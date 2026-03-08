# BIS (Bus Information System)

실시간 버스 위치 시뮬레이션과 노선 조회를 제공하는 웹 서비스입니다.
프론트엔드(React)에서 노선을 선택하면 백엔드(Spring Boot)가 정류장/경로/버스 위치를 제공하고,
지도(Kakao Maps)에 버스 이동 상황을 표시합니다.

<img width="1266" height="731" alt="image" src="https://github.com/user-attachments/assets/5f6aca69-80c8-4a38-9ad9-54aef83620c7" />
<img width="1269" height="735" alt="image" src="https://github.com/user-attachments/assets/51cfb85e-f421-4ca4-a01b-e66add4bd767" />



## 프로젝트 목적

- 노선/정류장 데이터 조회 기능 구현
- 버스 운행 시작 및 주기적 위치 갱신 시뮬레이션 구현
- 지도 기반 시각화로 사용자에게 운행 상태 전달

## 핵심 기능

### 1) 노선 정보 조회
- 노선별 정류장 목록 조회
- 노선별 Vertex(경로 점) 조회
- 선택한 여러 노선을 지도에 표시

### 2) 버스 시뮬레이션
- 노선별 버스 목록 조회
- 특정 버스 선택 후 시뮬레이션 시작
- 백엔드 스케줄러(기본 5초)로 버스 좌표/속도/상태 갱신

### 3) 실시간 위치 반영
- 프론트엔드가 위치 API를 주기적으로 호출
- 지도 마커를 최신 좌표로 업데이트
- 노선 상세 모달에서 정류장 단위 버스 위치 확인
<img width="1144" height="741" alt="image" src="https://github.com/user-attachments/assets/d07a2db9-62ec-41d3-921c-500291e2f5ab" />
<img width="1237" height="745" alt="image" src="https://github.com/user-attachments/assets/55b42671-0286-4e1b-b72a-3930701eea87" />


## 기술 스택

### Frontend
- React 18
- React Router DOM 6
- Kakao Maps JavaScript SDK
- Chart.js

### Backend
- Java 17
- Spring Boot 3.1.x
- Spring Data JPA
- MySQL 8
- Gradle

### BIS DBMS
<img width="1257" height="605" alt="image" src="https://github.com/user-attachments/assets/63d8de35-d326-4b8c-86ea-f3d25ffbb323" />
<img width="1138" height="609" alt="image" src="https://github.com/user-attachments/assets/a5cd50b1-da2d-4a3a-af26-128d053fcd7b" />


## 구조

```text
BIS/
├─ bis-frontend/
│  ├─ src/
│  │  ├─ pages/                 # Welcome, RouteDetails, Simulator
│  │  ├─ components/            # RouteMap, SimulatorForm, Modal 등
│  │  └─ utils/routeApi.js
│  └─ package.json
├─ bis-backend/
│  ├─ src/main/java/com/example/bis/
│  │  ├─ BisApplication.java
│  │  └─ simulator/
│  │     ├─ controller/         # API 엔드포인트
│  │     ├─ service/            # 비즈니스 로직 + 스케줄러
│  │     ├─ repository/         # JPA 접근
│  │     ├─ model/              # Entity
│  │     └─ dto/                # 응답 DTO
│  └─ build.gradle
└─ README.md
```

## 아키텍처 요약

```text
React UI
  -> REST API 호출 (/api/route, /api/simulator)
Spring Boot
  -> 서비스 로직 (조회/시뮬레이션)
  -> 스케줄러로 위치 갱신
JPA Repository
  -> MySQL CRUD/Query
```

## API

### Route
- `GET /api/route/busstops/{routeId}`
- `GET /api/route/vertices/{routeId}`
- `GET /api/route/{routeId}/buses/stops`

### Simulator
- `GET /api/simulator/buses/{routeId}`
- `POST /api/simulator/start`
- `GET /api/simulator/locations/{routeId}`

## 실행 방법

### 1. 요구사항
- Java 17+
- Node.js 18+
- MySQL 8+

### 2. 환경 변수 설정

#### Frontend (`bis-frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_KAKAO_API_KEY=YOUR_KAKAO_JS_KEY
```

#### Backend (`bis-backend/src/main/resources/application.properties` 생성)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_DB?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

simulator.update.interval=5000
```

### 3. 실행

```bash
# 터미널 1: backend
cd bis-backend
./gradlew bootRun
```

```bash
# 터미널 2: frontend
cd bis-frontend
npm install
npm start
```

- 브라우저: `http://localhost:3000`
- 백엔드 기본 주소: `http://localhost:8080`

## 테스트

```bash
# backend test
cd bis-backend
./gradlew test
```

```bash
# frontend test
cd bis-frontend
npm test
```

## 트러블슈팅

- 프론트에서 API 호출 실패 시
  - `REACT_APP_BACKEND_URL` 값 확인
  - 백엔드 실행 여부 확인 (`8080` 포트)

- 지도 미표시 시
  - `REACT_APP_KAKAO_API_KEY` 확인
  - 브라우저 콘솔에서 Kakao SDK 로드 에러 확인

- DB 연결 실패 시
  - `application.properties`의 URL/계정/비밀번호 확인
  - MySQL 스키마 및 권한 확인

## 참고 사항

- 현재 프론트의 `fetchStationInfo`가 호출하는 `/api/station/{stop_id}/info` API는 백엔드에서 구현 여부 확인이 필요합니다.
- `routeMapping`(노선번호 → routeId)은 프론트에 하드코딩되어 있어 추후 API 기반으로 분리하는 것이 좋습니다.
