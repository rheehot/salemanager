# SaleManager System Planning Document

> **Summary**: 영업 관리 시스템 - 영업 담당자의 효율적인 영업 활동 관리 시스템 구축
>
> **Project**: SaleManager
> **Version**: 1.0.0
> **Author**: CTO Lead
> **Date**: 2026-02-18
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

영업 담당자의 일일 영업 활동을 체계적으로 관리하고, 고객 정보와 영업 파이프라인을 효율적으로 추적할 수 있는 통합 영업 관리 시스템을 구축합니다.

### 1.2 Background

영업 조직에서는 고객 정보, 리드(잠재 고객), 영업 활동 이력, 파이프라인 상태 등을 통합 관리할 필요가 있습니다. 기존의 엑셀이나 개별 도구로 관리하던 방식에서 벗어나, 체계적인 영업 프로세스를 자동화하고 시각화하여 영업 효율성을 향상시키고자 합니다.

### 1.3 Related Documents

- Requirements: 현재 프로젝트 요구사항 (팀 미팅)
- References: CRM 시스템 베스트 프랙티스, 영업 프로세스 관리 가이드

---

## 2. Scope

### 2.1 In Scope

- [ ] **고객/리드 관리**: 고객 정보 CRUD, 리드(잠재 고객) 관리, 연락처 추적
- [ ] **영업 파이프라인**: 영업 단계(발굴~계약)별 기회 관리, 확률 추적
- [ ] **영업 활동 로그**: 이메일, 통화, 미팅 등 활동 기록 및 관리
- [ ] **대시보드**: 영업 현황 요약, KPI 추적, 실시간 통계

### 2.2 Out of Scope

- 사용자 인증/권한 관리 (v1.0에서는 단일 사용자)
- 이메일 발송 기능 (기록만 가능, 실제 발송은 미구현)
- 외부 API 연동 (캘린더, 이메일 서비스 등)
- 모바일 앱 (웹 only)
- 다국어 지원

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 고객 정보 등록/수정/조회/삭제 (CRUD) | High | Pending |
| FR-02 | 리드(잠재 고객) 별도 관리 및 상태 추적 | High | Pending |
| FR-03 | 영업 파이프라인 단계별 관리 (발굴 > 제안 > 협상 > 계약) | High | Pending |
| FR-04 | 각 영업 기회의 성공 확률 설정 및 추적 | High | Pending |
| FR-05 | 영업 활동(이메일, 통화, 미팅) 기록 | High | Pending |
| FR-06 | 활동 이력을 고객/리드별로 연결 | Medium | Pending |
| FR-07 | 대시보드에서 영업 현황 요약 제공 | High | Pending |
| FR-08 | KPI 지표 추적 (리드 수, 진행 중 기회, 예상 매출 등) | High | Pending |
| FR-09 | 검색 및 필터링 기능 (고객명, 상태, 단계 등) | Medium | Pending |
| FR-10 | 데이터 내보내기 기능 (CSV) | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 페이지 로드 시간 < 2초 | Lighthouse, Chrome DevTools |
| Usability | 모바일 반응형 UI 지원 | Responsive design test |
| Data Integrity | SQLite ACID 속성 보장 | Database transaction test |
| Maintainability | 컴포넌트 기반 아키텍처 | Code review |
| Testability | E2E 테스트 커버리지 > 70% | Playwright test report |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 모든 기능적 요구사항 (FR-01 ~ FR-10) 구현 완료
- [ ] 단위 테스트 작성 및 통과 (Jest)
- [ ] E2E 테스트 작성 및 통과 (Playwright)
- [ ] 각 저장소별 README 작성 완료
- [ ] 사용자 매뉴얼 작성 완료

### 4.2 Quality Criteria

- [ ] 테스트 커버리지 > 70%
- [ ] ESLint/Prettier 설정 및 에러 없음
- [ ] 모든 저장소에서 빌드 성공
- [ ] 크로스 브라우저 테스트 통과 (Chrome, Firefox, Safari)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Multi-repo 관리 복잡성 증가 | Medium | High | 명확한 API 계약 정의, 공유 타입 패키지 사용 |
| 프론트/백엔드 데이터 동기화 문제 | High | Medium | OpenAPI 스펙 자동화, 통합 테스트 강화 |
| SQLite 동시성 제약 (팀 사용 시) | Low | Low | v1.0은 단일 사용자, 추후 PostgreSQL 마이그레이션 계획 |
| UI/UX 일관성 유지 어려움 | Medium | Medium | Tailwind CSS 디자인 시스템 정의 및 공유 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | 단순 구조, 빠른 개발 | 정적 사이트, 포트폴리오 | ☑️ |
| **Dynamic** | BaaS 통합, 복잡한 상태 관리 | SaaS MVP, 풀스택 앱 | ☐ |
| **Enterprise** | 마이크로서비스, 엄격한 계층 분리 | 대규모 시스템 | ☐ |

**Rationale**: Starter level으로 진행하되, Multi-repo 구조로 팀 협업 경험을 제공합니다. 기본 기능 위주로 빠르게 구현하고, 추후 Dynamic/Enterprise로 확장 가능하도록 모듈화합니다.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Frontend Framework | React / Vue / Svelte | React | 팀원 익숙도, 생태계 |
| UI Library | Tailwind CSS / styled-components / MUI | Tailwind CSS | 빠른 스타일링, 일관성 |
| State Management | Context / Zustand / Redux | Context API | Starter level에 적합 |
| Backend Framework | Express / Fastify / Koa | Express | 팀원 익숙도, 안정성 |
| Database | SQLite / PostgreSQL / MongoDB | SQLite | 개발 환경 간편, 파일 기반 |
| API Style | REST / GraphQL | REST | 단순명확, 표준적 |
| Testing | Jest + Playwright | Jest + Playwright | React 표준 조합 |

### 6.3 Clean Architecture Approach

```
Selected Level: Starter (Multi-repo Structure)

Folder Structure Preview:
┌─────────────────────────────────────────────────────┐
│ salemanager-frontend/ (React + Tailwind)            │
│   src/components/     # UI 컴포넌트                  │
│   src/pages/          # 페이지 컴포넌트               │
│   src/services/       # API 클라이언트                │
│   src/hooks/          # 커스텀 훅                    │
│   src/utils/          # 유틸리티 함수                 │
│   src/types/          # TypeScript 타입              │
├─────────────────────────────────────────────────────┤
│ salemanager-backend/ (Express + SQLite)             │
│   src/routes/         # API 라우트                   │
│   src/controllers/    # 요청 처리 로직                │
│   src/models/         # 데이터 모델                  │
│   src/services/       # 비즈니스 로직                 │
│   src/middleware/     # 미들웨어                     │
│   src/utils/          # 유틸리티                     │
├─────────────────────────────────────────────────────┤
│ salemanager-test/ (Jest + Playwright)               │
│   e2e/               # E2E 테스트 시나리오            │
│   unit/              # 단위 테스트                   │
│   fixtures/          # 테스트 데이터                  │
└─────────────────────────────────────────────────────┘
```

### 6.4 Multi-Repo Structure

```
salemanager/                    # Organization (root)
├── salemanager-frontend/       # React Frontend Repository
├── salemanager-backend/        # Express Backend Repository
└── salemanager-test/           # Test Repository
```

**Repository 간 통신:**
- Frontend → Backend: REST API (http://localhost:3000/api)
- Test → Frontend/Backend: E2E 테스트 시 각 앱에 요청

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [ ] `CLAUDE.md` 작성 필요
- [ ] `docs/01-plan/conventions.md` 작성 필요
- [ ] 각 저장소별 ESLint/Prettier 설정 필요
- [ ] 각 저장소별 TypeScript 설정 필요

### 7.2 Conventions to Define

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | 미정 | camelCase (JS/TS), PascalCase (Components) | High |
| **Folder structure** | 미정 | Feature-based organization | High |
| **API Design** | 미정 | RESTful convention (/api/v1/...) | High |
| **Error handling** | 미정 |统一 에러 응답 포맷 | Medium |
| **Git commit** | 미정 | Conventional Commits | Medium |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | Repository |
|----------|---------|-------|------------|
| `VITE_API_URL` | Backend API 주소 | Client | salemanager-frontend |
| `PORT` | Backend 서버 포트 | Server | salemanager-backend |
| `NODE_ENV` | 실행 환경 (development/production) | Both | All |
| `DB_PATH` | SQLite DB 파일 경로 | Server | salemanager-backend |

---

## 8. Team Coordination

### 8.1 Team Structure

| Role | Repository | Primary Responsibilities |
|------|------------|---------------------------|
| **Frontend** | salemanager-frontend | React 컴포넌트, API 통신, 상태 관리, UI/UX |
| **Backend** | salemanager-backend | API 설계, DB 스키마, 비즈니스 로직 |
| **Test** | salemanager-test | E2E 테스트 시나리오, 단위 테스트, QA |

### 8.2 Development Workflow

```
1. Plan Phase (현재)
   └─> 요구사항 분석, 아키텍처 정의

2. Design Phase (다음)
   ├─> Backend: API 스펙, DB 스키마 설계
   ├─> Frontend: 페이지 구조, 컴포넌트 계층 설계
   └─> Test: 테스트 전략, 시나리오 정의

3. Do Phase
   ├─> Backend: API 구현, DB 설정
   ├─> Frontend: UI 구현, API 연동
   └─> Test: 테스트 코드 작성 (병행)

4. Check Phase
   └─> Gap 분석, 테스트 결과 검증

5. Act Phase
   └─> 이슈 수정, 리팩토링, 문서화
```

### 8.3 Integration Points

**API Contract (Frontend ↔ Backend):**
- OpenAPI/Swagger 스펙 공유
- TypeScript 타입 공유 (공유 패키지 또는 파일 복사)

**Test Integration:**
- E2E 테스트는 전체 시스템(프론트+백엔드) 실행 후 진행
- 테스트 데이터는 fixtures 폴더에서 관리

---

## 9. Success Metrics

### 9.1 Development Metrics

- [ ] 각 저장소별 최소 1회 이상 커밋
- [ ] Pull Request 최소 3회 (Frontend, Backend, Test 각각)
- [ ] Code Review 사이클 완료

### 9.2 Product Metrics

- [ ] 10개 이상의 테스트 고객 데이터 생성 가능
- [ ] 5개 이상의 영업 파이프라인 단계 관리 가능
- [ ] 대시보드에서 실시간 KPI 확인 가능

---

## 10. Next Steps

1. [ ] **Design Phase**: 각 저장소별 상세 설계 문서 작성
   - Backend: API 스펙, DB 스키마
   - Frontend: 컴포넌트 구조, 라우팅
   - Test: 테스트 시나리오, 커버리지 목표

2. [ ] **Repository Setup**: 각 저장소 초기화
   - salemanager-frontend: Vite + React + TypeScript
   - salemanager-backend: Express + TypeScript
   - salemanager-test: Playwright + Jest

3. [ ] **Convention Documentation**: 팀 코딩 컨벤션 정의

4. [ ] **Implementation Kickoff**: Do phase 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-18 | Initial draft - Plan document | CTO Lead |
