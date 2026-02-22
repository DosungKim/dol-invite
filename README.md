# 돌잔치 모바일 초대장 (Vite + React + TypeScript + Tailwind CSS)

심플하고 감성적인 모바일 퍼스트 돌잔치 초대장 단일 페이지입니다.

## 주요 구성

- Hero 카드 (아기 사진 + 이름 + 메시지 + 일시)
- Invitation Info 카드 (장소/주소 + 카카오맵 열기 + 주소 복사)
- Location 카드 (정적 지도 플레이스홀더)
- Gallery 6컷 + 클릭 확대 모달
- 방명록 (이름 + 메시지, 화면 목록 표시 + 콘솔 로그)
- Footer 연락처 + 링크 공유 버튼(Web Share/복사 fallback)

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

초대장 문구/날짜/장소/연락처/지도 링크/갤러리 이미지는 `src/config.ts`에서 수정합니다.

- `babyName`
- `message`
- `eventDateTime`
- `venueName`
- `address`
- `kakaoMapUrl`
- `contacts`
- `galleryImages`

## 4) 이미지 교체

- 아기 대표 사진: `/public/baby.jpg`
- 갤러리 이미지: `/public/gallery-1.svg` ... `/public/gallery-6.svg` (원하는 파일로 교체 가능)

`baby.jpg`가 없으면 Hero에 안내 플레이스홀더가 표시됩니다.

## 5) PR 충돌(conflict) 빠른 점검

```bash
npm run check:conflicts
```

- `README.md`, `src/` 내 `<<<<<<<`, `=======`, `>>>>>>>` 마커를 바로 확인합니다.
- 개인 정보는 `src/config.ts`에서만 수정하는 것을 권장합니다.

## 6) 소형 VM + Nginx 배포 예시

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

## 7) 공유 방명록 API 연동

기본 프론트엔드는 정적 앱이므로, 방문자끼리 방명록을 공유하려면 별도 API가 필요합니다.

`.env` 파일에 아래 값을 설정하세요.

```bash
VITE_GUESTBOOK_API_BASE_URL=https://your-api.example.com
VITE_GUESTBOOK_ADMIN_ID=admin-001
```

API 형식:
- `GET /guestbook` -> `[{ id?: string, name: string, message: string, createdAt: string }]`
- `POST /guestbook` body: `{ name: string, message: string, viewerId: string }` (`x-viewer-id` 헤더도 함께 전달) -> 생성된 엔트리(`id` 포함 권장) 반환
- `PATCH /guestbook/:id` body: `{ message: string }` (`x-viewer-id` 헤더 전달)
- `DELETE /guestbook/:id` (`x-viewer-id` 헤더 전달)

프론트는 작성 성공 시 응답의 `id`를 브라우저 로컬에 저장해, 해당 방문자가 작성한 글에 수정/삭제 버튼을 노출합니다.
또한 현재 입력한 `viewerId`가 `VITE_GUESTBOOK_ADMIN_ID`와 일치하면 모든 글에 수정/삭제 버튼을 노출합니다.

> 보안 주의: 버튼 노출 제어는 UX 편의용입니다. 실제 권한 검증(작성자/운영자)은 백엔드에서 반드시 검증해야 합니다.
