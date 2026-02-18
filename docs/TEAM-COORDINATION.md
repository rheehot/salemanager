# SaleManager 팀 협업 가이드

## 프로젝트 개요

**프로젝트명**: SaleManager (영업 관리 시스템)
**레벨**: Starter (Multi-repo 구조)
**현재 단계**: Plan Phase 완료 → Design Phase 진입 준비

---

## 팀 구성

### 1. 프론트엔드 팀
- **담당**: React + TypeScript + Tailwind CSS
- **저장소**: `salemanager-frontend/`
- **주요 책임**:
  - UI/UX 구현
  - API 통신 레이어
  - 상태 관리 (Context API)
  - 반응형 디자인

### 2. 백엔드 팀
- **담당**: Express + TypeScript + SQLite + Prisma
- **저장소**: `salemanager-backend/`
- **주요 책임**:
  - RESTful API 설계 및 구현
  - 데이터베이스 스키마 설계
  - 비즈니스 로직 구현
  - API 문서화

### 3. 테스트 팀
- **담당**: Playwright + Jest
- **저장소**: `salemanager-test/`
- **주요 책임**:
  - E2E 테스트 시나리오 작성
  - 테스트 데이터 관리
  - 테스트 커버리지 확보
  - QA 프로세스 정의

---

## PDCA 워크플로우

### 현재 상태

```
[Plan] ✅ → [Design] 🔄 → [Do] ⏳ → [Check] ⏳ → [Act] ⏳
```

**Plan Phase 완료 사항**:
- 요구사항 분석 완료 (FR-01 ~ FR-10)
- 아키텍처 결정 (Starter Level, Multi-repo)
- 기술 스택 선정
- 리스크 분석 완료

---

## Design Phase 작업 지시

### 프론트엔드 팀 (Design Phase)

**목표**: UI/UX 설계 및 컴포넌트 구조 정의

**작업 항목**:
1. **페이지 구조 정의**
   - 라우팅 구조 (React Router)
   - 페이지 계층 구조
   - 네비게이션 설계

2. **컴포넌트 계층 설계**
   - 공통 UI 컴포넌트 목록 (Button, Input, Card, etc.)
   - 페이지별 컴포넌트 구성
   - 컴포넌트 재사용 전략

3. **상태 관리 설계**
   - 전역 상태 vs 지역 상태 분리
   - Context 구조 정의
   - 데이터 흐름 설계

4. **API 통신 설계**
   - API 클라이언트 구조 (Axios)
   - 요청/응답 인터셉터
   - 에러 처리 전략

**산출물**:
- UI/UX 와이어프레임 (페이지별)
- 컴포넌트 트리 문서
- 라우팅 테이블

### 백엔드 팀 (Design Phase)

**목표**: API 설계 및 데이터베이스 스키마 정의

**작업 항목**:
1. **API 설계**
   - RESTful 엔드포인트 정의
   - 요청/응답 스펙
   - HTTP 상태 코드 가이드라인

2. **데이터베이스 설계**
   - Prisma Schema 작성
   - 테이블 관계 정의 (1:1, 1:N, N:M)
   - 인덱스 전략

3. **비즈니스 로직 설계**
   - 서비스 계층 구조
   - 데이터 검증 전략 (Zod)
   - 에러 처리 표준

4. **API 문서화**
   - OpenAPI/Swagger 스펙
   - 예제 요청/응답

**산출물**:
- API 명세서 (엔드포인트별)
- Prisma Schema 파일
- ERD (Entity Relationship Diagram)

### 테스트 팀 (Design Phase)

**목표**: 테스트 전략 수립 및 시나리오 정의

**작업 항목**:
1. **테스트 전략 수립**
   - E2E 테스트 범위 정의
   - 단위 테스트 범위 정의
   - 테스트 우선순위

2. **테스트 시나리오 작성**
   - 사용자 스토리별 시나리오
   - Happy Path & Error Path
   - 엣지 케이스 식별

3. **테스트 데이터 설계**
   - Fixture 데이터 구조
   - 테스트 데이터 셋 정의

4. **테스트 환경 설계**
   - Playwright 설정
   - CI/CD 통합 계획

**산출물**:
- 테스트 시나리오 문서
- 테스트 데이터 정의서
- 테스트 커버리지 목표

---

## 협업 규칙

### 1. API 계약 (API Contract)

**프론트엔드-백엔드 간 통신 규약**:

```typescript
// API 응답 표준 형식
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**절차**:
1. 백엔드 팀이 API 스펙 초안 작성
2. 프론트엔드 팀과 리뷰
3. 합의 후 OpenAPI 스펙으로 확정
4. 양 팀이 스펙을 참고하여 개발

### 2. 통합 테스트 일정

**Phase 1: 개발 기간**
- 각 팀 독립적 개발
- Mock 데이터로 개발

**Phase 2: 통합 기간**
- 전체 시스템 연동
- API 통신 테스트
- 이슈 수정

### 3. 커뮤니케이션

**도구**:
- GitHub Issues: 이슈 추적
- Pull Request: 코드 리뷰
- Weekly Meeting: 진행 상황 공유

**PR 템플릿**:
```markdown
## 변경 사항
- [ ] 기능 추가
- [ ] 버그 수정
- [ ] 리팩토링

## 테스트
- [ ] 단위 테스트 통과
- [ ] E2E 테스트 통과

## 관련 이슈
Closes #issue-number
```

---

## 다음 단계 안내

### Design Phase 시작

```bash
# CTO로서 Design Phase 시작
/pdca design salemanager-system
```

### 각 팀원의 첫 번째 작업

**프론트엔드 팀**:
1. 페이지 와이어프레임 작성
2. 컴포넌트 목업업
3. 라우팅 구조 설계

**백엔드 팀**:
1. API 엔드포인트 목록 작성
2. Prisma Schema 작성
3. API 스펙 문서화

**테스트 팀**:
1. 주요 사용자 시나리오 식별
2. 테스트 케이스 목록 작성
3. 테스트 데이터 구조 정의

---

## 질문 및 지원 필요시

각 팀은 Design Phase 진행 중 다음 사항을 CTO에게 보고:

1. 설계상 의사결정이 필요한 사항
2. 타 팀과의 협의가 필요한 사항
3. 기술적 난관 및 우려사항
4. 일정 변경이 필요한 사항

---

**문서 버전**: 1.0
**작성일**: 2026-02-18
**작성자**: CTO Lead
