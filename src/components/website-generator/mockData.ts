import type { MockFile, PlanItem } from './types';

/** 왼쪽 패널 "구현 계획" 카드에 표시할 항목들 */
export const PLAN_ITEMS: PlanItem[] = [
  { title: '매물 데이터 모델 설계', detail: '거래유형 · 가격 · 면적 · 방향 · 층 · 옵션 정의' },
  { title: '매물 목록 · 상세 페이지', detail: '카드 그리드, 필터, 상세 갤러리 구성' },
  { title: '지도 · 위치 섹션', detail: '주변 시세 · 교통 · 학군 정보 표시' },
  { title: '문의 · 방문 예약 폼', detail: '실시간 상담 연결 및 이메일 알림' },
  { title: '반응형 · SEO 최적화', detail: '모바일 우선 레이아웃 + 검색 노출 메타태그' },
];

/**
 * 생성되는 것처럼 보일 파일 목록 + 하드코딩된 코드.
 * content 안에는 백틱/${}를 쓰지 않습니다(이 파일이 백틱 문자열이라 충돌 방지).
 */
export const MOCK_FILES: MockFile[] = [
  {
    name: 'package.json',
    path: 'package.json',
    linesAdded: 38,
    content: `{
  "name": "haneul-realty-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^4.1.0",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.3",
    "vite": "^7.1.11"
  }
}`,
  },
  {
    name: 'tailwind.config.js',
    path: 'tailwind.config.js',
    linesAdded: 27,
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          500: '#2f7df6',
          600: '#1f63d6',
          700: '#1b50ab',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`,
  },
  {
    name: 'eslint.config.js',
    path: 'eslint.config.js',
    linesAdded: 21,
    content: `import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
];`,
  },
  {
    name: 'property.ts',
    path: 'src/types/property.ts',
    linesAdded: 44,
    content: `export type DealType = 'sale' | 'jeonse' | 'monthly';

export type PropertyKind = 'apartment' | 'officetel' | 'villa' | 'house' | 'commercial';

export interface Property {
  id: string;
  title: string;
  kind: PropertyKind;
  dealType: DealType;
  // 매매가 또는 보증금 (만원 단위)
  deposit: number;
  // 월세 (만원 단위, 월세 거래에만 사용)
  monthly?: number;
  // 전용 면적 (제곱미터)
  areaM2: number;
  // 층 / 전체 층
  floor: number;
  totalFloor: number;
  rooms: number;
  baths: number;
  // 남향, 남동향 등
  direction: string;
  address: string;
  description: string;
  options: string[];
  thumbnailColor: string;
  isNew?: boolean;
}

export interface PropertyFilterState {
  dealType: DealType | 'all';
  kind: PropertyKind | 'all';
  maxDeposit?: number;
  keyword: string;
}`,
  },
  {
    name: 'format.ts',
    path: 'src/lib/format.ts',
    linesAdded: 33,
    content: `// 만원 단위 금액을 "3억 2,500만원" 형태로 변환
export function formatKRW(manwon: number): string {
  if (manwon <= 0) return '0원';
  const eok = Math.floor(manwon / 10000);
  const rest = manwon % 10000;
  const parts: string[] = [];
  if (eok > 0) parts.push(eok + '억');
  if (rest > 0) parts.push(rest.toLocaleString('ko-KR') + '만원');
  if (eok > 0 && rest === 0) parts.push('원');
  return parts.join(' ');
}

// 제곱미터를 평으로 환산
export function toPyeong(areaM2: number): number {
  return Math.round((areaM2 / 3.3058) * 10) / 10;
}

// 매물 거래 형태 라벨
export function dealLabel(dealType: string): string {
  if (dealType === 'sale') return '매매';
  if (dealType === 'jeonse') return '전세';
  return '월세';
}`,
  },
  {
    name: 'mock-data.ts',
    path: 'src/lib/mock-data.ts',
    linesAdded: 96,
    content: `import type { Property } from '../types/property';

export const PROPERTIES: Property[] = [
  {
    id: 'p-1024',
    title: '래미안 강변 59㎡ 남향 로열층',
    kind: 'apartment',
    dealType: 'sale',
    deposit: 92000,
    areaM2: 59.8,
    floor: 12,
    totalFloor: 25,
    rooms: 3,
    baths: 2,
    direction: '남향',
    address: '서울 성동구 행당동',
    description: '한강 조망이 가능한 로열층 매물입니다. 올수리 완료, 즉시 입주 가능합니다.',
    options: ['엘리베이터', '주차 2대', '올수리', '시스템에어컨'],
    thumbnailColor: 'from-sky-400 to-blue-600',
    isNew: true,
  },
  {
    id: 'p-1025',
    title: '역세권 신축 오피스텔 전세',
    kind: 'officetel',
    dealType: 'jeonse',
    deposit: 28000,
    areaM2: 33.1,
    floor: 8,
    totalFloor: 15,
    rooms: 1,
    baths: 1,
    direction: '남동향',
    address: '서울 광진구 자양동',
    description: '2호선 도보 3분, 풀옵션 신축 오피스텔. 보안 철저, 1인 가구 추천.',
    options: ['풀옵션', '무인택배', 'CCTV', '엘리베이터'],
    thumbnailColor: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'p-1026',
    title: '조용한 주택가 빌라 월세',
    kind: 'villa',
    dealType: 'monthly',
    deposit: 2000,
    monthly: 75,
    areaM2: 46.2,
    floor: 2,
    totalFloor: 4,
    rooms: 2,
    baths: 1,
    direction: '남서향',
    address: '서울 중랑구 면목동',
    description: '채광 좋은 2층 빌라. 반려동물 협의 가능, 주차 가능합니다.',
    options: ['주차 가능', '반려동물', '베란다'],
    thumbnailColor: 'from-amber-400 to-orange-600',
  },
  {
    id: 'p-1027',
    title: '대로변 1층 상가 임대',
    kind: 'commercial',
    dealType: 'monthly',
    deposit: 5000,
    monthly: 220,
    areaM2: 82.6,
    floor: 1,
    totalFloor: 6,
    rooms: 0,
    baths: 1,
    direction: '북향',
    address: '서울 동대문구 장안동',
    description: '유동인구 많은 대로변 1층. 카페, 음식점 업종 추천합니다.',
    options: ['대로변', '코너', '화장실 별도'],
    thumbnailColor: 'from-violet-400 to-purple-600',
  },
];

export function getProperty(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}`,
  },
  {
    name: 'PropertyCard.tsx',
    path: 'src/components/PropertyCard.tsx',
    linesAdded: 61,
    content: `import { Link } from 'react-router-dom';
import type { Property } from '../types/property';
import { formatKRW, toPyeong, dealLabel } from '../lib/format';

interface Props {
  property: Property;
}

export function PropertyCard({ property }: Props) {
  const priceText =
    property.dealType === 'monthly'
      ? formatKRW(property.deposit) + ' / ' + property.monthly + '만원'
      : formatKRW(property.deposit);

  return (
    <Link
      to={'/property/' + property.id}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={'relative h-44 bg-gradient-to-br ' + property.thumbnailColor}>
        {property.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-600">
            신규
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-1 text-xs font-semibold text-white">
          {dealLabel(property.dealType)}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-900">{property.title}</h3>
        <p className="text-lg font-bold text-brand-600">{priceText}</p>
        <p className="text-sm text-slate-500">
          {property.address} · {toPyeong(property.areaM2)}평 · {property.floor}층
        </p>
      </div>
    </Link>
  );
}`,
  },
  {
    name: 'PropertyFilter.tsx',
    path: 'src/components/PropertyFilter.tsx',
    linesAdded: 54,
    content: `import type { DealType, PropertyFilterState } from '../types/property';

interface Props {
  value: PropertyFilterState;
  onChange: (next: PropertyFilterState) => void;
}

const DEAL_TABS: { id: DealType | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'sale', label: '매매' },
  { id: 'jeonse', label: '전세' },
  { id: 'monthly', label: '월세' },
];

export function PropertyFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-xl bg-slate-100 p-1">
        {DEAL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange({ ...value, dealType: tab.id })}
            className={
              'rounded-lg px-4 py-2 text-sm font-medium transition ' +
              (value.dealType === tab.id
                ? 'bg-white text-brand-600 shadow'
                : 'text-slate-500 hover:text-slate-800')
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      <input
        value={value.keyword}
        onChange={(e) => onChange({ ...value, keyword: e.target.value })}
        placeholder="지역 · 단지명 검색"
        className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}`,
  },
  {
    name: 'Header.tsx',
    path: 'src/components/Header.tsx',
    linesAdded: 40,
    content: `import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 font-black text-white">
            H
          </span>
          <span className="text-lg font-bold text-slate-900">하늘공인중개사사무소</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/listing" className="hover:text-brand-600">매물 검색</Link>
          <a href="#map" className="hover:text-brand-600">지역 안내</a>
          <a href="#contact" className="hover:text-brand-600">상담 문의</a>
        </nav>
        <a
          href="tel:0212345678"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          02-1234-5678
        </a>
      </div>
    </header>
  );
}`,
  },
  {
    name: 'ContactForm.tsx',
    path: 'src/components/ContactForm.tsx',
    linesAdded: 58,
    content: `import { useState } from 'react';

interface FormState {
  name: string;
  phone: string;
  message: string;
}

const EMPTY: FormState = { name: '', phone: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 실제 서비스에서는 여기서 상담 API로 전송됩니다.
    setSent(true);
    setForm(EMPTY);
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 text-center text-emerald-700">
        상담 신청이 접수되었습니다. 빠르게 연락드리겠습니다.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="성함"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
      />
      <input
        required
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="연락처"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="문의 내용"
        rows={4}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
      />
      <button className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700">
        상담 신청하기
      </button>
    </form>
  );
}`,
  },
  {
    name: 'HomePage.tsx',
    path: 'src/pages/HomePage.tsx',
    linesAdded: 72,
    content: `import { useMemo, useState } from 'react';
import { PROPERTIES } from '../lib/mock-data';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilter } from '../components/PropertyFilter';
import { ContactForm } from '../components/ContactForm';
import type { PropertyFilterState } from '../types/property';

const INITIAL: PropertyFilterState = { dealType: 'all', kind: 'all', keyword: '' };

export function HomePage() {
  const [filter, setFilter] = useState<PropertyFilterState>(INITIAL);

  const filtered = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (filter.dealType !== 'all' && p.dealType !== filter.dealType) return false;
      if (filter.keyword && !p.address.includes(filter.keyword) && !p.title.includes(filter.keyword))
        return false;
      return true;
    });
  }, [filter]);

  return (
    <main>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h1 className="text-4xl font-black leading-tight text-slate-900">
            성동구 한강변 매물,
            <br />
            하늘공인중개사가 직접 찾아드립니다
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            검증된 매물만 골라 소개합니다. 지금 바로 둘러보세요.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <PropertyFilter value={filter} onChange={setFilter} />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-2xl px-5 py-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">상담 문의</h2>
        <ContactForm />
      </section>
    </main>
  );
}`,
  },
  {
    name: 'PropertyDetailPage.tsx',
    path: 'src/pages/PropertyDetailPage.tsx',
    linesAdded: 88,
    content: `import { useParams, Link } from 'react-router-dom';
import { getProperty } from '../lib/mock-data';
import { formatKRW, toPyeong, dealLabel } from '../lib/format';
import { ContactForm } from '../components/ContactForm';

export function PropertyDetailPage() {
  const { id } = useParams();
  const property = id ? getProperty(id) : undefined;

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center text-slate-500">
        존재하지 않는 매물입니다.
        <Link to="/" className="ml-2 text-brand-600 underline">
          홈으로
        </Link>
      </div>
    );
  }

  const priceText =
    property.dealType === 'monthly'
      ? formatKRW(property.deposit) + ' / ' + property.monthly + '만원'
      : formatKRW(property.deposit);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className={'h-72 rounded-3xl bg-gradient-to-br ' + property.thumbnailColor} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-600">
            {dealLabel(property.dealType)}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{property.title}</h1>
          <p className="mt-2 text-2xl font-black text-brand-600">{priceText}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Spec label="전용면적" value={toPyeong(property.areaM2) + '평'} />
            <Spec label="해당층" value={property.floor + ' / ' + property.totalFloor + '층'} />
            <Spec label="방향" value={property.direction} />
            <Spec label="방 / 욕실" value={property.rooms + ' / ' + property.baths} />
            <Spec label="주소" value={property.address} />
          </dl>

          <h2 className="mt-10 text-lg font-bold text-slate-900">매물 설명</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{property.description}</p>

          <h2 className="mt-10 text-lg font-bold text-slate-900">옵션</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {property.options.map((opt) => (
              <li key={opt} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                {opt}
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">방문 예약 · 상담</h3>
          <ContactForm />
        </aside>
      </div>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-800">{value}</dd>
    </div>
  );
}`,
  },
  {
    name: 'App.tsx',
    path: 'src/App.tsx',
    linesAdded: 31,
    content: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-slate-900">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes>
        <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-400">
          하늘공인중개사사무소 · 서울 성동구 행당로 00 · 등록번호 11200-2024-00000
        </footer>
      </div>
    </BrowserRouter>
  );
}`,
  },
  {
    name: 'main.tsx',
    path: 'src/main.tsx',
    linesAdded: 12,
    content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,
  },
];

/**
 * 빌드 단계(Phase) 정의 — 왼쪽 패널 체크리스트 + 파일트리 "폴더 단위 동시 등장"에 사용.
 * 각 phase의 files 개수 합은 MOCK_FILES 길이(순서)와 일치해야 합니다.
 */
export const BUILD_PHASES: { title: string; count: number }[] = [
  { title: '개발 환경 설정', count: 3 }, // package.json, tailwind, eslint
  { title: '데이터 모델 · 유틸', count: 3 }, // property, format, mock-data
  { title: '공통 컴포넌트', count: 4 }, // Card, Filter, Header, ContactForm
  { title: '페이지 · 라우팅', count: 4 }, // Home, Detail, App, main
];

/** 파일 인덱스가 속한 phase 인덱스 */
export function phaseOfFile(fileIndex: number): number {
  let acc = 0;
  for (let i = 0; i < BUILD_PHASES.length; i++) {
    acc += BUILD_PHASES[i].count;
    if (fileIndex < acc) return i;
  }
  return BUILD_PHASES.length - 1;
}

/** phase의 첫 파일 인덱스(전역) */
export function firstFileOfPhase(phaseIndex: number): number {
  let acc = 0;
  for (let i = 0; i < phaseIndex; i++) acc += BUILD_PHASES[i].count;
  return acc;
}

/** phase의 마지막 파일 인덱스(전역) */
export function lastFileOfPhase(phaseIndex: number): number {
  return firstFileOfPhase(phaseIndex) + BUILD_PHASES[phaseIndex].count - 1;
}
