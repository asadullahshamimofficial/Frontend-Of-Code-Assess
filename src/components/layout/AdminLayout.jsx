import { Outlet, Link, useLocation } from "react-router";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { FiGrid, FiBookOpen, FiPlusCircle, FiUsers } from "react-icons/fi";

export default function AdminLayout() {
  const location = useLocation();

  const links = [
    { label: "Overview", href: "/admin", icon: FiGrid },
    { label: "Manage Tests", href: "/admin/assessments", icon: FiBookOpen },
    { label: "Create Test", href: "/admin/assessments/create", icon: FiPlusCircle },
    { label: "Users", href: "/admin/users", icon: FiUsers },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
