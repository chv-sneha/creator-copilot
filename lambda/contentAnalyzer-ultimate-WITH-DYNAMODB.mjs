import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new BedrockRuntimeClient({ region: "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = "creator-copilot-content-analysis";

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No request body' }) };
    }
    
    const { content, platform, region } = JSON.parse(event.body);
    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
    const hasHashtags = /#\w+/.test(content);
    const hasQuestion = /\?/.test(content);
    const hasNumbers = /\d+/.test(content);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    const prompt = `You are a world-class social media strategist. Analyze this content and return ONLY valid JSON:

Content: "${content}"
Platform: ${platform}
Region: ${region}
Metrics: ${wordCount} words, ${charCount} chars

Return format:
{
  "score": 0-100,
  "hookRating": 0-10,
  "suggestions": ["tip1", "tip2", "tip3"],
  "hashtags": ["#tag1", "#tag2"],
  "engagementPrediction": "Low/Medium/High",
  "engagementReason": "reason",
  "readabilityScore": 0-100,
  "sentimentScore": -100 to 100,
  "keywordDensity": {"word": 5.2},
  "optimalPostingTimes": ["9:00 AM"],
  "competitorAnalysis": "text",
  "viralPotential": 0-100,
  "brandAlignment": 0-100,
  "callToActionStrength": 0-100,
  "issues": ["issue1"],
  "platformTip": "tip"
}`;

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { max_new_tokens: 4000, temperature: 0.6, top_p: 0.95 }
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let text = responseBody.output.message.content[0].text.trim();
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      result = {
        score: 50, hookRating: 5, suggestions: ["Try again"], hashtags: ["#content"],
        engagementPrediction: "Medium", engagementReason: "Analysis unavailable",
        readabilityScore: 50, sentimentScore: 0, keywordDensity: {},
        optimalPostingTimes: ["9:00 AM"], competitorAnalysis: "N/A",
        viralPotential: 50, brandAlignment: 50, callToActionStrength: 50,
        issues: ["Analysis failed"], platformTip: "Try again"
      };
    }

    // SAVE TO DYNAMODB
    const timestamp = new Date().toISOString();
    const analysisId = `analysis-${Date.now()}`;

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        analysisId,
        userId: event.requestContext?.authorizer?.claims?.sub || 'anonymous',
        content,
        platform,
        region,
        wordCount,
        charCount,
        qualityScore: result.score,
        hookRating: result.hookRating,
        readabilityScore: result.readabilityScore,
        sentimentScore: result.sentimentScore,
        viralPotential: result.viralPotential,
        brandAlignment: result.brandAlignment,
        ctaStrength: result.callToActionStrength,
        suggestions: result.suggestions,
        hashtags: result.hashtags,
        engagementPrediction: result.engagementPrediction,
        issues: result.issues,
        keywordDensity: result.keywordDensity,
        optimalPostingTimes: result.optimalPostingTimes,
        contentType: 'text',
        createdAt: timestamp,
        ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60)
      }
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ ...result, analysisId }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed', details: error.message }) };
  }
};
