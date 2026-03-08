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
    const { mode, videoTitle, description, platform, style, colorScheme, mainText, subText, mood } = body;

    console.log('🎨 Thumbnail Request:', { mode, platform, style });

    // MODE 1: Structure Only - Return layout guidelines
    if (mode === 'structure') {
      const prompt = `Provide thumbnail layout guidelines for:
Title: ${videoTitle}
Platform: ${platform}
Style: ${style}

Return ONLY valid JSON:
{
  "layout": {
    "composition": "Rule of thirds with subject on left",
    "textPlacement": "Top-right corner, large bold font",
    "colorZones": "Dark background, bright accent colors",
    "focalPoint": "Center-left, eye-catching element"
  },
  "designGuidelines": [
    "Use high contrast between text and background",
    "Keep main text under 6 words",
    "Add face/emotion if relevant to topic",
    "Use ${colorScheme} color scheme"
  ],
  "recommendations": {
    "fontSize": "72-96px for main text",
    "fontStyle": "Bold, sans-serif",
    "spacing": "20px padding from edges",
    "elements": ["Background image", "Text overlay", "Small logo/branding"]
  }
}`;

      const response = await client.send(new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [{ role: "user", content: [{ text: prompt }] }],
          inferenceConfig: { maxTokens: 1500, temperature: 0.6, topP: 0.9 }
        })
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const generatedText = responseBody.output.message.content[0].text;
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ mode: 'structure', result })
      };
    }

    // MODE 2: Sample Thumbnail - Return relevant image URLs
    if (mode === 'sample') {
      const prompt = `Find 3 relevant thumbnail examples for:
Title: ${videoTitle}
Description: ${description}
Style: ${style}

Return ONLY valid JSON with real Unsplash image URLs:
{
  "samples": [
    {
      "url": "https://images.unsplash.com/photo-XXXXX?w=1280&h=720",
      "description": "Bold tech thumbnail with dark background",
      "relevance": 95
    }
  ]
}

Use Unsplash search terms: ${videoTitle.toLowerCase().split(' ').slice(0, 3).join(' ')}`;

      const response = await client.send(new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [{ role: "user", content: [{ text: prompt }] }],
          inferenceConfig: { maxTokens: 1000, temperature: 0.7, topP: 0.9 }
        })
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const generatedText = responseBody.output.message.content[0].text;
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { samples: [] };

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ mode: 'sample', result })
      };
    }

    // MODE 3: Professional - Generate with Titan Image Generator
    if (mode === 'professional') {
      const imagePrompt = `Professional ${platform} thumbnail: ${videoTitle}. ${description}. Style: ${style}. ${colorScheme}. ${mainText ? `Text: "${mainText}"` : ''}. Mood: ${mood}. High quality, eye-catching, clickable.`;

      const response = await client.send(new InvokeModelCommand({
        modelId: "amazon.titan-image-generator-v2:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          taskType: "TEXT_IMAGE",
          textToImageParams: {
            text: imagePrompt,
            negativeText: "blurry, low quality, text, watermark"
          },
          imageGenerationConfig: {
            numberOfImages: 1,
            quality: "premium",
            height: platform === "Instagram" ? 1080 : 720,
            width: platform === "Instagram" ? 1080 : 1280,
            cfgScale: 8.0
          }
        })
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const base64Image = responseBody.images[0];

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          mode: 'professional', 
          result: { 
            image: base64Image,
            prompt: imagePrompt
          }
        })
      };
    }

    throw new Error('Invalid mode');

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
