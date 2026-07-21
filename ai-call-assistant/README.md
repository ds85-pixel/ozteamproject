# AI 전문직 전화 비서 서비스

세무사·변호사 등 전문직이 부재 중이거나 상담 중일 때, **AI 음성 비서가 대신 응대하여 고객의 용건을 수집·요약해 대시보드로 전달하는 B2B SaaS** 프로젝트입니다.

전화 응대를 AI가 전처리(Pre-processing)함으로써, 전문직 종사자가 상담 준비 시간을 80% 이상 단축하고 핵심 업무에만 집중할 수 있는 환경을 제공합니다.

## 프로젝트 구조

```
ai-call-assistant/
├── docs/
│   ├── PRD_v1.0.md           # 메인 서비스 기획안 (제품 요구사항 정의서)
│   ├── ARCHITECTURE.md       # 시스템/전화망 연동 아키텍처 (기술용)
│   └── USER_FLOW.md          # 통화 응대 및 대시보드 유저 플로우
├── README.md                 # 프로젝트 소개 및 실행 가이드
└── src/                      # 소스코드 저장소
```

## 문서

| 문서 | 설명 |
|------|------|
| [PRD v1.0](docs/PRD_v1.0.md) | AI 전문직 전화 비서 서비스 기획안 |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | 전화 응대 엔진 & 세무사 대시보드 아키텍처 |
| [USER_FLOW](docs/USER_FLOW.md) | 통화 응대 및 대시보드 유저 플로우 |

## MVP 범위

- VoIP 착신전환 수신 (Twilio / WebRTC)
- AI 음성 응대 (OpenAI Realtime API / Whisper + GPT-4o + TTS)
- 세무 전문 용어 추출 및 용건 요약 파이프라인
- 세무사 웹 대시보드 (용건 리스트, 상세, 콜백 상태)
- 카카오 알림톡 / SMS 즉시 알림

## 기술 스택

- **Telephony / Voice:** Twilio, OpenAI Realtime API / Clova Speech
- **Backend:** Node.js (NestJS) 또는 Python (FastAPI)
- **Frontend:** React / Next.js, Tailwind CSS
- **Database:** PostgreSQL / Supabase
- **Infrastructure:** AWS / Vercel

## 시작하기

> 소스코드는 `src/` 디렉터리에 추가됩니다. 실행 방법은 구현 단계에 따라 업데이트 예정입니다.

```bash
cd ai-call-assistant
# npm install
# npm run dev
```

## 라이선스

MIT
