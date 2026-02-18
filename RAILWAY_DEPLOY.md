# 🚀 Railway 백엔드 배포 가이드

## 빠른 배포 링크

아래 링크를 클릭하여 Railway에서 바로 배포하세요:

👉 **[Railway에서 SaleManager 배포](https://railway.app/new?repo=https://github.com/rheehot/salemanager&ref=main)**

## 배포 설정 단계

1. **Railway 프로젝트 생성**
   - 위 링크 클릭
   - Railway 계정으로 로그인 (또는 GitHub로 로그인)

2. **저장소 설정 확인**
   - Repository: `rheehot/salemanager` ✓
   - Branch: `main` ✓
   - Root Directory: `salemanager-backend`로 설정 ⚠️

3. **Root Directory 설정**
   - Railway 프로젝트에서 "Settings" 탭 클릭
   - "General" > "Root Directory"를 `salemanager-backend`로 변경
   - "Save Changes" 클릭

4. **환경 변수 설정**
   - "Variables" 탭 클릭
   - 다음 환경 변수들이 자동으로 설정됩니다:
     - `PORT`: Railway가 자동 할당
     - `DATABASE_URL`: Railway가 자동 생성 (Postgres)

5. **재배포**
   - "Deployments" 탭으로 이동
   - "Latest" 옆의 "Redeploy" 클릭

6. **배포 완료 확인**
   - 배포가 완료되면 Railway가 URL을 제공합니다
   - 예: `https://salemanager-backend.up.railway.app`

7. **프론트엔드 API URL 설정**
   ```bash
   cd salemanager-frontend
   ./deploy-with-api.sh https://your-backend-url.railway.app
   ```

## 🔍 Health Check

배포 후 다음 URL로 서비스 상태 확인:
- `https://your-backend-url.railway.app/health`

## 📊 배포 후 접속 정보

| 서비스 | URL |
|--------|-----|
| 프론트엔드 | https://salemanager-frontend.vercel.app |
| 백엔드 | Railway에서 제공하는 URL |
