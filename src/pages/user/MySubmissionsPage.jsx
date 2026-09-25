import { useState, useEffect } from "react";
import { Link } from "react-router";
import { submissionApi } from "../../api/submissions";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { FiAward, FiArrowRight } from "react-icons/fi";

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await submissionApi.getMySubmissions();
        setSubmissions(data.items || []);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "submitted") return <span className="badge badge-success text-white text-xs">Submitted</span>;
    if (status === "pending_review") return <span className="badge badge-warning text-slate-800 text-xs">Pending Review</span>;
    if (status === "started") return <span className="badge badge-info text-white text-xs">In Progress</span>;
    return <span className="badge badge-ghost text-xs">{status}</span>;
  };

  if (loading) return <Loader text="Loading submissions..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Assessment History</h1>
        <p className="text-sm text-slate-500 mt-1">Review all your past attempts, scores, and statuses.</p>
      </div>

      {error ? (
        <div className="alert alert-error text-white rounded-2xl">{error}</div>
      ) : submissions.length === 0 ? (
        <EmptyState
          icon={FiAward}
          title="No assessment attempts yet"
          message="You haven't attempted any assessments. Explore the catalog to start!"
          actionLabel="Browse Assessments"
          onAction={() => window.location.assign("/")}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50/80 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th>Test ID</th>
                  <th>Assessment</th>
                  <th>Date Attempted</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {submissions.map((sub) => {
                  const date = new Date(sub.started_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="font-mono text-xs text-slate-500 font-semibold">#{sub.id}</td>
                      <td><span className="font-bold text-slate-800">{sub.assessment?.title || `Assessment #${sub.assessment_id}`}</span></td>
                      <td className="text-xs text-slate-500">{date}</td>
                      <td>
                        {sub.score !== null ? (
                          <span className="font-bold text-slate-800">
                            {sub.score} marks {sub.percentage !== null && <span className="text-xs text-slate-500 font-normal">({Math.round(sub.percentage)}%)</span>}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">--</span>
                        )}
                      </td>
                      <td>{getStatusBadge(sub.status)}</td>
                      <td className="text-right">
                        {sub.status === "started" ? (
                          <Link to={`/exam/${sub.id}`} className="btn btn-xs btn-primary text-white">Resume Test</Link>
                        ) : (
                          <Link to={`/result/${sub.id}`} className="btn btn-xs btn-outline btn-primary inline-flex items-center gap-1">
                            View Result <FiArrowRight />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
