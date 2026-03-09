# 🚀 Step-by-Step Deployment Guide (Low Cost)

## 💰 Cost: ~$0.50/month

---

## ✅ STEP 1: Create S3 Bucket (5 minutes)

### 1.1 Open AWS Console
Go to: https://console.aws.amazon.com/s3

### 1.2 Click "Create bucket"

### 1.3 Configure:
- **Bucket name**: `creator-copilot-thumbnails`
- **Region**: `us-east-1`
- **Block Public Access**: UNCHECK "Block all public access"
- Click **Create bucket**

### 1.4 Enable Public Access
1. Click on your bucket name
2. Go to **Permissions** tab
3. Click **Edit** on Bucket policy
4. Paste this:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::creator-copilot-thumbnails/*"
  }]
}
```

5. Click **Save changes**

✅ **Done!** Your S3 bucket is ready.

---

## ✅ STEP 2: Create DynamoDB Table (3 minutes)

### 2.1 Open DynamoDB Console
Go to: https://console.aws.amazon.com/dynamodb

### 2.2 Click "Create table"

### 2.3 Configure:
- **Table name**: `creator-copilot-thumbnails`
- **Partition key**: `thumbnailId` (String)
- **Table settings**: Choose **On-demand** (pay per request - cheaper!)
- Click **Create table**

### 2.4 Add Global Secondary Index (GSI)
1. Click on your table name
2. Go to **Indexes** tab
3. Click **Create index**
4. Configure:
   - **Partition key**: `userId` (String)
   - **Index name**: `UserIdIndex`
   - Click **Create index**

✅ **Done!** Your DynamoDB table is ready.

---

## ✅ STEP 3: Update Lambda Function (10 minutes)

### 3.1 Open Lambda Console
Go to: https://console.aws.amazon.com/lambda

### 3.2 Find your function
Click on `thumbnailGenerator`

### 3.3 Replace code
1. Click on **Code** tab
2. Delete existing code
3. Copy code from `lambda/thumbnailGeneratorWithStorage.mjs`
4. Paste into Lambda editor
5. Click **Deploy**

### 3.4 Add Environment Variables
1. Go to **Configuration** tab
2. Click **Environment variables**
3. Click **Edit**
4. Add these:
   - `S3_BUCKET_NAME` = `creator-copilot-thumbnails`
   - `DYNAMODB_TABLE_NAME` = `creator-copilot-thumbnails`
5. Click **Save**

✅ **Done!** Lambda is configured.

---

## ✅ STEP 4: Update IAM Permissions (5 minutes)

### 4.1 Go to Lambda Configuration
1. In your Lambda function, click **Configuration** tab
2. Click **Permissions**
3. Click on the **Role name** (opens IAM in new tab)

### 4.2 Add S3 Permission
1. Click **Add permissions** → **Attach policies**
2. Search for `AmazonS3FullAccess`
3. Check it and click **Attach policies**

### 4.3 Add DynamoDB Permission
1. Click **Add permissions** → **Attach policies**
2. Search for `AmazonDynamoDBFullAccess`
3. Check it and click **Attach policies**

✅ **Done!** Permissions are set.

---

## ✅ STEP 5: Test the Setup (2 minutes)

### 5.1 Test in Lambda Console
1. Go back to your Lambda function
2. Click **Test** tab
3. Create new test event:

```json
{
  "httpMethod": "POST",
  "body": "{\"mode\":\"professional\",\"userId\":\"test-user\",\"videoTitle\":\"Test Video\",\"description\":\"Test\",\"platform\":\"YouTube\",\"style\":\"Bold\"}"
}
```

4. Click **Test**
5. Check response - should see `s3Url` in result

### 5.2 Verify S3
1. Go to S3 console
2. Open your bucket
3. You should see `thumbnails/` folder with a PNG file

### 5.3 Verify DynamoDB
1. Go to DynamoDB console
2. Click your table
3. Click **Explore table items**
4. You should see 1 item with your test data

✅ **Done!** Everything works!

---

## ✅ STEP 6: Update Frontend (5 minutes)

### 6.1 Get Lambda URL
1. In Lambda console, go to **Configuration** → **Function URL**
2. Copy the URL (e.g., `https://abc123.lambda-url.us-east-1.on.aws/`)

### 6.2 Update .env file
Open `creator-copilot/.env` and add:

```bash
VITE_LAMBDA_THUMBNAIL_STORAGE=https://YOUR_LAMBDA_URL.lambda-url.us-east-1.on.aws/
```

### 6.3 Restart dev server
```bash
npm run dev
```

✅ **Done!** Frontend is connected.

---

## ✅ STEP 7: Test End-to-End (2 minutes)

1. Open your app: http://localhost:8080
2. Go to **Thumbnail Generator**
3. Select "Professional Thumbnail"
4. Fill in details and click **Generate**
5. Check response - you should get an S3 URL
6. Click the URL - image should load from S3

✅ **Success!** Your app now uses S3 + DynamoDB!

---

## 📊 What You Get

| Feature | Status |
|---------|--------|
| ✅ Thumbnails saved to S3 | Working |
| ✅ Metadata in DynamoDB | Working |
| ✅ Public S3 URLs | Working |
| ✅ User history tracking | Working |
| ✅ Auto-cleanup (90 days) | Working |

---

## 💰 Monthly Cost Breakdown

| Service | Usage | Cost |
|---------|-------|------|
| S3 | 100 images (~50MB) | $0.01 |
| DynamoDB | On-demand, 100 requests | $0.25 |
| Lambda | 100 requests | $0.00 (free tier) |
| **Total** | | **~$0.26/month** |

Even cheaper than expected! 🎉

---

## 🔧 Troubleshooting

### Error: "Access Denied" on S3
- Check bucket policy is applied
- Verify IAM role has S3 permissions

### Error: "Table not found" on DynamoDB
- Check table name matches exactly
- Verify region is `us-east-1`

### Error: "No image generated"
- Check Bedrock Nova Canvas is enabled
- Verify IAM has Bedrock permissions

### Lambda timeout
- Increase timeout: Configuration → General → Timeout → 60 seconds

---

## 🎉 Next Steps

1. ✅ Test with real thumbnails
2. ✅ Check S3 bucket for saved images
3. ✅ Query DynamoDB for metadata
4. ✅ Build analytics dashboard (optional)
5. ✅ Add user thumbnail gallery (optional)

---

## 📝 Quick Commands Reference

### View S3 files
```bash
aws s3 ls s3://creator-copilot-thumbnails/thumbnails/ --recursive
```

### Query DynamoDB
```bash
aws dynamodb scan --table-name creator-copilot-thumbnails --limit 10
```

### Check Lambda logs
```bash
aws logs tail /aws/lambda/thumbnailGenerator --follow
```

---

## ✅ Checklist

- [ ] S3 bucket created
- [ ] Bucket policy applied
- [ ] DynamoDB table created
- [ ] GSI added (UserIdIndex)
- [ ] Lambda code updated
- [ ] Environment variables set
- [ ] IAM permissions added
- [ ] Lambda tested successfully
- [ ] S3 has test image
- [ ] DynamoDB has test record
- [ ] Frontend .env updated
- [ ] End-to-end test passed

---

**Total Time**: ~30 minutes
**Total Cost**: ~$0.26/month

You're all set! 🚀
