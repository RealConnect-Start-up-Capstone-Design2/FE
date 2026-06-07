import type { MockFile } from './types';

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
  "name": "jamsil-lael-realty-web",
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
    name: 'crm-config.ts',
    path: 'src/lib/crm-config.ts',
    linesAdded: 24,
    content: `// RealConnect CRM 연동 설정 — 중개사 계정에서 자동 주입됩니다.
// (build 시 RealConnect API 토큰으로 매물/지역 데이터를 동기화)
export const CRM_CONFIG = {
  agencyId: 'agency_jamsil_lael_8821',
  agencyName: '잠실르엘공인중개사사무소',
  agentName: '김잠실',
  complex: '잠실르엘',
  region: {
    sido: '서울',
    sigungu: '송파구',
    dongs: ['신천동', '잠실동', '석촌동', '방이동'],
    center: { lat: 37.5126, lng: 127.0826 },
  },
  contact: {
    phone: '02-2147-5000',
    kakao: '@jamsil-lael',
    email: 'jamsil-lael@realconnect.app',
  },
  // 매물은 CRM에서 실시간 동기화 (mock-data.ts 는 빌드 시점 스냅샷)
  syncEndpoint: 'https://api.realconnect.app/v1/listings',
} as const;

export type CrmRegion = typeof CRM_CONFIG.region;`,
  },
  {
    name: 'mock-data.ts',
    path: 'src/lib/mock-data.ts',
    linesAdded: 96,
    content: `import type { Property } from '../types/property';
// CRM 동기화 스냅샷 — agency_jamsil_lael_8821 (서울 송파구 잠실르엘), 매물 18건 중 대표 4건
export const PROPERTIES: Property[] = [
  {
    id: 'p-1024',
    title: '잠실르엘 84㎡ 남향 한강 조망',
    kind: 'apartment',
    dealType: 'sale',
    deposit: 290000,
    areaM2: 84.9,
    floor: 27,
    totalFloor: 35,
    rooms: 3,
    baths: 2,
    direction: '남향',
    address: '서울 송파구 신천동 잠실르엘',
    description: '한강 조망 로열층 신축 매물입니다. 잠실역 도보권, 즉시 입주 가능합니다.',
    options: ['한강뷰', '지하주차', '커뮤니티시설', '시스템에어컨'],
    thumbnailColor: 'from-sky-400 to-blue-600',
    isNew: true,
  },
  {
    id: 'p-1025',
    title: '잠실르엘 59㎡ 전세 고층',
    kind: 'apartment',
    dealType: 'jeonse',
    deposit: 130000,
    areaM2: 59.9,
    floor: 18,
    totalFloor: 35,
    rooms: 3,
    baths: 1,
    direction: '남동향',
    address: '서울 송파구 신천동 잠실르엘',
    description: '신축 입주 컨디션 그대로. 잠실 학군·생활 인프라 도보권, 즉시 입주 가능.',
    options: ['신축', '지하주차', '무인택배', '커뮤니티시설'],
    thumbnailColor: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'p-1026',
    title: '잠실르엘 110㎡ 남향 펜트뷰',
    kind: 'apartment',
    dealType: 'sale',
    deposit: 385000,
    areaM2: 110.5,
    floor: 32,
    totalFloor: 35,
    rooms: 4,
    baths: 2,
    direction: '남향',
    address: '서울 송파구 신천동 잠실르엘',
    description: '고층 대형 평형, 석촌호수·한강 파노라마 조망. 프리미엄 마감재 적용.',
    options: ['한강뷰', '호수뷰', '대형평형', '복층창고'],
    thumbnailColor: 'from-amber-400 to-orange-600',
  },
  {
    id: 'p-1027',
    title: '잠실르엘 84㎡ 반전세',
    kind: 'apartment',
    dealType: 'monthly',
    deposit: 150000,
    monthly: 180,
    areaM2: 84.9,
    floor: 9,
    totalFloor: 35,
    rooms: 3,
    baths: 2,
    direction: '남서향',
    address: '서울 송파구 신천동 잠실르엘',
    description: '보증금 조정 가능한 반전세. 단지 내 커뮤니티·조경 우수, 가족 단위 추천.',
    options: ['지하주차', '커뮤니티시설', '조경우수', '반려동물'],
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
            르
          </span>
          <span className="text-lg font-bold text-slate-900">잠실르엘공인중개사사무소</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/listing" className="hover:text-brand-600">매물 검색</Link>
          <a href="#map" className="hover:text-brand-600">지역 안내</a>
          <a href="#contact" className="hover:text-brand-600">상담 문의</a>
        </nav>
        <a
          href="tel:0221475000"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          02-2147-5000
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
    content: `import { useState } from 'react';
import { useCrmListings } from '../hooks/useCrmListings';
import { useFilteredListings } from '../hooks/useFilteredListings';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilter } from '../components/PropertyFilter';
import { ContactForm } from '../components/ContactForm';
import { RegionMap } from '../components/RegionMap';
import { CRM_CONFIG } from '../lib/crm-config';
import type { PropertyFilterState } from '../types/property';

const INITIAL: PropertyFilterState = { dealType: 'all', kind: 'all', keyword: '' };

export function HomePage() {
  const { listings } = useCrmListings();
  const [filter, setFilter] = useState<PropertyFilterState>(INITIAL);
  const filtered = useFilteredListings(listings, filter);

  return (
    <main>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h1 className="text-4xl font-black leading-tight text-slate-900">
            {CRM_CONFIG.complex} 매물,
            <br />
            {CRM_CONFIG.agencyName}가 직접 찾아드립니다
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

      <RegionMap />

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
import { Footer } from './components/Footer';
import { KakaoChat } from './components/KakaoChat';
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
        <Footer />
        <KakaoChat />
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
  {
    name: 'api-client.ts',
    path: 'src/lib/api-client.ts',
    linesAdded: 47,
    content: `import { CRM_CONFIG } from './crm-config';
import type { Property } from '../types/property';

// RealConnect CRM 연동 클라이언트
// 빌드 시 스냅샷을 쓰고, 런타임에는 최신 매물을 폴링해 동기화한다.
const BASE = CRM_CONFIG.syncEndpoint;

async function request<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'X-Agency-Id': CRM_CONFIG.agencyId },
  });
  if (!res.ok) throw new Error('CRM sync failed: ' + res.status);
  return res.json() as Promise<T>;
}

export async function fetchListings(): Promise<Property[]> {
  return request<Property[]>('/listings?status=active');
}

export async function fetchListing(id: string): Promise<Property> {
  return request<Property>('/listings/' + id);
}

export async function submitInquiry(payload: {
  propertyId: string;
  name: string;
  phone: string;
  message: string;
}): Promise<{ ok: boolean }> {
  const res = await fetch(BASE + '/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Agency-Id': CRM_CONFIG.agencyId,
    },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok };
}`,
  },
  {
    name: 'useCrmListings.ts',
    path: 'src/hooks/useCrmListings.ts',
    linesAdded: 39,
    content: `import { useEffect, useState } from 'react';
import { PROPERTIES } from '../lib/mock-data';
import { fetchListings } from '../lib/api-client';
import type { Property } from '../types/property';

// CRM 매물을 불러오는 훅. 초기엔 빌드 스냅샷, 이후 실시간 동기화.
export function useCrmListings() {
  const [listings, setListings] = useState<Property[]>(PROPERTIES);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchListings()
      .then((data) => {
        if (alive) {
          setListings(data);
          setSynced(true);
        }
      })
      .catch(() => {
        // 동기화 실패 시 스냅샷 유지
        if (alive) setSynced(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { listings, synced };
}`,
  },
  {
    name: 'useFilteredListings.ts',
    path: 'src/hooks/useFilteredListings.ts',
    linesAdded: 33,
    content: `import { useMemo } from 'react';
import type { Property, PropertyFilterState } from '../types/property';

export function useFilteredListings(
  listings: Property[],
  filter: PropertyFilterState,
) {
  return useMemo(() => {
    return listings.filter((p) => {
      if (filter.dealType !== 'all' && p.dealType !== filter.dealType) return false;
      if (filter.kind !== 'all' && p.kind !== filter.kind) return false;
      if (filter.maxDeposit && p.deposit > filter.maxDeposit) return false;
      if (filter.keyword) {
        const k = filter.keyword;
        if (!p.address.includes(k) && !p.title.includes(k)) return false;
      }
      return true;
    });
  }, [listings, filter]);
}`,
  },
  {
    name: 'RegionMap.tsx',
    path: 'src/components/RegionMap.tsx',
    linesAdded: 52,
    content: `import { CRM_CONFIG } from '../lib/crm-config';

// 중개사 지역(송파구 잠실르엘)을 중심으로 한 지도 섹션.
// 실제로는 네이버/카카오 지도 SDK를 붙이며, 여기선 정적 마커로 표현.
export function RegionMap() {
  const { sigungu, dongs } = CRM_CONFIG.region;

  return (
    <section id="map" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-2xl font-bold text-slate-900">{sigungu} 매물 안내</h2>
      <p className="mt-2 text-slate-500">
        {CRM_CONFIG.agencyName}가 직접 관리하는 {sigungu} 일대 매물입니다.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="relative h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white shadow-lg">
              ●
            </span>
            <p className="mt-2 text-center text-sm font-semibold text-slate-700">
              {sigungu}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {dongs.map((dong) => (
            <li
              key={dong}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
            >
              <span className="font-medium text-slate-700">{dong}</span>
              <span className="text-sm text-brand-600">매물 보기</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}`,
  },
  {
    name: 'Footer.tsx',
    path: 'src/components/Footer.tsx',
    linesAdded: 29,
    content: `import { CRM_CONFIG } from '../lib/crm-config';

export function Footer() {
  const { agencyName, contact, region } = CRM_CONFIG;
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-slate-500">
        <p className="font-semibold text-slate-700">{agencyName}</p>
        <p className="mt-2">
          {region.sido} {region.sigungu} · 대표 {CRM_CONFIG.agentName}
        </p>
        <p className="mt-1">전화 {contact.phone} · 카카오 {contact.kakao}</p>
        <p className="mt-4 text-xs text-slate-400">
          Powered by RealConnect · 등록번호 11200-2024-00000
        </p>
      </div>
    </footer>
  );
}`,
  },
  {
    name: 'KakaoChat.tsx',
    path: 'src/components/KakaoChat.tsx',
    linesAdded: 26,
    content: `import { CRM_CONFIG } from '../lib/crm-config';

// 우측 하단 카카오 상담 플로팅 버튼
export function KakaoChat() {
  return (
    <a
      href={'https://pf.kakao.com/' + CRM_CONFIG.contact.kakao}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 font-bold text-slate-900 shadow-lg transition hover:scale-105"
    >
      <span>💬</span>
      카카오 상담
    </a>
  );
}`,
  },
  {
    name: 'seo.ts',
    path: 'src/lib/seo.ts',
    linesAdded: 31,
    content: `import { CRM_CONFIG } from './crm-config';

// 지역 키워드 기반 SEO 메타 생성
export function buildMeta(title: string, description?: string) {
  const region = CRM_CONFIG.region.sigungu;
  return {
    title: title + ' | ' + CRM_CONFIG.agencyName,
    description:
      description ??
      region + ' 매물 전문 ' + CRM_CONFIG.agencyName + ' - 매매, 전세, 월세 매물 안내',
    keywords: [
      region + ' 부동산',
      region + ' 아파트',
      region + ' 매물',
      ...CRM_CONFIG.region.dongs.map((d) => d + ' 부동산'),
    ].join(', '),
    ogTitle: title,
    ogType: 'website',
  };
}`,
  },
  {
    name: 'vite.config.ts',
    path: 'vite.config.ts',
    linesAdded: 14,
    content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: { outDir: 'dist', sourcemap: false },
});`,
  },
  {
    name: 'index.css',
    path: 'src/index.css',
    linesAdded: 18,
    content: `@import 'tailwindcss';

:root {
  --brand: #1f63d6;
  font-family: 'Pretendard', system-ui, sans-serif;
  color-scheme: light;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
}`,
  },
];

/** 파일 경로 → 진행상황 패널에 표시할 작업 설명 */
const FILE_TASKS: Record<string, string> = {
  'package.json': '프로젝트 의존성 설정 중',
  'tailwind.config.js': '디자인 시스템(색상·폰트) 구성 중',
  'eslint.config.js': '코드 품질 규칙 설정 중',
  'vite.config.ts': '빌드 환경 설정 중',
  'src/index.css': '전역 스타일 적용 중',
  'src/main.tsx': '앱 진입점 연결 중',
  'src/App.tsx': '페이지 라우팅 구성 중',
  'src/lib/crm-config.ts': 'CRM 계정·지역 정보 연동 중',
  'src/lib/api-client.ts': '매물 동기화 API 연결 중',
  'src/lib/mock-data.ts': '매물 데이터 불러오는 중',
  'src/lib/format.ts': '가격·면적 표기 유틸 작성 중',
  'src/lib/seo.ts': '지역 키워드 SEO 설정 중',
  'src/types/property.ts': '매물 데이터 모델 정의 중',
  'src/hooks/useCrmListings.ts': '매물 실시간 연동 훅 작성 중',
  'src/hooks/useFilteredListings.ts': '매물 검색·필터 로직 작성 중',
  'src/components/Header.tsx': '상단 내비게이션 만드는 중',
  'src/components/Footer.tsx': '하단 정보 영역 만드는 중',
  'src/components/PropertyCard.tsx': '매물 카드 컴포넌트 만드는 중',
  'src/components/PropertyFilter.tsx': '매물 필터 UI 만드는 중',
  'src/components/ContactForm.tsx': '상담 문의 폼 만드는 중',
  'src/components/RegionMap.tsx': '잠실르엘 지역 지도 섹션 만드는 중',
  'src/components/KakaoChat.tsx': '카카오 상담 버튼 추가 중',
  'src/pages/HomePage.tsx': '메인 페이지 조립 중',
  'src/pages/PropertyDetailPage.tsx': '매물 상세 페이지 만드는 중',
};

export function taskForFile(path: string): string {
  return FILE_TASKS[path] ?? '코드 작성 중';
}
