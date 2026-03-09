# 🚀 MANUAL DEPLOYMENT GUIDE

## Step 1: Create DynamoDB Tables (5 minutes)

Run this command in AWS CLI or CloudShell:

```bash
# Table 1: Content Analysis
aws dynamodb create-table --table-name creator-copilot-content-analysis --attribute-definitions AttributeName=analysisId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=analysisId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

# Table 2: Trends
aws dynamodb create-table --table-name creator-copilot-trends --attribute-definitions AttributeName=trendId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=trendId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

# Table 3: Safety
aws dynamodb create-table --table-name creator-copilot-safety --attribute-definitions AttributeName=safetyId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=safetyId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

# Table 4: Monetization
aws dynamodb create-table --table-name creator-copilot-monetization --attribute-definitions AttributeName=monetizationId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=monetizationId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

# Table 5: Schedule
aws dynamodb create-table --table-name creator-copilot-schedule --attribute-definitions AttributeName=scheduleId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=scheduleId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

# Table 6: Content Ideas
aws dynamodb create-table --table-name creator-copilot-content-ideas --attribute-definitions AttributeName=ideaId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=ideaId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1
```

---

## Step 2: Update IAM Role (2 minutes)

1. Go to **IAM Console** → **Roles**
2. Find your Lambda execution role (e.g., `lambda-bedrock-role`)
3. Click **Add permissions** → **Attach policies**
4. Click **Create policy** → **JSON** tab
5. Paste this:

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
        "dynamodb:UpdateItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/creator-copilot-*",
        "arn:aws:dynamodb:us-east-1:*:table/creator-copilot-*/index/*"
      ]
    }
  ]
}
```

6. Name it: `DynamoDBCreatorCopilotAccess`
7. Attach to your Lambda role

---

## Step 3: Update Lambda Functions (10 minutes)

### **Option A: AWS Console (Easiest)**

For each Lambda function, do this:

#### 1. **analyzeContent** (Content Analyzer)
- Go to Lambda Console → `analyzeContent`
- Click **Code** tab
- Replace code with: `lambda/contentAnalyzer.mjs`
- Click **Deploy**

#### 2. **trendAnalyzer**
- Go to Lambda Console → `trendAnalyzer`
- Replace code with: `lambda/trendAnalyzer.mjs`
- Click **Deploy**

#### 3. **safetyAnalyzer**
- Go to Lambda Console → `safetyAnalyzer`
- Replace code with: `lambda/safetyAnalyzer.mjs`
- Click **Deploy**

#### 4. **monetizationPredictor**
- Go to Lambda Console → `monetizationPredictor`
- Replace code with: `lambda/monetizationPredictor.mjs`
- Click **Deploy**

#### 5. **schedulingIntelligence**
- Go to Lambda Console → `schedulingIntelligence`
- Replace code with: `lambda/schedulingIntelligence.mjs`
- Click **Deploy**

#### 6. **contentIdeaGenerator**
- Go to Lambda Console → `contentIdeaGenerator`
- Replace code with: `lambda/contentIdeaGenerator.mjs`
- Click **Deploy**

---

### **Option B: AWS CLI (Faster)**

```bash
cd lambda

# Update Content Analyzer
zip contentAnalyzer.zip contentAnalyzer.mjs
aws lambda update-function-code --function-name analyzeContent --zip-file fileb://contentAnalyzer.zip --region us-east-1

# Update Trend Analyzer
zip trendAnalyzer.zip trendAnalyzer.mjs
aws lambda update-function-code --function-name trendAnalyzer --zip-file fileb://trendAnalyzer.zip --region us-east-1

# Update Safety Analyzer
zip safetyAnalyzer.zip safetyAnalyzer.mjs
aws lambda update-function-code --function-name safetyAnalyzer --zip-file fileb://safetyAnalyzer.zip --region us-east-1

# Update Monetization Predictor
zip monetizationPredictor.zip monetizationPredictor.mjs
aws lambda update-function-code --function-name monetizationPredictor --zip-file fileb://monetizationPredictor.zip --region us-east-1

# Update Scheduling Intelligence
zip schedulingIntelligence.zip schedulingIntelligence.mjs
aws lambda update-function-code --function-name schedulingIntelligence --zip-file fileb://schedulingIntelligence.zip --region us-east-1

# Update Content Idea Generator
zip contentIdeaGenerator.zip contentIdeaGenerator.mjs
aws lambda update-function-code --function-name contentIdeaGenerator --zip-file fileb://contentIdeaGenerator.zip --region us-east-1
```

---

## Step 4: Verify (1 minute)

```bash
# Check tables exist
aws dynamodb list-tables --region us-east-1

# Test a Lambda
aws lambda invoke --function-name trendAnalyzer --payload '{"body":"{\"platform\":\"Instagram\",\"niche\":\"Tech\",\"region\":\"US\"}"}' response.json --region us-east-1

# Check DynamoDB data
aws dynamodb scan --table-name creator-copilot-trends --limit 5 --region us-east-1
```

---

## ✅ What You Get

**6 Lambda Functions** now saving data to **6 DynamoDB Tables**:

| Lambda Function | DynamoDB Table | What It Stores |
|----------------|----------------|----------------|
| analyzeContent | creator-copilot-content-analysis | Content analysis history |
| trendAnalyzer | creator-copilot-trends | Trending hashtags |
| safetyAnalyzer | creator-copilot-safety | Safety reports |
| monetizationPredictor | creator-copilot-monetization | Revenue predictions |
| schedulingIntelligence | creator-copilot-schedule | Posting recommendations |
| contentIdeaGenerator | creator-copilot-content-ideas | Content ideas |

**Total Cost**: $0 (within AWS Free Tier)

---

## 🎯 Quick Commands

```bash
# Create all tables at once
cd scripts
create-dynamodb-tables.bat

# View data
node view-data.mjs
```

Done! 🚀
