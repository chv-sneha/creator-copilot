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

    const prompt = `You are an expert content strategist. Transform this content for ${platform}:

Original Content: ${content}
Format: ${contentFormat}
Processing Mode: ${processingMode}

Create platform-optimized versions for ALL 4 platforms with DETAILED, COMPLETE content:

Return ONLY valid JSON:
{
  "Instagram": {
    "caption": "[Write a FULL 150-200 word engaging caption with emojis, line breaks, and storytelling. Include hook, value, and CTA]",
    "hashtags": "[30 relevant hashtags]",
    "charCount": 0
  },
  "LinkedIn": {
    "post": "[Write a FULL 300-400 word professional post with paragraphs, insights, and thought leadership. Include hook, body with 3-5 key points, and CTA]",
    "charCount": 0
  },
  "YouTube": {
    "title": "[Catchy 60-char SEO title with keywords]",
    "script": "[Write a FULL 500-800 word video script with: INTRO (hook + preview), MAIN CONTENT (detailed explanation with examples), CONCLUSION (summary + CTA). Include timestamps]",
    "charCount": 0
  },
  "X (Twitter)": {
    "tweets": ["[Tweet 1: Hook with question or bold statement]", "[Tweet 2: Key insight 1]", "[Tweet 3: Key insight 2]", "[Tweet 4: Key insight 3]", "[Tweet 5: CTA with link]"],
    "charCount": 280
  }
}

RULES:
- Instagram: Use emojis, line breaks, storytelling format
- LinkedIn: Professional tone, paragraph format, thought leadership
- YouTube: Full script with intro/body/outro, timestamps
- Twitter: 5-tweet thread, each under 280 chars
- Make content DETAILED and COMPLETE, not summaries`;

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
