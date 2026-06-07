export type GenerationStep =
  | 'idle'
  | 'building'
  | 'done'
  | 'pricing'
  | 'deploying'
  | 'deployed';

export interface MockFile {
  /** 파일명 (트리/탭에 표시) */
  name: string;
  /** 트리에 표시할 전체 경로 */
  path: string;
  /** 우측에 표시할 추가 라인 수 (+105 식, 결정적 고정값) */
  linesAdded: number;
  /** 코드 에디터에 타이핑될 내용 */
  content: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  /** 원 단위 가격 (0 = 무료) */
  price: number;
  badge?: string;
  cta: string;
  features: string[];
  highlight?: boolean;
}
