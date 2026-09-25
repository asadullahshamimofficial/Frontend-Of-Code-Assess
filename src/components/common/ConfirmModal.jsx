export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{message}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel} disabled={loading} className="btn btn-sm btn-ghost">
            {cancelText}
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-sm btn-error text-white">
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
