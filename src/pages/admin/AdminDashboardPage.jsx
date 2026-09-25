import { useState, useEffect } from "react";
import { Link } from "react-router";
import { assessmentApi } from "../../api/assessments";
import { submissionApi } from "../../api/submissions";
import Loader from "../../components/common/Loader";
import { FiBookOpen, FiAward, FiCheckCircle, FiPlusCircle, FiArrowRight } from "react-icons/fi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalAssessments: 0, totalSubmissions: 0, publishedCount: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      assessmentApi.getAll({ limit: 5, sort_by: "created_at", sort_order: "desc" }),
      submissionApi.getAdminAll(),
    ]).then(([aRes, sRes]) => {
      const aData = aRes.status === "fulfilled" ? aRes.value : { items: [], total: 0 };
      const sData = sRes.status === "fulfilled" ? sRes.value : [];
      setRecent(aData.items || []);
      setStats({
        totalAssessments: aData.total || 0,
        totalSubmissions: Array.isArray(sData) ? sData.length : sData.total || 0,
        publishedCount: (aData.items || []).filter((a) => a.status === "published").length,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of tests and candidate activity</p>
        </div>
        <Link to="/admin/assessments/create" className="btn btn-primary text-white btn-sm">
          <FiPlusCircle /> New Test
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <FiBookOpen />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Assessments</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalAssessments}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Published Active</p>
            <p className="text-2xl font-bold text-slate-800">{stats.publishedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <FiAward />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Attempts</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalSubmissions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-sm">Recent Tests</h2>
          <Link to="/admin/assessments" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Marks</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="font-semibold text-slate-800">{item.title}</td>
                  <td><span className="badge badge-outline text-xs">{item.category}</span></td>
                  <td className="capitalize">{item.difficulty}</td>
                  <td>{item.total_marks}</td>
                  <td>
                    <span className={`badge badge-sm text-white text-[10px] font-bold ${item.status === "published" ? "badge-success" : "badge-warning"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link to={`/admin/assessments/${item.id}/edit`} className="btn btn-xs btn-ghost text-primary">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
