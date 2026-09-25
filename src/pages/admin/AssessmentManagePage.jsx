import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { assessmentApi } from "../../api/assessments";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";
import { FiPlusCircle, FiEdit, FiTrash2, FiHelpCircle, FiSearch } from "react-icons/fi";

export default function AssessmentManagePage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort_by: "created_at", sort_order: "desc" };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const data = await assessmentApi.getAll(params);
      setAssessments(data.items || []);
      setTotalPages(data.total_pages || 1);
    } catch {
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await assessmentApi.delete(deleteTarget.id);
      toast.success("Deleted successfully");
      setDeleteTarget(null);
      loadData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Assessments</h1>
          <p className="text-sm text-slate-500">Create, edit, and publish developer tests</p>
        </div>
        <Link to="/admin/assessments/create" className="btn btn-primary text-white btn-sm">
          <FiPlusCircle /> New Assessment
        </Link>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="input input-bordered input-sm w-full pl-9 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="select select-bordered select-sm text-xs"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <Loader text="Loading assessments..." />
      ) : assessments.length === 0 ? (
        <EmptyState title="No assessments found" actionLabel="Create Test" onAction={() => window.location.assign("/admin/assessments/create")} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Passing/Total</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="font-semibold text-slate-800">{item.title}</td>
                    <td><span className="badge badge-outline text-xs">{item.category}</span></td>
                    <td className="capitalize">{item.difficulty}</td>
                    <td>{item.duration}m</td>
                    <td>{item.passing_marks} / {item.total_marks}</td>
                    <td>
                      <span className={`badge badge-sm text-white text-[10px] font-bold ${item.status === "published" ? "badge-success" : "badge-warning"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-right space-x-1">
                      <Link to={`/admin/assessments/${item.id}/questions`} className="btn btn-xs btn-ghost text-indigo-600" title="Questions">
                        <FiHelpCircle /> Questions
                      </Link>
                      <Link to={`/admin/assessments/${item.id}/edit`} className="btn btn-xs btn-ghost" title="Edit">
                        <FiEdit />
                      </Link>
                      <button onClick={() => setDeleteTarget(item)} className="btn btn-xs btn-ghost text-red-600" title="Delete">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} hasNext={page < totalPages} hasPrevious={page > 1} />
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Assessment?"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
