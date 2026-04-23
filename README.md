# SecureTracker - Security Incident Management System

A full-stack web application for tracking and managing information security incidents.

## Features

- User authentication with role-based access control (Admin, Analyst, Employee)
- Create, edit, delete, and track security incidents
- Incident classification by type and severity
- Assignment of responsible personnel
- Comments and activity history
- Dashboard with statistics and analytics
- Audit logging

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Containerization**: Docker & Docker Compose

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Shakhiizada/Practise2025sh.git
cd Practise2025sh

# Start with Docker Compose
docker-compose up -d

# Run database migrations and seed
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed

# Open http://localhost:3000
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL (or use Docker)
docker-compose up db -d

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Analyst | analyst@company.com | analyst123 |
| Employee | employee@company.com | employee123 |

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/securetracker"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed the database
npm run db:studio    # Open Prisma Studio
```

## Docker Commands

```bash
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose logs -f app    # View app logs
docker-compose --profile dev up studio  # Start with Prisma Studio
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── incidents/         # Incidents pages
│   ├── login/             # Login page
│   ├── reports/           # Reports page
│   └── team/              # Team page
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── prisma/                # Prisma schema and migrations
├── scripts/               # Database seed scripts
├── docker-compose.yml     # Docker configuration
└── Dockerfile             # Docker build file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/me | Get current user |
| GET | /api/incidents | List incidents |
| POST | /api/incidents | Create incident |
| GET | /api/incidents/:id | Get incident details |
| PUT | /api/incidents/:id | Update incident |
| DELETE | /api/incidents/:id | Delete incident |
| GET | /api/incidents/:id/comments | Get comments |
| POST | /api/incidents/:id/comments | Add comment |
| GET | /api/stats | Get dashboard statistics |
| GET | /api/users | List users |
