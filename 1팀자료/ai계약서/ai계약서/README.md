# AI 계약서 분석 MVP

계약서(PDF/DOCX)를 업로드하면 AI가 계약 유형·핵심 조건·위험 조항을 분석해 보여주는
Next.js 기반 웹앱입니다.

## ⚠️ 먼저 확인해 주세요 — 모델 이름 관련 안내

요청하신 기본 모델 `gpt-5.6-terra`는 코드에 그대로 설정해 두었지만, **실존 여부를
확인할 수 없는 모델명**입니다 (OpenAI의 공개된 모델 네이밍 규칙과 다릅니다). 실행 전
`.env.local`의 `OPENAI_MODEL`을 실제로 계정에서 사용 가능한 모델(예: 현재 사용 중인
GPT 계열 모델)로 반드시 변경해 주세요. 그렇지 않으면 API 호출 시 "모델을 찾을 수
없다"는 오류가 발생합니다.

## 주요 기능

- PDF 업로드 → OpenAI Responses API에 `input_file`로 전달해 텍스트와 페이지 이미지를
  함께 분석
- DOCX 업로드 → 서버에서 `mammoth`로 텍스트 추출 후 모델에 전달
- Structured Outputs(JSON Schema)로 항상 동일한 구조의 분석 결과 반환
- 계약서 판별, 당사자·기간·금액 등 핵심 조건 추출, 위험 조항 탐지 및 쉬운 설명
- 업로드 → 분석 진행(3단계 진행 표시) → 결과 → 위험 조항 상세 흐름
- API 키가 없어도 "데모 결과 보기"로 화면 전체를 확인 가능
- 분석 이력은 브라우저 `localStorage`에 저장 (서버 DB 없음, MVP 범위)

## 실행 방법

```bash
npm install
cp .env.example .env.local
# .env.local 파일을 열어 OPENAI_API_KEY, OPENAI_MODEL 값을 채워주세요
npm run dev
```

브라우저에서 http://localhost:3000 접속.

API 키를 아직 설정하지 않았다면, 랜딩 페이지 또는 업로드 페이지의
**"예시 계약서로 체험하기"** 버튼으로 전체 화면 흐름(분석 진행 → 결과 → 위험 조항
상세)을 데모 데이터로 확인할 수 있습니다.

## 환경 변수

`.env.example` 참고:

| 변수 | 설명 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API 키. 서버(API Route)에서만 사용되며 클라이언트로 절대 전달되지 않습니다. |
| `OPENAI_MODEL` | 분석에 사용할 모델. 기본값 `gpt-5.6-terra` — 위 경고 참고, 실제 사용 가능한 모델로 교체 필요. |

## 분석 흐름

1. **업로드** (`/upload`): PDF/DOCX 드래그앤드롭 업로드. 파일 형식·크기(최대 20MB)를
   클라이언트에서 1차 검증.
2. **분석 진행** (`/analyzing`): 파일을 `/api/analyze`로 전송하는 동안 "문서를 읽고
   있습니다 → 핵심 조항을 추출하고 있습니다 → 위험 요소를 검토하고 있습니다" 단계별
   진행 UI를 표시.
3. **서버 분석** (`app/api/analyze/route.ts`):
   - PDF: base64로 인코딩해 Responses API에 `input_file`로 전달 (텍스트 + 페이지
     이미지 동시 분석)
   - DOCX: `mammoth`로 텍스트만 추출해 `input_text`로 전달
   - 두 경우 모두 `text.format = { type: 'json_schema', ... }` 옵션으로 Structured
     Outputs를 강제해, 항상 `lib/types.ts`의 스키마와 일치하는 JSON을 받습니다.
4. **결과 저장**: 분석이 끝나면 결과를 `localStorage`에 저장하고 `/result/[id]`로
   이동.
5. **결과 화면** (`/result/[id]`): 계약서 판별·신뢰도, 유형, 당사자, 기간/금액/지급
   조건, 위험 점수 게이지, 핵심 요약, 위험 조항 목록(펼치면 원문 인용·쉬운 설명·
   협상 포인트 표시), 확인이 필요한 누락 항목, 법률 자문이 아니라는 고지 문구를
   표시.
6. **이력** (`/history`): `localStorage`에 저장된 과거 분석 결과 목록. 항목 클릭 시
   해당 결과 화면으로 이동, 삭제 가능.

## 보안 주의사항

- `OPENAI_API_KEY`는 **서버 API Route(`app/api/analyze/route.ts`)에서만** 읽습니다.
  `NEXT_PUBLIC_` 접두사를 붙이지 마세요 — 붙이면 브라우저에 노출됩니다.
- 업로드된 파일은 분석 요청을 만드는 동안만 메모리에서 처리되며, 이 MVP는 파일이나
  분석 결과를 서버 DB에 저장하지 않습니다. (분석 결과만 사용자 브라우저의
  `localStorage`에 남습니다.)
- `.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 않습니다. 배포 시에는 호스팅
  플랫폼의 환경 변수 설정 기능을 사용하세요.
- AI 응답은 참고용 정보이며 법률 자문이 아닙니다 (`disclaimer` 필드 및 시스템
  프롬프트에 명시). 실제 서비스로 확장할 경우 이용약관·개인정보처리방침에도 동일한
  고지를 포함하는 것을 권장합니다.
- 업로드 크기 제한(20MB)은 클라이언트와 서버 양쪽에서 모두 검증합니다.

## 파일 구조

```
contract-analyzer/
├─ app/
│  ├─ page.tsx                 # 랜딩 페이지
│  ├─ upload/page.tsx          # 업로드 화면
│  ├─ analyzing/page.tsx       # 분석 진행 화면 (+ 데모 모드)
│  ├─ result/[id]/page.tsx     # 분석 결과 + 위험 조항 상세
│  ├─ history/page.tsx         # 검사 이력
│  ├─ api/analyze/route.ts     # 서버 API: 파일 수신 → OpenAI 분석 → JSON 반환
│  ├─ layout.tsx / globals.css
├─ components/
│  ├─ SiteHeader.tsx
│  ├─ UploadDropzone.tsx
│  ├─ ProgressSteps.tsx
│  ├─ ScoreGauge.tsx           # 위험 점수 게이지 (시그니처 UI)
│  ├─ RiskBadge.tsx            # 텍스트 라벨 + 아이콘 (색상만으로 구분하지 않음)
│  ├─ RiskCard.tsx             # 위험 조항 아코디언 카드
│  └─ RecentScansPreview.tsx
├─ lib/
│  ├─ types.ts                 # Zod 스키마 + JSON Schema (Structured Outputs)
│  ├─ openai.ts                # Responses API 호출 (PDF / 텍스트)
│  ├─ docx.ts                  # DOCX 텍스트 추출 (mammoth)
│  ├─ mockData.ts              # 데모 결과
│  └─ storage.ts               # localStorage 기반 이력 저장
├─ .env.example
└─ README.md
```

## 알려진 MVP 범위 제한

- 로그인/인증, 결제, 실제 법률 데이터베이스 연동은 포함되어 있지 않습니다.
- 분석 이력은 브라우저별 `localStorage`에만 저장되어 기기 간 동기화되지 않습니다.
- 매우 긴 계약서(수십 페이지 이상)는 모델의 컨텍스트 한도나 응답 시간에 따라
  분석이 지연되거나 실패할 수 있습니다.
