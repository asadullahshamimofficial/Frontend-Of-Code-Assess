import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { FiCode, FiLogOut, FiUser, FiAward, FiShield, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path ? "text-primary bg-primary/10 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <FiCode className="text-xl" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                Code<span className="text-primary">Assess</span>
              </span>
            </Link>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                <Link to="/" className={linkClass("/")}>Assessments</Link>
                <Link to="/submissions/my" className={linkClass("/submissions/my")}>My Submissions</Link>
                {isAdmin && (
                  <>
                    <Link to="/admin" className={linkClass("/admin")}>Admin Dashboard</Link>
                    <Link to="/admin/assessments" className={linkClass("/admin/assessments")}>Manage Tests</Link>
                    <Link to="/admin/users" className={linkClass("/admin/users")}>Users</Link>
                  </>
                )}
              </nav>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span>{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50">
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm text-white">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm">
              {open ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <p className="text-xs text-slate-500 font-semibold mb-2">{user?.name} ({user?.role})</p>
              <Link to="/" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-slate-700">Assessments</Link>
              <Link to="/submissions/my" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-slate-700">My Submissions</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-slate-700">Profile</Link>
              {isAdmin && (
                <>
                  <Link to="/admin" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-amber-700 font-medium">Admin Dashboard</Link>
                  <Link to="/admin/assessments" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-amber-700 font-medium">Manage Tests</Link>
                  <Link to="/admin/users" onClick={() => setOpen(false)} className="block py-1.5 text-sm text-amber-700 font-medium">Users</Link>
                </>
              )}
              <button onClick={() => { setOpen(false); handleLogout(); }} className="block py-1.5 text-sm text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn btn-outline btn-sm w-full mb-2">Log In</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="btn btn-primary btn-sm w-full text-white">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
