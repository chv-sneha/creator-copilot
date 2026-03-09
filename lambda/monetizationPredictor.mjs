import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "creator-copilot-monetization";

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { topic, reach, audience, platform } = body;

    console.log('💰 Monetization Request:', { topic, reach, platform });

    const prompt = `Predict monetization potential for this creator:

Topic: ${topic}
Reach: ${reach}
Audience: ${audience}
Platform: ${platform}

Return ONLY valid JSON:
{
  "monthlyEarnings": {
    "adRevenue": { "min": 320, "max": 480 },
    "affiliateRevenue": { "min": 150, "max": 300 },
    "brandDeals": { "min": 500, "max": 1200 },
    "total": { "min": 970, "max": 1980 }
  },
  "platformMetrics": {
    "averageCPM": 6.20,
    "engagementRate": 4.5,
    "conversionRate": 2.3
  },
  "brandSuggestions": [
    { "name": "Notion", "fit": 95, "avgDeal": "$800-$1500" },
    { "name": "Grammarly", "fit": 88, "avgDeal": "$600-$1200" },
    { "name": "Canva", "fit": 85, "avgDeal": "$500-$1000" }
  ],
  "growthPotential": {
    "nextMonth": "+15%",
    "sixMonths": "+60%",
    "recommendation": "Focus on affiliate marketing for ${topic}"
  }
}

Rules:
- Calculate based on ${platform} CPM rates
- Brand fit: 0-100
- Realistic ranges for ${reach} reach
- Platform-specific metrics`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 2500, temperature: 0.5, topP: 0.9 }
    };

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-pro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.output.message.content[0].text;

    console.log('🤖 AI Response:', generatedText);

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const prediction = JSON.parse(jsonMatch[0]);

    console.log('✅ Monetization prediction complete');

    const timestamp = new Date().toISOString();
    const monetizationId = `monetization-${Date.now()}`;

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        monetizationId,
        userId: body.userId || 'anonymous',
        topic,
        reach,
        audience,
        platform,
        monthlyEarnings: prediction.monthlyEarnings,
        platformMetrics: prediction.platformMetrics,
        brandSuggestions: prediction.brandSuggestions,
        growthPotential: prediction.growthPotential,
        actualRevenue: 0,
        revenueTracking: [],
        createdAt: timestamp,
        ttl: Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60)
      }
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ prediction, monetizationId })
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
