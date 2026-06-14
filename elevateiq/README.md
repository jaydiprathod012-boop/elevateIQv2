# ElevateIQ 🚀
### Build Smarter. Grow Faster.

> AI-powered career growth platform that transforms your resume into a personalized, employability-focused project portfolio.

---

## ✨ Features

- **Resume Upload & Parsing** — PDF & DOCX support
- **AI Skill Gap Analysis** — Powered by Gemini 2.0 Flash
- **Personalized Project Generator** — 6 projects per analysis (Beginner → Advanced)
- **Career Roadmap** — Phase-by-phase learning plan
- **Project Tracker** — Track SAVED / IN_PROGRESS / COMPLETED
- **Resume Improvement Suggestions** — AI-generated feedback
- **Dashboard** — Unified view of your progress

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Neon) + Prisma ORM |
| AI | Google Gemini 2.0 Flash & 1.5 Pro |
| Auth | JWT + Bcrypt |
| File Processing | Multer, PDF-Parse, Mammoth |

---

## 📁 Project Structure

```
elevateiq/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # Route pages
│   │   ├── components/# UI & layout components
│   │   ├── hooks/     # React Query hooks
│   │   ├── store/     # Auth context
│   │   ├── lib/       # Axios, utils
│   │   └── types/     # TypeScript types
└── backend/           # Express API
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── services/  # Gemini AI, Resume Parser
    │   ├── middleware/
    │   └── config/
    └── prisma/        # DB schema
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- [Gemini API Key](https://aistudio.google.com/app/apikey)

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://..."   # Your Neon/PostgreSQL connection string
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
FRONTEND_URL="http://localhost:5173"
```

---

### 3. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

---

### 4. Run Development

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click **Create API Key**
4. Copy and paste into `backend/.env`

---

## 🗄 Database Setup (Neon — Free)

1. Go to [neon.tech](https://neon.tech)
2. Create a free project
3. Copy the connection string
4. Paste into `DATABASE_URL` in `backend/.env`

---

## 🚢 Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [Neon](https://neon.tech) |

### Deploy Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to GitHub → connect to Vercel
```

### Deploy Backend (Render)
- Create a Web Service on Render
- Set environment variables
- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm start`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/resumes/upload` | Upload resume |
| GET | `/api/resumes` | List resumes |
| POST | `/api/analysis/analyze` | Run AI analysis |
| GET | `/api/analysis` | List analyses |
| POST | `/api/projects/save` | Save a project |
| GET | `/api/projects/saved` | List saved projects |
| PATCH | `/api/projects/:id/status` | Update project status |
| GET | `/api/dashboard` | Dashboard data |

---

## 🎨 Brand

- **Primary**: Deep Indigo `#4F46E5`
- **Accent**: Emerald `#10B981`
- **Font**: Plus Jakarta Sans

---

## 📄 License

MIT © 2025 ElevateIQ
