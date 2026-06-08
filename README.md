# 📚 4차 미니 프로젝트

> 텍스트 중심 도서 관리의 한계를 넘어, AI가 도서 내용을 분석해 어울리는 표지를 자동으로 생성하는 창작 지원 플랫폼

---

## 📁 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 수행 기간 | 2026.05.22 ~ 2026.05.27 |
| 팀 구성 | 👥 팀 프로젝트 / 9인 |
| 개발 환경 | React 19, Vite, json-server |
| 형상 관리 | GitHub |

---

## 🔍 문제 배경

- 기존 텍스트 중심 도서 관리는 **직관성이 떨어짐**
- 표지 이미지를 수동으로 찾아 등록하는 것은 **번거롭고 창작 흐름을 방해**
- 책의 장르·분위기·핵심 메시지를 시각적으로 전달하는 표지는 **CTR, 구매 전환율, SNS 공유율**에 직접적인 영향을 줌

## 🎯 해결 목표

- 도서 제목과 내용을 기반으로 **AI가 어울리는 표지를 자동 생성**
- 사용자가 직접 이미지를 찾지 않아도 **등록과 동시에 시각적 완성도**를 확보
- React + fetch + CRUD 기반으로 **실전 수준의 프론트엔드 개발 경험** 확보

---

## 📸 Screenshot

| 도서 메인페이지 | 도서 등록페이지 |
|----------------|----------------|
| <img width="640" height="349" alt="Image" src="https://github.com/user-attachments/assets/4f1f84a4-3ab2-4571-9b84-30f1f856b754" /> | <img width="640" height="348" alt="Image" src="https://github.com/user-attachments/assets/6b9b5995-6993-4770-9e4b-d5f41694b37f" /> |

| 도서 목록페이지 | 도서 수정페이지 |
|----------------|----------------|
| <img width="640" height="349" alt="Image" src="https://github.com/user-attachments/assets/e2cf5065-a57a-42c5-b99c-ef65f72ca5b4" /> | <img width="640" height="334" alt="Image" src="https://github.com/user-attachments/assets/14ce77f1-c4f3-449c-b7a0-098b07e529d4" /> |

| 도서 삭제페이지 | 도서 통계페이지 |
|----------------|----------------|
| <img width="640" height="362" alt="Image" src="https://github.com/user-attachments/assets/4d0b9076-9a6c-4bef-93b8-8f8d78c8cfb6" /> | <img width="640" height="313" alt="Image" src="https://github.com/user-attachments/assets/1501908b-4357-4df4-b23e-c50df0bcdf4d" /> |

| 휴지통 |
|--------|
| <img width="640" height="338" alt="Image" src="https://github.com/user-attachments/assets/3d6c192d-c34f-4fb0-821a-5b675119be30" /> |

---

## ⚙️ 기술 스택 & 선택 이유

| 기술 | 선택 이유 |
|------|-----------|
| **React 19 + Vite** | 컴포넌트 기반 UI 구성과 빠른 HMR 개발 환경 |
| **fetch** | 별도 라이브러리 없이 REST API 통신 구조 학습 |
| **json-server** | 백엔드 없이 GET/POST/PATCH/DELETE REST API 환경 구현 |
| **OpenAI GPT Image 2** | 다국어 텍스트 이해 + 추상적 표현 가능, 도서 표지에 적합 |

---

## 🏗 시스템 아키텍처

<img width="900" height="659" alt="architecture" src="https://github.com/user-attachments/assets/5b2356cb-d9b1-47b6-a69e-09c3bb45070a" />

---

## 🚀 핵심 기능 구현

### CRUD 도서 관리

| 기능 | 구현 내용 |
|------|-----------|
| 도서 목록 조회 | 도서 제목·등록일 카드 형태 표시 |
| 도서 상세 조회 | 표지 · 작성일 · 수정일 · 본문 표시 및 상태 즉시 반영 |
| 댓글 CRUD | json-server REST API 연동으로 댓글 조회 · 등록 · 수정 · 삭제 구현 |

---

## 💡 배운 점

- 원격의 최신 코드를 `[로컬 main] → [내 브랜치]` 순으로 먼저 가져와서 충돌을 미리 해결한 뒤 PR을 보내야 함을 체득
- 실제 백엔드 없이 GET / POST / PATCH / DELETE 요청 흐름을 직접 구현하면서 **REST API의 기본 구조**를 체득
- JSON Server 기반이라 고품질 AI 이미지의 Base64 데이터 저장에 한계가 있었고, 실제 백엔드와 S3 같은 스토리지를 활용했다면 더 안정적으로 이미지 기능을 구현할 수 있었을 것

---

## 🔮 향후 개선 방향

- json-server → **Spring Boot** 로 교체해 실제 백엔드 연동 (Backend 미니프로젝트 연계)
- 댓글 비밀번호가 db.json에 평문으로 저장되는 문제 → 백엔드 연동 시 서버 측 암호화 처리 적용
- 사용자 인증 기능 도입으로 개인화 서비스 확장

---

## 🛠 실행 방법

```bash
# 1. json-server 설치
npm install json-server@0.17.4

# 2. json-server 실행
npx json-server@0.17.4 --watch db.json
# → http://localhost:3000/books

# 3. React 앱 실행
cd frontend
npm install
npm install react-router-dom
npm run dev
```

---

## 📁 프로젝트 구조

```
📦 project-root
├── db.json          # json-server 데이터
├── frontend/
│   └── src/
│       ├── components/
│       └── ...
└── README.md
```
