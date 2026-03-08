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
    const { content, niche, platform, hookStyle, targetAudience, tone } = body;

    const prompt = `Generate an attention-grabbing hook for:
Content: ${content}
Niche: ${niche}
Platform: ${platform}
Style: ${hookStyle}
Audience: ${targetAudience}
Tone: ${tone}

Return ONLY valid JSON:
{
  "mainHook": "Your main compelling hook here",
  "alternativeHooks": [
    "Alternative hook 1",
    "Alternative hook 2",
    "Alternative hook 3"
  ],
  "engagementScore": 85,
  "clarityScore": 90,
  "hookStrength": 88,
  "reachPotential": "High"
}

Rules:
- mainHook: primary attention-grabbing hook
- alternativeHooks: array of 3 alternative versions
- scores: 0-100
- reachPotential: "Low", "Medium", or "High"`;

    const response = await client.send(new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 1000, temperature: 0.8, topP: 0.9 }
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
