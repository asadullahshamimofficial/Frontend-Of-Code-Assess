import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { assessmentApi } from "../../api/assessments";
import { submissionApi } from "../../api/submissions";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { FiClock, FiAward, FiCheckCircle, FiPlay } from "react-icons/fi";

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    assessmentApi.getById(id)
      .then(setAssessment)
      .catch(() => toast.error("Assessment not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const sub = await submissionApi.start(assessment.id);
      navigate(`/exam/${sub.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not start test");
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <Loader text="Loading test details..." />;
  if (!assessment) return <div className="text-center py-12">Assessment not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <span className="badge badge-outline text-xs mr-2">{assessment.category}</span>
          <span className="badge badge-ghost text-xs capitalize">{assessment.difficulty}</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">{assessment.title}</h1>
          <p className="text-slate-600 text-sm mt-2">{assessment.description || "No description available."}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl text-center">
          <div>
            <p className="text-xs text-slate-500">Duration</p>
            <p className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5"><FiClock /> {assessment.duration}m</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Marks</p>
            <p className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5"><FiAward /> {assessment.total_marks}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Passing Score</p>
            <p className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5"><FiCheckCircle /> {assessment.passing_marks}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-1.5">
          <p className="font-bold text-slate-700">Instructions:</p>
          <p>• The timer will begin immediately when you click Start.</p>
          <p>• Save your answers before moving forward.</p>
          <p>• Ensure a stable internet connection during your session.</p>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button onClick={() => navigate("/")} className="btn btn-ghost btn-sm">Cancel</button>
          <button onClick={handleStart} disabled={starting} className="btn btn-primary text-white btn-sm px-6">
            <FiPlay /> {starting ? "Starting..." : "Start Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}
