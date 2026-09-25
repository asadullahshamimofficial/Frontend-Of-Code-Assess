export default function Loader({ text = "Loading...", fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <span className="loading loading-spinner text-primary loading-lg"></span>
        <p className="text-slate-500 text-sm">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2">
      <span className="loading loading-spinner text-primary loading-md"></span>
      {text && <p className="text-slate-500 text-sm">{text}</p>}
    </div>
  );
}
