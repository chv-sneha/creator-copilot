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
    const { content, platform, contentType } = body;

    console.log('🛡️ Safety Analysis Request:', { platform, contentType, contentLength: content?.length });

    const prompt = `You are a strict content safety analyzer. Analyze this content and provide DIFFERENT scores based on actual issues:

Content: "${content}"
Platform: ${platform}
Type: ${contentType}

ANALYZE CAREFULLY:
1. Check for clickbait words: GUARANTEED, INSTANTLY, SECRET, RICH, MILLION, NOW, FOREVER
2. Check for misleading claims and exaggerations
3. Check sentence complexity and readability
4. Check for copyright/trademark issues
5. Check platform-specific policy violations

Return ONLY valid JSON:
{
  "overallScore": <calculate average of all 5 category scores>,
  "riskLevel": "<Low if overallScore>79, Medium if 50-79, High if <50>",
  "copyright": {
    "score": <0-100 based on trademark/copyright issues>,
    "status": "<Safe if score>79, Warning if 50-79, Risk if <50>",
    "issues": ["list specific issues found or empty array"],
    "suggestions": ["specific fixes or empty array"]
  },
  "platformCompliance": {
    "score": <0-100, LOW if clickbait detected>,
    "status": "<Safe/Warning/Risk>",
    "issues": ["list violations"],
    "suggestions": ["specific fixes"]
  },
  "accessibility": {
    "score": <0-100, LOW if complex jargon or long sentences>,
    "status": "<Safe/Warning/Risk>",
    "readabilityGrade": <6-14>,
    "sentenceLength": "<Short/Medium/Long/Too Long>",
    "issues": ["list readability issues"],
    "suggestions": ["specific improvements"]
  },
  "languageSafety": {
    "score": <0-100>,
    "status": "<Safe/Warning/Risk>",
    "toxicity": <true/false>,
    "issues": [],
    "suggestions": []
  },
  "plagiarism": {
    "score": <0-100>,
    "similarityRisk": <0-100>,
    "status": "<Safe/Warning/Risk>",
    "possibleSources": []
  },
  "safeRewrite": "<Rewrite the content fixing ALL identified issues>"
}

SCORING RULES:
- Clickbait words detected → platformCompliance score 20-40
- Complex jargon → accessibility score 40-60
- Long sentences (>25 words) → accessibility score 50-70
- Safe content → all scores 85-95
- Calculate overallScore = (copyright + platformCompliance + accessibility + languageSafety + plagiarism) / 5`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 3000, temperature: 0.2, topP: 0.8 }
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

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    console.log('✅ Safety analysis complete');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ analysis })
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message, details: 'Safety analysis failed' })
    };
  }
};
