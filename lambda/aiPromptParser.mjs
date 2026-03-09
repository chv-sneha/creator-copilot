import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, prompt, canvasWidth, canvasHeight } = body;

    if (action === 'parsePrompt') {
      const aiPrompt = `Parse this thumbnail editing command and return JSON:
Command: "${prompt}"
Canvas: ${canvasWidth}x${canvasHeight}

Return ONLY this JSON format:
{
  "action": "addText",
  "text": "extracted text",
  "x": number (0-${canvasWidth}),
  "y": number (0-${canvasHeight}),
  "fontSize": number (20-100),
  "color": "#hexcolor",
  "bold": boolean,
  "outline": boolean
}

Position mapping:
- "top left" = x:100, y:100
- "top center" = x:${canvasWidth/2}, y:100
- "top right" = x:${canvasWidth-200}, y:100
- "center" = x:${canvasWidth/2}, y:${canvasHeight/2}
- "bottom left" = x:100, y:${canvasHeight-100}
- "bottom center" = x:${canvasWidth/2}, y:${canvasHeight-100}
- "bottom right" = x:${canvasWidth-200}, y:${canvasHeight-100}

Color mapping:
- "red" = "#ff0000"
- "blue" = "#0000ff"
- "green" = "#00ff00"
- "yellow" = "#ffff00"
- "white" = "#ffffff"
- "black" = "#000000"`;

      const response = await client.send(new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [{ role: "user", content: [{ text: aiPrompt }] }],
          inferenceConfig: { maxTokens: 500, temperature: 0.3, topP: 0.9 }
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
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
