# 📊 DynamoDB Schema - Creator Copilot Thumbnails

## Table: `creator-copilot-thumbnails`

### Primary Keys
- **thumbnailId** (String) - Partition Key: `{userId}-{timestamp}`
- **userId** (String) - GSI: User's unique identifier

---

## 🎯 Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `thumbnailId` | String | Unique identifier |
| `userId` | String | User who created thumbnail |
| `videoTitle` | String | Video/content title |
| `description` | String | Content description |
| `platform` | String | Target platform (YouTube, Instagram, etc.) |
| `style` | String | Visual style applied |
| `s3Url` | String | Public S3 URL |
| `s3Key` | String | S3 object key |
| `source` | String | `ai-generated` or `editor` |

---

## 📈 Analytics & Usage Tracking

| Field | Type | Description |
|-------|------|-------------|
| `views` | Number | View count |
| `downloads` | Number | Download count |
| `shares` | Number | Share count |
| `clicks` | Number | Click-through count |
| `impressions` | Number | Display count |
| `edits` | Number | Edit count |

---

## 🔧 Technical Metadata

| Field | Type | Description |
|-------|------|-------------|
| `fileSize` | Number | Image size in bytes |
| `dimensions` | String | "1280x720" format |
| `format` | String | Image format (png, jpg) |
| `generationModel` | String | AI model used |
| `processingTime` | Number | Generation time (ms) |
| `generationSeed` | Number | AI generation seed |
| `cfgScale` | Number | AI configuration scale |

---

## 🎨 Content Analysis

| Field | Type | Description |
|-------|------|-------------|
| `hasText` | Boolean | Contains text elements |
| `hasShapes` | Boolean | Contains shapes |
| `hasImages` | Boolean | Contains images |
| `layerCount` | Number | Number of layers |
| `colorPalette` | Array | Dominant colors |
| `textCount` | Number | Text element count |

---

## 📊 Content Analyzer Integration

| Field | Type | Description |
|-------|------|-------------|
| `contentAnalyzerUsed` | Boolean | Was analyzer used |
| `qualityScore` | Number | Content quality (0-100) |
| `readabilityScore` | Number | Readability score (0-100) |
| `sentimentScore` | Number | Sentiment analysis (-1 to 1) |
| `viralPotential` | Number | Viral prediction (0-100) |
| `brandAlignment` | Number | Brand consistency (0-100) |
| `ctaStrength` | Number | Call-to-action strength (0-100) |

---

## 🎬 Content Studio Integration

| Field | Type | Description |
|-------|------|-------------|
| `contentStudioProject` | String | Project ID if linked |
| `templateUsed` | String | Template applied |
| `editHistory` | Array | Edit action history |
| `collaborators` | Array | Team members involved |

---

## 📅 Trends & Calendar Integration

| Field | Type | Description |
|-------|------|-------------|
| `scheduledPost` | Boolean | Is scheduled for posting |
| `scheduledDate` | String | ISO date for posting |
| `trendingHashtags` | Array | Associated trending tags |
| `optimalPostTime` | String | AI recommended time |
| `seasonalRelevance` | String | Seasonal context |

---

## 🛡️ Safety & Copyright

| Field | Type | Description |
|-------|------|-------------|
| `copyrightChecked` | Boolean | Copyright scan completed |
| `copyrightStatus` | String | `pending`, `clear`, `flagged` |
| `safetyScore` | Number | Content safety (0-100) |
| `contentFlags` | Array | Safety flags |
| `moderationStatus` | String | `pending`, `approved`, `rejected` |

---

## 💰 Monetization

| Field | Type | Description |
|-------|------|-------------|
| `monetizationEnabled` | Boolean | Can generate revenue |
| `revenueGenerated` | Number | Revenue in USD |
| `sponsorshipDeals` | Array | Sponsor information |
| `affiliateLinks` | Array | Affiliate tracking |

---

## 📊 Performance Metrics

| Field | Type | Description |
|-------|------|-------------|
| `ctrScore` | Number | Click-through rate prediction |
| `engagementRate` | Number | Engagement prediction |
| `conversionRate` | Number | Conversion prediction |

---

## 🔍 Business Intelligence

| Field | Type | Description |
|-------|------|-------------|
| `deviceType` | String | `desktop`, `mobile`, `tablet` |
| `userAgent` | String | Browser information |
| `ipAddress` | String | User location (hashed) |
| `sessionId` | String | User session tracking |
| `experimentGroup` | String | A/B testing group |

---

## 🏷️ Content Tags

| Field | Type | Description |
|-------|------|-------------|
| `tags` | Array | Content tags |
| `category` | String | Content category |
| `mood` | String | Content mood/tone |
| `targetAudience` | String | Intended audience |

---

## 🕒 Timestamps

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | String | ISO creation timestamp |
| `updatedAt` | String | ISO last update |
| `lastAccessedAt` | String | ISO last access |
| `publishedAt` | String | ISO publish timestamp |

---

## 🔄 Versioning

| Field | Type | Description |
|-------|------|-------------|
| `version` | Number | Version number |
| `parentId` | String | Parent thumbnail ID |

---

## ⚡ Lifecycle

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `active`, `archived`, `deleted` |
| `ttl` | Number | Auto-delete timestamp (90 days) |

---

## 📋 Global Secondary Indexes (GSI)

### GSI-1: UserIndex
- **Partition Key**: `userId`
- **Sort Key**: `createdAt`
- **Purpose**: Query user's thumbnails by date

### GSI-2: PlatformIndex
- **Partition Key**: `platform`
- **Sort Key**: `viralPotential`
- **Purpose**: Find top-performing thumbnails by platform

### GSI-3: StatusIndex
- **Partition Key**: `status`
- **Sort Key**: `updatedAt`
- **Purpose**: Admin queries for content moderation

---

## 🔍 Query Patterns

```javascript
// Get user's thumbnails
const params = {
  IndexName: 'UserIndex',
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: { ':userId': 'user123' }
};

// Get trending thumbnails by platform
const params = {
  IndexName: 'PlatformIndex',
  KeyConditionExpression: 'platform = :platform',
  ScanIndexForward: false, // Descending order
  ExpressionAttributeValues: { ':platform': 'YouTube' }
};

// Analytics aggregation
const params = {
  FilterExpression: 'createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':start': '2024-01-01T00:00:00Z',
    ':end': '2024-01-31T23:59:59Z'
  }
};
```

---

## 💡 Usage Examples

### Track Thumbnail Performance
```javascript
// Update view count
await docClient.send(new UpdateCommand({
  TableName: 'creator-copilot-thumbnails',
  Key: { thumbnailId: 'thumb123' },
  UpdateExpression: 'ADD #views :inc SET lastAccessedAt = :now',
  ExpressionAttributeNames: { '#views': 'views' },
  ExpressionAttributeValues: { 
    ':inc': 1, 
    ':now': new Date().toISOString() 
  }
}));
```

### Content Analysis Integration
```javascript
// Update after content analysis
await docClient.send(new UpdateCommand({
  TableName: 'creator-copilot-thumbnails',
  Key: { thumbnailId: 'thumb123' },
  UpdateExpression: `SET 
    contentAnalyzerUsed = :used,
    qualityScore = :quality,
    viralPotential = :viral,
    updatedAt = :now`,
  ExpressionAttributeValues: {
    ':used': true,
    ':quality': 85,
    ':viral': 72,
    ':now': new Date().toISOString()
  }
}));
```

### Monetization Tracking
```javascript
// Track revenue
await docClient.send(new UpdateCommand({
  TableName: 'creator-copilot-thumbnails',
  Key: { thumbnailId: 'thumb123' },
  UpdateExpression: 'ADD revenueGenerated :revenue',
  ExpressionAttributeValues: { ':revenue': 12.50 }
}));
```

---

## 🚀 Benefits

✅ **Complete Analytics**: Track every interaction and metric  
✅ **Cross-Feature Integration**: Connect all Creator Copilot features  
✅ **Business Intelligence**: A/B testing and performance optimization  
✅ **Monetization Ready**: Revenue and sponsorship tracking  
✅ **Compliance**: Safety and copyright monitoring  
✅ **Scalability**: Efficient queries with GSIs  

This comprehensive schema enables full-featured analytics, cross-platform insights, and business intelligence for the Creator Copilot platform.