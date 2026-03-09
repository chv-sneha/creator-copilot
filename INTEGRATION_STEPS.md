# ✅ DEPLOYMENT CHECKLIST

## Step 1: Create DynamoDB Tables (5 min)

Open AWS CloudShell or CMD and run ONE command at a time:

```bash
aws dynamodb create-table --table-name creator-copilot-content-analysis --attribute-definitions AttributeName=analysisId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=analysisId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

aws dynamodb create-table --table-name creator-copilot-trends --attribute-definitions AttributeName=trendId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=trendId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

aws dynamodb create-table --table-name creator-copilot-safety --attribute-definitions AttributeName=safetyId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=safetyId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

aws dynamodb create-table --table-name creator-copilot-monetization --attribute-definitions AttributeName=monetizationId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=monetizationId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

aws dynamodb create-table --table-name creator-copilot-schedule --attribute-definitions AttributeName=scheduleId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=scheduleId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

aws dynamodb create-table --table-name creator-copilot-content-ideas --attribute-definitions AttributeName=ideaId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=ideaId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1
```

Verify:
```bash
aws dynamodb list-tables --region us-east-1
```

---

## Step 2: Add DynamoDB Permissions to Lambda Role (3 min)

1. Go to **AWS Console** → **IAM** → **Roles**
2. Search for your Lambda execution role (probably named like `lambda-bedrock-role` or `lambda-execution-role`)
3. Click the role name
4. Click **Add permissions** → **Create inline policy**
5. Click **JSON** tab
6. Paste this:

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
    }
  ]
}
```

7. Click **Review policy**
8. Name it: `DynamoDBCreatorCopilotAccess`
9. Click **Create policy**

---

## Step 3: Test One Lambda Function (2 min)

Test if it's working:

```bash
aws lambda invoke --function-name trendAnalyzer --payload "{\"body\":\"{\\\"platform\\\":\\\"Instagram\\\",\\\"niche\\\":\\\"Tech\\\",\\\"region\\\":\\\"US\\\",\\\"userId\\\":\\\"test123\\\"}\"}" response.json --region us-east-1
```

Check response:
```bash
type response.json
```

Should see `"trendId": "trend-..."` in response.

---

## Step 4: Verify Data in DynamoDB (1 min)

```bash
aws dynamodb scan --table-name creator-copilot-trends --limit 5 --region us-east-1
```

You should see your test data!

---

## Step 5: Test All Functions

Run these one by one:

```bash
# Content Analyzer
aws lambda invoke --function-name analyzeContent --payload "{\"body\":\"{\\\"content\\\":\\\"Amazing AI tool\\\",\\\"platform\\\":\\\"Instagram\\\",\\\"region\\\":\\\"US\\\"}\"}" test1.json --region us-east-1

# Trends
aws lambda invoke --function-name trendAnalyzer --payload "{\"body\":\"{\\\"platform\\\":\\\"Instagram\\\",\\\"niche\\\":\\\"Tech\\\",\\\"region\\\":\\\"US\\\"}\"}" test2.json --region us-east-1

# Safety
aws lambda invoke --function-name safetyAnalyzer --payload "{\"body\":\"{\\\"content\\\":\\\"Test content\\\",\\\"platform\\\":\\\"Instagram\\\",\\\"contentType\\\":\\\"post\\\"}\"}" test3.json --region us-east-1

# Monetization
aws lambda invoke --function-name monetizationPredictor --payload "{\"body\":\"{\\\"topic\\\":\\\"Tech\\\",\\\"reach\\\":\\\"10K\\\",\\\"audience\\\":\\\"Developers\\\",\\\"platform\\\":\\\"YouTube\\\"}\"}" test4.json --region us-east-1

# Scheduling
aws lambda invoke --function-name schedulingIntelligence --payload "{\"body\":\"{\\\"platform\\\":\\\"Instagram\\\",\\\"contentType\\\":\\\"Reel\\\",\\\"niche\\\":\\\"Tech\\\",\\\"region\\\":\\\"US\\\"}\"}" test5.json --region us-east-1

# Content Ideas
aws lambda invoke --function-name contentIdeaGenerator --payload "{\"body\":\"{\\\"niche\\\":\\\"Tech\\\",\\\"platform\\\":\\\"Instagram\\\"}\"}" test6.json --region us-east-1
```

---

## ✅ SUCCESS INDICATORS

After Step 4, you should see:
- 6 DynamoDB tables created
- Lambda functions returning IDs like `analysisId`, `trendId`, etc.
- Data visible in DynamoDB tables

---

## 🎯 DONE!

All 6 features now save data to DynamoDB automatically! 🚀

Check data anytime:
```bash
aws dynamodb scan --table-name creator-copilot-content-analysis --limit 10
aws dynamodb scan --table-name creator-copilot-trends --limit 10
```
