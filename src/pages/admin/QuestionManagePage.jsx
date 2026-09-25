import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { assessmentApi } from "../../api/assessments";
import { questionApi } from "../../api/questions";
import Breadcrumb from "../../components/common/Breadcrumb";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiCheckCircle, FiHelpCircle, FiX } from "react-icons/fi";

const defaultForm = {
  question_text: "",
  question_type: "mcq",
  marks: 10,
  difficulty: "Medium",
  options: [
    { option_text: "", is_correct: true },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ],
};

export default function QuestionManagePage() {
  const { id: assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assessData, qData] = await Promise.all([
        assessmentApi.getById(assessmentId),
        questionApi.getAdminQuestions({ assessment_id: assessmentId, limit: 100 }),
      ]);
      setAssessment(assessData);
      setQuestions(qData.items || []);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOptionChange = (index, text) => {
    const updated = [...form.options];
    updated[index].option_text = text;
    setForm({ ...form, options: updated });
  };

  const handleCorrectOptionSelect = (index) => {
    setForm({ ...form, options: form.options.map((opt, i) => ({ ...opt, is_correct: i === index })) });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!form.question_text.trim()) { toast.error("Question text is required"); return; }
    if (form.question_type === "mcq") {
      const filled = form.options.filter((o) => o.option_text.trim());
      if (filled.length < 2) { toast.error("Please provide at least 2 options."); return; }
      if (!form.options.some((o) => o.is_correct && o.option_text.trim())) { toast.error("Please mark one option as correct."); return; }
    }

    setSaving(true);
    try {
      const payload = {
        question_text: form.question_text.trim(),
        question_type: form.question_type,
        marks: Number(form.marks),
        difficulty: form.difficulty,
        options: form.question_type === "mcq" ? form.options.filter((o) => o.option_text.trim()) : [],
      };
      await questionApi.create(assessmentId, payload);
      toast.success("Question added!");
      setIsModalOpen(false);
      setForm(defaultForm);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create question.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await questionApi.delete(deleteTarget.id);
      toast.success("Question deleted.");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete question.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading questions..." />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: "Admin", href: "/admin" },
        { label: "Assessments", href: "/admin/assessments" },
        { label: assessment?.title || "Assessment", href: `/admin/assessments/${assessmentId}/edit` },
        { label: "Manage Questions" },
      ]} />

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-primary badge-outline text-xs font-semibold mb-2">{assessment?.category}</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{assessment?.title}</h1>
          <p className="text-xs text-slate-500 mt-1">Total questions: <strong className="text-slate-700">{questions.length}</strong></p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary text-white shadow-xs flex items-center gap-2 self-start sm:self-auto">
          <FiPlus className="text-lg" /> Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <EmptyState icon={FiHelpCircle} title="No questions added yet" message="Add MCQ or coding questions to complete this assessment." actionLabel="Add First Question" onAction={() => setIsModalOpen(true)} />
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                    <span className="badge badge-sm font-semibold capitalize">{q.question_type === "mcq" ? "Multiple Choice" : "Coding Challenge"}</span>
                    <span className="text-xs text-slate-500">Marks: <strong>{q.marks}</strong></span>
                    <span className="text-xs text-slate-400 capitalize">• {q.difficulty}</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-base leading-relaxed pt-1">{q.question_text}</p>
                  {q.question_type === "mcq" && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2">
                      {q.options.map((opt) => (
                        <div key={opt.id} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${opt.is_correct ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          {opt.is_correct && <FiCheckCircle className="text-emerald-600 text-sm" />}
                          <span>{opt.option_text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setDeleteTarget(q)} className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50 p-2" title="Delete Question">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Add New Question</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-ghost btn-circle text-slate-400 hover:text-slate-700">
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Question Type</label>
                  <select value={form.question_type} onChange={(e) => setForm({ ...form, question_type: e.target.value })} className="select select-bordered select-sm w-full text-xs">
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="coding">Coding Challenge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marks</label>
                  <input type="number" min="1" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} className="input input-bordered input-sm w-full text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="select select-bordered select-sm w-full text-xs">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question Description *</label>
                <textarea rows={3} value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} placeholder="e.g. What is the time complexity of searching in a Balanced BST?" className="textarea textarea-bordered w-full text-sm leading-relaxed" />
              </div>

              {form.question_type === "mcq" && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-slate-700">Options & Correct Answer (select the radio of correct option):</p>
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="radio" name="correct_option" checked={opt.is_correct} onChange={() => handleCorrectOptionSelect(i)} className="radio radio-primary radio-sm shrink-0" />
                      <input type="text" value={opt.option_text} onChange={(e) => handleOptionChange(i, e.target.value)} placeholder={`Option ${i + 1} text`} className={`input input-bordered input-sm flex-1 text-xs ${opt.is_correct ? "border-emerald-400 bg-emerald-50/50" : ""}`} />
                      {opt.is_correct && <span className="text-[10px] text-emerald-600 font-bold uppercase shrink-0">Correct</span>}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm text-white px-6">
                  {saving && <span className="loading loading-spinner loading-xs"></span>}
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Question?"
        message="Are you sure you want to remove this question?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
