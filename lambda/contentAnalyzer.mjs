import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new BedrockRuntimeClient({ region: "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "creator-copilot-content-analysis";

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
    console.log('Event:', JSON.stringify(event));
    console.log('Event body:', event.body);
    
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No request body provided' })
      };
    }
    
    const { content, platform, region } = JSON.parse(event.body);

    if (!content || !platform || !region) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const prompt = `You are an expert social media strategist and content analyst with 10+ years of experience analyzing viral content across all major platforms.

Your task: Provide a comprehensive, brutally honest analysis of this ${platform} post targeting ${region} audience.

Content to analyze:
"${content}"

Analyze based on these criteria:

1. QUALITY SCORE (0-100):
- Content length and depth
- Grammar and clarity
- Value proposition
- Emotional impact
- Call-to-action presence
- Visual appeal potential

2. HOOK RATING (0-10):
- First 3 words effectiveness
- Curiosity generation
- Pattern interrupt
- Scroll-stopping power

3. PLATFORM-SPECIFIC ANALYSIS for ${platform}:
${platform === 'Instagram' ? '- Visual storytelling potential\n- Reel/Story suitability\n- Carousel opportunity\n- Hashtag strategy' : ''}
${platform === 'LinkedIn' ? '- Professional tone\n- Thought leadership value\n- Industry relevance\n- Networking potential' : ''}
${platform === 'YouTube' ? '- Title SEO optimization\n- Thumbnail potential\n- Watch time factors\n- Retention hooks' : ''}
${platform === 'X (Twitter)' ? '- Character efficiency\n- Thread potential\n- Retweet worthiness\n- Trending topic alignment' : ''}
${platform === 'TikTok' ? '- Trend alignment\n- Sound/music potential\n- Gen Z appeal\n- Viral hook strength' : ''}
${platform === 'Facebook' ? '- Community engagement\n- Shareability\n- Discussion potential\n- Algorithm optimization' : ''}

4. REGIONAL CONSIDERATIONS for ${region}:
- Cultural relevance
- Local trends alignment
- Language nuances
- Timezone optimization

Provide your analysis in this EXACT JSON format (no markdown, no backticks):
{
  "score": <honest rating 0-100>,
  "hookRating": <honest rating 0-10>,
  "suggestions": [<4-6 specific, actionable improvements>],
  "hashtags": [<12-20 highly relevant hashtags with # symbol>],
  "engagementPrediction": "Low" or "Medium" or "High",
  "engagementReason": "<detailed explanation based on content analysis>",
  "readabilityScore": <0-100 based on clarity and structure>,
  "sentimentScore": <-100 to 100, negative to positive>,
  "keywordDensity": {"keyword1": percentage, "keyword2": percentage, ...top 5},
  "optimalPostingTimes": [<3-4 best times for ${region}>],
  "competitorAnalysis": "<how this compares to trending content>",
  "viralPotential": <0-100 likelihood of going viral>,
  "brandAlignment": <0-100 professional brand building score>,
  "callToActionStrength": <0-100 CTA effectiveness>,
  "issues": [<2-4 specific problems found>],
  "platformTip": "<one specific ${platform} optimization tip>"
}

Be critical and honest. Short or low-quality content should get low scores. High-quality, engaging content deserves high scores.`;

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: {
          max_new_tokens: 3000,
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let text = responseBody.output.message.content[0].text.trim();
    
    let cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanText);

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...result, analysisId })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Analysis failed', details: error.message })
    };
  }
};
