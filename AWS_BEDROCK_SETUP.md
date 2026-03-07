# AWS Bedrock Integration Guide

## 1. Lambda Function Code

Create `lambda/contentAnalyzer.mjs`:

```javascript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { content, platform, region } = JSON.parse(event.body);

    const prompt = `Analyze this ${platform} content for ${region}:
"${content}"

Return ONLY valid JSON (no markdown):
{
  "qualityScore": <0-100>,
  "hookRating": <0-10>,
  "issues": ["issue1", "issue2"],
  "suggestions": ["tip1", "tip2", "tip3"],
  "platformTip": "specific tip for ${platform}"
}`;

    const command = new InvokeModelCommand({
      modelId: "amazon.titan-text-express-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 1024,
          temperature: 0.7,
          topP: 0.9
        }
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.results[0].outputText.trim();
    
    let result = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## 2. IAM Policy for Lambda

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-express-v1"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

## 3. Deploy Lambda

```bash
# Install dependencies
npm install @aws-sdk/client-bedrock-runtime

# Create deployment package
zip -r function.zip contentAnalyzer.mjs node_modules

# Deploy via AWS CLI
aws lambda create-function \
  --function-name ContentAnalyzer \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/LambdaBedrockRole \
  --handler contentAnalyzer.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512
```

## 4. API Gateway Setup

1. Go to AWS Console → API Gateway
2. Create REST API
3. Create Resource: `/analyze`
4. Create Method: POST
5. Integration Type: Lambda Function
6. Select your Lambda function
7. Enable CORS
8. Deploy API to stage (e.g., `prod`)
9. Copy Invoke URL: `https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/analyze`

## 5. Frontend Integration

Add to `.env`:
```
VITE_AWS_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/analyze
```

## 6. Enable Bedrock Model Access

1. Go to AWS Console → Bedrock
2. Click "Model access"
3. Enable "Titan Text G1 - Express"
4. Wait for approval (usually instant)
