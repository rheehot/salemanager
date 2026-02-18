# SaleManager

> 영업 관리 시스템 (Sales Management System)

## 프로젝트 개요

SaleManager는 영업 담당자의 효율적인 영업 활동 관리를 위한 웹 애플리케이션입니다. 고객 관리, 영업 파이프라인 추적, 활동 로깅, 대시보드 등의 핵심 기능을 제공합니다.

## 주요 기능

1. **고객/리드 관리**: 고객 정보 CRUD, 리드(잠재 고객) 관리 및 연락처 추적
2. **영업 파이프라인**: 영업 단계(발굴~계약)별 기회 관리 및 확률 추적
3. **영업 활동 로그**: 이메일, 통화, 미팅 등 활동 기록 및 관리
4. **대시보드**: 영업 현황 요약 및 KPI 추적

## 프로젝트 구조

이 프로젝트는 **Multi-repo 구조**로 운영됩니다:

```
salemanager/
├── salemanager-frontend/    # React + TypeScript + Vite + Tailwind CSS
├── salemanager-backend/     # Express + TypeScript + SQLite + Prisma
├── salemanager-test/        # Playwright + Jest
├── docs/                    # PDCA 문서
└── README.md                # 이 파일
```

## 기술 스택

### 프론트엔드
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### 백엔드
- Express.js
- TypeScript
- SQLite
- Prisma ORM

### 테스트
- Playwright (E2E)
- Jest (Unit)
- React Testing Library

## 시작하기

### 사전 요구사항

- Node.js >= 18
- pnpm >= 8 (각 저장소 공통)

### 설치 및 실행

```bash
# 1. 백엔드 설정
cd salemanager-backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
# 실행: http://localhost:3000

# 2. 프론트엔드 설정 (새 터미널)
cd salemanager-frontend
npm install
npm run dev
# 실행: http://localhost:5173

# 3. 테스트 실행 (새 터미널)
cd salemanager-test
npm install
npx playwright install
npm run test
```

## 🚀 배포 (Deployment)

### 실서비스 접속

- **프론트엔드**: [https://salemanager-frontend.vercel.app](https://salemanager-frontend.vercel.app)
- **백엔드 배포**: 아래 Railway 버튼으로 배포

### 빠른 백엔드 배포

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?repo=https://github.com/rheehot/salemanager&ref=main)

상세 가이드: [Railway 배포 가이드](./RAILWAY_DEPLOY.md)

## 개발 현황

### PDCA 진행 상황

```
[Plan] ✅ → [Design] ✅ → [Do] ✅ → [Check] ✅ → [Report] ✅
```

**현재 단계**: PDCA 완료, 배포 진행 중

### 최신 업데이트

- 2026-02-18: PDCA 완료 (Match Rate: 95%)
- 2026-02-18: Vercel 배포 완료
- 2026-02-18: 이메일 캠페인 기능 추가
- 2026-02-18: 전체 CRUD 구현 완료

## 문서

### PDCA 문서
- [Plan 문서](./docs/01-plan/features/salemanager-system.plan.md)
- [Design 문서](./docs/02-design/features/) (준비 중)
- [팀 협업 가이드](./docs/TEAM-COORDINATION.md)

### 각 저장소 README
- [프론트엔드 README](./salemanager-frontend/README.md)
- [백엔드 README](./salemanager-backend/README.md)
- [테스트 README](./salemanager-test/README.md)

## 팀 구성

| 역할 | 담당 | 저장소 |
|------|------|--------|
| 프론트엔드 | Frontend Team | salemanager-frontend |
| 백엔드 | Backend Team | salemanager-backend |
| 테스트 | Test Team | salemanager-test |

## 기여 방법

1. 각 저장소의 README를 참고하여 개발 환경을 설정합니다.
2. [팀 협업 가이드](./docs/TEAM-COORDINATION.md)를 숙지합니다.
3. 해당 저장소의 Issue를 확인하고 작업을 할당받습니다.
4. Pull Request를 생성하고 Code Review를 받습니다.

## 라이선스

ISC

---

**프로젝트 시작일**: 2026-02-18
**현재 버전**: 1.0.0
**프로젝트 레벨**: Starter
