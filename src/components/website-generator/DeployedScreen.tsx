import { useState } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';

interface Props {
  /** 로그인 계정의 배포 미리보기 주소 */
  siteUrl: string;
  onReset: () => void;
}

export function DeployedScreen({ siteUrl, onReset }: Props) {
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const displayUrl = siteUrl.replace(/^https?:\/\//, '');

  return (
    <div className="flex h-full flex-col bg-slate-100">
      {/* 성공 배너 */}
      <div className="flex items-center justify-between gap-3 border-b border-emerald-200 bg-emerald-50 px-5 py-3">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">배포 완료!</span>
          <span className="text-sm text-emerald-600">사이트가 성공적으로 배포되었습니다.</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <ExternalLink className="h-4 w-4" />
            사이트 방문
          </a>
          <button
            onClick={onReset}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            처음으로
          </button>
        </div>
      </div>

      {/* 브라우저 크롬 + iframe 임베드 */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-1 text-sm text-slate-500 ring-1 ring-slate-200">
              <span className="text-emerald-600">🔒</span>
              {displayUrl}
            </div>
          </div>

          <div className="relative flex-1 bg-white">
            <iframe
              src={siteUrl}
              title="배포된 웹사이트"
              className="h-full w-full"
              onError={() => setIframeBlocked(true)}
            />
            {iframeBlocked && (
              <div className="absolute inset-0 grid place-items-center bg-white/95 p-6 text-center">
                <div>
                  <p className="mb-3 text-slate-600">
                    이 사이트는 보안 정책(X-Frame-Options)으로 미리보기 임베드를 차단합니다.
                  </p>
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    새 탭에서 사이트 열기
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 일부 사이트는 보안 정책상 미리보기 임베드를 막습니다 → 항상 보이는 안내 경로 */}
        <p className="mt-2 text-center text-xs text-slate-400">
          미리보기가 보이지 않으면 보안 정책(X-Frame-Options) 때문일 수 있어요. 위{' '}
          <span className="font-medium text-brand-600">사이트 방문</span> 버튼으로 새 탭에서
          확인하세요.
        </p>
      </div>
    </div>
  );
}
