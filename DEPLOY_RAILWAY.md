# 🚀 Railway 백엔드 배포 가이드

## 방법 1: 빠른 배포 (추천)

아래 링크를 클릭하여 Railway에서 바로 배포하세요:

👉 **[Railway에서 백엔드 배포](https://railway.app/new?template=zsh)**

## 방법 2: GitHub 저장소로 배포

1. **Railway 접속**: https://railway.app/new
2. **"Deploy from GitHub repo"** 클릭
3. **저장소 선택**: `rheehot/salemanager`
4. **Root Directory 설정**: `salemanager-backend`
5. **"Deploy"** 클릭

## 배포 후 설정

### 1. Root Directory 확인
Railway 프로젝트 설정에서:
- Settings → General
- Root Directory: `salemanager-backend`로 설정
- Save Changes

### 2. 환경 변수
Railway가 자동으로 설정합니다:
- `PORT`: Railway 자동 할당
- `NODE_ENV`: `production`

### 3. 데이터베이스
Railway에서 PostgreSQL을 추가하세요:
- 프로젝트에서 "New" → "Database" → "Add PostgreSQL"
- Prisma가 자동으로 연결됩니다

### 4. 재배포
배포 탭에서 "Redeploy" 클릭

## 배포 완료 후

Railway가 백엔드 URL을 제공합니다 (예: `https://salemanager-backend.up.railway.app`)

이 URL로 프론트엔드의 API를 연결하세요.
