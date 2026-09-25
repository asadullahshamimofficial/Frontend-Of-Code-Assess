import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, totalPages, onPageChange, hasNext, hasPrevious }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-white border-t border-slate-200 text-sm text-slate-600">
      <span>Page {page} of {totalPages}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious && page <= 1}
          className="btn btn-sm btn-ghost border border-slate-200"
        >
          <FiChevronLeft /> Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext && page >= totalPages}
          className="btn btn-sm btn-ghost border border-slate-200"
        >
          Next <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
