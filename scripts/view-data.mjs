import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({ region: "us-east-1" });

// View all DynamoDB items
async function viewAllThumbnails() {
  const result = await docClient.send(new ScanCommand({
    TableName: "creator-copilot-thumbnails"
  }));
  
  console.log("📊 Total thumbnails:", result.Items.length);
  console.log("\n🔍 Sample item with all fields:");
  console.log(JSON.stringify(result.Items[0], null, 2));
}

// View specific thumbnail
async function viewThumbnail(thumbnailId) {
  const result = await docClient.send(new GetCommand({
    TableName: "creator-copilot-thumbnails",
    Key: { thumbnailId }
  }));
  
  console.log("📄 Thumbnail details:");
  console.log(JSON.stringify(result.Item, null, 2));
}

// List S3 objects
async function listS3Objects() {
  const result = await s3Client.send(new ListObjectsV2Command({
    Bucket: "creator-copilot-thumbnails",
    Prefix: "thumbnails/"
  }));
  
  console.log("🖼️ S3 Objects:", result.Contents.length);
  result.Contents.forEach(obj => {
    console.log(`- ${obj.Key} (${obj.Size} bytes)`);
  });
}

// Run
viewAllThumbnails().catch(console.error);
// viewThumbnail("YOUR_THUMBNAIL_ID").catch(console.error);
// listS3Objects().catch(console.error);
