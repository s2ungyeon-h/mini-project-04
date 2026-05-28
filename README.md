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

## 👥 팀원 구성

| 이름 | 역할 |
|------|------|
| 박유경 | 조장 · PM/기획 · 스타일링/QA · 도서 삭제 기능 |
| 김완수 | PPT 작성 · AI 이미지 생성 · DB 수정 및 저장 |
| 박선호 | 문서 작성 · UI 작성 · 도서 목록 조회 기능 |
| 박형우 | 검토 담당자 · AI 한줄평 작성 · DB 수정 및 저장 |
| 신가람 | 검토 담당자 · 스타일링/QA · 도서 검색 기능 |
| 심유리 | UI 작성 · 메인 페이지 작성 · 통계 구현 |
| 윤빈 | PPT 작성 · 도서 등록 기능 · Router Dom 적용 |
| 최지흠 | PPT 작성 · Update/Delete 기능 |
| **한승연** | **서기 · 게시글 조회 기능 · 댓글 기능** |

---

## 📋 기능 소개

| 기능 | 설명 |
|------|------|
| 새 도서 등록 | 제목·저자 입력, 장르·태그 복수 선택, 도서 내용 작성 |
| 도서 목록 | 도서 검색 및 도서 추천 |
| 사용자 통계 | 등록된 도서 장르·태그별 통계 |
| 휴지통 | 삭제된 도서 확인 |
| 도서 수정 | 도서 등록 시 작성한 내용 수정 |
| 도서 삭제 | 등록된 도서 삭제 |
| 댓글 | 도서에 대한 감상평 작성 |
| AI 한줄평 생성 | 도서 제목·내용에 따라 한줄평 자동 생성 |
| AI 표지 생성 | 도서 내용에 맞는 표지를 AI가 자동 생성 |

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

## 🚀 핵심 기능 구현

### AI 표지 자동 생성

도서 제목과 내용을 프롬프트로 구성해 OpenAI API에 요청하고, 응답받은 `b64_json`을 Data URL로 변환 후 json-server에 PATCH로 저장합니다.

```
① 도서 내용 기반 프롬프트 구성
② OpenAI API POST 요청
③ b64_json → Data URL 변환
④ json-server PATCH (coverImageUrl 업데이트)
⑤ 화면 상태 즉시 반영
```

### CRUD 도서 관리

| 기능 | 구현 내용 |
|------|-----------|
| 목록 조회 | 도서 제목·등록일 카드 형태 표시 |
| 상세 조회 | 표지·작성일·수정일·본문 확인 |
| 등록 | 제목·내용 입력, 공백 등 유효성 검사 |
| 수정 | 기존 정보 자동 불러오기 후 저장 |
| 삭제 | 확인 알림 후 제거, 목록 즉시 반영 |

---

## 💡 배운 점

- fetch의 GET/POST/PATCH/DELETE 패턴을 실전에서 직접 구현하며 **REST API 통신 구조**를 체득
- OpenAI API 연동 과정에서 **비동기 처리(async/await)** 와 **Base64 → Data URL 변환** 흐름 이해
- 백엔드 없이 json-server로 API 환경을 구성하며 **프론트-백 분리 구조**의 필요성 체감

---

## 🔮 향후 개선 방향

- json-server → **Spring Boot** 로 교체해 실제 백엔드 연동 (Backend 미니프로젝트 연계)
- 표지 **재생성 및 미리보기** 기능 추가
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
