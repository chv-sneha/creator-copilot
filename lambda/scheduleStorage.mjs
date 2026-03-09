import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "creator-copilot-schedule";

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, userId, platform, scheduledDate, scheduledTime, content, hashtags } = body;

    const timestamp = new Date().toISOString();

    // SCHEDULE POST
    if (action === 'schedule') {
      const scheduleId = `schedule-${Date.now()}`;

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          scheduleId,
          userId,
          platform,
          scheduledDate,
          scheduledTime,
          content,
          hashtags: hashtags || [],
          status: 'scheduled',
          posted: false,
          createdAt: timestamp,
          ttl: Math.floor(new Date(scheduledDate).getTime() / 1000) + (30 * 24 * 60 * 60)
        }
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ scheduleId, message: 'Post scheduled' })
      };
    }

    // GET SCHEDULED POSTS
    if (action === 'list') {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: { ':uid': userId }
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ schedules: result.Items })
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
