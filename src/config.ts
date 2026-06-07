import type { PricingPlan } from './components/website-generator/types';

/**
 * CRM 사용자 컨텍스트 (목업).
 * 실제로는 로그인한 중개사 계정에서 가져오는 값 — 대시보드와 "생성되는 코드"가
 * 같은 데이터를 참조하는 것처럼 보이게 한 곳에 정의한다.
 */
export const CRM_CONTEXT = {
  agencyName: '잠실르엘공인중개사사무소',
  agentName: '김잠실',
  region: '서울 송파구',
  regionShort: '송파구',
  complex: '잠실르엘',
  phone: '02-2147-5000',
  listingCount: 18,
  activeCustomers: 52,
  monthlyVisitors: 2340,
} as const;

/**
 * 배포 완료 화면에서 iframe / 새 탭으로 연결할 실제 홈페이지 주소.
 * 나중에 본인 홈페이지 주소로 한 줄만 바꾸면 됩니다.
 * (지금은 테스트용 실제 부동산 홈페이지)
 */
export const DEPLOYED_SITE_URL = 'https://xn--h49ap64b0ub1zf.com/';

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
