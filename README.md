# schats

## Telegram grammY bot & SvelteKit webapp

Try it out: https://t.me/SecureChatsBot

# Under the hood:

* Supabase as PostgreSQL database and serverless Edge Functions host
* Telegram bot framework - grammY
* SvelteKit as frontend framework

# Telegram WebApp build:

yarn

yarn build

# Supabase CLI setup:

Guide: https://supabase.com/docs/guides/cli

# Supabase project setup (Replacing `<...>` with respective values):

supabase login

supabase link --project-ref <SUPABASE_PROJECT_ID>

supabase secrets set --env-file ./.env

supabase secrets list

supabase secrets unset SUPABASE_DB_URL

supabase start

supabase gen types typescript --local > ./src/DatabaseDefinitions.ts

## open link:

https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<SUPABASE_PROJECT_ID>.functions.supabase.co/<FUNCTIONS_BOT>?secret=<SUPABASE_PROJECT_ID>

# Local check (need Deno installed):

deno run --allow-net --allow-read --allow-env --watch ./supabase/functions/<FUNCTIONS_BOT>/index.ts

# Features:

*
