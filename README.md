# 짠순이의 반란 💸
> 2030을 위한 무료 재무설계 비서 — 은행 VIP만 받던 서비스, 이제 누구나

## 📁 파일 구조
```
jjansuni-rebellion/
├── index.html          ← 메인 (진단 + 시뮬레이터 + AI채팅 all-in-one)
├── css/
│   └── style.css       ← 전체 스타일
├── js/
│   ├── engine.js       ← 재무 진단 룰 엔진
│   ├── simulator.js    ← 복리 계산 + Chart.js
│   └── storage.js      ← LocalStorage 관리
└── README.md
```

## 🚀 GitHub Pages 배포 (10분)

### 1. 저장소 생성
```bash
git init
git add .
git commit -m "feat: 짠순이의 반란 v1.0"
```

### 2. GitHub에 올리기
```bash
# GitHub에서 새 저장소 만든 후
git remote add origin https://github.com/[내ID]/jjansuni-rebellion.git
git push -u origin main
```

### 3. GitHub Pages 설정
1. 저장소 → **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)` → **Save**
4. 1~2분 후 `https://[내ID].github.io/jjansuni-rebellion` 접속 가능

## 🤖 AI 기능 (완전 무료)
- AI 채팅은 **사용자가 본인 Anthropic API 키를 입력**하는 방식
- 키는 세션 스토리지에만 저장 → 탭 닫으면 자동 삭제, 서버로 전송 안 됨
- API 키 발급: https://console.anthropic.com (신규 가입 시 무료 크레딧 제공)
- **내 서버 비용 = $0**

## ✨ 주요 기능
- ✅ 5단계 재무 진단 (나이/고용/소득/목표/성향)
- ✅ 리스크 성향별 포트폴리오 추천 (공격형/성장형/균형형/안전형)
- ✅ 맞춤 금융상품 추천 (ISA, 연금저축, 청년도약계좌, ETF 등)
- ✅ 월 배분 플랜 자동 계산
- ✅ 복리 시뮬레이터 + 시나리오 비교
- ✅ AI 재무 비서 채팅 (Claude Sonnet 4)
- ✅ 진단 결과 LocalStorage 저장

## 🔧 커스터마이징
- `js/engine.js` → 상품 추천 로직, 포트폴리오 비율 수정
- `js/simulator.js` → 수익률 가정값 수정
- `css/style.css` → 색상 테마 (`--accent`, `--accent2` 등)
