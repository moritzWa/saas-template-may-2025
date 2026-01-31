# PROJECT_NAME

A modern SaaS template with authentication, payments, and a beautiful UI.

## Tech Stack

- **Frontend:** Next.js 15 (Pages Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Deno + tRPC
- **Database:** MongoDB
- **Auth:** Google OAuth
- **Payments:** Stripe
- **Package Manager:** Bun

## Project Structure

```
.
├── client/          # Next.js frontend
│   ├── src/
│   │   ├── pages/   # Next.js pages
│   │   ├── components/
│   │   └── lib/
│   └── package.json
├── server/          # Deno backend
│   ├── src/
│   │   ├── routers/ # tRPC routers
│   │   ├── models/  # Mongoose models
│   │   └── index.ts
│   └── deno.json
└── shared/          # Shared types
    └── types.ts
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (for package management and client)
- [Deno](https://deno.land/) (for server)
- MongoDB
- Stripe account
- Google OAuth credentials

### Environment Variables

Create `.env` files in both `client/` and `server/` directories. Required variables:

**Server (`server/.env`):**
- `MONGODB_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `JWT_SECRET` - Secret for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `CLIENT_URL` - Frontend URL (e.g., `http://localhost:3000`)

**Client (`client/.env.local`):**
- `NEXT_PUBLIC_API_URL` - Backend URL (e.g., `http://localhost:8000`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

### Installation

```bash
# Install all dependencies
bun install

# Start both servers (recommended)
bun run dev

# Or start separately:
bun run dev:client  # Next.js on :3000
bun run dev:server  # Deno on :8000
```

### Stripe Webhooks (Development)

```bash
stripe listen --forward-to localhost:8000/webhook/stripe
```

## Customization

Search for `PROJECT_NAME` in the codebase to find all instances to replace with your brand name.

## Deployment

- **Frontend:** Deploy to Vercel (recommended for Next.js)
- **Backend:** Deploy to Deno Deploy

## License

MIT
