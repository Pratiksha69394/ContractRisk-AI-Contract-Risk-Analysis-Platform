# Contract Risk Platform

<div align="center">

**AI-Powered Contract Risk Analysis & Management**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21.0-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)](https://openai.com/)

</div>

---

## Overview

Contract Risk Platform is a comprehensive solution for analyzing, managing, and mitigating risks in business or any other contracts. Leveraging advanced AI capabilities, the platform automatically identifies potential risks, provides detailed risk scores, and offers actionable insights to help organizations make informed decisions about their contractual agreements.

### Key Capabilities

- 🤖 **AI-Powered Analysis** - Automated risk assessment using cutting-edge AI technology
- 📊 **Risk Scoring** - Quantified risk levels with visual indicators and detailed breakdowns
- 📁 **Contract Management** - Full lifecycle management from upload to archival
- ✅ **Compliance Tracking** - Ensure contracts meet regulatory and organizational standards
- 📤 **Export Options** - Export reports in CSV or JSON formats for further analysis

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19.2 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Radix UI | Accessible Components |
| React Router | Client-side Routing |
| React Hook Form | Form Management |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | API Server |
| MongoDB | Database |
| JWT | Authentication |
| OpenAI API | AI Analysis |

---

## Project Structure

```
contract-risk-platform/
├── backend/                  # Backend API Server
│   ├── src/
│   │   ├── index.js         # Server entry point
│   │   ├── middleware/      # Auth & middleware
│   │   └── models/          # Mongoose models
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities
│   ├── package.json
│   └── vite.config.ts
├── .env                     # Frontend environment
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contract-risk-platform
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**

   Create `backend/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/contract-risk-platform
   OPENAI_API_KEY=sk-your-openai-api-key
   JWT_SECRET=your-jwt-secret
   CORS_ORIGIN=http://localhost:3000
   ```

   Create `.env` (frontend):
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_APP_NAME=Contract Risk Platform
   VITE_APP_VERSION=1.0.0
   ```

### Running the Application

**Development (both frontend & backend)**
```bash
npm run dev:all
```

**Individual Services**

Backend (port 3001):
```bash
npm run server:dev
```

Frontend (port 3000):
```bash
npm run dev
```

---

## API Reference

### Health Check
- `GET /api/health` - Server status

### Contracts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contracts` | List all contracts |
| GET | `/api/contracts/:id` | Get contract details |
| POST | `/api/contracts` | Upload new contract |
| PATCH | `/api/contracts/:id` | Update contract |
| DELETE | `/api/contracts/:id` | Remove contract |

### Analysis
- `POST /api/analyze` - AI risk analysis

---

## Features

| Feature | Description |
|---------|-------------|
| 📄 **Contract Upload** | Upload PDF documents for analysis |
| 🔍 **Smart Search** | Filter contracts by various criteria |
| 📉 **Risk Gauges** | Visual risk level indicators |
| 🎨 **Theme Support** | Light and dark modes |
| 🔐 **Authentication** | Secure user access |
| 📊 **Analytics** | Dashboard with insights |
| 🔔 **Notifications** | Stay updated on changes |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | Ensure backend is running: `npm run server:dev` |
| CORS errors | Verify `CORS_ORIGIN` matches frontend URL |
| Port in use | Change `PORT` in `backend/.env` or frontend config |

---

## License

MIT License - feel free to use this project for learning or commercial purposes.

---

<div align="center">

**Built with ❤️ for smarter contract management**

</div>

