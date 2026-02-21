# 돌잔치 모바일 초대장 (Vite + React + TypeScript + Tailwind CSS)

심플하고 감성적인 모바일 퍼스트 돌잔치 초대장 단일 페이지입니다.

## 1) 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 2) 빌드 (정적 배포용)

```bash
npm run build
```

빌드 결과물은 `/dist` 폴더에 생성됩니다.

로컬 확인:

```bash
npm run preview
```

## 3) 내용 수정 위치

초대장 문구/날짜/장소/연락처/지도 링크는 `src/config.ts`에서 수정합니다.

- `babyName`
- `message`
- `eventDateTime`
- `venueName`
- `address`
- `kakaoMapUrl`
- `contacts`

## 4) 아기 사진 교체

`/public/baby.jpg` 파일을 원하는 사진으로 교체하세요.

- 파일명이 정확히 `baby.jpg`여야 합니다.
- 파일이 없으면 화면에 안내 플레이스홀더가 표시됩니다.

## 5) 소형 VM + Nginx 배포 예시

### (A) 앱 빌드 후 서버로 복사

```bash
npm install
npm run build
```

`dist/` 폴더를 서버의 예: `/var/www/dol-invite/dist` 경로로 업로드합니다.

### (B) Nginx 서버 블록 예시

`/etc/nginx/sites-available/dol-invite`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/dol-invite/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

심볼릭 링크 연결:

```bash
sudo ln -s /etc/nginx/sites-available/dol-invite /etc/nginx/sites-enabled/dol-invite
```

### (C) Nginx 설정 테스트 및 재시작

```bash
sudo nginx -t
sudo systemctl reload nginx
```

(필요 시)

```bash
sudo systemctl restart nginx
```
