import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

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

    const prompt = `You are a social media trend analyst. Generate 8 trending hashtags for:
Niche: ${niche}
Region: ${region || 'Global'}
Platform: ${platform}

Return ONLY valid JSON array with this exact structure:
[
  {
    "hashtag": "#ExampleTag",
    "volume": 125000,
    "growth": 45,
    "platforms": ["Instagram", "LinkedIn"],
    "difficulty": "Medium"
  }
]

Rules:
- 8 hashtags total
- volume: 10000-500000
- growth: 15-95 (percentage)
- difficulty: "Easy", "Medium", or "Hard"
- platforms: array with 1-3 platforms from ["Instagram", "LinkedIn", "YouTube", "X (Twitter)", "TikTok", "Facebook"]`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 2000, temperature: 0.7, topP: 0.9 }
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

    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    const trends = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ trends })
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
