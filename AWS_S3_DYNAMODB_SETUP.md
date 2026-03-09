# AWS S3 + DynamoDB Setup Guide

## 🎯 Architecture Overview

```
User → Lambda → Bedrock (Generate) → S3 (Store Image) → DynamoDB (Store Metadata)
                                    ↓
                              CloudFront (CDN)
```

## 📦 Step 1: Create S3 Bucket

```bash
aws s3 mb s3://creator-copilot-thumbnails --region us-east-1
```

### Enable Public Access
```bash
aws s3api put-bucket-acl --bucket creator-copilot-thumbnails --acl public-read
```

### Bucket Policy (Allow Public Read)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::creator-copilot-thumbnails/*"
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy --bucket creator-copilot-thumbnails --policy file://bucket-policy.json
```

## 🗄️ Step 2: Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name creator-copilot-thumbnails \
  --attribute-definitions \
    AttributeName=thumbnailId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=thumbnailId,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"UserIdIndex\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### Enable TTL (Auto-delete after 90 days)
```bash
aws dynamodb update-time-to-live \
  --table-name creator-copilot-thumbnails \
  --time-to-live-specification "Enabled=true, AttributeName=ttl"
```

## 🔧 Step 3: Update Lambda Function

### Package Dependencies
```bash
cd lambda
npm init -y
npm install @aws-sdk/client-s3 @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb @aws-sdk/client-bedrock-runtime
```

### Create deployment package
```bash
zip -r thumbnailGeneratorWithStorage.zip thumbnailGeneratorWithStorage.mjs node_modules/
```

### Deploy Lambda
```bash
aws lambda update-function-code \
  --function-name thumbnailGenerator \
  --zip-file fileb://thumbnailGeneratorWithStorage.zip \
  --region us-east-1
```

### Set Environment Variables
```bash
aws lambda update-function-configuration \
  --function-name thumbnailGenerator \
  --environment "Variables={S3_BUCKET_NAME=creator-copilot-thumbnails,DYNAMODB_TABLE_NAME=creator-copilot-thumbnails}" \
  --region us-east-1
```

## 🔐 Step 4: Update IAM Role

Add these permissions to your Lambda execution role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::creator-copilot-thumbnails/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/creator-copilot-thumbnails",
        "arn:aws:dynamodb:us-east-1:*:table/creator-copilot-thumbnails/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "*"
    }
  ]
}
```

## 📊 Step 5: Create getThumbnailHistory Lambda

```bash
zip getThumbnailHistory.zip getThumbnailHistory.mjs

aws lambda create-function \
  --function-name getThumbnailHistory \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler getThumbnailHistory.handler \
  --zip-file fileb://getThumbnailHistory.zip \
  --environment "Variables={DYNAMODB_TABLE_NAME=creator-copilot-thumbnails}" \
  --region us-east-1
```

### Create Function URL
```bash
aws lambda create-function-url-config \
  --function-name getThumbnailHistory \
  --auth-type NONE \
  --cors "AllowOrigins=*,AllowMethods=GET,AllowHeaders=content-type"
```

## 🌐 Step 6: Update Frontend

Add to `.env`:
```bash
VITE_LAMBDA_THUMBNAIL_STORAGE=https://YOUR_LAMBDA_URL.lambda-url.us-east-1.on.aws/
VITE_LAMBDA_GET_HISTORY=https://YOUR_LAMBDA_URL.lambda-url.us-east-1.on.aws/
VITE_S3_BUCKET_URL=https://creator-copilot-thumbnails.s3.amazonaws.com
```

## ✅ Testing

### Test S3 Upload
```bash
echo "test" > test.txt
aws s3 cp test.txt s3://creator-copilot-thumbnails/test.txt --acl public-read
```

### Test DynamoDB
```bash
aws dynamodb put-item \
  --table-name creator-copilot-thumbnails \
  --item '{"thumbnailId":{"S":"test-123"},"userId":{"S":"user-1"},"createdAt":{"S":"2024-01-01T00:00:00Z"}}'
```

### Query DynamoDB
```bash
aws dynamodb scan --table-name creator-copilot-thumbnails --limit 10
```

## 💰 Cost Estimate

| Service | Usage | Cost |
|---------|-------|------|
| S3 | 1GB storage, 10K requests | $0.03/month |
| DynamoDB | 5 RCU, 5 WCU | $2.50/month |
| Lambda | 10K requests | $0 (free tier) |
| **Total** | | **~$2.53/month** |

## 🎉 Benefits

1. ✅ **Persistent Storage** - Thumbnails saved permanently
2. ✅ **User History** - Track all user-generated thumbnails
3. ✅ **Analytics** - Query usage patterns
4. ✅ **CDN Ready** - S3 URLs work with CloudFront
5. ✅ **Auto Cleanup** - TTL removes old data
6. ✅ **Scalable** - Handles millions of thumbnails

## 📝 DynamoDB Schema

```javascript
{
  thumbnailId: "user123-1234567890",  // Primary Key
  userId: "user123",                   // GSI
  videoTitle: "My Video",
  description: "Description",
  platform: "YouTube",
  style: "Bold & Dramatic",
  s3Url: "https://...",
  s3Key: "thumbnails/...",
  prompt: "AI prompt used",
  source: "ai" | "editor",
  createdAt: "2024-01-01T00:00:00Z",
  ttl: 1234567890                      // Auto-delete timestamp
}
```
