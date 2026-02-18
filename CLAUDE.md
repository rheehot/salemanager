# SaleManager Project

> **Level**: Starter
> **Type**: Multi-repo (Frontend/Backend/Test separated)
> **Status**: Plan Phase

---

## Project Overview

영업 관리 시스템(SaleManager)은 영업 담당자의 효율적인 영업 활동 관리를 위한 웹 애플리케이션입니다.

### Core Features

1. **고객/리드 관리**: 고객 정보 CRUD, 리드(잠재 고객) 관리
2. **영업 파이프라인**: 영업 단계(발굴~계약)별 기회 관리 및 확률 추적
3. **영업 활동 로그**: 이메일, 통화, 미팅 등 활동 기록
4. **대시보드**: 영업 현황 요약 및 KPI 추적

---

## Multi-Repo Structure

```
salemanager/
├── salemanager-frontend/    # React + Tailwind CSS
├── salemanager-backend/     # Express + SQLite
└── salemanager-test/        # Jest + Playwright
```

### Repository Responsibilities

| Repository | Tech Stack | Owner |
|------------|-----------|-------|
| `salemanager-frontend` | React 18, TypeScript, Vite, Tailwind CSS | Frontend Team |
| `salemanager-backend` | Express, TypeScript, SQLite, Prisma | Backend Team |
| `salemanager-test` | Playwright, Jest, @testing-library | Test Team |

---

## Development Workflow

### Phase Progression

```
[Plan] → [Design] → [Do] → [Check] → [Act]
   ✅       🔄        ⏳       ⏳       ⏳
```

**Current Phase**: Plan (문서 작성 완료)

### Next Commands

```bash
# Design Phase 시작
/pdca design salemanager-system

# Design 후 Implementation
/pdca do salemanager-system
```

---

## Team Communication

### When Working on Features

1. **Check Plan First**: `docs/01-plan/features/{feature}.plan.md`
2. **Reference Design**: `docs/02-design/features/{feature}.design.md` (after Design phase)
3. **Follow Conventions**: 각 저장소의 README.md 및 CLAUDE.md 참고

### Cross-Repo Integration

- **API Contract**: Backend OpenAPI 스펙 → Frontend에서 참조
- **Shared Types**: TypeScript 타입 정의 공유 (필요시 별도 패키지 고려)
- **Integration Testing**: salemanager-test에서 전체 시스템 테스트

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8 (각 저장소 공통)

### Setup Each Repository

```bash
# Frontend
cd salemanager-frontend
pnpm install
pnpm dev

# Backend
cd salemanager-backend
pnpm install
pnpm dev

# Test
cd salemanager-test
pnpm install
pnpm test
```

---

## Architecture Decisions

### Why Starter Level?

- 단일 개발자 또는 소규모 팀에 적합
- 빠른 개발 및 배포 가능
- 추후 Dynamic/Enterprise 레벨로 확장 가능한 구조

### Why Multi-Repo?

- 팀원별 역할 분담 경험 제공
- 프론트엔드/백엔드/테스트 독립적 관리
- 실무 협업 시나리오 시뮬레이션

### Technology Choices

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + Vite | 빠른 개발, 풍부한 생태계 |
| Styling | Tailwind CSS | 빠른 UI 구현, 일관성 |
| Backend | Express | 안정적, 널리 사용됨 |
| Database | SQLite | 개발 환경 간편, 파일 기반 |
| Testing | Playwright | 현대적 E2E 테스트 도구 |

---

## Important Notes

### Version Control

- 각 저장소는 독립적인 Git repository로 관리
- 통합 버전 관리는 root의 docs/에서 수행
- Release 시 각 저장소의 버전을 동기화

### API Communication

```
Frontend (localhost:5173)
    ↓ HTTP/REST API
Backend (localhost:3000)
    ↓ SQL
SQLite (file-based DB)
```

### Testing Strategy

- **Unit Tests**: 각 저장소 내에서 Jest로 실행
- **E2E Tests**: salemanager-test에서 Playwright로 전체 흐름 테스트
- **Test Coverage 목표**: > 70%

---

## Current Status

**Last Updated**: 2026-02-18
**Active Phase**: Plan
**Match Rate**: N/A
**Iteration**: 0

---

## Team Contacts

- **CTO Lead**: Architecture decisions, team orchestration
- **Frontend Team**: UI/UX implementation
- **Backend Team**: API & Database implementation
- **Test Team**: Quality assurance, testing strategy
