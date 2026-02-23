# footballStAItsBoard

Football matches dashboard — browse today's matches grouped by competition and drill into match details including squad lineups and AI-generated predictions.

## Tech Stack

- **Backend:** Express.js 5 + MongoDB (Mongoose) + TypeScript
- **Frontend:** React 19 + React Router 7 + Redux Toolkit + Material UI 7 + TypeScript
- **External data:** [football-data.org](https://www.football-data.org/) v4 API
- **Infrastructure:** Docker Compose (MongoDB)

## Project Structure

```
footballStAItsBoard/
├── docker-compose.yml        # MongoDB service
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server entry point
│   │   ├── config/           # Environment configuration
│   │   ├── models/
│   │   │   └── cache.ts      # Mongoose Cache model
│   │   ├── routes/
│   │   │   └── matches.ts    # GET /api/matches, GET /api/matches/:matchId
│   │   ├── services/
│   │   │   ├── cacheService.ts       # MongoDB-backed 1-hour TTL cache
│   │   │   └── footballApiService.ts # football-data.org v4 client
│   │   └── types/
│   │       └── matches.ts    # Shared TypeScript types
│   ├── .env                  # Environment variables (gitignored)
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Root component with routing
│   │   ├── index.tsx         # Entry point
│   │   ├── theme.ts          # MUI theme configuration
│   │   ├── setupProxy.js     # CRA dev proxy → backend
│   │   ├── api/              # API client helpers
│   │   ├── components/
│   │   │   ├── MatchCard.tsx     # Single match summary card
│   │   │   ├── MatchesList.tsx   # Matches grouped by competition
│   │   │   └── MatchDetail.tsx   # Full match detail with squads & predictions
│   │   ├── store/
│   │   │   ├── index.ts          # Redux store setup
│   │   │   ├── hooks.ts          # Typed useAppDispatch / useAppSelector
│   │   │   ├── matchesSlice.ts   # Matches list state
│   │   │   └── matchDetailSlice.ts # Single match detail state
│   │   └── types/
│   │       └── matches.ts    # Shared TypeScript types
│   ├── public/
│   └── package.json
└── README.md
```

## Features

- **Matches list** — today's matches fetched from football-data.org, grouped by competition with competition emblem and country flag.
- **Match detail** — date/time, home & away team crests, squad lineups sorted by position (GK → DEF → MID → FWD), date of birth, and AI-generated match predictions.
- **MongoDB cache** — API responses are cached for 1 hour to avoid hitting external API rate limits. The app degrades gracefully when MongoDB is unavailable.
- **Health check** — `GET /api/health` returns server status.

## API Endpoints

| Method | Path                        | Description                  |
| ------ | --------------------------- | ---------------------------- |
| GET    | `/api/health`               | Server health check          |
| GET    | `/api/matches`              | List of today's matches      |
| GET    | `/api/matches/:matchId`     | Full details for one match   |

## Getting Started

### Prerequisites

- Node.js v22.11.0+
- npm 10.9.0+
- Docker & Docker Compose (for MongoDB) **or** a local MongoDB 8.0 instance

### Start MongoDB with Docker

```bash
docker compose up -d
```

### Backend

```bash
cd backend
cp .env.example .env    # Fill in your EXTERNAL_API_TOKEN
npm install
npm run dev             # Starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm start               # Starts on http://localhost:3000
```

The frontend dev server proxies `/api/*` requests to `http://localhost:3001` automatically.

## Environment Variables

Configure in `backend/.env`:

| Variable             | Description                          | Default                                          |
| -------------------- | ------------------------------------ | ------------------------------------------------ |
| `PORT`               | Backend server port                  | `3001`                                           |
| `MONGODB_URI`        | MongoDB connection string            | `mongodb://localhost:27017/footballstaitsboard`  |
| `EXTERNAL_API_TOKEN` | football-data.org API token          | —                                                |

