import { FiInbox } from "react-icons/fi";

export default function EmptyState({
  title = "No data found",
  message = "There are no records to display at this moment.",
  icon: Icon = FiInbox,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mb-3">
        <Icon />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm mt-1 mb-4">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
