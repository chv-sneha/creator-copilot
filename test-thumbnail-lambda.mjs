import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function testNovaCanvas() {
  try {
    console.log('Testing Nova Canvas...');
    
    const response = await client.send(new InvokeModelCommand({
      modelId: "us.amazon.nova-canvas-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        taskType: "TEXT_IMAGE",
        textToImageParams: {
          text: "Professional YouTube thumbnail with bold text and vibrant colors"
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          height: 768,
          width: 1280,
          cfgScale: 8.0,
          seed: 12345
        }
      })
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log('✅ Success! Image generated');
    console.log('Response keys:', Object.keys(responseBody));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testNovaCanvas();
