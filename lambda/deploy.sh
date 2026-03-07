#!/bin/bash

# Deploy Lambda Function to AWS
# Run this from the lambda/ directory

echo "Installing dependencies..."
npm install

echo "Creating deployment package..."
zip -r function.zip contentAnalyzer.mjs node_modules package.json

echo "Deploying to AWS Lambda..."
aws lambda create-function \
  --function-name ContentAnalyzer \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/LambdaBedrockRole \
  --handler contentAnalyzer.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512 \
  --region us-east-1

echo "Done! Update YOUR_ACCOUNT_ID in this script before running."
