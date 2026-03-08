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
    const { niche, platform, contentType, targetAudience } = body;

    const prompt = `You are a content strategist. Generate 6 content ideas for:
Niche: ${niche}
Platform: ${platform}
Content Type: ${contentType || 'Any'}
Target Audience: ${targetAudience || 'General'}

Return ONLY valid JSON array:
[
  {
    "title": "Content Title",
    "format": "YouTube Video",
    "platform": "YouTube",
    "estimatedReach": "50K–120K",
    "difficulty": "Medium",
    "trending": true
  }
]

Rules:
- 6 ideas total
- format: Post, Reel, Story, Video, Article, Thread, Carousel, Short
- platform: ${platform}
- difficulty: "Easy", "Medium", or "Hard"
- trending: true/false
- estimatedReach: realistic range`;

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

    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    const ideas = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ideas })
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
