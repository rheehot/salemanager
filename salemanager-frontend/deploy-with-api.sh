#!/bin/bash
# Railway 백엔드 배포 후 사용하세요
# 사용법: ./deploy-with-api.sh https://your-backend-url.railway.app

if [ -z "$1" ]; then
  echo "사용법: ./deploy-with-api.sh https://your-backend-url.railway.app"
  exit 1
fi

API_URL="$1"

# Vercel에 환경 변수 추가
echo "📝 Vercel에 VITE_API_URL 환경 변수 추가 중..."
npx vercel env add VITE_API_URL production --yes << EOF
$API_URL
