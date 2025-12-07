import { cn } from "@/shared/utils";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ChevronLeft = () => (
  <svg
    width="12.6"
    height="8.61"
    viewBox="0 0 13 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.6 0L4 4.3L8.6 8.61" stroke="currentColor" strokeWidth="1" />
    <path d="M0 4.3H8.6" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="12.6"
    height="8.61"
    viewBox="0 0 13 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 8.61L8.6 4.3L4 0" stroke="currentColor" strokeWidth="1" />
    <path d="M12.6 4.3H4" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const DoubleChevronLeft = () => (
  <svg
    width="12.6"
    height="8.61"
    viewBox="0 0 13 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.6 0L4 4.3L8.6 8.61" stroke="currentColor" strokeWidth="1" />
    <path d="M4.6 0L0 4.3L4.6 8.61" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const DoubleChevronRight = () => (
  <svg
    width="12.6"
    height="8.61"
    viewBox="0 0 13 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 8.61L8.6 4.3L4 0" stroke="currentColor" strokeWidth="1" />
    <path d="M8.6 8.61L13.2 4.3L8.6 0" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AdminPaginationProps) {
  const maxVisiblePages = 11;

  // 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 맨 앞으로 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={cn(
          "w-[25px] h-[25px] flex items-center justify-center",
          currentPage === 1
            ? "opacity-30 cursor-not-allowed"
            : "hover:opacity-70"
        )}
      >
        <DoubleChevronLeft />
      </button>

      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "w-[25px] h-[25px] flex items-center justify-center",
          currentPage === 1
            ? "opacity-30 cursor-not-allowed"
            : "hover:opacity-70"
        )}
      >
        <ChevronLeft />
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={cn(
              "w-[25px] h-[25px] rounded-full flex items-center justify-center transition-colors",
              "text-[13px] font-semibold leading-[1.193] tracking-[-0.025em]",
              pageNum === currentPage
                ? "bg-[#1C2882] text-white"
                : "bg-white text-[#B1B6C7] hover:bg-gray-100"
            )}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "w-[25px] h-[25px] flex items-center justify-center",
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed"
            : "hover:opacity-70"
        )}
      >
        <ChevronRight />
      </button>

      {/* 맨 뒤로 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={cn(
          "w-[25px] h-[25px] flex items-center justify-center",
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed"
            : "hover:opacity-70"
        )}
      >
        <DoubleChevronRight />
      </button>
    </div>
  );
}
