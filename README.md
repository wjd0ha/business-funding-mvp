# Bizfit 사업기회 레이더 (격리 프리뷰)

`feature/opportunity-radar` 브랜치 전용 구현입니다. 운영 사이트와 기존 DB는 변경하지 않습니다.

## 구성

- 6단계 진단, 공고 매칭, 저장, 리드 신청, 관리자 CRM, 2027 준비지도
- 비공개 Google Sheet의 `notices`, `leads`, `saved`, `events`, `notifications` 탭을 저장소로 사용
- 서버만 Google 서비스 계정으로 시트에 접근. 브라우저에는 시트 ID·비밀키·리드 목록을 전달하지 않음
- `POST /api/cron/alerts`는 `CRON_SECRET` 인증 후 신규 공고와 저장 공고 D-7/D-3을 확인. 기본 dry-run은 후보 건수만 세고 시트에 발송 기록을 남기거나 메일을 보내지 않음

## 로컬 실행

```sh
npm ci
npm run dev
```

`.env.example`을 참고해 개발 전용 환경변수를 설정합니다. 시트의 편집 권한은 서비스 계정 이메일에만 추가합니다. 자격증명이 없으면 공고는 예시 데이터로 표시하고 개인정보 수집은 막습니다.

## 프리뷰 연결 순서

1. 별도 생성한 비공개 `Bizfit Radar Preview DB` 시트의 ID를 `RADAR_SHEET_ID`에 설정.
2. Google Cloud 서비스 계정 키를 `GOOGLE_SERVICE_ACCOUNT_JSON`에 설정하고, 그 서비스 계정 이메일에 시트 편집 권한만 부여.
3. 별도 프리뷰 프로젝트의 Vercel Authentication을 활성화하고, 비로그인 요청이 Vercel 로그인으로 이동하는지 확인한다. 공유 링크는 만들지 않는다. 이 프리뷰에만 `RADAR_PREVIEW_SSO=1`을 Preview 환경변수로 설정하면 CRM 추가 비밀번호가 필요 없다. 운영 환경과 보호되지 않은 배포에는 절대 이 값을 설정하지 않는다. 그 외 환경에서 CRM을 사용할 때만 `RADAR_ADMIN_PASSWORD`(16자 이상)와 `RADAR_ADMIN_SECRET`(32자 이상)을 설정한다. `CRON_SECRET`은 별도로 유지한다.
4. `bizinfo-crawler`의 프리뷰 브랜치가 기존 `GOOGLE_CREDENTIALS` secret을 재사용해 새 시트에 수집. 기본 브랜치에는 프리뷰 전용 예약 파일 하나만 추가해 매일 08:00 KST 무렵 프리뷰 브랜치를 실행함. 2026-09-19 수동 검증 작업은 성공했고 CRM에서 공고 45건을 확인함. 기존 운영용 날짜별 시트·주간 수집 코드는 변경하지 않음.
5. 진단→리드→저장→CRM→수신 해지→알림 dry-run을 검증.
6. `bizfit_official@naver.com`의 2단계 인증·POP3/SMTP 사용·애플리케이션 비밀번호를 준비한 뒤 Preview Secret `NAVER_SMTP_APP_PASSWORD`와 접근 가능한 `APP_URL`을 설정한다. 관리자 전용 `POST /api/admin/email-check`로 발송 없이 SMTP 인증을 확인하고, 본인 주소 테스트 메일까지 검증한 뒤에만 `RADAR_EMAIL_ENABLED=1`로 변경한다. 일반 네이버 로그인 비밀번호는 사용하지 않는다. SMTP는 전송 결과가 모호한 실패를 자동 재시도하지 않는다. 프리뷰 배포에서는 Vercel Cron이 실행되지 않으므로 알림 예약은 별도 배포·스케줄 검증 후 활성화.
7. Vercel 별도 프로젝트 또는 격리 프리뷰 URL로 배포. 운영 도메인과 운영 프로젝트 환경변수는 변경하지 않음.

Google Sheets는 초기 MVP에는 적합하지만 다중 사용자 동시 쓰기, 대량 공고, 정교한 쿼리에는 한계가 있습니다. API 할당량·서비스 계정 접근·개인정보 보존 정책을 운영 전에 검증해야 합니다.

공고 조건은 제목·요약 기반 추정이므로 실제 신청 자격은 기관 원문으로 확인해야 합니다. 2027 준비지도 통계는 사용자 제공 분석으로 원자료 검증 전이며, 사업 통폐합과 예산·공고 시점은 계속 바뀔 수 있습니다.
