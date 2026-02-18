# SaleManager Test

> Playwright + Jest + Testing Library

## Overview

SaleManager의 테스트 저장소입니다. E2E 테스트와 단위 테스트를 관리합니다.

## Tech Stack

- **E2E Testing**: Playwright
- **Unit Testing**: Jest
- **Component Testing**: React Testing Library

## Project Structure

```
├── e2e/                    # E2E test scenarios
│   ├── dashboard.spec.ts
│   ├── customers.spec.ts
│   ├── leads.spec.ts
│   ├── pipeline.spec.ts
│   └── activities.spec.ts
├── unit/                   # Unit tests
│   └── (if needed)
├── fixtures/               # Test data
│   ├── customers.json
│   ├── leads.json
│   └── opportunities.json
├── utils/                  # Test utilities
│   └── helpers.ts
└── playwright.config.ts
```

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests with debug
npm run test:debug
```

## Environment Variables

```env
# Frontend URL for E2E tests
FRONTEND_URL=http://localhost:5173

# Backend URL for API tests
BACKEND_URL=http://localhost:3000
```

## Test Scenarios

### E2E Tests

#### Dashboard
- [ ] 대시보드 페이지 로드
- [ ] KPI 카드 표시 확인
- [ ] 통계 데이터 정확성 확인

#### Customers
- [ ] 고객 목록 표시
- [ ] 고객 생성 (Create)
- [ ] 고객 정보 수정 (Update)
- [ ] 고객 삭제 (Delete)
- [ ] 검색 기능
- [ ] 필터 기능

#### Leads
- [ ] 리드 목록 표시
- [ ] 리드 생성
- [ ] 리드 상태 변경
- [ ] 리드 → 고객 전환

#### Pipeline
- [ ] 파이프라인 보드 표시
- [ ] 기회 생성
- [ ] 단계 이동 (드래그앤드롭)
- [ ] 확률 업데이트

#### Activities
- [ ] 활동 로그 표시
- [ ] 활동 기록 (이메일/통화/미팅)
- [ ] 고객별 활동 필터링

## Test Data

### Fixtures Examples

```json
// fixtures/customers.json
[
  {
    "name": "John Doe",
    "company": "Acme Corp",
    "email": "john@acme.com",
    "phone": "123-456-7890"
  }
]
```

## Testing Guidelines

### E2E Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Customers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers');
  });

  test('should display customer list', async ({ page }) => {
    // Test implementation
  });
});
```

### Best Practices

1. **Isolation**: Each test should be independent
2. **Clear assertions**: Use descriptive assertion messages
3. **Wait properly**: Use explicit waits over implicit
4. **Clean up**: Reset test data after each test
5. **Page Objects**: Consider using Page Object Model for complex flows

### Coverage Goals

- E2E: Cover all critical user flows
- Happy path: 100% coverage
- Error cases: Major errors covered
- Target: > 70% overall coverage

## Test Execution

### Local Testing

```bash
# Start all services
# Terminal 1: Backend
cd ../salemanager-backend && npm run dev

# Terminal 2: Frontend
cd ../salemanager-frontend && npm run dev

# Terminal 3: Tests
cd salemanager-test && npm run test
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
```

## Reporting

- HTML Report: `npm run test:report`
- JSON Report: For CI/CD integration
- Screenshots: On failure (auto-captured)

## Team

- QA Lead: [Name]
- Test Engineers: [Names]

---

## Next Steps

1. Design phase complete → Define test scenarios
2. Set up Playwright configuration
3. Create test fixtures
4. Implement critical path tests first
5. Expand coverage based on implementation progress
