Tic-Tac-Toe Nakama/
├── docker-compose.yml       # Orchestrates Nakama and CockroachDB
├── backend/                 # 🚀 Server-Side Logic (Nakama TS Module)
│   ├── src/
│   │   ├── main.ts          # Entry point (Registers RPCs & Match Handler)
│   │   └── match_handler.ts # Authoritative Logic (Game state, validation, loops)
│   ├── package.json
│   └── tsconfig.json
└── client/                # 🎮 Client-Side App (React, Vite, TS)
    ├── src/
    │   ├── components/      # UI pieces (Board, Square, Timer, Buttons)
    │   ├── screens/         # Main views (Auth, Lobby, Match, Leaderboard)
    │   ├── hooks/           # Custom hooks (e.g., useNakama)
    │   ├── lib/             # Nakama connection logic & API handlers
    │   ├── App.tsx
    │   └── tsconfig.app.json
    │   └── tsconfig.tsx
    │   └── tsconfig.node.tsx
    │   └── main.tsx
    ├── package.json
    └── tailwind.config.js   # (If we use Tailwind for styling)
