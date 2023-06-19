# [BlogHub](https://skateshop13.vercel.app/)

This is an open source blog app built with everything new in Next.js 13. It is built with the [T3 Turbo Stack](https://github.com/t3-oss/create-t3-turbo).

> **Warning**
> This project is still in development and is not ready for production use.
>
> It uses new technologies (server actions, drizzle ORM) which are subject to change and may break your application.

## Tech Stack

- [Next.js](https://nextjs.org)
- [Next Auth](https://next-auth.js.org/) -> soon changing to [Clerk Auth](https://clerk.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Stripe](https://stripe.com)

## Features

- Authentication with Next Auth, soon with Clerk
- Subscription, payment, and billing with Stripe
- Blog with posts
- Post editor built with TipTap

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/dichioniccolo/bloghub
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create a `.env` file or stick with Doppler

Personally I use doppler for all my environment variables,
but feel free to create a `.env` file in the root directory and add the environment variables there.

### 4. Run the application

```bash
pnpm run dev
```

### 5. Push database

```bash
pnpm run db:push
```

### 6. Listen for stripe events

```bash
pnpm run stripe:listen
```

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
