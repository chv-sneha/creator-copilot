import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

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

    // Calculate content metrics
    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
    const hasHashtags = /#\w+/.test(content);
    const hasQuestion = /\?/.test(content);
    const hasNumbers = /\d+/.test(content);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    const prompt = `You are a world-class social media strategist who has analyzed over 100,000 viral posts and generated $50M+ in engagement value for Fortune 500 brands.

CONTENT TO ANALYZE:
Platform: ${platform}
Target Region: ${region}
Content: "${content}"

CONTENT METRICS (use these in your analysis):
- Word count: ${wordCount}
- Character count: ${charCount}
- Sentences: ${sentences}
- Has emojis: ${hasEmojis}
- Has hashtags: ${hasHashtags}
- Has questions: ${hasQuestion}
- Has numbers: ${hasNumbers}

ANALYSIS FRAMEWORK:

1. QUALITY SCORE (0-100) - Be BRUTALLY honest:
   - 0-20: Spam/useless (very short, no value, poor grammar)
   - 21-40: Poor (lacks depth, unclear message, weak hook)
   - 41-60: Average (decent but forgettable, needs work)
   - 61-80: Good (engaging, clear value, well-structured)
   - 81-95: Excellent (viral potential, strong hook, compelling)
   - 96-100: Masterpiece (perfect execution, guaranteed viral)
   
   Consider: ${wordCount < 10 ? 'TOO SHORT - penalize heavily' : wordCount > 300 ? 'TOO LONG for ' + platform : 'good length'}

2. HOOK RATING (0-10) - First 5-10 words analysis:
   - Does it create curiosity?
   - Does it promise value?
   - Does it trigger emotion?
   - Would YOU stop scrolling?

3. ${platform} ALGORITHM OPTIMIZATION:
${platform === 'Instagram' ? `   - Visual storytelling score
   - Reel/Story/Carousel suitability
   - Hashtag strategy (needs 15-30 hashtags)
   - Caption length (optimal: 125-150 chars for feed, 2200 max)
   - Emoji usage effectiveness` : ''}
${platform === 'LinkedIn' ? `   - Professional tone score
   - Thought leadership value
   - Industry relevance
   - Networking/discussion potential
   - Optimal length: 150-300 words` : ''}
${platform === 'YouTube' ? `   - Title SEO optimization
   - Thumbnail concept potential
   - Watch time prediction
   - Retention hook strength
   - Description optimization` : ''}
${platform === 'X (Twitter)' ? `   - Character efficiency (280 limit)
   - Thread potential
   - Retweet worthiness
   - Trending topic alignment
   - Optimal: 71-100 characters` : ''}
${platform === 'TikTok' ? `   - Trend alignment score
   - Sound/music potential
   - Gen Z appeal
   - Viral hook strength
   - First 3 seconds impact` : ''}
${platform === 'Facebook' ? `   - Community engagement potential
   - Shareability score
   - Discussion trigger
   - Algorithm optimization
   - Optimal: 40-80 characters` : ''}

4. ${region} REGIONAL INTELLIGENCE:
   - Cultural appropriateness
   - Local trends alignment
   - Language/slang usage
   - Best posting times for timezone
   - Regional holidays/events

5. ENGAGEMENT PREDICTION MODEL:
   - Hook strength × Platform fit × Timing × Value proposition
   - Compare to top 1% performing content
   - Predict: Low (<2% engagement), Medium (2-5%), High (>5%)

Return ONLY valid JSON with NO quotes in text values (use single words or escape quotes):
{
  "score": number 0-100,
  "hookRating": number 0-10,
  "suggestions": ["tip1", "tip2", "tip3", "tip4"],
  "hashtags": ["#tag1", "#tag2", ...15 tags],
  "engagementPrediction": "Low" or "Medium" or "High",
  "engagementReason": "explanation without quotes",
  "readabilityScore": number 0-100,
  "sentimentScore": number -100 to 100,
  "keywordDensity": {"word1": 5.2, "word2": 3.1, "word3": 2.8, "word4": 2.1, "word5": 1.9},
  "optimalPostingTimes": ["9:00 AM", "1:00 PM", "7:00 PM"],
  "competitorAnalysis": "brief comparison",
  "viralPotential": number 0-100,
  "brandAlignment": number 0-100,
  "callToActionStrength": number 0-100,
  "issues": ["issue1", "issue2"],
  "platformTip": "specific tip"
}

CRITICAL RULES:
- If content is <15 words, score MUST be <40
- If no clear value proposition, score MUST be <50
- If grammar errors, deduct 10-20 points
- If no hook, hookRating MUST be <4
- Be HONEST - most content is average (50-70 range)
- Only exceptional content deserves 80+`;

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: {
          max_new_tokens: 4000,
          temperature: 0.6,
          top_p: 0.95
        }
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let text = responseBody.output.message.content[0].text.trim();
    
    console.log('Raw response:', text);
    
    // Clean markdown
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    // Try to parse, if fails, sanitize and retry
    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse failed, sanitizing...', parseError);
      // Fix common JSON issues
      text = text
        .replace(/\n/g, ' ')  // Remove newlines
        .replace(/\r/g, '')   // Remove carriage returns
        .replace(/\t/g, ' ')  // Remove tabs
        .replace(/"/g, '"')  // Fix smart quotes
        .replace(/"/g, '"')
        .replace(/'/g, "'")  // Fix smart apostrophes
        .replace(/'/g, "'");
      
      try {
        result = JSON.parse(text);
      } catch (secondError) {
        console.error('Still failed, returning fallback');
        // Return fallback
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            score: 50,
            hookRating: 5,
            suggestions: ["Unable to analyze - please try again"],
            hashtags: ["#content"],
            engagementPrediction: "Medium",
            engagementReason: "Analysis unavailable",
            readabilityScore: 50,
            sentimentScore: 0,
            keywordDensity: {},
            optimalPostingTimes: ["9:00 AM", "1:00 PM", "7:00 PM"],
            competitorAnalysis: "Analysis unavailable",
            viralPotential: 50,
            brandAlignment: 50,
            callToActionStrength: 50,
            issues: ["Analysis failed"],
            platformTip: "Try again"
          })
        };
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed', details: error.message }) };
  }
};
