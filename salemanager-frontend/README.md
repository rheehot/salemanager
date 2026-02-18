# SaleManager Frontend

> React + TypeScript + Vite + Tailwind CSS

## Overview

SaleManager의 프론트엔드 애플리케이션입니다. 영업 관리 시스템의 UI/UX를 담당합니다.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Testing**: Vitest, React Testing Library

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── features/       # Feature-specific components
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Customers.tsx
│   ├── Leads.tsx
│   ├── Pipeline.tsx
│   └── Activities.tsx
├── services/           # API client
│   └── api.ts
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── App.tsx
```

## Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
```

## API Integration

Backend API와 통신하기 위한 엔드포인트:

- `GET /api/customers` - 고객 목록 조회
- `POST /api/customers` - 고객 생성
- `PUT /api/customers/:id` - 고객 수정
- `DELETE /api/customers/:id` - 고객 삭제
- `GET /api/leads` - 리드 목록 조회
- `GET /api/opportunities` - 영업 기회 목록
- `GET /api/activities` - 활동 로그 조회

## Development Guidelines

### Component Naming

- Use PascalCase for components: `CustomerList.tsx`
- Use camelCase for utilities: `formatDate.ts`

### File Organization

- Co-locate related files (component + styles + tests)
- Keep components under 300 lines
- Extract reusable logic to custom hooks

### Styling

- Use Tailwind utility classes
- Avoid inline styles
- Create reusable UI components in `components/ui/`

## Key Features to Implement

1. **Dashboard**: 영업 현황 요약, KPI 카드
2. **Customers**: 고객 목록, 검색, 필터, CRUD
3. **Leads**: 리드 관리, 상태 추적
4. **Pipeline**: 칸반 보드, 드래그앤드롭
5. **Activities**: 활동 로그 타임라인

## Team

- Frontend Lead: [Name]
- Developers: [Names]

---

## Next Steps

1. Design phase complete → Start implementation
2. Set up Vite + React + TypeScript
3. Configure Tailwind CSS
4. Create base UI components
5. Implement API client
6. Build pages one by one
