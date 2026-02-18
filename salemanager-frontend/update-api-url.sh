#!/bin/bash
# Railway 배포 URL을 받은 후 실행하세요
# 사용법: ./update-api-url.sh https://your-backend-url.railway.app

if [ -z "$1" ]; then
  echo "사용법: ./update-api-url.sh https://your-backend-url.railway.app"
  exit 1
fi

API_URL="$1"

# 프론트엔드 서비스 파일의 API URL 변경
sed -i.bak "s|http://localhost:3000|$API_URL|g" src/services/api.ts

# .env 파일에 API URL 추가
echo "VITE_API_URL=$API_URL" >> .env.local

echo "✅ API URL이 $API_URL로 변경되었습니다."
echo "⚠️  변경사항을 Vercel에 다시 배포하려면: npx vercel --prod --scope rheehots-projects"
