import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "creator-copilot-trends";

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
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { platform, niche, region, timeframe } = body;

    console.log('📈 Trends Request:', { platform, niche, region });

    const prompt = `Generate 8 trending hashtags for:
Niche: ${niche}
Region: ${region || 'Global'}
Platform: ${platform}

Return ONLY valid JSON array:
[
  {
    "hashtag": "#${niche}Tag",
    "volume": 125000,
    "growth": 45,
    "platforms": ["${platform}"],
    "difficulty": "Medium"
  }
]

Rules:
- 8 UNIQUE hashtags for ${niche}
- volume: 10000-500000
- growth: 15-95 (percentage)
- difficulty: "Easy", "Medium", or "Hard"
- platforms: array with 1-3 from ["Instagram", "LinkedIn", "YouTube", "X (Twitter)", "TikTok", "Facebook"]`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 2000, temperature: 0.8, topP: 0.9 }
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

    console.log('🤖 AI Response:', generatedText);

    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array in response');
    }

    const trends = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(trends) || trends.length === 0) {
      throw new Error('Invalid trends format');
    }

    console.log('✅ Generated', trends.length, 'trends');

    const timestamp = new Date().toISOString();
    const trendId = `trend-${Date.now()}`;

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        trendId,
        userId: body.userId || 'anonymous',
        platform,
        niche,
        region: region || 'Global',
        timeframe: timeframe || '7days',
        trends,
        createdAt: timestamp,
        ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
      }
    }));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ trends, trendId })
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message, details: 'Trend analysis failed' })
    };
  }
};
