import { FileCode2, Folder, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { firstFileOfPhase, MOCK_FILES, phaseOfFile } from './mockData';

interface Props {
  revealedCount: number;
  /** 현재 타이핑 중인 파일 인덱스 */
  currentFileIndex: number;
  /** 코드창에서 지금 보고 있는 파일 인덱스 */
  activeIndex: number;
  /** 클릭으로 열람 가능한 마지막 인덱스(=currentFileIndex까지) */
  onSelectFile: (index: number) => void;
}

/** 경로의 깊이(들여쓰기)와 표시 이름 계산 */
function depthOf(path: string) {
  return path.split('/').length - 1;
}

export function FileTreePanel({
  revealedCount,
  currentFileIndex,
  activeIndex,
  onSelectFile,
}: Props) {
  const revealed = MOCK_FILES.slice(0, revealedCount);

  // 등장한 파일들의 상위 폴더 집합 (트리 느낌을 위해 폴더 라벨도 표시)
  const shownFolders = new Set<string>();

  return (
    <div className="code-scroll flex h-full flex-col overflow-y-auto bg-slate-50 p-3">
      <div className="flex items-center justify-between px-2 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">탐색기</p>
        <span className="text-[11px] text-slate-400">{revealed.length} files</span>
      </div>
      <div className="space-y-0.5">
        {revealed.map((file, i) => {
          const depth = depthOf(file.path);
          const folder = file.path.includes('/')
            ? file.path.slice(0, file.path.lastIndexOf('/'))
            : '';
          const isCurrent = i === currentFileIndex;
          const isActive = i === activeIndex;
          const clickable = i <= currentFileIndex; // 등장/진행된 파일은 다시 열람 가능
          // 같은 phase(폴더 묶음) 안에서 순차로 살짝 늦게 등장 → 촤르륵 쏟아지는 느낌
          const stagger = (i - firstFileOfPhase(phaseOfFile(i))) * 0.07;

          const folderRow =
            folder && !shownFolders.has(folder) ? (
              <div
                key={'folder-' + folder}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400"
                style={{ paddingLeft: 8 + (depth - 1) * 14 }}
              >
                <Folder className="h-3.5 w-3.5" />
                <span>{folder}</span>
              </div>
            ) : null;
          if (folder) shownFolders.add(folder);

          return (
            <div key={file.path}>
              {folderRow}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onSelectFile(i)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition',
                  'animate-[fadeIn_0.25s_ease]',
                  isActive
                    ? 'bg-brand-100 text-brand-800 ring-1 ring-brand-300'
                    : clickable
                      ? 'text-slate-600 hover:bg-slate-200/70'
                      : 'text-slate-600',
                  clickable ? 'cursor-pointer' : 'cursor-default',
                )}
                style={{
                  paddingLeft: 8 + depth * 14,
                  animationDelay: stagger + 's',
                  animationFillMode: 'backwards',
                }}
              >
                <span className="flex items-center gap-1.5 truncate">
                  {isCurrent ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-brand-600" />
                  ) : (
                    <FileCode2
                      className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        isActive ? 'text-brand-600' : 'text-slate-400',
                      )}
                    />
                  )}
                  <span className="truncate">{file.name}</span>
                </span>
                <span className="ml-2 shrink-0 text-xs font-medium text-emerald-600">
                  +{file.linesAdded}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
