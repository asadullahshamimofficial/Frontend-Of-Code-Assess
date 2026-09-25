import { Link } from "react-router";
import { FiCode } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <FiCode className="text-primary text-lg" />
          <span className="font-semibold text-slate-800">CodeAssess</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-primary">Assessments</Link>
          <Link to="/submissions/my" className="hover:text-primary">Submissions</Link>
          <Link to="/profile" className="hover:text-primary">Profile</Link>
        </div>
      </div>
    </footer>
  );
}
