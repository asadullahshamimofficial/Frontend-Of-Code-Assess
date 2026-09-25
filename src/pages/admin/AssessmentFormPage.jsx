import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { assessmentApi } from "../../api/assessments";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { FiSave, FiArrowLeft } from "react-icons/fi";

export default function AssessmentFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Fullstack",
    difficulty: "Medium",
    duration: 60,
    total_marks: 100,
    passing_marks: 60,
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      assessmentApi.getById(id)
        .then((data) => setForm(data))
        .catch(() => { toast.error("Failed to load"); navigate("/admin/assessments"); })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (Number(form.passing_marks) > Number(form.total_marks)) {
      return toast.error("Passing marks cannot exceed total marks");
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        total_marks: Number(form.total_marks),
        passing_marks: Number(form.passing_marks),
      };
      if (isEdit) {
        await assessmentApi.update(id, payload);
        toast.success("Updated successfully");
      } else {
        const created = await assessmentApi.create(payload);
        toast.success("Created successfully");
        navigate(`/admin/assessments/${created.id}/questions`);
        return;
      }
      navigate("/admin/assessments");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader text="Loading form..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? "Edit Assessment" : "Create Assessment"}</h1>
          <Link to="/admin/assessments" className="btn btn-ghost btn-sm text-slate-500"><FiArrowLeft /> Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input input-bordered w-full text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="textarea textarea-bordered w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="select select-bordered w-full text-sm"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="select select-bordered w-full text-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (m)</label>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="input input-bordered w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Total Marks</label>
              <input
                type="number"
                min="1"
                value={form.total_marks}
                onChange={(e) => setForm({ ...form, total_marks: e.target.value })}
                className="input input-bordered w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Passing</label>
              <input
                type="number"
                min="1"
                value={form.passing_marks}
                onChange={(e) => setForm({ ...form, passing_marks: e.target.value })}
                className="input input-bordered w-full text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={form.status === "draft"}
                  onChange={() => setForm({ ...form, status: "draft" })}
                  className="radio radio-primary radio-sm"
                />
                <span>Draft</span>
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={form.status === "published"}
                  onChange={() => setForm({ ...form, status: "published" })}
                  className="radio radio-primary radio-sm"
                />
                <span className="font-semibold text-emerald-600">Published</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Link to="/admin/assessments" className="btn btn-ghost btn-sm">Cancel</Link>
            <button type="submit" disabled={loading} className="btn btn-primary text-white btn-sm px-6">
              <FiSave /> {loading ? "Saving..." : "Save Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
