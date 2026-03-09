import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "creator-copilot-thumbnails";
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "creator-copilot-thumbnails";

export const handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { mode, videoTitle, description, platform, style, userId, imageData } = body;

    // Don't set headers here - Function URL handles CORS

    // MODE 1: Structure
    if (mode === 'structure') {
      const prompt = `Provide thumbnail layout guidelines for: Title: ${videoTitle}, Platform: ${platform}, Style: ${style}. Return ONLY valid JSON.`;
      
      const response = await bedrockClient.send(new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [{ role: "user", content: [{ text: prompt }] }],
          inferenceConfig: { maxTokens: 1500, temperature: 0.6, topP: 0.9 }
        })
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const generatedText = responseBody.output.message.content[0].text;
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return { statusCode: 200, body: JSON.stringify({ mode: 'structure', result }) };
    }

    // MODE 2: Sample
    if (mode === 'sample') {
      const samples = [{
        url: `https://www.google.com/search?q=${encodeURIComponent(videoTitle + ' ' + platform + ' thumbnail')}&tbm=isch`,
        description: `${platform} thumbnails for ${videoTitle}`,
        relevance: 95,
        searchTerm: `${videoTitle} ${platform} thumbnail`
      }];

      return { statusCode: 200, body: JSON.stringify({ mode: 'sample', result: { samples } }) };
    }

    // MODE 3: Professional
    if (mode === 'professional') {
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
      
      if (!responseBody.images || !responseBody.images[0]) {
        throw new Error('No image generated');
      }

      const base64Image = responseBody.images[0];
      const imageBuffer = Buffer.from(base64Image, 'base64');
      const thumbnailId = `${userId || 'anonymous'}-${Date.now()}`;
      const s3Key = `thumbnails/${thumbnailId}.png`;
      
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: imageBuffer,
        ContentType: 'image/png'
      }));

      const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

      const timestamp = new Date().toISOString();
      const seed = Math.floor(Math.random() * 858993459);

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          thumbnailId,
          userId: userId || 'anonymous',
          videoTitle,
          description,
          platform,
          style,
          s3Url,
          s3Key,
          prompt: imagePrompt,
          source: 'ai-generated',
          
          // Analytics & Usage
          views: 0,
          downloads: 0,
          shares: 0,
          clicks: 0,
          impressions: 0,
          edits: 0,
          
          // Technical Metadata
          fileSize: imageBuffer.length,
          dimensions: '1280x768',
          format: 'png',
          generationModel: 'amazon.nova-canvas-v1:0',
          processingTime: null,
          generationSeed: seed,
          cfgScale: 8.0,
          
          // Content Analysis
          hasText: false,
          hasShapes: true,
          hasImages: true,
          layerCount: 1,
          colorPalette: [],
          textCount: 0,
          
          // Content Analyzer Integration
          contentAnalyzerUsed: false,
          qualityScore: null,
          readabilityScore: null,
          sentimentScore: null,
          viralPotential: null,
          brandAlignment: null,
          ctaStrength: null,
          seoScore: null,
          platformOptimization: null,
          
          // Content Studio Integration
          contentStudioProject: null,
          projectId: null,
          draftVersion: null,
          collaborators: [],
          comments: [],
          approvalStatus: 'pending',
          approvedBy: null,
          
          // Thumbnail Generator Specific
          templateUsed: style,
          aiAssistantUsed: false,
          textElements: [],
          imageElements: [],
          shapeElements: [],
          
          // Trends & Calendar Integration
          scheduledPost: false,
          scheduledDate: null,
          scheduledTime: null,
          trendingHashtags: [],
          optimalPostTime: null,
          seasonalRelevance: null,
          trendScore: null,
          contentIdeas: [],
          
          // Safety & Copyright
          copyrightChecked: false,
          copyrightStatus: 'pending',
          safetyScore: null,
          contentFlags: [],
          moderationStatus: 'pending',
          aiDetectionScore: null,
          plagiarismScore: null,
          
          // Monetization
          monetizationEnabled: false,
          revenueGenerated: 0,
          sponsorshipDeals: [],
          affiliateLinks: [],
          adRevenue: 0,
          sponsorshipRevenue: 0,
          
          // Performance Metrics
          ctrScore: null,
          engagementRate: 0,
          conversionRate: 0,
          bounceRate: null,
          avgWatchTime: null,
          
          // Versioning
          version: 1,
          parentId: null,
          editHistory: [{
            action: 'ai_generated',
            timestamp,
            model: 'amazon.nova-canvas-v1:0',
            seed
          }],
          
          // Business Intelligence
          deviceType: null,
          userAgent: null,
          ipAddress: null,
          sessionId: null,
          experimentGroup: null,
          abTestVariant: null,
          
          // Content Tags
          tags: [platform, style],
          category: 'thumbnail',
          mood: style,
          targetAudience: null,
          niche: null,
          language: 'en',
          region: null,
          
          // Timestamps
          createdAt: timestamp,
          updatedAt: timestamp,
          lastAccessedAt: timestamp,
          publishedAt: null,
          archivedAt: null,
          
          // Status
          status: 'active',
          isPublic: false,
          isFeatured: false,
          ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60)
        }
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          mode: 'professional',
          result: { image: base64Image, s3Url, thumbnailId, prompt: imagePrompt }
        })
      };
    }

    // MODE 4: Save
    if (mode === 'save') {
      if (!imageData || !userId) {
        throw new Error('Missing imageData or userId');
      }

      const thumbnailId = `${userId}-${Date.now()}`;
      const s3Key = `user-thumbnails/${thumbnailId}.png`;
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: imageBuffer,
        ContentType: 'image/png'
      }));

      const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

      const timestamp = new Date().toISOString();

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          thumbnailId,
          userId,
          videoTitle: videoTitle || 'Untitled',
          platform: platform || 'Custom',
          s3Url,
          s3Key,
          source: 'editor',
          
          // Analytics
          views: 0,
          downloads: 1,
          shares: 0,
          clicks: 0,
          impressions: 0,
          edits: body.editCount || 1,
          
          // Technical
          fileSize: imageBuffer.length,
          dimensions: body.dimensions || '1280x720',
          format: 'png',
          processingTime: body.processingTime || null,
          
          // Content
          hasText: body.hasText || false,
          hasShapes: body.hasShapes || false,
          hasImages: body.hasImages || false,
          layerCount: body.layerCount || 1,
          textCount: body.textCount || 0,
          colorPalette: body.colorPalette || [],
          
          // Feature Integration
          contentAnalyzerUsed: body.contentAnalyzerUsed || false,
          contentStudioProject: body.projectId || null,
          scheduledPost: body.scheduledPost || false,
          copyrightChecked: body.copyrightChecked || false,
          monetizationEnabled: body.monetizationEnabled || false,
          
          // Metadata
          templateUsed: body.templateUsed || null,
          editHistory: body.editHistory || [{ action: 'manual_save', timestamp }],
          tags: body.tags || [platform || 'Custom'],
          category: 'thumbnail',
          
          // Timestamps
          createdAt: timestamp,
          updatedAt: timestamp,
          lastAccessedAt: timestamp,
          
          // Status
          status: 'active',
          version: body.version || 1,
          parentId: body.parentId || null,
          ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60)
        }
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          mode: 'save',
          result: { s3Url, thumbnailId, message: 'Thumbnail saved successfully' }
        })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid mode specified' })
    };

  } catch (error) {
    console.error('❌ Lambda Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Function failed: ${error.message}` })
    };
  }
};