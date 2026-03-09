import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "creator-copilot-content-studio";
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "creator-copilot-projects";

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, projectId, userId, title, description, platform, content, status } = body;

    const timestamp = new Date().toISOString();

    // CREATE PROJECT
    if (action === 'create') {
      const newProjectId = `project-${Date.now()}`;
      const s3Key = `projects/${userId}/${newProjectId}/draft.json`;

      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: JSON.stringify({ content, version: 1 }),
        ContentType: 'application/json'
      }));

      const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          projectId: newProjectId,
          userId,
          title,
          description,
          platform,
          s3DraftUrl: s3Url,
          s3Key,
          status: 'draft',
          collaborators: [],
          comments: [],
          version: 1,
          editHistory: [{ action: 'created', timestamp, userId }],
          views: 0,
          likes: 0,
          shares: 0,
          createdAt: timestamp,
          updatedAt: timestamp,
          publishedAt: null,
          ttl: Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60)
        }
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ projectId: newProjectId, s3Url, message: 'Project created' })
      };
    }

    // UPDATE PROJECT
    if (action === 'update') {
      const s3Key = `projects/${userId}/${projectId}/draft-v${Date.now()}.json`;

      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: JSON.stringify({ content }),
        ContentType: 'application/json'
      }));

      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { projectId },
        UpdateExpression: 'SET s3DraftUrl = :url, updatedAt = :time, version = version + :inc',
        ExpressionAttributeValues: {
          ':url': `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`,
          ':time': timestamp,
          ':inc': 1
        }
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Project updated' })
      };
    }

    // GET PROJECT
    if (action === 'get') {
      const result = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { projectId }
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ project: result.Item })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
