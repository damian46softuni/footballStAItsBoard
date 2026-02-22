# footballStAItsBoard

Football matches statistics and predictions application.

## Tech Stack

- **Backend:** Express.js + MongoDB + TypeScript
- **Frontend:** React + Redux Toolkit + Material UI + TypeScript

## Project Structure

```
footballStAItsBoard/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/   # Environment configuration
│   │   └── index.ts  # Server entry point
│   ├── .env          # Environment variables (gitignored)
│   ├── .env.example  # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React application
│   ├── src/
│   │   ├── store/    # Redux store & hooks
│   │   ├── theme.ts  # MUI theme configuration
│   │   ├── App.tsx   # Root component
│   │   └── index.tsx # Entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v22.11.0+
- npm 10.9.0+
- MongoDB (installed locally — can be set up later)

### Backend

```bash
cd backend
cp .env.example .env    # Configure your environment variables
npm install
npm run dev             # Starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm start               # Starts on http://localhost:3000
```

## Environment Variables

Configure in `backend/.env`:

| Variable             | Description                        | Default                                          |
| -------------------- | ---------------------------------- | ------------------------------------------------ |
| `PORT`               | Backend server port                | `3001`                                           |
| `MONGODB_URI`        | MongoDB connection string          | `mongodb://localhost:27017/footballstaitsboard`   |
| `EXTERNAL_API_TOKEN` | Token for external football API    | —                                                |

