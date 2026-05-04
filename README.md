# 한국의 목소리 — Voices of Korea

한국 태생의 위인들이 남긴 명언을 GPT API로 생성하여 카드 UI로 제공하는 웹 앱입니다.

---

## 주요 기능

- **GPT-4o mini 기반 명언 생성** — 인물별 실제 명언 또는 삶을 대표하는 말을 AI가 생성
- **한국어 + 영문 번역** — 명언 하단에 영문 번역 자동 제공
- **명언 맥락 설명** — 명언의 배경과 의미를 2~3문장으로 설명
- **3D 카드 플립 애니메이션** — 앞면(인물 정보) ↔ 뒷면(명언) 전환
- **분위기별 배경 이미지** — 인물의 특성(열정/예술/지식/에너지/성장)에 맞는 배경 자동 적용
- **카테고리 필터** — 전체 / 역사 / 예술·문화 / 스포츠 / 현대
- **뷰 모드 전환** — 📱 모바일 뷰 / 🖥 데스크톱 뷰 토글 버튼

---

## 뷰 모드

### 데스크톱 뷰 (그리드)
- M3 Adaptive Layout 적용
- Compact `< 600px` → 1열
- Medium `600–840px` → 2열
- Expanded `840–1200px` → 3열
- Wide `> 1200px` → 4열
- 카드 내 "명언 보기" 버튼으로 플립

### 모바일 뷰 (스와이프 덱)
- 카드 1장 전체 화면 표시
- **좌우 스와이프** 또는 화살표 버튼으로 인물 전환
- **카드 탭** 한 번으로 명언 플립 / 다시 탭하면 앞면 복귀
- 하단 **dot 인디케이터** + N/총 카운터
- 한 번 불러온 명언은 캐시 → 재요청 없음

---

## 등장 인물 (10명)

| 이름 | 분야 | 배경 분위기 |
|------|------|------|
| 세종대왕 | 역사 / 학문 | 하늘색 — 지식·평화 |
| 이순신 | 역사 / 무인 | 붉은색 — 열정·의지 |
| 유관순 | 역사 / 독립운동 | 붉은색 — 저항·의지 |
| 안중근 | 역사 / 독립운동 | 붉은색 — 결의·열정 |
| 김환기 | 예술 / 미술 | 청록 수채화 — 창의·예술 |
| 박경리 | 예술 / 문학 | 청록 수채화 — 문학·감성 |
| 박지성 | 스포츠 / 축구 | 밝은 파랑 — 에너지·도전 |
| BTS | 현대 / K-pop | 연두·초록 — 성장·영감 |
| 봉준호 | 현대 / 영화 | 청록 수채화 — 창의·혁신 |
| 손흥민 | 스포츠 / 축구 | 밝은 파랑 — 에너지·도전 |

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 18 + Vite 4 |
| AI API | OpenAI GPT-4o mini |
| 디자인 시스템 | Material Design 3 (Adaptive Layout) |
| 디자인 테마 | Xela Robotics 스타일 (네이비 + Cyan) |
| 스타일 | 순수 CSS (외부 UI 라이브러리 없음) |

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 OpenAI API 키를 입력합니다.

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

> Vite는 `VITE_` 접두사가 붙은 환경 변수만 브라우저에 노출합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 **http://localhost:8871** 을 열어 확인합니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

---

## 프로젝트 구조

```
ws_card_react_vite/
├── public/
│   └── img/                    # 배경 이미지 5종 (Unsplash)
├── src/
│   ├── data/
│   │   └── people.js           # 인물 데이터 + 배경 이미지 매핑
│   ├── services/
│   │   └── openai.js           # GPT API 호출 로직
│   ├── components/
│   │   ├── QuoteCard.jsx       # 데스크톱용 플립 카드
│   │   ├── QuoteCard.css
│   │   ├── SwipeCardDeck.jsx   # 모바일용 스와이프 덱
│   │   └── SwipeCardDeck.css
│   ├── App.jsx                 # 레이아웃 / 카테고리 필터 / 뷰 모드 토글
│   ├── App.css
│   ├── index.css               # M3 디자인 토큰 + 전역 스타일
│   └── main.jsx
├── .env.example
├── vite.config.js
└── package.json
```

---

## 배경 이미지 출처

모든 이미지는 [Unsplash](https://unsplash.com) 라이선스 하에 사용됩니다.

| 파일 | 작가 | 분위기 |
|------|------|------|
| bg-img-01 | Bekky Bekks | 밝은 파랑 — 에너지·도전 |
| bg-img-02 | Chinigraphy | 청록 수채화 — 예술·창의 |
| bg-img-03 | Francesco Ungaro | 하늘색 — 지식·평화 |
| bg-img-04 | Kseniya Lapteva | 연두·초록 — 성장·혁신 |
| bg-img-05 | Lauris Rozentals | 붉은색 — 열정·의지 |
