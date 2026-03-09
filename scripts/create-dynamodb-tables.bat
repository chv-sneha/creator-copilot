@echo off
echo Creating DynamoDB tables for Creator Copilot...

echo.
echo [1/6] Creating content-analysis table...
aws dynamodb create-table --table-name creator-copilot-content-analysis --attribute-definitions AttributeName=analysisId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=analysisId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

echo.
echo [2/6] Creating trends table...
aws dynamodb create-table --table-name creator-copilot-trends --attribute-definitions AttributeName=trendId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=trendId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

echo.
echo [3/6] Creating safety table...
aws dynamodb create-table --table-name creator-copilot-safety --attribute-definitions AttributeName=safetyId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=safetyId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

echo.
echo [4/6] Creating monetization table...
aws dynamodb create-table --table-name creator-copilot-monetization --attribute-definitions AttributeName=monetizationId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=monetizationId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

echo.
echo [5/6] Creating projects table...
aws dynamodb create-table --table-name creator-copilot-projects --attribute-definitions AttributeName=projectId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=projectId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

echo.
echo [6/6] Creating schedule table...
aws dynamodb create-table --table-name creator-copilot-schedule --attribute-definitions AttributeName=scheduleId,AttributeType=S AttributeName=userId,AttributeType=S --key-schema AttributeName=scheduleId,KeyType=HASH --global-secondary-indexes IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1

echo.
echo Creating S3 bucket for Content Studio...
aws s3 mb s3://creator-copilot-content-studio --region us-east-1

echo.
echo ✅ All tables and buckets created!
echo.
echo Verify with: aws dynamodb list-tables --region us-east-1
pause
