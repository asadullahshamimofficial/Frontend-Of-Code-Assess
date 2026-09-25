import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";
import { FiUser, FiMail, FiShield, FiCalendar, FiLogOut } from "react-icons/fi";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal details and authentication status.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-2xl border border-primary/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <span className="badge badge-primary badge-sm uppercase font-bold text-[10px]">{user?.role}</span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: <FiUser />, label: "Display Name", value: user?.name },
            { icon: <FiMail />, label: "Email Address", value: user?.email },
            { icon: <FiShield />, label: "Security Role", value: user?.role },
            { icon: <FiCalendar />, label: "Account Status", value: "Active Member" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-slate-500 flex items-center justify-center border border-slate-200">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Link to="/submissions/my" className="btn btn-outline btn-sm">View My Test History</Link>
          <button onClick={logout} className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 flex items-center gap-1.5">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
