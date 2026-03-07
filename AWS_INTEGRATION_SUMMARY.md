# ✅ AWS Bedrock Integration - Complete Summary

## 📦 What I Created

### 1. Lambda Function (`lambda/contentAnalyzer.mjs`)
- Uses Amazon Titan Text Express model
- Handles content analysis requests
- Returns JSON with quality scores and suggestions
- Includes CORS headers for frontend access

### 2. IAM Policy (`lambda/iam-policy.json`)
- Grants Lambda permission to invoke Bedrock
- Allows CloudWatch logging

### 3. Deployment Script (`lambda/deploy.sh`)
- Automates Lambda deployment
- Creates deployment package with dependencies

### 4. Frontend Integration (`src/lib/bedrock.ts`)
- TypeScript service for calling AWS API
- Type-safe interface for results

### 5. New Component (`src/pages/ContentAnalyzerBedrock.tsx`)
- Clean UI for AWS Bedrock analysis
- Displays: Quality Score, Hook Rating, Issues, Suggestions, Platform Tips

### 6. Documentation
- `AWS_BEDROCK_SETUP.md` - Detailed setup guide
- `AWS_QUICK_DEPLOY.md` - Step-by-step deployment

## 🚀 Deployment Steps

### Step 1: Enable Bedrock Access
```bash
# Go to AWS Console → Bedrock → Model access
# Enable "Titan Text G1 - Express"
```

### Step 2: Create IAM Role
```bash
aws iam create-role \
  --role-name LambdaBedrockRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name LambdaBedrockRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam put-role-policy \
  --role-name LambdaBedrockRole \
  --policy-name BedrockAccess \
  --policy-document file://lambda/iam-policy.json
```

### Step 3: Deploy Lambda
```bash
cd lambda
npm install
zip -r function.zip contentAnalyzer.mjs node_modules package.json

aws lambda create-function \
  --function-name ContentAnalyzer \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/LambdaBedrockRole \
  --handler contentAnalyzer.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512 \
  --region us-east-1
```

### Step 4: Create API Gateway
1. AWS Console → API Gateway → Create REST API
2. Create Resource: `/analyze`
3. Create Method: `POST` → Link to Lambda
4. Enable CORS
5. Deploy to `prod` stage
6. Copy Invoke URL

### Step 5: Update Environment
```bash
# Add to .env
VITE_AWS_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/analyze
```

### Step 6: Use New Component
```typescript
// In your routing file, add:
import ContentAnalyzerBedrock from "@/pages/ContentAnalyzerBedrock";

// Route: /dashboard/analyzer-bedrock
```

## 📊 API Response Format

```json
{
  "qualityScore": 75,
  "hookRating": 8,
  "issues": [
    "Missing call-to-action",
    "Could use more emojis for Instagram"
  ],
  "suggestions": [
    "Add a clear CTA at the end",
    "Include 2-3 relevant emojis",
    "Break text into shorter paragraphs"
  ],
  "platformTip": "For Instagram, consider adding a question to boost comments"
}
```

## 🔧 Testing

```bash
# Test Lambda directly
aws lambda invoke \
  --function-name ContentAnalyzer \
  --payload '{"body":"{\"content\":\"Test post\",\"platform\":\"Instagram\",\"region\":\"India\"}"}' \
  response.json

# Test API Gateway
curl -X POST https://YOUR_API_URL/prod/analyze \
  -H "Content-Type: application/json" \
  -d '{"content":"Test post","platform":"Instagram","region":"India"}'
```

## 💰 Cost Estimate

- Lambda: ~$0.20 per 1M requests
- API Gateway: ~$3.50 per 1M requests
- Bedrock Titan Text: ~$0.0008 per 1K input tokens
- **Total**: ~$5-10/month for moderate usage

## 🎯 Next Steps

1. Deploy Lambda function
2. Set up API Gateway
3. Update `.env` with API URL
4. Test the integration
5. (Optional) Add to existing ContentAnalyzer as a toggle

## 🔄 Switch Between Gemini and Bedrock

You can keep both implementations:
- Original: Uses Gemini (current `/dashboard/analyzer`)
- New: Uses AWS Bedrock (`/dashboard/analyzer-bedrock`)

Or add a toggle in the UI to switch between providers!
