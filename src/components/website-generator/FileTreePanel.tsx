import { ChevronDown, FileCode2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_FILES } from './mockData';

interface Props {
  /** 현재 작성 중인 파일 인덱스 */
  currentFileIndex: number;
  /** 코드창에서 지금 보고 있는 파일 인덱스 */
  activeIndex: number;
  onSelectFile: (index: number) => void;
}

interface TreeNode {
  name: string;
  fileIndex: number;
  depth: number;
  isDir: boolean;
}

/** MOCK_FILES 경로들을 폴더+파일 평면 리스트(렌더 순서)로 변환 */
function buildTree(): TreeNode[] {
  const nodes: TreeNode[] = [];
  const seenDirs = new Set<string>();
  const entries = MOCK_FILES.map((f, i) => ({ path: f.path, index: i })).sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  for (const { path, index } of entries) {
    const parts = path.split('/');
    for (let d = 0; d < parts.length - 1; d++) {
      const dirPath = parts.slice(0, d + 1).join('/');
      if (!seenDirs.has(dirPath)) {
        seenDirs.add(dirPath);
        nodes.push({ name: parts[d], fileIndex: -1, depth: d, isDir: true });
      }
    }
    nodes.push({
      name: parts[parts.length - 1],
      fileIndex: index,
      depth: parts.length - 1,
      isDir: false,
    });
  }
  return nodes;
}

const TREE = buildTree();

export function FileTreePanel({ currentFileIndex, activeIndex, onSelectFile }: Props) {
  return (
    <div className="code-scroll flex h-full flex-col overflow-y-auto bg-slate-900 py-2 text-slate-300">
      <div className="flex items-center gap-1.5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <ChevronDown className="h-3.5 w-3.5" />
        탐색기
      </div>
      <div className="px-1">
        {TREE.map((node, i) => {
          if (node.isDir) {
            return (
              <div
                key={'dir-' + i}
                className="flex items-center gap-1 py-1 text-sm text-slate-400"
                style={{ paddingLeft: 8 + node.depth * 14 }}
              >
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                <span>{node.name}</span>
              </div>
            );
          }
          const isActive = node.fileIndex === activeIndex;
          const isCurrent = node.fileIndex === currentFileIndex;
          return (
            <button
              key={'file-' + node.fileIndex}
              type="button"
              onClick={() => onSelectFile(node.fileIndex)}
              className={cn(
                'flex w-full items-center gap-1.5 rounded py-1 pr-2 text-left text-sm transition',
                isActive
                  ? 'bg-slate-700/70 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
              )}
              style={{ paddingLeft: 8 + node.depth * 14 + 16 }}
            >
              <FileCode2
                className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-sky-400' : 'text-slate-500')}
              />
              <span className="truncate">{node.name}</span>
              {isCurrent && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
