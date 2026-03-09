import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

export const handler = async (event) => {
  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, body: '' };
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
        body: JSON.stringify({ mode: 'structure', result })
      };
    }

    // MODE 2: Sample Thumbnail - Use AI to generate Google Image search links
    if (mode === 'sample') {
      const prompt = `Generate 3 Google Image search queries for thumbnail inspiration.
Title: ${videoTitle}
Description: ${description}
Platform: ${platform}
Style: ${style}

Return ONLY a JSON array with 3 objects:
[{"searchQuery":"query text","description":"what it shows","relevance":95}]`;

      const response = await client.send(new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [{ role: "user", content: [{ text: prompt }] }],
          inferenceConfig: { maxTokens: 600, temperature: 0.7, topP: 0.9 }
        })
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const generatedText = responseBody.output.message.content[0].text;
      const jsonMatch = generatedText.match(/\[[\s\S]*?\]/);
      
      let aiSuggestions = [];
      if (jsonMatch) {
        try {
          aiSuggestions = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('JSON parse error:', e);
        }
      }

      const samples = aiSuggestions.length > 0 ? aiSuggestions.map((item, i) => ({
        url: `https://www.google.com/search?q=${encodeURIComponent(item.searchQuery + ' thumbnail')}&tbm=isch`,
        description: item.description,
        relevance: item.relevance || (95 - i * 5),
        searchTerm: item.searchQuery
      })) : [
        {
          url: `https://www.google.com/search?q=${encodeURIComponent(videoTitle + ' ' + platform + ' thumbnail')}&tbm=isch`,
          description: `${platform} thumbnails for ${videoTitle}`,
          relevance: 95,
          searchTerm: `${videoTitle} ${platform} thumbnail`
        },
        {
          url: `https://www.google.com/search?q=${encodeURIComponent(style + ' thumbnail design')}&tbm=isch`,
          description: `${style} style thumbnail examples`,
          relevance: 90,
          searchTerm: `${style} thumbnail design`
        },
        {
          url: `https://www.google.com/search?q=${encodeURIComponent(platform + ' thumbnail inspiration')}&tbm=isch`,
          description: `${platform} thumbnail inspiration`,
          relevance: 85,
          searchTerm: `${platform} thumbnail inspiration`
        }
      ];

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          mode: 'sample', 
          result: { 
            samples,
            note: 'AI-generated Google Image search links for thumbnail inspiration. Click to explore relevant designs.'
          }
        })
      };
    }

    // MODE 3: Professional - Generate with Nova Canvas
    if (mode === 'professional') {
      try {
        const imagePrompt = `Professional ${platform} thumbnail: ${videoTitle}. ${description}. Style: ${style}. Mood: ${mood}. High quality, eye-catching design.`;

        console.log('🎨 Generating with Nova Canvas:', imagePrompt);

        const response = await client.send(new InvokeModelCommand({
          modelId: "amazon.nova-canvas-v1:0",
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            taskType: "TEXT_IMAGE",
            textToImageParams: {
              text: imagePrompt
            },
            imageGenerationConfig: {
              numberOfImages: 1,
              height: 768,
              width: 1280,
              cfgScale: 8.0,
              seed: Math.floor(Math.random() * 858993459)
            }
          })
        }));

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        console.log('✅ Nova Canvas response received');
        
        if (!responseBody.images || !responseBody.images[0]) {
          throw new Error('No image generated');
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            mode: 'professional', 
            result: { 
              image: responseBody.images[0],
              prompt: imagePrompt
            }
          })
        };
      } catch (professionalError) {
        console.error('❌ Professional mode error:', professionalError);
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: `Professional thumbnail generation failed: ${professionalError.message}. Please ensure Nova Canvas model access is enabled in your AWS account.`
          })
        };
      }
    }

    throw new Error('Invalid mode');

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
