# 🚀 Run Commands

## Quick Start (Both Frontend + Backend)

```bash
cd /Users/mac/Desktop/creator-copilot
npm run dev
```

## Separate Commands

### Backend Server (Port 3001)
```bash
cd /Users/mac/Desktop/creator-copilot
npm run server
```

### Frontend (Port 8083)
```bash
cd /Users/mac/Desktop/creator-copilot
npm run client
```

## Troubleshooting

### Kill Backend Server (if port 3001 is in use)
```bash
lsof -ti:3001 | xargs kill -9
```

### Kill Frontend Server (if port is in use)
```bash
lsof -ti:8083 | xargs kill -9
```

## Access URLs

- **Frontend**: http://localhost:8083/
- **Backend API**: http://localhost:3001/
- **Network**: http://172.20.10.2:8083/

## Build Commands

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
npm run preview
```
