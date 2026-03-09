# View all DynamoDB items
aws dynamodb scan --table-name creator-copilot-thumbnails --region us-east-1 --output json > dynamodb-data.json

# View specific item
# aws dynamodb get-item --table-name creator-copilot-thumbnails --key "{\"thumbnailId\": {\"S\": \"YOUR_ID\"}}" --region us-east-1

# List S3 objects
aws s3 ls s3://creator-copilot-thumbnails/thumbnails/ --recursive
