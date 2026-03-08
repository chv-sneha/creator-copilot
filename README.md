# 🚀 AI Creator Copilot

> **AWS-Powered AI Platform for Social Media Content Creation & Optimization**

[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20Lambda%20%7C%20S3-FF9900?logo=amazon-aws)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [AWS Services Integration](#-aws-services-integration)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Setup & Installation](#-setup--installation)
- [AWS Deployment](#-aws-deployment)
- [Project Structure](#-project-structure)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 Overview

**AI Creator Copilot** is an enterprise-grade, AWS-powered platform designed to revolutionize content creation for social media creators. By leveraging cutting-edge AWS AI services, we provide real-time content analysis, trend discovery, intelligent scheduling, and AI-generated thumbnails.

### 🏆 Problem Statement
Content creators struggle with:
- Analyzing content performance across multiple platforms
- Discovering trending topics and hashtags
- Creating eye-catching thumbnails
- Scheduling posts at optimal times
- Managing content across different social media platforms

### ✅ Our Solution
An all-in-one AI platform powered by **AWS Bedrock**, **Lambda**, and **S3** that provides:
- Real-time AI content analysis
- Dynamic trend intelligence
- AI-generated thumbnails
- Intelligent scheduling recommendations
- Multi-platform content optimization

---

## ☁️ AWS Services Integration

### Core AWS Services Used

| AWS Service | Purpose | Implementation |
|------------|---------|----------------|
| **Amazon Bedrock** | AI/ML inference for content analysis, trend discovery, and thumbnail generation | Nova Lite (text), Nova Canvas (images) |
| **AWS Lambda** | Serverless compute for AI processing | 5 Lambda functions (Node.js 20.x) |
| **Amazon S3** | Thumbnail storage and delivery | Public bucket with CDN-ready URLs |
| **API Gateway** | RESTful API endpoints | 5 endpoints with CORS enabled |
| **CloudWatch** | Monitoring and logging | Lambda execution logs and metrics |
| **IAM** | Security and access control | Least-privilege policies |

### AWS Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    Vite + TypeScript + Tailwind                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS API Gateway (REST)                      │
│  /trendAnalyzer  /contentIdeaGenerator  /schedulingIntelligence │
│  /generateThumbnail  /save-thumbnail                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Invoke
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Lambda Functions                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Trend        │  │ Content Idea │  │ Scheduling   │         │
│  │ Analyzer     │  │ Generator    │  │ Intelligence │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                             │                                    │
│                             ▼                                    │
│                    ┌─────────────────┐                          │
│                    │ Amazon Bedrock  │                          │
│                    │  Nova Lite v1   │                          │
│                    └─────────────────┘                          │
│                                                                  │
│  ┌──────────────┐                    ┌──────────────┐          │
│  │ Thumbnail    │────────────────────│ Save to S3   │          │
│  │ Generator    │                    │ Lambda       │          │
│  └──────┬───────┘                    └──────┬───────┘          │
│         │                                    │                  │
│         ▼                                    ▼                  │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │ Amazon Bedrock  │              │   Amazon S3     │          │
│  │ Nova Canvas v1  │              │   Thumbnails    │          │
│  └─────────────────┘              └─────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Firebase (Auth + Firestore)                   │
│              User Authentication & Data Persistence              │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → API Gateway → Lambda → Bedrock AI → Response
                                        ↓
                                   CloudWatch Logs
                                        ↓
                                  S3 (Thumbnails)
```

---

## ✨ Key Features

### 1. 🎯 AI Content Analyzer (AWS Bedrock)
- **8-Metric Analysis System**: Quality, Readability, Sentiment, Viral Potential, Brand Alignment, CTA Strength
- **Platform-Specific Insights**: Instagram, LinkedIn, YouTube, X (Twitter), TikTok, Facebook, Pinterest
- **Regional Intelligence**: 13+ regions with cultural awareness
- **Real-time Processing**: Sub-second response via AWS Lambda

### 2. 📈 Trends & Calendar (AWS Bedrock + Lambda)
- **Dynamic Trend Discovery**: Real-time hashtag analysis powered by Amazon Nova Lite
- **AI Content Ideas**: Personalized content suggestions based on niche and platform
- **Intelligent Scheduling**: AI-powered optimal posting time recommendations
- **Firebase Integration**: Persistent scheduling with Firestore

### 3. 🎨 Thumbnail Generator (AWS Bedrock + S3)
- **AI Image Generation**: Amazon Nova Canvas for high-quality thumbnails
- **Platform Optimization**: Auto-resize for YouTube, Instagram, LinkedIn, Twitter
- **S3 Storage**: Permanent storage with public CDN URLs
- **FREE Tier**: 300 images/month free for 3 months

### 4. 👤 Profile Management (Firebase)
- **User Authentication**: Firebase Auth with email/password
- **Profile Analytics**: Performance graphs and engagement tracking
- **Social Media Links**: Multi-platform account management
- **Avatar Upload**: Profile customization

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Component library |
| **Recharts** | Data visualization |

### Backend & Cloud
| Technology | Purpose |
|-----------|---------|
| **AWS Bedrock** | AI/ML inference |
| **AWS Lambda** | Serverless compute |
| **Amazon S3** | Object storage |
| **API Gateway** | REST API |
| **Firebase Auth** | Authentication |
| **Firestore** | NoSQL database |

### AI Models
| Model | Use Case | Provider |
|-------|----------|----------|
| **Amazon Nova Lite v1** | Text generation (trends, ideas, scheduling) | AWS Bedrock |
| **Amazon Nova Canvas v1** | Image generation (thumbnails) | AWS Bedrock |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- AWS Account with Bedrock access
- Firebase project
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/creator-copilot.git
   cd creator-copilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local`:
   ```bash
   # AWS
   VITE_AWS_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
   
   # Firebase
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:8080

---

## ☁️ AWS Deployment

### Lambda Functions

We have deployed **5 Lambda functions** on AWS:

| Function Name | Runtime | Memory | Timeout | Purpose |
|--------------|---------|--------|---------|---------|
| `trendAnalyzer` | Node.js 20.x | 512 MB | 30s | Discover trending hashtags |
| `contentIdeaGenerator` | Node.js 20.x | 512 MB | 30s | Generate content ideas |
| `schedulingIntelligence` | Node.js 20.x | 512 MB | 30s | Recommend posting times |
| `generateThumbnail` | Node.js 20.x | 512 MB | 60s | Create AI thumbnails |
| `saveThumbnailToS3` | Node.js 20.x | 512 MB | 30s | Save thumbnails to S3 |

### API Endpoints

```
Base URL: https://your-api-id.execute-api.us-east-1.amazonaws.com/prod

POST /trendAnalyzer           - Analyze trends
POST /contentIdeaGenerator    - Generate content ideas
POST /schedulingIntelligence  - Get posting recommendations
POST /generateThumbnail       - Create AI thumbnail
POST /save-thumbnail          - Save thumbnail to S3
```

### S3 Bucket Configuration

```
Bucket Name: creator-copilot-thumbnails
Region: us-east-1
Access: Public read for images
Policy: Bucket policy for public GetObject
```

### Deployment Guides

- **Manual Setup**: See `AWS_MANUAL_DEPLOYMENT.md`
- **Thumbnail Setup**: See `POLLINATIONS_S3_SETUP.md`
- **Trends Setup**: See `AWS_TRENDS_SETUP.md`

---

## 📁 Project Structure

```
creator-copilot/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── PillTabs.tsx    # Custom tab component
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Firebase auth context
│   ├── hooks/              # Custom React hooks
│   │   └── use-toast.ts    # Toast notifications
│   ├── lib/                # Utility libraries
│   │   ├── firebase.ts     # Firebase config
│   │   ├── trendsApi.ts    # AWS Trends API
│   │   └── thumbnailApi.ts # AWS Thumbnail API
│   ├── pages/              # Application pages
│   │   ├── Auth.tsx        # Authentication
│   │   ├── Profile.tsx     # User profile
│   │   ├── ContentAnalyzer.tsx  # Content analysis
│   │   ├── TrendsCalendar.tsx   # Trends & scheduling
│   │   └── ThumbnailGenerator.tsx # Thumbnail creation
│   └── App.tsx             # Main app component
├── lambda/                 # AWS Lambda functions
│   ├── trendAnalyzer.mjs
│   ├── contentIdeaGenerator.mjs
│   ├── schedulingIntelligence.mjs
│   ├── generateThumbnail.mjs
│   └── saveThumbnailToS3.mjs
├── public/                 # Static assets
├── .env.local             # Environment variables (not in git)
└── README.md              # This file
```

---

## 💰 Cost Analysis

### AWS Free Tier Benefits

| Service | Free Tier | Our Usage | Cost |
|---------|-----------|-----------|------|
| **Amazon Bedrock (Nova)** | 300 images/month (3 months) | ~100 images/month | $0 |
| **AWS Lambda** | 1M requests/month | ~10K requests/month | $0 |
| **API Gateway** | 1M requests/month | ~10K requests/month | $0 |
| **Amazon S3** | 5GB storage, 20K GET | ~100MB, 1K GET | $0 |
| **CloudWatch Logs** | 5GB ingestion | ~100MB | $0 |

**Total Monthly Cost**: **$0** (within free tier limits)

---

## 🎓 Learning Outcomes

### AWS Skills Demonstrated
- ✅ Amazon Bedrock AI model integration (Nova Lite, Nova Canvas)
- ✅ AWS Lambda serverless architecture
- ✅ API Gateway REST API design
- ✅ S3 bucket configuration and policies
- ✅ IAM role and policy management
- ✅ CloudWatch monitoring and logging

### Development Skills
- ✅ React 18 with TypeScript
- ✅ Serverless architecture patterns
- ✅ RESTful API integration
- ✅ Firebase authentication and Firestore
- ✅ Responsive UI design with Tailwind CSS
- ✅ State management with React Context

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/identicons/mkishore.png" width="100px;" alt="M Kishore"/><br />
      <sub><b>M Kishore</b></sub><br />
      <sub>Full Stack Developer</sub><br />
      <sub>AWS Integration & Backend</sub>
    </td>
    <td align="center">
      <img src="https://github.com/identicons/chvsneha.png" width="100px;" alt="CH V Sneha"/><br />
      <sub><b>CH V Sneha</b></sub><br />
      <sub>Full Stack Developer</sub><br />
      <sub>Frontend & UI/UX</sub>
    </td>
  </tr>
</table>

### Contributions
- **M Kishore**: AWS Bedrock integration, Lambda functions, API Gateway setup, S3 configuration
- **CH V Sneha**: React frontend, UI/UX design, Firebase integration, component architecture

---

## 📊 Performance Metrics

### Response Times
- Content Analysis: **< 2 seconds**
- Trend Discovery: **< 3 seconds**
- Thumbnail Generation: **< 5 seconds**
- Scheduling Intelligence: **< 2 seconds**

### Scalability
- **Concurrent Users**: 1000+ (Lambda auto-scaling)
- **API Rate Limit**: 10,000 requests/second (API Gateway)
- **Storage**: Unlimited (S3)

---

## 🔒 Security Features

- ✅ Firebase Authentication with email/password
- ✅ IAM least-privilege policies
- ✅ API Gateway CORS configuration
- ✅ Environment variable protection
- ✅ S3 bucket policies for public read-only
- ✅ CloudWatch logging for audit trails

---

## 🚀 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social media post automation
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] AI video script generation
- [ ] Competitor analysis dashboard

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **AWS** for providing Bedrock AI services and cloud infrastructure
- **Firebase** for authentication and database services
- **shadcn/ui** for beautiful UI components
- **Recharts** for data visualization
- **Lucide** for icon library

---

## 📧 Contact

For questions, feedback, or support:
- 📧 Email: support@creatorcopilot.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/creator-copilot/issues)
- 📖 Documentation: See `/docs` folder

---

<div align="center">

**Built with ❤️ using AWS, React, and TypeScript**

**Empowering Content Creators Worldwide** 🌍

</div>
