// AWS Bedrock API service for content analysis via API Gateway

interface BedrockAnalysisResult {
  qualityScore: number;
  hookRating: number;
  issues?: string[];
  suggestions?: string[];
  platformTip?: string;
}

export async function analyzeContentWithBedrock(
  content: string,
  platform: string,
  region: string
): Promise<BedrockAnalysisResult> {
  const apiUrl = import.meta.env.VITE_AWS_API_URL;

  if (!apiUrl) {
    throw new Error("AWS API URL not configured. Please set VITE_AWS_API_URL in .env");
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, platform, region }),
    });

    console.log('📡 API Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const rawResult = await response.json();
    console.log('✅ Raw API Result:', rawResult);
    
    // Handle Lambda proxy response format
    let result: BedrockAnalysisResult;
    if (rawResult.body && typeof rawResult.body === 'string') {
      // Lambda proxy response - parse the body
      const parsedBody = JSON.parse(rawResult.body);
      if (parsedBody.error) {
        throw new Error(parsedBody.error + ': ' + (parsedBody.details || ''));
      }
      result = parsedBody;
    } else if (rawResult.statusCode) {
      // Lambda error response
      throw new Error('Lambda function error: ' + (rawResult.body || 'Unknown error'));
    } else {
      // Direct response
      result = rawResult;
    }
    
    console.log('✅ Parsed Result:', result);
    return result;
  } catch (error) {
    console.error("Error analyzing content with Bedrock:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to analyze content"
    );
  }
}
