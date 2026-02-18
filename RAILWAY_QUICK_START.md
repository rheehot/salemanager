# 🚀 Railway 백엔드 배포 - 3단계 완료

## 👉 1단계: 클릭하여 Railway 시작

아래 링크를 클릭하세요:

**[https://railway.app/new?repo=https://github.com/rheehot/salemanager](https://railway.app/new?repo=https://github.com/rheehot/salemanager)**

## 👉 2단계: Root Directory 설정

Railway 프로젝트가 열리면:
1. **Settings** 탭 클릭
2. **General** 섹션 찾기
3. **Root Directory**를 `salemanager-backend`로 변경
4. **Save Changes** 클릭

## 👉 3단계: PostgreSQL 데이터베이스 추가

1. 프로젝트 상단 **+ New** 버튼 클릭
2. **Database** 선택
3. **Add PostgreSQL** 클릭

## ✅ 완료!

자동으로 배포가 시작됩니다. 배포가 완료되면 Railway가 URL을 제공합니다.

예: `https://salemanager-backend.up.railway.app`

## 🧪 배포 확인

```bash
curl https://your-app.up.railway.app/health
```

응답: `{"status":"ok","timestamp":"..."}`

## 📝 배포 URL 알려주시면

프론트엔드와 연결해 드리겠습니다!
