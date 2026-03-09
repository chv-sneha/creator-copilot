@echo off
echo ========================================
echo Checking Lambda CloudWatch Logs
echo ========================================

echo.
echo Fetching latest logs for thumbnailGenerator...
aws logs tail /aws/lambda/thumbnailGenerator --follow --region us-east-1

pause
