# SaleManager Backend

> Express + TypeScript + SQLite + Prisma

## Overview

SaleManager의 백엔드 API 서버입니다. RESTful API를 제공하고 데이터를 관리합니다.

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: (v1.0 미구현 - 단일 사용자)

## Project Structure

```
src/
├── routes/             # API route definitions
│   ├── customers.ts
│   ├── leads.ts
│   ├── opportunities.ts
│   └── activities.ts
├── controllers/        # Request handlers
├── models/            # Data models (Prisma)
├── services/          # Business logic
├── middleware/        # Express middleware
│   ├── errorHandler.ts
│   └── validation.ts
├── utils/             # Utility functions
└── index.ts           # App entry point
```

## Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Development server
npm run dev

# Run tests
npm run test
```

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
```

## Database Schema

```prisma
model Customer {
  id          String   @id @default(cuid())
  name        String
  company     String?
  email       String   @unique
  phone       String?
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  activities  Activity[]
}

model Lead {
  id          String   @id @default(cuid())
  name        String
  company     String?
  email       String
  phone       String?
  status      String   @default("new")
  source      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Opportunity {
  id          String   @id @default(cuid())
  title       String
  customerId  String
  stage       String   @default("prospecting")
  probability Int      @default(0)
  value       Float?
  expectedCloseDate DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Activity {
  id          String   @id @default(cuid())
  type        String   // email, call, meeting
  subject     String
  description String?
  customerId  String
  createdAt   DateTime @default(now())
}
```

## API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Leads

- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Opportunities (Pipeline)

- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/:id` - Get opportunity by ID
- `POST /api/opportunities` - Create opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity

### Activities

- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Log activity
- `GET /api/activities/customer/:customerId` - Get customer activities

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

## Error Handling

统一 에러 응답 형식:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  }
}
```

## Development Guidelines

### API Design

- Use RESTful conventions
- Return consistent response format
- Use appropriate HTTP status codes
- Validate input with Zod schemas

### Database

- Use Prisma migrations for schema changes
- Never manually modify database
- Use transactions for multi-step operations

### Code Organization

- Keep routes thin (delegate to controllers)
- Business logic in services
- Reusable utilities in utils/

## Team

- Backend Lead: [Name]
- Developers: [Names]

---

## Next Steps

1. Design phase complete → Start implementation
2. Set up Express + TypeScript
3. Configure Prisma + SQLite
4. Create database schema
5. Implement API endpoints
6. Add validation middleware
