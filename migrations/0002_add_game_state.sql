create table if not exists "game_state" (
    id          uuid primary key default gen_random_uuid(),
    user_id     text not null,
    state       jsonb not null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    unique (user_id)
); 