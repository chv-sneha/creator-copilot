import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

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
    const { content, platform, contentFormat, processingMode } = body;

    const prompt = `Assemble and optimize this content for ${platform}:
Content: ${content}
Format: ${contentFormat}
Mode: ${processingMode}

Return ONLY valid JSON:
{
  "Instagram": {
    "caption": "Optimized Instagram caption",
    "hashtags": "#hashtag1 #hashtag2 #hashtag3",
    "charCount": 150
  },
  "LinkedIn": {
    "post": "Professional LinkedIn post",
    "charCount": 200
  },
  "YouTube": {
    "script": "Video script",
    "title": "Video title",
    "charCount": 300
  },
  "X (Twitter)": {
    "tweets": ["Tweet 1", "Tweet 2", "Tweet 3"],
    "charCount": 280
  }
}`;

    const response = await client.send(new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 2000, temperature: 0.7, topP: 0.9 }
      })
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.output.message.content[0].text;
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result)
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
