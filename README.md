# Realconnect v2

Realconnect v2는 React와 TypeScript, Vite(SWC)를 기반으로 구축한 프론트엔드 프로젝트입니다. Tailwind CSS와 shadcn/ui 컴포넌트를 활용하며 Pretendard 폰트를 기본값으로 사용합니다. 기능 모듈과 공통 리소스를 분리한 구조를 적용해 확장성과 유지보수성을 높였습니다.

## 기술 스택

- React 19 + TypeScript
- Vite 7 (SWC)
- Tailwind CSS 3 + tailwindcss-animate
- shadcn/ui (CLI 설정 포함)
- pnpm 패키지 매니저
- Pretendard 폰트 (@fontsource)

## 시작하기

```bash
pnpm install
pnpm dev
```

## 사용 가능한 스크립트

- `pnpm dev` – 로컬 개발 서버 실행
- `pnpm build` – 타입 검사 후 프로덕션 번들 생성
- `pnpm preview` – 빌드 결과를 미리보기 서버로 확인
- `pnpm lint` – ESLint 기본 규칙으로 정적 분석

## 프로젝트 구조

```
realconnect_v2/
├─ src/
│  ├─ App.tsx               # 루트 컴포넌트
│  ├─ components/
│  │  ├─ common/            # 전역 Provider 등 공통 컴포넌트
│  │  └─ ui/                # shadcn/ui 패턴 컴포넌트 (예: Button)
│  ├─ features/
│  │  └─ auth/
│  │     ├─ components/
│  │     ├─ hooks/
│  │     ├─ stores/
│  │     └─ types/
│  ├─ hooks/                # 전역 훅
│  ├─ pages/                # 페이지 컴포넌트 (예: pages/home)
│  ├─ shared/
│  │  ├─ api/
│  │  ├─ constants/
│  │  │  └─ fonts.ts
│  │  ├─ types/
│  │  └─ utils/             # 유틸 함수 (예: cn)
│  ├─ stores/               # 전역 상태 관리
│  └─ styles/
│     └─ index.css          # 전역 스타일 & Tailwind 계층
└─ components.json          # shadcn/ui CLI 설정
```

현재 `pages/home`에 샘플 홈 화면이 구현되어 있으며, `components/ui`에는 shadcn 패턴을 따른 `Button` 컴포넌트와 유틸리티(`cn`)가 포함되어 있습니다.

## 스타일 & UI 가이드

- 전역 스타일은 `src/styles/index.css`에 정의되어 있으며 Tailwind base/utility 계층과 색상 토큰, Pretendard 폰트가 세팅되어 있습니다.
- Tailwind 설정은 `tailwind.config.ts`에서 관리하며, shadcn/ui를 위해 `tailwindcss-animate` 플러그인을 추가했습니다.
- shadcn/ui 컴포넌트는 `@/components/ui`에서 관리하고, 공용 유틸은 `@/shared/utils`에서 가져옵니다.

## shadcn/ui 컴포넌트 추가

CLI 설정(`components.json`)을 기반으로 필요 컴포넌트를 추가할 수 있습니다.

```bash
pnpm dlx shadcn@latest add <component-name>
```

CLI가 `@/components/ui` 폴더에 컴포넌트를 생성하고, 유틸 경로는 `@/shared/utils`를 사용합니다.

## 코드 품질 도구

- ESLint: `eslint.config.js`의 기본 권장 규칙을 사용합니다.
- Prettier: `.prettierrc`에 기본 옵션(`{}`)을 적용했으므로, 별도 설정 없이 포맷할 수 있습니다.

## 배포 전 점검

1. `pnpm lint`로 정적 분석을 통과합니다.
2. `pnpm build`로 타입 검사 및 번들을 생성합니다.
3. 필요 시 `pnpm preview`로 결과를 검증합니다.

## 참고

- 기본 폰트는 Pretendard이며, 관련 상수는 `src/shared/constants/fonts.ts`에서 관리합니다.
- 추가 의존성은 상황에 맞게 `pnpm add` 또는 `pnpm add -D`로 설치해 주세요.
