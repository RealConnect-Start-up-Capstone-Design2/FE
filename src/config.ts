import type { PricingPlan } from './components/website-generator/types';

/**
 * CRM 사용자 컨텍스트 (목업).
 * 로그인한 중개사 계정(username)에 따라 사무소 정보가 달라진다.
 * 대시보드 · 웹사이트 스튜디오 · 생성되는 코드가 모두 같은 값을 참조하게 해서
 * "내 CRM 데이터로 내 사이트를 만든다"는 흐름이 한 계정으로 일관되게 보이도록 한다.
 */
export interface CrmContext {
  agencyName: string;
  agentName: string;
  region: string;
  regionShort: string;
  complex: string;
  phone: string;
  address: string;
  listingCount: number;
  activeCustomers: number;
  monthlyVisitors: number;
  /** 배포 완료 화면에서 iframe / 새 탭으로 연결할 실제 홈페이지 주소 */
  deployedSiteUrl: string;
}

/**
 * 로그인 username → 사무소(목업) 매핑.
 * 새 계정을 추가하려면 여기 한 줄만 넣으면 대시보드·스튜디오에 같이 반영된다.
 */
export const CRM_ACCOUNTS: Record<string, CrmContext> = {
  // 계정 1 — 실제 로그인 아이디
  asd10203: {
    agencyName: '잠실공인중개사사무소',
    agentName: '최정현',
    region: '서울 송파구',
    regionShort: '송파구',
    complex: '잠실르엘',
    phone: '02-422-4545',
    address: '서울 송파구 올림픽로 435 파크리오B 상가1층',
    listingCount: 12,
    activeCustomers: 52,
    monthlyVisitors: 2340,
    deployedSiteUrl: 'https://jamsil-leel.vercel.app',
  },
  // 계정 2 — 실제 로그인 아이디. 아래 ⚠️ 값들은 임시이니 실제 정보로 교체할 것.
  qwe10203: {
    agencyName: '잠래아부동산',
    agentName: '김잠실',
    region: '서울 송파구',
    regionShort: '송파구',
    complex: '잠실래미안아이파크',
    phone: '010-3086-8805',
    address: '서울 송파구 올림픽로 326 잠실래미안아이파크 상가 2층', // ⚠️ 임시 주소
    listingCount: 20,
    activeCustomers: 39, // 미사용(랜딩 카드에서 제거됨)
    monthlyVisitors: 1680, // 미사용(랜딩 카드에서 제거됨)
    deployedSiteUrl: 'https://jamsil-raemian-ipark.vercel.app',
  },
};

/** 매칭되는 계정이 없을 때(로그아웃·미지정) 보여줄 기본 계정 */
export const DEFAULT_USERNAME = 'asd10203';

/** username으로 사무소 컨텍스트를 찾는다. 없으면 기본 계정. */
export function getCrmContext(username?: string | null): CrmContext {
  return (username && CRM_ACCOUNTS[username]) || CRM_ACCOUNTS[DEFAULT_USERNAME];
}

/**
 * 모듈 로드 시점에 쓰는 기본 컨텍스트(예: 아래 PRICING_PLANS, MOCK_FILES 기본값).
 * 런타임 화면들은 useCrmContext()로 로그인 계정 값을 읽는다.
 */
export const CRM_CONTEXT = CRM_ACCOUNTS[DEFAULT_USERNAME];

/**
 * 코드 생성 연출 전체 목표 시간(ms). 빠르게 파일들을 넘나들며 작성하는 느낌.
 * 코드량에 맞춰 타이핑 속도가 자동 페이싱됩니다. 더 빠르게/느리게는 이 값만 조절.
 */
export const TARGET_DURATION_MS = 45 * 1000;

/** 배포 버튼 클릭 후 "배포 중" 연출 시간(ms) */
export const DEPLOYING_MS = 3_200;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: '무료',
    price: 0,
    badge: '바로 시작',
    cta: '무료로 시작하기',
    features: [
      'realconnect.app 서브도메인 제공',
      '내 매물 자동 연동 (목록 · 상세)',
      CRM_CONTEXT.regionShort + ' 지역 정보 표시',
      '문의 폼 (이메일 알림)',
      '기본 SEO · 모바일 최적화',
    ],
  },
  {
    id: 'pro',
    name: '프로',
    price: 150_000,
    badge: '가장 인기',
    highlight: true,
    cta: '프로로 시작하기',
    features: [
      '무료 플랜 전체 포함',
      '내 도메인 연결 (.com / .co.kr)',
      'SSL 보안 인증서 자동 적용',
      CRM_CONTEXT.regionShort + ' 네이버 · 구글 지도 연동',
      '카카오톡 상담 · 방문 예약',
      '고급 SEO · 검색 노출 최적화',
      '광고 배너 제거',
    ],
  },
  {
    id: 'business',
    name: '비즈니스',
    price: 350_000,
    badge: '중개법인용',
    cta: '비즈니스로 시작하기',
    features: [
      '프로 플랜 전체 포함',
      '소속 공인중개사 다중 계정',
      '매물 실시간 자동 동기화 (CRM 연동)',
      '방문자 분석 대시보드',
      '우선 기술 지원',
    ],
  },
];
