import { useAuthStore } from '@/features/auth/stores';
import { getCrmContext } from '../../config';

/**
 * 로그인한 계정(username)에 해당하는 사무소 컨텍스트(목업)를 돌려준다.
 * 대시보드·웹사이트 스튜디오의 모든 화면이 이 훅으로 같은 사무소를 참조한다.
 */
export function useCrmContext() {
  const username = useAuthStore((s) => s.username);
  return getCrmContext(username);
}
