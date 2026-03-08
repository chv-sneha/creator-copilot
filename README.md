# 🚀 AI Creator Copilot
### AWS-Powered AI Platform for Social Media Content Creation & Optimization

![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20Lambda%20%7C%20S3%20%7C%20Comprehend-FF9900?style=for-the-badge&logo=amazonaws)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react)
![Serverless](https://img.shields.io/badge/Architecture-Serverless-green?style=for-the-badge)

> **AI Creator Copilot** is a fully serverless, cloud-native platform built on AWS that empowers content creators to generate, analyze, optimize and distribute content across Instagram, LinkedIn, YouTube and X — powered entirely by Amazon Bedrock AI.

---

## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [AWS Architecture](#aws-architecture)
- [AWS Services](#aws-services)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Lambda Functions](#lambda-functions)
- [API Endpoints](#api-endpoints)
- [Performance Metrics](#performance-metrics)
- [Cost Analysis](#cost-analysis)
- [Contributors](#contributors)

---

## 🎯 Problem Statement

Content creators face critical challenges:
- No real-time feedback on content quality before publishing
- Manual effort to rewrite content for each platform
- No intelligent system to detect copyright or toxic content
- No AI-powered monetization or trend insights
- Thousands of hours lost to repetitive content tasks

---

## ✅ Solution

AI Creator Copilot solves this with a **fully serverless AWS architecture** that delivers:
- Real-time AI content analysis via **Amazon Bedrock Nova Pro**
- Platform-specific content generation for 6 social platforms
- Copyright and toxicity scanning via **Amazon Comprehend**
- AI thumbnail generation via **Amazon Nova Canvas**
- All processed through **AWS Lambda** — zero server management

---

## ☁️ AWS Architecture

```
┌─────────────────────────────────────────────────────┐
│              CLIENT LAYER (Layer 1)                  │
│         Web App (React/Next.js) + Mobile API         │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────┐
│           API GATEWAY LAYER (Layer 2)                │
│     AWS API Gateway (Routing) + AWS WAF (Security)   │
└─────────────────────┬───────────────────────────────┘
                      │ Invoke
                      ▼
┌─────────────────────────────────────────────────────┐
│           SERVERLESS COMPUTE (Layer 2.5)             │
│         AWS Lambda — All Business Logic              │
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│  Bedrock   │ │ Comprehend │ │   S3       │
│  Nova Pro  │ │  NLP/NER   │ │  Storage   │
│  Nova Lite │ │  Toxicity  │ │  Thumbnails│
│Nova Canvas │ │  Sentiment │ └────────────┘
└────────────┘ └────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│              DATA LAYER (Layer 5)                    │
│  Amazon S3 (Media) | DynamoDB (Logs) | CloudWatch    │
└─────────────────────────────────────────────────────┘
```

---

## ☁️ AWS Services

| AWS Service | Purpose | Implementation |
|------------|---------|----------------|
| **Amazon Bedrock (Nova Pro)** | Core AI — content analysis, hooks, platform writing, translation | 6 Lambda integrations |
| **Amazon Bedrock (Nova Lite)** | Lightweight AI — trend discovery, idea generation, scheduling | 3 Lambda integrations |
| **Amazon Bedrock (Nova Canvas)** | Image generation — AI thumbnails | 1 Lambda integration |
| **AWS Lambda** | Serverless compute for all AI features | 8 functions, Node.js 24.x |
| **AWS API Gateway** | REST API routing with CORS | 8 endpoints, prod stage |
| **Amazon S3** | Thumbnail and media storage | Public CDN-ready bucket |
| **Amazon Comprehend** | NLP — sentiment, toxicity, copyright risk detection | Safety & Copyright feature |
| **Amazon DynamoDB** | AI usage logs, content metadata | PutItem on every AI call |
| **Amazon CloudWatch** | Lambda monitoring, API metrics, execution logs | Auto-enabled |
| **AWS IAM** | Least-privilege roles for all Lambda functions | Per-function policies |

---

## ✨ Key Features

### 1. 🎯 AI Content Analyzer — Amazon Bedrock Nova Pro
- **8-metric analysis**: Quality Score, Hook Rating, Readability, Sentiment, Viral Potential, Brand Alignment, CTA Strength, Engagement Prediction
- **Platform-specific insights**: Instagram, LinkedIn, YouTube, X, TikTok, Facebook
- **Regional intelligence**: 13+ regions with cultural awareness
- **Response time**: < 3 seconds via AWS Lambda

### 2. 🪝 Hook & Platform Writer — Amazon Bedrock Nova Pro
- Generates 5 alternative hooks with engagement, clarity and strength scores
- Rewrites raw content into platform-optimized posts for all 4 major platforms
- Translates and culturally adapts content for Indian regional languages

### 3. 📈 Trend Intelligence — Amazon Bedrock Nova Lite
- Discovers trending hashtags, viral topics and content formats by niche
- AI Idea Calendar with daily/weekly content plans
- Intelligent scheduling with optimal posting time recommendations

### 4. 🎨 Thumbnail Generator — Amazon Nova Canvas + Amazon S3
- AI-powered thumbnail generation from text prompts
- Platform-specific sizing: YouTube (1280×720), Instagram (1080×1080), LinkedIn (1200×627)
- Permanent storage in Amazon S3 with public CDN URLs
- Multiple styles: Bold, Minimal, Cinematic, Professional

### 5. 🛡️ Safety & Copyright Scanner — Amazon Comprehend
- Real-time toxicity detection before publishing
- Sentiment analysis and dominant language detection
- Copyright risk scoring (High/Medium/Low)
- Accessibility and readability analysis

### 6. 💰 Monetization Predictor — Amazon Bedrock Nova Pro
- Predicts monetization potential by niche + platform + audience size
- Promotional timing advisor for maximum ROI
- Comment sentiment and moderation at scale

---

## 🛠️ Tech Stack

### Cloud & Backend
| Technology | Purpose |
|-----------|---------|
| **Amazon Bedrock** | Core AI inference engine |
| **AWS Lambda (Node.js 24.x)** | Serverless backend |
| **AWS API Gateway** | REST API management |
| **Amazon S3** | Object storage |
| **Amazon Comprehend** | NLP & content safety |
| **Amazon DynamoDB** | Usage logs & metadata |
| **Amazon CloudWatch** | Monitoring & alerting |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Recharts | Data visualization |

### AI Models
| Model | Use Case |
|-------|---------|
| **Amazon Nova Pro v1** | Content analysis, hooks, writing, translation |
| **Amazon Nova Lite v1** | Trends, ideas, scheduling |
| **Amazon Nova Canvas v1** | Thumbnail image generation |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- AWS Account with Bedrock model access enabled
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-repo/creator-copilot.git
cd creator-copilot

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# AWS Configuration
VITE_AWS_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
AWS_REGION=us-east-1
```

```bash
# Start development server
npm run dev
# App runs at http://localhost:8080
```

---

## ⚡ Lambda Functions

| Function | Runtime | Purpose | Bedrock Model |
|----------|---------|---------|---------------|
| `analyzeContent` | Node.js 24.x | Content quality analysis | Nova Pro |
| `generateHook` | Node.js 24.x | Hook & title generation | Nova Pro |
| `generateAssembly` | Node.js 24.x | Platform content writing | Nova Pro |
| `translateContent` | Node.js 24.x | Language & cultural adaptation | Nova Pro |
| `findTrends` | Node.js 24.x | Trend discovery | Nova Lite |
| `generateCalendar` | Node.js 24.x | AI content calendar | Nova Lite |
| `safetyCheck` | Node.js 24.x | Copyright & toxicity scan | Comprehend |
| `saveThumbnailToS3` | Node.js 24.x | Thumbnail storage | S3 |

---

## 🔌 API Endpoints

**Base URL:** `https://your-api-id.execute-api.us-east-1.amazonaws.com/prod`

```
POST /analyze              → Content quality analysis
POST /generate-hook        → Hook & title generation
POST /generate-assembly    → Platform content writing
POST /translate-content    → Language adaptation
POST /find-trends          → Trend discovery
POST /generate-calendar    → AI content calendar
POST /safety-check         → Copyright & toxicity scan
POST /save-thumbnail       → Save thumbnail to S3
```

---

## 📊 Performance Metrics

| Feature | Response Time | AWS Service |
|---------|--------------|-------------|
| Content Analysis | < 3 seconds | Bedrock Nova Pro |
| Hook Generation | < 3 seconds | Bedrock Nova Pro |
| Platform Writing | < 4 seconds | Bedrock Nova Pro |
| Trend Discovery | < 3 seconds | Bedrock Nova Lite |
| Safety Scan | < 2 seconds | Amazon Comprehend |
| Thumbnail Generation | < 5 seconds | Nova Canvas + S3 |

**Scalability:**
- Concurrent Users: 10,000+ (Lambda auto-scaling)
- API Rate Limit: 10,000 requests/second (API Gateway)
- Storage: Unlimited (Amazon S3)
- Zero downtime — fully serverless

---

## 💰 AWS Cost Analysis

| Service | Free Tier | Monthly Usage | Cost |
|---------|-----------|---------------|------|
| Amazon Bedrock (Nova) | Pay per token | ~50K tokens | ~$0.50 |
| AWS Lambda | 1M requests/month | ~10K requests | **$0** |
| API Gateway | 1M requests/month | ~10K requests | **$0** |
| Amazon S3 | 5GB storage | ~500MB | **$0** |
| Amazon Comprehend | 50K units/month | ~5K units | **$0** |
| Amazon DynamoDB | 25GB free | ~1MB | **$0** |
| CloudWatch | 5GB logs | ~100MB | **$0** |

**Estimated Monthly Cost: < $1** (within free tier for hackathon)

---

## 🔒 Security

- ✅ IAM least-privilege policies per Lambda function
- ✅ API Gateway CORS configuration
- ✅ Environment variable protection (never in code)
- ✅ S3 bucket policies for public read-only on thumbnails
- ✅ CloudWatch logging for complete audit trails
- ✅ AWS WAF rate limiting on API Gateway

---

## 🎓 AWS Skills Demonstrated

- ✅ Amazon Bedrock multi-model integration (Nova Pro, Nova Lite, Nova Canvas)
- ✅ AWS Lambda serverless architecture (8 functions)
- ✅ API Gateway REST API design with CORS
- ✅ S3 bucket configuration, policies and CDN delivery
- ✅ Amazon Comprehend NLP integration
- ✅ DynamoDB table design and PutItem operations
- ✅ IAM role and least-privilege policy management
- ✅ CloudWatch monitoring and logging

---

## 👥 Contributors

| Name | Role | Contributions |
|------|------|---------------|
| **M Kishore** | Full Stack + AWS | Amazon Bedrock integration, Lambda functions, API Gateway, S3, Comprehend, DynamoDB |
| **CH V Sneha** | Full Stack + UI | React frontend, UI/UX design, component architecture, Firebase integration |

---

## 🚀 Future Enhancements

- [ ] Amazon Rekognition for advanced image copyright detection
- [ ] AWS Cognito for enterprise authentication
- [ ] Amazon SageMaker for custom ML monetization models
- [ ] Multi-language support with Amazon Translate
- [ ] Mobile app with AWS Amplify
- [ ] Real-time collaboration with AWS AppSync

---

## 📝 License

This project is licensed under the MIT License.

---

> **Built for AWS AI for Bharat Hackathon**
> Empowering Indian Content Creators with AWS Cloud AI 🇮🇳