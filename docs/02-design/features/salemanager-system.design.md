# SaleManager System Design Document

> **Summary**: 영업 관리 시스템 설계 - 고객/리드 관리, 영업 파이프라인, 활동 로그, 대시보드 기능 구현을 위한 상세 설계
>
> **Project**: SaleManager
> **Version**: 1.0.0
> **Author**: Design Team (Frontend + Backend + Test)
> **Date**: 2026-02-18
> **Status**: Draft
> **Planning Doc**: [salemanager-system.plan.md](../01-plan/features/salemanager-system.plan.md)

---

## 1. Overview

### 1.1 Design Goals

1. **단순성과 확장성**: Starter Level 기반으로 빠른 개발 가능하되, 추후 Dynamic/Enterprise로 확장 가능한 모듈화 구조
2. **사용자 경험**: 직관적인 UI/UX로 영업 담당자의 업무 효율 극대화
3. **데이터 무결성**: SQLite ACID 속성 보장으로 데이터 일관성 유지
4. **테스트 가능성**: E2E 테스트 커버리지 70% 이상 달성

### 1.2 Design Principles

- **Single Responsibility Principle**: 각 컴포넌트/서비스는 하나의 명확한 책임만 수행
- **Separation of Concerns**: 프레젠테이션, 비즈니스 로직, 데이터 접근 계층 분리
- **DRY (Don't Repeat Yourself)**: 공통 로직은 재사용 가능한 모듈로 추출
- **API First**: 프론트엔드/백엔드 간 명확한 API 계약 정의

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │  Dashboard  │  │  Customers  │  │   Pipeline  │  │ Activities│ │
│  │    Page     │  │    Page     │  │    Page     │  │   Page    │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘ │
│         │                │                │                │       │
│         └────────────────┴────────────────┴────────────────┘       │
│                                  │                                 │
│                    ┌─────────────▼─────────────┐                   │
│                    │   API Client (axios)      │                   │
│                    │   + State Management      │                   │
│                    │   (React Context)         │                   │
│                    └─────────────┬─────────────┘                   │
└──────────────────────────────────┼─────────────────────────────────┘
                                   │ HTTP/REST
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Backend Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │  Customer   │  │    Lead     │  │  Opportunity│  │ Activity  │ │
│  │  Controller │  │ Controller  │  │ Controller  │  │Controller │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘ │
│         │                │                │                │       │
│         └────────────────┴────────────────┴────────────────┘       │
│                                  │                                 │
│                    ┌─────────────▼─────────────┐                   │
│                    │   Service Layer           │                   │
│                    │   (Business Logic)        │                   │
│                    └─────────────┬─────────────┘                   │
└──────────────────────────────────┼─────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Data Layer                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │  customers  │  │    leads    │  │ opportunities│  │ activities│ │
│  │    Table    │  │    Table    │  │    Table     │  │   Table   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│                                                                      │
│                    SQLite Database (salemanager.db)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        User Request Flow                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User Action → React Component                                │
│         │                                                         │
│         ▼                                                         │
│  2. API Client → HTTP Request (REST)                             │
│         │                                                         │
│         ▼                                                         │
│  3. Express Router → Controller                                   │
│         │                                                         │
│         ▼                                                         │
│  4. Service Layer → Business Logic + Validation                   │
│         │                                                         │
│         ▼                                                         │
│  5. Prisma/SQLite → Data Persistence                              │
│         │                                                         │
│         ▼                                                         │
│  6. Response → JSON Response → State Update → UI Re-render        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Frontend App | React, Vite, React Router | SPA 구현 |
| Frontend UI | Tailwind CSS, Lucide Icons | 스타일링, 아이콘 |
| Frontend API | Axios | HTTP 통신 |
| Frontend State | React Context API | 상태 관리 |
| Backend App | Express, TypeScript | API 서버 |
| Backend DB | Prisma, SQLite | ORM, 데이터베이스 |
| Test Suite | Playwright, Jest | E2E, 단위 테스트 |

---

## 3. Data Model

### 3.1 Entity Definition

#### Customer (고객)

```typescript
interface Customer {
  id: string;              // UUID
  name: string;            // 고객명 (필수)
  company?: string;        // 회사명
  email?: string;          // 이메일
  phone?: string;          // 전화번호
  status: CustomerStatus;  // 고객 상태 (active, inactive)
  createdAt: Date;         // 생성일
  updatedAt: Date;         // 수정일
}

enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
```

#### Lead (리드/잠재고객)

```typescript
interface Lead {
  id: string;              // UUID
  name: string;            // 리드명 (필수)
  company?: string;        // 회사명
  email?: string;          // 이메일
  phone?: string;          // 전화번호
  source: LeadSource;      // 리드 소스
  status: LeadStatus;      // 리드 상태
  createdAt: Date;         // 생성일
  updatedAt: Date;         // 수정일
}

enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  EVENT = 'event',
  COLD_CALL = 'cold_call',
  OTHER = 'other'
}

enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',    // Customer로 전환
  LOST = 'lost'
}
```

#### Opportunity (영업 기회)

```typescript
interface Opportunity {
  id: string;                // UUID
  customerId?: string;       // 연결된 고객 ID
  leadId?: string;           // 연결된 리드 ID
  title: string;             // 기회명 (필수)
  stage: OpportunityStage;   // 영업 단계
  value: number;             // 예상 매출 (원)
  probability: number;       // 성공 확률 (0-100)
  expectedCloseDate: Date;   // 예상 계약일
  actualCloseDate?: Date;    // 실제 계약일
  notes?: string;            // 비고
  createdAt: Date;
  updatedAt: Date;
}

enum OpportunityStage {
  PROSPECTING = 'prospecting',     // 발굴
  QUALIFICATION = 'qualification', // 검토
  PROPOSAL = 'proposal',           // 제안
  NEGOTIATION = 'negotiation',     // 협상
  CLOSED_WON = 'closed_won',       // 계약 성공
  CLOSED_LOST = 'closed_lost'      // 계약 실패
}
```

#### Activity (영업 활동)

```typescript
interface Activity {
  id: string;              // UUID
  type: ActivityType;      // 활동 유형
  customerId?: string;     // 연결된 고객 ID
  leadId?: string;         // 연결된 리드 ID
  opportunityId?: string;  // 연결된 기회 ID
  title: string;           // 활동 제목 (필수)
  description?: string;    // 활동 내용
  activityDate: Date;      // 활동 일시
  duration?: number;       // 소요 시간 (분)
  outcome?: string;        // 결과 메모
  createdAt: Date;
  updatedAt: Date;
}

enum ActivityType {
  EMAIL = 'email',
  CALL = 'call',
  MEETING = 'meeting',
  NOTE = 'note',
  OTHER = 'other'
}
```

### 3.2 Entity Relationships

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Customer   │ 1     N │   Activity   │ N     1 │   Lead       │
└──────────────┘         └──────────────┘         └──────────────┘
       │                                                    │
       │                                                    │
       │ N                                                N │
       │                                                    │
┌──────▼──────────┐         ┌──────────────┐         ┌───▼────────────┐
│  Opportunity    │ N     1 │   Activity   │ 1     N │ Opportunity    │
└─────────────────┘         └──────────────┘         └────────────────┘

Customer OR Lead ── Opportunity (다대일, 둘 중 하나만 연결)
Customer OR Lead OR Opportunity ── Activity (다대일)
```

### 3.3 Database Schema (SQLite + Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./salemanager.db"
}

model Customer {
  id        String   @id @default(uuid())
  name      String
  company   String?
  email     String?
  phone     String?
  status    String   @default("active") // active, inactive
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  opportunities Opportunity[]
  activities    Activity[]

  @@map("customers")
}

model Lead {
  id        String   @id @default(uuid())
  name      String
  company   String?
  email     String?
  phone     String?
  source    String   // website, referral, event, cold_call, other
  status    String   @default("new") // new, contacted, qualified, converted, lost
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  opportunities Opportunity[]
  activities    Activity[]

  @@map("leads")
}

model Opportunity {
  id                String    @id @default(uuid())
  customerId        String?
  leadId            String?
  title             String
  stage             String    @default("prospecting") // prospecting, qualification, proposal, negotiation, closed_won, closed_lost
  value             Float     @default(0)
  probability       Int       @default(10)
  expectedCloseDate DateTime
  actualCloseDate   DateTime?
  notes             String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  customer   Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  lead       Lead?     @relation(fields: [leadId], references: [id], onDelete: SetNull)
  activities Activity[]

  @@map("opportunities")
}

model Activity {
  id            String    @id @default(uuid())
  type          String    // email, call, meeting, note, other
  customerId    String?
  leadId        String?
  opportunityId String?
  title         String
  description   String?
  activityDate  DateTime
  duration      Int?      // minutes
  outcome       String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  customer    Customer?    @relation(fields: [customerId], references: [id], onDelete: SetNull)
  lead        Lead?        @relation(fields: [leadId], references: [id], onDelete: SetNull)
  opportunity Opportunity?  @relation(fields: [opportunityId], references: [id], onDelete: SetNull)

  @@map("activities")
}
```

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| **Customers** | | | |
| GET | `/api/customers` | Get all customers | - |
| GET | `/api/customers/:id` | Get customer detail | - |
| POST | `/api/customers` | Create customer | - |
| PUT | `/api/customers/:id` | Update customer | - |
| DELETE | `/api/customers/:id` | Delete customer | - |
| **Leads** | | | |
| GET | `/api/leads` | Get all leads | - |
| GET | `/api/leads/:id` | Get lead detail | - |
| POST | `/api/leads` | Create lead | - |
| PUT | `/api/leads/:id` | Update lead | - |
| DELETE | `/api/leads/:id` | Delete lead | - |
| PUT | `/api/leads/:id/convert` | Convert lead to customer | - |
| **Opportunities** | | | |
| GET | `/api/opportunities` | Get all opportunities | - |
| GET | `/api/opportunities/:id` | Get opportunity detail | - |
| POST | `/api/opportunities` | Create opportunity | - |
| PUT | `/api/opportunities/:id` | Update opportunity | - |
| DELETE | `/api/opportunities/:id` | Delete opportunity | - |
| **Activities** | | | |
| GET | `/api/activities` | Get all activities | - |
| GET | `/api/activities/:id` | Get activity detail | - |
| POST | `/api/activities` | Create activity | - |
| PUT | `/api/activities/:id` | Update activity | - |
| DELETE | `/api/activities/:id` | Delete activity | - |
| **Dashboard** | | | |
| GET | `/api/dashboard/stats` | Get dashboard statistics | - |

### 4.2 Detailed Specification

#### `GET /api/customers`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by name or company |
| status | string | No | Filter by status (active, inactive) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "홍길동",
      "company": "(주)삼성",
      "email": "hong@example.com",
      "phone": "010-1234-5678",
      "status": "active",
      "createdAt": "2026-02-18T00:00:00Z",
      "updatedAt": "2026-02-18T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### `POST /api/customers`

**Request:**
```json
{
  "name": "홍길동",
  "company": "(주)삼성",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "홍길동",
  "company": "(주)삼성",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "status": "active",
  "createdAt": "2026-02-18T00:00:00Z",
  "updatedAt": "2026-02-18T00:00:00Z"
}
```

#### `PUT /api/leads/:id/convert`

Convert a lead to a customer.

**Request:**
```json
{
  "status": "converted"
}
```

**Response (200 OK):**
```json
{
  "customerId": "uuid",
  "leadId": "uuid",
  "message": "Lead successfully converted to customer"
}
```

#### `GET /api/dashboard/stats`

**Response (200 OK):**
```json
{
  "customers": {
    "total": 45,
    "active": 38,
    "newThisMonth": 5
  },
  "leads": {
    "total": 120,
    "new": 15,
    "contacted": 45,
    "qualified": 30,
    "converted": 20,
    "lost": 10
  },
  "opportunities": {
    "total": 25,
    "byStage": {
      "prospecting": 5,
      "qualification": 8,
      "proposal": 7,
      "negotiation": 3,
      "closed_won": 2,
      "closed_lost": 0
    },
    "totalValue": 250000000,
    "weightedValue": 75000000
  },
  "activities": {
    "total": 150,
    "thisWeek": 12,
    "byType": {
      "email": 60,
      "call": 40,
      "meeting": 30,
      "note": 20
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Input validation failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### 4.3 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "name": "Name is required",
      "email": "Invalid email format"
    }
  }
}
```

---

## 5. UI/UX Design

### 5.1 Screen Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  Header                                                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📊 SaleManager          🔍 검색      📊 대시보드  📝 활동   │  │
│  └──────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│  Sidebar        │                   Main Content Area              │
│  ┌───────────┐  │  ┌────────────────────────────────────────────┐ │
│  │ 📊 대시보드 │  │  │                                            │ │
│  ├───────────┤  │  │  [페이지별 컨텐츠]                           │ │
│  │ 👥 고객    │  │  │                                            │ │
│  ├───────────┤  │  │  - 고객 목록 / 상세                          │ │
│  │ 🎯 리드    │  │  │  - 리드 목록 / 상세                          │ │
│  ├───────────┤  │  │  - 영업 파이프라인                           │ │
│  │ 💼 기회    │  │  │  - 활동 로그                                 │ │
│  ├───────────┤  │  │                                            │ │
│  │ 📝 활동    │  │  │                                            │ │
│  └───────────┘  │  │                                            │ │
│                 │  └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### 5.2 User Flow

```
Login (v1.0 스킵)
    │
    ▼
┌─────────────────────────────────────┐
│            Dashboard                 │
│  - 전체 현황 요약                     │
│  - 최근 활동                         │
│  - 주요 KPI                          │
└─────────────────────────────────────┘
    │
    ├──▶ 고객 관리: 목록 → 상세 → 수정/삭제
    ├──▶ 리드 관리: 목록 → 상세 → 수정/고객 전환
    ├──▶ 영업 파이프라인: 칸반 보기 → 단계 이동 → 상세
    └──▶ 활동 로그: 목록 → 등록 → 상세
```

### 5.3 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `Layout` | `src/components/Layout/` | 공통 레이아웃 (헤더, 사이드바) |
| `Header` | `src/components/Header/` | 상단 내비게이션, 검색 |
| `Sidebar` | `src/components/Sidebar/` | 메뉴 내비게이션 |
| `DashboardStats` | `src/components/Dashboard/` | 대시보드 통계 카드 |
| `CustomerList` | `src/pages/Customers/` | 고객 목록 테이블 |
| `CustomerForm` | `src/pages/Customers/` | 고객 생성/수정 폼 |
| `LeadCard` | `src/pages/Leads/` | 리드 카드 컴포넌트 |
| `PipelineKanban` | `src/pages/Pipeline/` | 영업 파이프라인 칸반 |
| `ActivityTimeline` | `src/components/Activity/` | 활동 타임라인 |
| `ActivityForm` | `src/components/Activity/` | 활동 등록 폼 |

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| `VALIDATION_ERROR` | 입력 값이 올바르지 않습니다 | 필수 값 누락, 형식 오류 | 입력 폼에 에러 메시지 표시 |
| `NOT_FOUND` | 리소스를 찾을 수 없습니다 | 존재하지 않는 ID | 404 페이지 또는 목록으로 리다이렉트 |
| `DUPLICATE_ERROR` | 이미 존재하는 데이터입니다 | 중복 이메일 등 | 에러 메시지 표시 |
| `DATABASE_ERROR` | 데이터베이스 오류가 발생했습니다 | DB 연결 실패 등 | 사용자에게 알림, 로그 기록 |

### 6.2 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 값이 올바르지 않습니다",
    "details": [
      {
        "field": "email",
        "message": "이메일 형식이 올바르지 않습니다"
      },
      {
        "field": "name",
        "message": "고객명은 필수입니다"
      }
    ],
    "timestamp": "2026-02-18T10:00:00Z"
  }
}
```

---

## 7. Security Considerations

| Category | Implementation | Priority |
|----------|---------------|:--------:|
| Input Validation | Zod 스키마로 요청 데이터 검증 | High |
| SQL Injection | Prisma ORM 사용 (자동 방지) | High |
| XSS | React 기본 방어 + sanitization | High |
| CORS | 특정 Origin만 허용 설정 | Medium |
| Rate Limiting | Express rate-limit 미들웨어 | Low (v1.0) |
| Error Messages | 민감 정보 노출 방지 | High |

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | Repository |
|------|--------|------|------------|
| Unit Test | Business Logic, Utilities | Jest | salemanager-test |
| Integration Test | API Endpoints | Supertest | salemanager-test |
| E2E Test | User Flows | Playwright | salemanager-test |

### 8.2 Test Cases

#### Backend (Jest + Supertest)

```typescript
// 예시: Customer API 테스트
describe('Customer API', () => {
  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({
          name: '테스트 고객',
          email: 'test@example.com'
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({
          name: '테스트',
          email: 'invalid-email'
        });
      expect(response.status).toBe(400);
    });
  });
});
```

#### E2E (Playwright)

```typescript
// 예시: 고객 등록 E2E 테스트
test('고객 등록 흐름', async ({ page }) => {
  await page.goto('/customers');
  await page.click('[data-testid="add-customer-btn"]');
  await page.fill('[name="name"]', '테스트 고객');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('[data-testid="save-btn"]');
  await expect(page.locator('text=테스트 고객')).toBeVisible();
});
```

### 8.3 Key Test Scenarios

| Scenario | Description | Priority |
|----------|-------------|:--------:|
| Customer CRUD | 고객 생성/조회/수정/삭제 | High |
| Lead to Customer | 리드를 고객으로 전환 | High |
| Pipeline Stage Move | 영업 단계 변경 | High |
| Activity Logging | 활동 등록 및 연결 | High |
| Dashboard Stats | 대시보드 통계 정확성 | High |
| Search & Filter | 검색 및 필터링 기능 | Medium |
| CSV Export | 데이터 내보내기 | Low |

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Frontend Location | Backend Location |
|-------|---------------|-------------------|------------------|
| **Presentation** | UI Components, Hooks | `src/components/`, `src/pages/` | N/A |
| **Application** | Business Logic, State | `src/services/`, `src/hooks/` | `src/services/` |
| **Domain** | Types, Entities | `src/types/` | `src/types/` |
| **Infrastructure** | API Clients, External | `src/lib/api/` | `src/lib/`, `src/db/` |

### 9.2 File Structure

#### Frontend (salemanager-frontend)

```
src/
├── components/          # Presentation Layer
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── Dashboard/
│   ├── Customers/
│   └── common/
├── pages/              # Page Components
│   ├── Dashboard.tsx
│   ├── Customers.tsx
│   ├── Leads.tsx
│   ├── Pipeline.tsx
│   └── Activities.tsx
├── services/           # Application Layer
│   ├── api/
│   │   ├── customerService.ts
│   │   ├── leadService.ts
│   │   └── opportunityService.ts
│   └── hooks/
│       ├── useCustomers.ts
│       └── useLeads.ts
├── types/              # Domain Layer
│   ├── customer.types.ts
│   ├── lead.types.ts
│   └── opportunity.types.ts
├── lib/                # Infrastructure Layer
│   ├── api/
│   │   └── axiosClient.ts
│   └── utils/
└── contexts/           # State Management
    └── AppContext.tsx
```

#### Backend (salemanager-backend)

```
src/
├── routes/             # API Routes
│   ├── customers.ts
│   ├── leads.ts
│   ├── opportunities.ts
│   ├── activities.ts
│   └── dashboard.ts
├── controllers/        # Request Handlers
│   ├── customerController.ts
│   └── ...
├── services/           # Application Layer (Business Logic)
│   ├── customerService.ts
│   └── ...
├── models/             # Domain Types
│   └── index.ts        # Export all types
├── lib/                # Infrastructure
│   ├── db/
│   │   └── prisma.ts
│   ├── validators/
│   │   └── customerSchema.ts
│   └── middleware/
│       ├── errorHandler.ts
│       └── validationHandler.ts
└── utils/
```

### 9.3 Dependency Rules

```
┌─────────────────────────────────────────────────────────────┐
│                    Dependency Direction                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Presentation ──→ Application ──→ Domain ←── Infrastructure│
│                          │                                  │
│                          └──→ Infrastructure                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Rule: Inner layers MUST NOT depend on outer layers
      Domain is independent (no external dependencies)
```

---

## 10. Coding Convention Reference

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `CustomerList`, `LeadCard` |
| Functions | camelCase | `getCustomers()`, `createLead()` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_ITEMS` |
| Types/Interfaces | PascalCase | `Customer`, `LeadStatus` |
| Files (component) | PascalCase.tsx | `DashboardStats.tsx` |
| Files (utility) | camelCase.ts | `formatDate.ts` |
| Folders | kebab-case | `customer-list/`, `api-client/` |

### 10.2 Import Order

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 2. Internal absolute imports (@/)
import { Button } from '@/components/common';
import { useCustomers } from '@/services/hooks';
import type { Customer } from '@/types';

// 3. Relative imports
import { CustomerForm } from './components';

// 4. CSS (if any)
import './CustomerList.css';
```

### 10.3 Environment Variables

| Variable | Purpose | Scope | Example |
|----------|---------|-------|---------|
| `VITE_API_URL` | Backend API 주소 | Client | `http://localhost:3000/api` |
| `PORT` | Backend 서버 포트 | Server | `3000` |
| `NODE_ENV` | 실행 환경 | Both | `development`, `production` |
| `DB_PATH` | SQLite DB 경로 | Server | `./prisma/salemanager.db` |

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| Component naming | PascalCase (e.g., `CustomerList`, `LeadCard`) |
| File organization | Feature-based (customers/, leads/, pipeline/) |
| State management | React Context API (AppContext) |
| Error handling | Unified error response format |
| API communication | Axios with interceptors |

---

## 11. Implementation Guide

### 11.1 Implementation Order

```
Phase 1: Foundation (공통)
├── [Backend] Prisma 설정 + DB 마이그레이션
├── [Backend] Express 서버 기본 구조
├── [Frontend] Vite 프로젝트 설정 + 라우팅
├── [Frontend] Axios API 클라이언트 설정
└── [Both] 공통 타입 정의

Phase 2: Core Features
├── [Backend] Customer API 구현
├── [Frontend] Customer 페이지 구현
├── [Backend] Lead API 구현
├── [Frontend] Lead 페이지 구현
└── [Test] 기본 E2E 테스트 작성

Phase 3: Advanced Features
├── [Backend] Opportunity API + Pipeline
├── [Frontend] Pipeline 칸반 보드
├── [Backend] Activity API
├── [Frontend] Activity 타임라인
└── [Test] E2E 테스트 추가

Phase 4: Dashboard & Polish
├── [Backend] Dashboard 통계 API
├── [Frontend] Dashboard 페이지
├── [Both] 검색/필터링 기능
├── [Frontend] UI/UX 개선
└── [Test] 전체 테스트 커버리지 확인
```

### 11.2 Repository Setup Commands

```bash
# Frontend (salemanager-frontend)
cd salemanager-frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom axios lucide-react

# Backend (salemanager-backend)
cd salemanager-backend
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors tsx
npm install prisma @prisma/client
npx prisma init

# Test (salemanager-test)
cd salemanager-test
npm init -y
npm install -D playwright @playwright/test
npm install -D jest @types/jest ts-jest
npx playwright install
```

### 11.3 Development Workflow

1. **Backend 먼저 API 구현** → Postman으로 테스트
2. **Frontend에서 API 연동** → UI 구현
3. **Test에서 E2E 시나리오 작성** → 전체 흐름 검증
4. **Code Review & 리팩토링**

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-18 | Initial draft - Design document | Design Team |
