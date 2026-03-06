# Quiz System

A modern, full-featured quiz management platform built with Next.js 16, PostgreSQL, and Tailwind CSS. This application provides a comprehensive solution for creating, managing, and taking quizzes with real-time leaderboard tracking and detailed analytics.

## Features

### User Features
- **Authentication** - Secure JWT-based login and registration
- **Quiz Taking** - Interactive quiz interface with instant feedback
- **Results Tracking** - View detailed results and performance history
- **Leaderboard** - Compete with other users and track rankings
- **Dashboard** - Personal progress overview and statistics

### Admin Features
- **Dashboard Analytics** - System-wide metrics and recent activity overview
- **Quiz Management** - Create, edit, and delete quizzes
- **User Management** - Monitor user activity and performance
- **Results Overview** - Track all quiz submissions and scores

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Database** | PostgreSQL |
| **Authentication** | JWT (jose) + bcryptjs |
| **Icons** | Lucide React |
| **Theme** | next-themes (Dark/Light mode) |

## Prerequisites

- Node.js 20+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Quiz_system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database URL (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/quiz_db

# JWT Secret for authentication (generate with: openssl rand -base64 32)
JWT_SECRET=your_secure_jwt_secret_here

# Next.js App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up the Database

Run the database setup script to initialize tables:

```bash
npx tsx setup-db.ts
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
Quiz_system/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Authentication pages (login, register)
│   │   ├── admin/        # Admin dashboard and management
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # User dashboard
│   │   ├── leaderboard/  # Leaderboard page
│   │   ├── quiz/         # Quiz taking interface
│   │   └── results/      # Results view
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility libraries
│   │   ├── db/           # Database configuration
│   │   ├── auth.ts       # Authentication utilities
│   │   └── db.ts         # Database client
│   └── middleware.ts     # Auth middleware
├── public/               # Static assets
├── setup-db.ts           # Database initialization script
└── check_users.ts        # User verification utility
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **quizzes** - Quiz definitions and questions
- **results** - Quiz submission records
- **leaderboard** - User rankings and scores

## Authentication

The system uses JWT-based authentication with HTTP-only cookies:

1. Users register with email/password
2. Passwords are hashed using bcryptjs
3. JWT tokens are signed with jose library
4. Middleware protects authenticated routes

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on the repository.
