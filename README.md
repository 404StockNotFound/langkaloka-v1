# LangkaLoka

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

- Node.js 18+
- PostgreSQL installed and running

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/404StockNotFound/langkaloka-v1.git
cd langkaloka-v1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```ini
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/langkaloka_db
JWT_SECRET=your_super_secret_key
```

### 4. Setup PostgreSQL database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE langkaloka_db;
ALTER USER postgres WITH PASSWORD 'yourpassword';
\q
```

### 5. Run Drizzle migrations

```bash
npm run db:generate
npm run db:push
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Database Commands

```bash
npm run db:generate   # Generate migration files from schema
npm run db:push       # Push schema directly (dev only)
npm run db:studio     # Open Drizzle Studio GUI
```

---

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── register/
│   │           └── route.ts   # Register API
│   ├── layout.tsx
│   └── page.tsx
├── src/
│   └── db/
│       ├── index.ts           # DB connection
│       └── schema.ts          # Drizzle schema
├── .env.example
├── drizzle.config.ts
└── package.json
```

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) - learn about Drizzle ORM.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

> Make sure to add all environment variables (`DATABASE_URL`, `JWT_SECRET`) in your Vercel project settings before deploying.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
