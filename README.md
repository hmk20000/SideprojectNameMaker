# 💡 사이드 프로젝트 아이디어 생성기

AI가 랜덤으로 타겟층, 문제점, 그리고 창의적인 사이드 프로젝트 아이디어를 생성해주는 웹 애플리케이션입니다.

## 🚀 기술 스택

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **AI**: Google AI Studio (Gemini 1.5 Flash)

## 📋 기능

- ✨ AI 기반 랜덤 타겟층 생성
- 🎯 타겟층별 문제점 도출
- 💡 문제 해결을 위한 사이드 프로젝트 아이디어 제안
- 🎨 깔끔하고 반응형인 UI/UX
- 📱 모바일 친화적 디자인

## 🛠️ 설치 및 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고, Google AI Studio API 키를 입력하세요.

```bash
cp .env.example .env
```

`.env` 파일:
```
GOOGLE_AI_API_KEY=your_actual_api_key_here
```

### 3. Google AI Studio API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. 'Get API Key' 버튼 클릭
3. API 키 생성 후 `.env` 파일에 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 애플리케이션을 확인하세요.

### 5. 빌드

```bash
npm run build
```

## 🚢 Vercel 배포

### 1. Vercel CLI 설치 (선택사항)

```bash
npm install -g vercel
```

### 2. Vercel 배포

```bash
vercel
```

또는 GitHub와 연동하여 자동 배포:

1. GitHub 저장소에 코드 푸시
2. [Vercel](https://vercel.com)에 접속하여 프로젝트 import
3. 환경 변수 설정 (`GOOGLE_AI_API_KEY`)
4. 배포 완료!

### 3. 환경 변수 설정 (Vercel Dashboard)

Vercel 프로젝트 설정에서 다음 환경 변수를 추가하세요:

- `GOOGLE_AI_API_KEY`: Google AI Studio API 키

## 📁 프로젝트 구조

```
MakeSideprojectName/
├── api/
│   └── generate.js          # Vercel Serverless Function
├── src/
│   ├── components/
│   │   └── IdeaGenerator.jsx # 아이디어 생성 컴포넌트
│   ├── App.jsx              # 메인 앱 컴포넌트
│   ├── main.jsx             # 엔트리 포인트
│   └── index.css            # Tailwind CSS
├── .env.example             # 환경 변수 예시
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json              # Vercel 설정
└── vite.config.js
```

## 🎯 사용 방법

1. "✨ 아이디어 생성하기" 버튼 클릭
2. AI가 타겟층, 문제점, 프로젝트 아이디어를 생성
3. 카드 형태로 표시된 결과 확인
4. 마음에 드는 아이디어가 나올 때까지 반복!

## ⚠️ 주의사항

- Google AI Studio API 키가 필요합니다
- API 키는 절대 공개 저장소에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있습니다

## 📝 라이선스

MIT License
