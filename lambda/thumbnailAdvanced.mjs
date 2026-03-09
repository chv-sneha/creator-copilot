import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import sharp from 'sharp';

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "creator-copilot-thumbnails";
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "creator-copilot-thumbnails";
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`;

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,GET,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  };

  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, userId, thumbnailId, imageData, videoTitle, description, platform, style, filters } = body;

    // ACTION 1: Generate & Save with Optimization
    if (action === 'generate') {
      const imagePrompt = `Professional ${platform} thumbnail: ${videoTitle}. ${description}. Style: ${style}. High quality, eye-catching design.`;

      const response = await bedrockClient.send(new InvokeModelCommand({
        modelId: "amazon.nova-canvas-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          taskType: "TEXT_IMAGE",
          textToImageParams: { text: imagePrompt },
          imageGenerationConfig: {
            numberOfImages: 1,
            height: 768,
            width: 1280,
            cfgScale: 8.0,
            seed: Math.floor(Math.random() * 858993459)
          }
        })
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const base64Image = responseBody.images[0];
      const imageBuffer = Buffer.from(base64Image, 'base64');
      
      // Image Optimization with Sharp
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(1280, 720, { fit: 'cover' })
        .png({ quality: 90, compressionLevel: 9 })
        .toBuffer();

      // Generate thumbnail variants
      const thumbnailSmall = await sharp(imageBuffer).resize(320, 180).png().toBuffer();
      const thumbnailMedium = await sharp(imageBuffer).resize(640, 360).png().toBuffer();
      
      const thumbnailId = `${userId}-${Date.now()}`;
      const timestamp = Date.now();
      
      // Save original + variants to S3
      const uploads = [
        { key: `thumbnails/${thumbnailId}/original.png`, buffer: optimizedBuffer, size: 'original' },
        { key: `thumbnails/${thumbnailId}/small.png`, buffer: thumbnailSmall, size: 'small' },
        { key: `thumbnails/${thumbnailId}/medium.png`, buffer: thumbnailMedium, size: 'medium' }
      ];

      const urls = {};
      for (const upload of uploads) {
        await s3Client.send(new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: upload.key,
          Body: upload.buffer,
          ContentType: 'image/png',
          CacheControl: 'max-age=31536000',
          Metadata: {
            userId,
            thumbnailId,
            size: upload.size,
            createdAt: new Date().toISOString()
          }
        }));
        urls[upload.size] = `${CLOUDFRONT_URL}/${upload.key}`;
      }

      // Save to DynamoDB with analytics
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          thumbnailId,
          userId,
          videoTitle,
          description,
          platform,
          style,
          urls,
          prompt: imagePrompt,
          fileSize: optimizedBuffer.length,
          dimensions: { width: 1280, height: 720 },
          createdAt: new Date().toISOString(),
          views: 0,
          downloads: 0,
          ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60)
        }
      }));

      // Update user stats
      await updateUserStats(userId, 'thumbnailsGenerated');

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: true,
          thumbnailId,
          urls,
          fileSize: optimizedBuffer.length
        })
      };
    }

    // ACTION 2: Get User Analytics
    if (action === 'analytics') {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'UserIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
      }));

      const thumbnails = result.Items || [];
      
      const analytics = {
        totalThumbnails: thumbnails.length,
        totalViews: thumbnails.reduce((sum, t) => sum + (t.views || 0), 0),
        totalDownloads: thumbnails.reduce((sum, t) => sum + (t.downloads || 0), 0),
        platformBreakdown: {},
        styleBreakdown: {},
        recentActivity: thumbnails.slice(0, 10).map(t => ({
          thumbnailId: t.thumbnailId,
          videoTitle: t.videoTitle,
          platform: t.platform,
          createdAt: t.createdAt,
          views: t.views || 0
        }))
      };

      thumbnails.forEach(t => {
        analytics.platformBreakdown[t.platform] = (analytics.platformBreakdown[t.platform] || 0) + 1;
        analytics.styleBreakdown[t.style] = (analytics.styleBreakdown[t.style] || 0) + 1;
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, analytics })
      };
    }

    // ACTION 3: Search Thumbnails
    if (action === 'search') {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'UserIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        Limit: 50
      }));

      let thumbnails = result.Items || [];

      // Apply filters
      if (filters?.platform) {
        thumbnails = thumbnails.filter(t => t.platform === filters.platform);
      }
      if (filters?.style) {
        thumbnails = thumbnails.filter(t => t.style === filters.style);
      }
      if (filters?.dateFrom) {
        thumbnails = thumbnails.filter(t => new Date(t.createdAt) >= new Date(filters.dateFrom));
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: true, 
          count: thumbnails.length,
          thumbnails: thumbnails.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
      };
    }

    // ACTION 4: Generate Pre-signed URL (Secure Download)
    if (action === 'getDownloadUrl') {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `thumbnails/${thumbnailId}/original.png`
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      // Track download
      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { thumbnailId },
        UpdateExpression: 'SET downloads = if_not_exists(downloads, :zero) + :inc',
        ExpressionAttributeValues: { ':zero': 0, ':inc': 1 }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, downloadUrl: signedUrl })
      };
    }

    // ACTION 5: Track View
    if (action === 'trackView') {
      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { thumbnailId },
        UpdateExpression: 'SET views = if_not_exists(views, :zero) + :inc',
        ExpressionAttributeValues: { ':zero': 0, ':inc': 1 }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true })
      };
    }

    // ACTION 6: Batch Delete
    if (action === 'batchDelete') {
      const { thumbnailIds } = body;
      
      for (const id of thumbnailIds) {
        // Delete from S3
        const sizes = ['original', 'small', 'medium'];
        for (const size of sizes) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `thumbnails/${id}/${size}.png`
          }));
        }
        
        // Delete from DynamoDB
        await docClient.send(new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { thumbnailId: id }
        }));
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, deleted: thumbnailIds.length })
      };
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function updateUserStats(userId, metric) {
  try {
    await docClient.send(new UpdateCommand({
      TableName: 'creator-copilot-users',
      Key: { userId },
      UpdateExpression: `SET ${metric} = if_not_exists(${metric}, :zero) + :inc, lastActivity = :now`,
      ExpressionAttributeValues: {
        ':zero': 0,
        ':inc': 1,
        ':now': new Date().toISOString()
      }
    }));
  } catch (error) {
    console.error('Stats update failed:', error);
  }
}
