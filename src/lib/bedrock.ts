const AWS_API_URL = import.meta.env.VITE_AWS_API_URL;

export interface BedrockAnalysisResult {
  qualityScore: number;
  hookRating: number;
  issues: string[];
  suggestions: string[];
  platformTip: string;
}

export const analyzeContentWithBedrock = async (
  content: string,
  platform: string,
  region: string
): Promise<BedrockAnalysisResult> => {
  const response = await fetch(AWS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, platform, region }),
  });

  if (!response.ok) {
    throw new Error('AWS Bedrock analysis failed');
  }

  return await response.json();
};
