# 🚀 DynamoDB Tables Setup Guide

## 📊 Required Tables

### 1. **creator-copilot-content-analysis**
```bash
aws dynamodb create-table \
  --table-name creator-copilot-content-analysis \
  --attribute-definitions \
    AttributeName=analysisId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=analysisId,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### 2. **creator-copilot-trends**
```bash
aws dynamodb create-table \
  --table-name creator-copilot-trends \
  --attribute-definitions \
    AttributeName=trendId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=trendId,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### 3. **creator-copilot-safety**
```bash
aws dynamodb create-table \
  --table-name creator-copilot-safety \
  --attribute-definitions \
    AttributeName=safetyId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=safetyId,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### 4. **creator-copilot-monetization**
```bash
aws dynamodb create-table \
  --table-name creator-copilot-monetization \
  --attribute-definitions \
    AttributeName=monetizationId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=monetizationId,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### 5. **creator-copilot-projects** (Content Studio)
```bash
aws dynamodb create-table \
  --table-name creator-copilot-projects \
  --attribute-definitions \
    AttributeName=projectId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=projectId,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### 6. **creator-copilot-schedule**
```bash
aws dynamodb create-table \
  --table-name creator-copilot-schedule \
  --attribute-definitions \
    AttributeName=scheduleId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=scheduleId,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

---

## 🪣 S3 Bucket for Content Studio

```bash
aws s3 mb s3://creator-copilot-content-studio --region us-east-1

aws s3api put-bucket-cors --bucket creator-copilot-content-studio --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }]
}'
```

---

## 🔑 IAM Policy for Lambda Functions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/creator-copilot-*",
        "arn:aws:dynamodb:us-east-1:*:table/creator-copilot-*/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::creator-copilot-content-studio/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 📦 Deploy Lambda Functions

### Update existing Lambdas:
```bash
cd lambda

# Content Analyzer
zip contentAnalyzer.zip contentAnalyzer.mjs
aws lambda update-function-code --function-name contentAnalyzer --zip-file fileb://contentAnalyzer.zip

# Trend Analyzer
zip trendAnalyzer.zip trendAnalyzer.mjs
aws lambda update-function-code --function-name trendAnalyzer --zip-file fileb://trendAnalyzer.zip

# Safety Analyzer
zip safetyAnalyzer.zip safetyAnalyzer.mjs
aws lambda update-function-code --function-name safetyAnalyzer --zip-file fileb://safetyAnalyzer.zip

# Monetization Predictor
zip monetizationPredictor.zip monetizationPredictor.mjs
aws lambda update-function-code --function-name monetizationPredictor --zip-file fileb://monetizationPredictor.zip
```

### Create new Lambdas:
```bash
# Content Studio
zip contentStudioStorage.zip contentStudioStorage.mjs
aws lambda create-function \
  --function-name contentStudioStorage \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-dynamodb-s3-role \
  --handler contentStudioStorage.handler \
  --zip-file fileb://contentStudioStorage.zip \
  --timeout 30 \
  --memory-size 512

# Schedule Storage
zip scheduleStorage.zip scheduleStorage.mjs
aws lambda create-function \
  --function-name scheduleStorage \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-dynamodb-role \
  --handler scheduleStorage.handler \
  --zip-file fileb://scheduleStorage.zip \
  --timeout 30 \
  --memory-size 256
```

---

## ✅ Verify Tables

```bash
aws dynamodb list-tables --region us-east-1
```

Expected output:
- creator-copilot-content-analysis
- creator-copilot-trends
- creator-copilot-safety
- creator-copilot-monetization
- creator-copilot-projects
- creator-copilot-schedule
- creator-copilot-thumbnails (existing)

---

## 🎯 Summary

**7 DynamoDB Tables** tracking:
- ✅ Content Analysis history
- ✅ Trend discoveries
- ✅ Safety reports
- ✅ Monetization predictions
- ✅ Content Studio projects
- ✅ Scheduled posts
- ✅ Thumbnail metadata

**2 S3 Buckets**:
- ✅ creator-copilot-thumbnails
- ✅ creator-copilot-content-studio

All features now have persistent storage! 🚀
