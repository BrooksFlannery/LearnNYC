# NYC Chatbot – Architecture Primer

This document walks through the **frontend → backend → database → backend → frontend** cycle for every game action so new contributors can orient themselves quickly.

---

## 1. Tech stack

| Layer            | Technology                                   |
|------------------|----------------------------------------------|
| UI               | Next.js / React 18                           |
| Data-fetching    | tRPC + React Query                           |
| State / Logic    | Pure TypeScript functions (`engine.ts`)      |
| Persistence      | Drizzle ORM → Postgres (Neon)                |
| Auth             | better-auth                                  |

---

## 2. Source-code map

```
└─ src/
   ├─ hooks/useGameState.ts       ← React hook (client)
   ├─ utils/trpc.ts               ← typed tRPC client (client)
   ├─ app/api/trpc/[trpc]/route.ts← HTTP → tRPC adapter (server)
   ├─ server/routers/             ← request routers (server)
   │   └─ gameRouter.ts
   ├─ server/services/            ← application services (server)
   │   └─ gameService.ts
   ├─ server/repositories/        ← DB repositories + cache (server)
   │   └─ gameRepo.ts
   ├─ domain/game/engine.ts       ← pure game logic (no IO)
   ├─ db/schema.ts                ← Drizzle table definitions
   └─ db/drizzle.ts               ← DB connection helper
```

---

## 3. End-to-end flow

1. **React** mounts a component that calls the custom hook `useGameState()`.
2. The hook executes
   ```ts
   const { data } = trpc.game.getState.useQuery(undefined);
   ```
   which sends a request to **`/api/trpc/game.getState`**.
3. **Next.js** catches the request in `app/api/trpc/[trpc]/route.ts` and hands it to `appRouter`.
4. `appRouter` delegates to **`gameRouter.getState`** (a tRPC procedure).
5. The procedure calls **`gameService.getState(ctx.userId)`**.
6. `gameService` performs "load-or-create":
   1. Ask **`gameRepo.fetchByUserId(key)`** for the current row.
   2. `gameRepo` looks in its in-memory `Map` cache → if miss → runs `SELECT … WHERE user_id = $1`.
   3. Row found → parse JSON → return it.
   4. Row missing → call **`engine.createNewGame()`** → **`gameRepo.save()`** (JSON.stringify + `INSERT`) → return the fresh state.
7. The **`GameState`** object bubbles back up the stack to the React hook, which updates the React-Query cache → components re-render.

Mutations (`makeMove`, `boardTrain`, `exitTrain`, `advanceTurn`) follow the same path but with extra steps inside `gameService`:

```
load state → engine.<action>() → engine.tickTrains() → repo.save() → return
```

---

## 4. Caching behaviour

* A **single row per user** (or the shared key `"anonymous"`) is stored in Postgres.
* `gameRepo` keeps a per-process `Map` cache for hot reads/writes.
* On cold starts or cross-region traffic the cache is empty; the repo automatically falls back to the database and repopulates.

---

## 5. Database lifecycle

* Tables are defined in `db/schema.ts`.
* To apply changes in dev run:

```bash
npm run db:push   # quick diff-and-apply
# OR
npm run db:migrate # run hand-written SQL files in /migrations
```

---

## 6. Where to add features

| I want to…                                | Edit here                                         |
|-------------------------------------------|---------------------------------------------------|
| change game rules                         | `domain/game/engine.ts`                           |
| add a new field to saved state            | `lib/definitions/types.ts` **and** `db/schema.ts` |
| expose a new API endpoint                 | `server/routers/` + `services/`                   |
| integrate another client (CLI, mobile…)   | call `gameService` directly or add another router |
| plug in real authentication               | `middleware.ts` + `app/api/trpc/[trpc]/route.ts`  |

