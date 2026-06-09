import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { FileCode2, Radio } from 'lucide-react';
import type { MockFile } from './types';

interface Props {
  file: MockFile | undefined;
  /** 표시할 코드 텍스트 (라이브면 작성 중인 부분, 과거 파일이면 전체) */
  content: string;
  /** 작성 중 = 캐럿 + 해당 줄로 스크롤 */
  typing: boolean;
  /** 지금 막 작성 중인 줄 인덱스 (비순차 작성이라 마지막 줄이 아닐 수 있음) */
  writeLine: number;
  /** 과거 파일을 열람 중 (라이브와 다른 파일) */
  isHistory: boolean;
  onBackToLive: () => void;
}

const KEYWORDS =
  'import|from|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|interface|type|extends|implements|new|class|enum|async|await|true|false|null|undefined|void';

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
    if (m[1]) cls = 'text-slate-600 italic'; // comment
    else if (m[2]) cls = 'text-slate-400'; // string
    else if (m[3]) cls = 'text-sky-300'; // keyword
    else if (m[4]) cls = 'text-slate-300'; // type / component
    else if (m[5]) cls = 'text-slate-400'; // number
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

export function CodeTypingPanel({
  file,
  content,
  typing,
  writeLine,
  isHistory,
  onBackToLive,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // 작성 중인 줄을 화면 중앙 근처로 따라가게 (비순차 작성이라 위·아래로 점프)
  useLayoutEffect(() => {
    if (typing && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [content, typing, writeLine]);

  // 과거 파일 열람 시작 시 맨 위로
  useEffect(() => {
    const el = scrollRef.current;
    if (el && !typing) el.scrollTop = 0;
  }, [file?.path, typing]);

  const lines = content.split('\n');
  const lineCount = content ? lines.length : 0;

  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* 에디터 탭 바 */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-800/70 px-4 py-2">
        {file ? (
          <>
            <span className="flex items-center gap-1.5 rounded-t-md bg-slate-900 px-3 py-1.5 text-sm text-slate-200">
              <FileCode2 className="h-4 w-4 text-sky-400" />
              {file.name}
            </span>
            <span className="hidden text-xs text-slate-500 md:inline">{file.path}</span>
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
      <div ref={scrollRef} className="code-scroll flex-1 overflow-auto font-mono text-[13px] leading-6">
        {content ? (
          <div className="flex min-h-full">
            <div className="sticky left-0 select-none border-r border-slate-700/40 bg-slate-900 px-3 py-3 text-right text-slate-600">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="flex-1 px-4 py-3 text-slate-200">
              {lines.map((line, i) => {
                const isActive = typing && i === writeLine;
                return (
                  <div
                    key={i}
                    ref={isActive ? activeLineRef : undefined}
                    className={isActive ? 'whitespace-pre bg-slate-700/30' : 'whitespace-pre'}
                  >
                    {highlight(line)}
                    {isActive && (
                      <span className="caret-blink ml-px inline-block h-4 w-2 translate-y-0.5 bg-brand-400" />
                    )}
                  </div>
                );
              })}
            </pre>
          </div>
        ) : (
          <div className="h-full bg-slate-900" />
        )}
      </div>
    </div>
  );
}
