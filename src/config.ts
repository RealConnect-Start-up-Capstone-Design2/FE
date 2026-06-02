import type { PricingPlan } from "./components/website-generator/types";

/**
 * 배포 완료 화면에서 iframe / 새 탭으로 연결할 실제 홈페이지 주소.
 * 나중에 본인 홈페이지 주소로 한 줄만 바꾸면 됩니다.
 * (지금은 테스트용 실제 부동산 홈페이지)
 */
export const DEPLOYED_SITE_URL = "https://xn--h49ap64b0ub1zf.com/";

/**
 * 생성(빌드) 연출 전체 목표 시간(ms). 실제 작업처럼 길게 보이도록 5~10분 사이로 설정.
 * 빌드 구간이 이 시간을 채우도록 타이핑 속도가 자동 페이싱됩니다.
 * 데모를 빨리 확인하고 싶으면 이 값만 줄이세요. (예: 30_000 = 30초)
 */
export const TARGET_DURATION_MS = 3 * 60 * 1000;

/** 빌드 시작 전 준비/계획 단계에 쓰는 고정 연출 시간(ms) */
export const PREPARING_MS = 3_000;
export const PLANNING_MS = 4_000;

/** 배포 버튼 클릭 후 "배포 중" 연출 시간(ms) */
export const DEPLOYING_MS = 30_200;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "무료 배포",
    price: 0,
    badge: "바로 시작",
    cta: "무료로 배포하기",
    features: [
      "realconnect.app 서브도메인 제공",
      "매물 목록 · 상세 페이지",
      "문의 폼 (이메일 알림)",
      "기본 SEO · 모바일 최적화",
    ],
  },
  {
    id: "pro",
    name: "실제 배포",
    price: 150_000,
    badge: "가장 인기",
    highlight: true,
    cta: "실제 배포하기",
    features: [
      "내 도메인 연결 (.com / .co.kr)",
      "SSL 보안 인증서 자동 적용",
      "네이버 · 구글 지도 연동",
      "카카오톡 상담 · 방문 예약",
      "고급 SEO · 검색 노출 최적화",
      "광고 배너 제거",
    ],
  },
  {
    id: "business",
    name: "비즈니스",
    price: 350_000,
    badge: "중개법인용",
    cta: "비즈니스 문의",
    features: [
      "실제 배포 플랜 전체 포함",
      "소속 공인중개사 다중 계정",
      "매물 자동 동기화 (CRM 연동)",
      "방문자 분석 대시보드",
      "우선 기술 지원",
    ],
  },
];
