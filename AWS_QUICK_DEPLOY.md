# 🚀 Quick AWS Bedrock Deployment

## Step 1: Enable Bedrock Model Access
1. Go to AWS Console → Bedrock
2. Click "Model access" (left sidebar)
3. Click "Enable specific models"
4. Find "Titan Text G1 - Express" and enable it
5. Wait for status to show "Access granted"

## Step 2: Create IAM Role
```bash
# Create trust policy file
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name LambdaBedrockRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name LambdaBedrockRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam put-role-policy \
  --role-name LambdaBedrockRole \
  --policy-name BedrockAccess \
  --policy-document file://lambda/iam-policy.json
```

## Step 3: Deploy Lambda
```bash
cd lambda
chmod +x deploy.sh

# Edit deploy.sh and replace YOUR_ACCOUNT_ID with your AWS account ID
# Then run:
./deploy.sh
```

## Step 4: Create API Gateway
1. Go to AWS Console → API Gateway
2. Click "Create API" → "REST API" → "Build"
3. Name: `ContentAnalyzerAPI`
4. Click "Create API"
5. Click "Actions" → "Create Resource"
   - Resource Name: `analyze`
   - Click "Create Resource"
6. Select `/analyze` → "Actions" → "Create Method" → "POST"
   - Integration type: Lambda Function
   - Lambda Function: `ContentAnalyzer`
   - Click "Save" → "OK"
7. Select POST method → "Actions" → "Enable CORS"
   - Click "Enable CORS and replace existing CORS headers"
8. Click "Actions" → "Deploy API"
   - Stage: `prod`
   - Click "Deploy"
9. Copy the "Invoke URL" (looks like: https://xxxxx.execute-api.us-east-1.amazonaws.com/prod)

## Step 5: Update Frontend
```bash
# Edit .env file
VITE_AWS_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/analyze
```

## Step 6: Test
```bash
npm run dev
```

Visit http://localhost:8083/dashboard/analyzer and test!

## Troubleshooting

### Lambda timeout
```bash
aws lambda update-function-configuration \
  --function-name ContentAnalyzer \
  --timeout 60
```

### Check Lambda logs
```bash
aws logs tail /aws/lambda/ContentAnalyzer --follow
```

### Update Lambda code
```bash
cd lambda
zip -r function.zip contentAnalyzer.mjs node_modules
aws lambda update-function-code \
  --function-name ContentAnalyzer \
  --zip-file fileb://function.zip
```
