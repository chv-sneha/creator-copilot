import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "creator-copilot-schedule";

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const { platform, contentType, niche, region, targetAudience } = JSON.parse(event.body);

    const prompt = `You are a social media timing expert. Recommend optimal posting times for:
Platform: ${platform}
Content Type: ${contentType}
Niche: ${niche}
Region: ${region}
Target Audience: ${targetAudience || 'General'}

Return ONLY valid JSON:
{
  "bestTimes": ["9:00 AM", "1:00 PM", "6:00 PM"],
  "bestDays": ["Monday", "Wednesday", "Friday"],
  "reasoning": "Brief explanation",
  "engagementPrediction": "High"
}

Rules:
- bestTimes: 3 optimal times in 12-hour format
- bestDays: 3 best days
- engagementPrediction: "Low", "Medium", or "High"
- reasoning: 1-2 sentences`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 1000, temperature: 0.6, topP: 0.9 }
    };

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.output.message.content[0].text;

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    const recommendation = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    const timestamp = new Date().toISOString();
    const scheduleId = `schedule-${Date.now()}`;

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        scheduleId,
        userId: event.requestContext?.authorizer?.claims?.sub || 'anonymous',
        platform,
        contentType,
        niche,
        region,
        targetAudience: targetAudience || 'General',
        bestTimes: recommendation.bestTimes,
        bestDays: recommendation.bestDays,
        reasoning: recommendation.reasoning,
        engagementPrediction: recommendation.engagementPrediction,
        status: 'recommendation',
        createdAt: timestamp,
        ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
      }
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ recommendation, scheduleId })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
