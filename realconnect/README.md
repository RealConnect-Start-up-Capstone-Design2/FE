# 🏢 RealConnect - 부동산 통합 관리 플랫폼

> **Turborepo + React 기반의 확장 가능한 부동산 관리 시스템**  
> 웹과 모바일을 지원하는 모노레포 아키텍처로 구축된 현대적인 프론트엔드 애플리케이션

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF.svg)](https://vitejs.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-latest-red.svg)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-10.15.0-orange.svg)](https://pnpm.io/)

## 📋 프로젝트 개요

RealConnect는 부동산 매물 관리, 고객 문의, 계약 관리를 통합한 올인원 플랫폼입니다. Entity-Model-ViewModel 아키텍처를 기반으로 비즈니스 로직과 UI를 분리하여 웹과 React Native 앱에서 코드를 재사용할 수 있도록 설계되었습니다.

### 🎯 주요 기능

- **매물 관리**: 아파트 매물 등록, 수정, 상태 관리
- **문의 관리**: 고객 문의 접수, 처리, 상태 추적
- **계약 관리**: 계약서 작성, 관리, 파일 업로드
- **공유 문의**: 지역별 문의 공유 및 협업
- **대시보드**: 진행 중인 업무, 알림, 통계 현황

## 🏗️ 아키텍처

### 📦 모노레포 구조

```
realconnect/
├── apps/                    # 애플리케이션
│   ├── web/                # React 웹 앱
│   └── mobile/             # React Native 앱 (예정)
└── packages/               # 공유 패키지
    ├── shared-entity/      # 도메인 엔티티
    ├── shared-model/       # UI 모델
    ├── shared-ui/          # 공통 컴포넌트
    ├── shared-utils/       # 유틸리티 함수
    ├── web-viewmodel/      # 웹 뷰모델
    └── mobile-viewmodel/   # 모바일 뷰모델 (예정)
```

### 🔄 데이터 플로우

```
Backend API → Entity → Model → ViewModel → UI Components
             ↓         ↓        ↓
           순수 데이터  구조화   플랫폼별 최적화
```

#### 레이어별 역할

- **Entity**: 백엔드 API 응답 데이터의 순수한 타입 정의
- **Model**: Entity를 UI에서 사용하기 편한 구조로 변환 (비즈니스 로직 제외)
- **Utils**: 재사용 가능한 비즈니스 로직과 포맷팅 함수
- **ViewModel**: Model + Utils를 조합하여 플랫폼별 UI에 최적화된 데이터 생성

## 🚀 빠른 시작

### 📋 필수 요구사항

- **Node.js**: 18.0.0 이상
- **pnpm**: 10.15.0 이상

### 🛠️ 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-org/realconnect.git
cd realconnect

# 의존성 설치
pnpm install

# 개발 서버 실행 (모든 앱)
pnpm dev

# 웹 앱만 실행
pnpm --filter web dev

# 빌드
pnpm build
```

### 🌐 환경 변수 설정

```bash
# apps/web/.env.local
VITE_API_URL=http://localhost:8080/api
```

## 💻 개발 가이드

### 📁 컴포넌트 구조

```
src/components/
├── common/          # 공통 컴포넌트
│   ├── Layout.jsx
│   ├── form/
│   ├── table/
│   └── sidebar/
└── domain/          # 도메인별 컴포넌트
    ├── contracts/
    ├── inquiries/
    └── properties/
```

### 🎨 스타일링 컨벤션

#### CSS Module 사용

```jsx
// ✅ 올바른 방식
import styles from "./Component.module.css";

function Component() {
  return <div className={styles.container}>...</div>;
}
```

#### 네이밍 컨벤션

- **파일명**: `camelCase.module.css`
- **클래스명**: `kebab-case` 또는 `camelCase`
- **컴포넌트**: `PascalCase`

### 🔧 상태 관리

#### React Query (서버 상태)

```jsx
import { useQuery } from "@tanstack/react-query";

function PropertyList() {
  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });
}
```

#### Zustand (클라이언트 상태)

```jsx
import useAuthStore from "@/store/authStore";

function Header() {
  const { user, logout } = useAuthStore();
}
```

### 📦 패키지 간 의존성

#### 올바른 import 경로

```jsx
// Entity 사용
import { PropertyEntity } from "@realconnect/shared-entity";

// Model 변환
import { toPropertyTableRow } from "@realconnect/shared-model";

// Utils 활용
import { formatPrice } from "@realconnect/shared-utils";

// ViewModel 적용
import { toPropertyViewModel } from "@realconnect/web-viewmodel";
```

### 🔄 새 기능 개발 플로우

1. **Entity 정의** (필요시)

   ```typescript
   // packages/shared-entity/NewEntity.ts
   export interface NewEntity {
     id: number;
     name: string;
   }
   ```

2. **Model 생성**

   ```typescript
   // packages/shared-model/NewModel.ts
   export function toNewTableRow(entity: NewEntity) {
     return {
       id: entity.id,
       displayName: entity.name,
     };
   }
   ```

3. **Utils 추가** (비즈니스 로직)

   ```javascript
   // packages/shared-utils/src/newUtils.js
   export function calculateNewScore(data) {
     // 비즈니스 로직
   }
   ```

4. **ViewModel 구현**

   ```typescript
   // packages/web-viewmodel/newViewModel.ts
   export function toNewViewModel(model) {
     return {
       ...model,
       scoreText: calculateNewScore(model),
     };
   }
   ```

5. **컴포넌트 개발**
   ```jsx
   // apps/web/src/components/domain/new/NewComponent.jsx
   function NewComponent() {
     // ViewModel 사용
   }
   ```

## 🧪 테스트

```bash
# 단위 테스트 실행
pnpm test

# 특정 패키지 테스트
pnpm --filter shared-utils test

# 테스트 커버리지
pnpm test:coverage
```

## 📚 추가 문서

- [API 문서](./docs/api.md)
- [컴포넌트 가이드](./docs/components.md)
- [배포 가이드](./docs/deployment.md)
- [기여 가이드](./CONTRIBUTING.md)

## 🛣️ 로드맵

### ✅ 완료된 기능

- [x] 웹 앱 기본 구조
- [x] Entity-Model-ViewModel 아키텍처
- [x] 매물/문의/계약 관리 기능

### 🚧 진행 중

- [ ] 비즈니스 로직 Utils 분리
- [ ] 컴포넌트 중복 제거
- [ ] 디자인 시스템 구축

### 📋 계획

- [ ] React Native 앱 개발
- [ ] 네이티브 앱 전환
- [ ] Storybook 도입
- [ ] E2E 테스트

## 🤝 기여하기

1. 이슈 생성 또는 할당받기
2. 기능 브랜치 생성: `git checkout -b feature/new-feature`
3. 변경사항 커밋: `git commit -m 'Add new feature'`
4. 브랜치 푸시: `git push origin feature/new-feature`
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 있습니다.

---

## 📞 지원

문제가 있거나 질문이 있으시면 [이슈를 생성](https://github.com/your-org/realconnect/issues)해 주세요.
