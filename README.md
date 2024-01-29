# [BlogHub](https://app.bloghub.it/)

This is an open source blog app built with everything new in Next.js 13. It is built with the [T3 Turbo Stack](https://github.com/t3-oss/create-t3-turbo).

> **Warning**
> This project is still in development and is not ready for production use.

## Tech Stack

- [Next.js](https://nextjs.org)
- [Next Auth](https://next-auth.js.org/)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Stripe](https://stripe.com)

## Features

- Authentication with Next Auth
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
bun install
```

### 3. Create a `.env` file or stick with Doppler

Personally I use doppler for all my environment variables,
but feel free to create a `.env` file in the root directory and add the environment variables there.

### 4. Run the application

```bash
bun dev
```

### 5. Push database

```bash
bun db:push
```

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
