import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { FileCode2, Radio } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { MockFile } from './types';

interface Props {
  file: MockFile | undefined;
  /** 표시할 코드 텍스트 (라이브면 타이핑 중인 부분, 과거 파일이면 전체) */
  content: string;
  /** 타이핑 중 = 캐럿 + 자동 따라가기 */
  typing: boolean;
  /** 과거 파일을 열람 중 (라이브와 다른 파일) */
  isHistory: boolean;
  onBackToLive: () => void;
}

const KEYWORDS =
  'import|from|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|interface|type|extends|implements|new|class|enum|async|await|true|false|null|undefined|void';

// 줄 단위 경량 토크나이저: 주석/문자열/키워드/타입(대문자)/숫자 색상화
const TOKEN = new RegExp(
  '(\\/\\/[^\\n]*)' + // 1 comment
    "|('(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\")" + // 2 string
    '|(\\b(?:' + KEYWORDS + ')\\b)' + // 3 keyword
    '|(\\b[A-Z][A-Za-z0-9_]*\\b)' + // 4 type / component
    '|(\\b\\d[\\d_.]*\\b)', // 5 number
  'g',
);

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  let key = 0;
  while ((m = TOKEN.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    let cls = '';
    if (m[1]) cls = 'text-slate-500 italic';
    else if (m[2]) cls = 'text-orange-400';
    else if (m[3]) cls = 'text-blue-400';
    else if (m[4]) cls = 'text-emerald-400';
    else if (m[5]) cls = 'text-fuchsia-400';
    out.push(
      <span key={key++} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeTypingPanel({ file, content, typing, isHistory, onBackToLive }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // 사용자가 바닥 근처에 있을 때만 자동 따라가기 (위로 스크롤하면 멈춤 = 실제 에디터 동작)
  const stickToBottom = useRef(true);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  }

  // 타이핑 중 + 바닥 고정 상태면 새 줄을 따라 스크롤
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && typing && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [content, typing]);

  // 파일이 바뀌면 맨 위로 (과거 파일 열람 시작 시 처음부터 보이게)
  useEffect(() => {
    const el = scrollRef.current;
    if (el && !typing) {
      el.scrollTop = 0;
      stickToBottom.current = true;
    }
  }, [file?.path, typing]);

  const lines = content.split('\n');
  const lineCount = content ? lines.length : 0;

  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* 탭 바 */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-800/70 px-4 py-2">
        {file ? (
          <>
            <FileCode2 className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-200">{file.name}</span>
            <span className="hidden text-xs text-slate-500 sm:inline">— {file.path}</span>
            {isHistory ? (
              <button
                onClick={onBackToLive}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-brand-600/90 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-brand-600"
              >
                <Radio className="h-3.5 w-3.5" />
                라이브로 돌아가기
              </button>
            ) : (
              <span className="ml-auto text-xs text-slate-500">{lineCount} lines</span>
            )}
          </>
        ) : (
          <span className="text-sm text-slate-500">코드 에디터</span>
        )}
      </div>

      {/* 코드 영역 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="code-scroll flex-1 overflow-auto font-mono text-[13px] leading-6"
      >
        {content ? (
          <div className="flex min-h-full">
            {/* 라인 번호 거터 */}
            <div className="sticky left-0 select-none border-r border-slate-700/40 bg-slate-900 px-3 py-3 text-right text-slate-600">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* 코드 본문 */}
            <pre className={cn('flex-1 px-4 py-3 text-slate-200')}>
              {lines.map((line, i) => (
                <div key={i} className="whitespace-pre">
                  {highlight(line)}
                  {typing && i === lines.length - 1 && (
                    <span className="caret-blink ml-px inline-block h-4 w-2 translate-y-0.5 bg-brand-400" />
                  )}
                </div>
              ))}
            </pre>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-sm text-slate-600">
            곧 코드 생성이 시작됩니다…
          </div>
        )}
      </div>
    </div>
  );
}
