import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { submissionApi } from "../../api/submissions";
import Loader from "../../components/common/Loader";
import { FiCheckCircle, FiXCircle, FiClock, FiAward, FiBarChart2, FiArrowLeft } from "react-icons/fi";

export default function ResultPage() {
  const { submissionId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await submissionApi.getResult(submissionId);
        setResult(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load result.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [submissionId]);

  if (loading) return <Loader fullScreen text="Calculating score..." />;

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
          <FiXCircle />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Result Not Available</h2>
        <p className="text-sm text-slate-500">{error || "Could not retrieve score."}</p>
        <Link to="/" className="btn btn-primary btn-sm text-white">Back to Assessments</Link>
      </div>
    );
  }

  const isPendingReview = result.status === "pending_review";
  const passed = result.passed;
  const percentage = result.percentage !== null ? Math.round(result.percentage) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className={`rounded-3xl p-8 sm:p-10 text-white shadow-lg text-center relative overflow-hidden ${isPendingReview ? "bg-gradient-to-r from-amber-500 to-orange-600" : passed ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-red-500 to-rose-600"}`}>
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-4xl mb-4">
          {isPendingReview ? <FiClock /> : passed ? <FiCheckCircle /> : <FiXCircle />}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {isPendingReview ? "Submitted for Review" : passed ? "Congratulations! You Passed!" : "Assessment Not Passed"}
        </h1>
        <p className="mt-2 text-white/90 text-sm sm:text-base max-w-lg mx-auto">
          {isPendingReview
            ? "Your submission has coding challenges pending review. Your MCQ score is recorded below."
            : passed
            ? "You have successfully demonstrated the required proficiency."
            : "You did not reach the passing threshold. Review and try again."}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FiBarChart2 className="text-primary" /> Performance Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Score Obtained</p>
            <p className="text-3xl font-black text-slate-900">
              {result.score} <span className="text-sm font-semibold text-slate-400">/ {result.total_marks}</span>
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Percentage</p>
            <p className="text-3xl font-black text-primary">{isPendingReview ? "Pending" : `${percentage}%`}</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Passing Threshold</p>
            <p className="text-3xl font-black text-slate-700">
              {result.passing_marks} <span className="text-sm font-semibold text-slate-400">Marks</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-xs text-slate-600 font-semibold">
            <span>Score progress</span>
            <span>{percentage}%</span>
          </div>
          <progress className={`progress w-full h-3 ${passed ? "progress-success" : "progress-error"}`} value={percentage} max="100"></progress>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/submissions/my" className="btn btn-outline btn-sm text-slate-700 w-full sm:w-auto flex items-center gap-1.5">
            <FiAward /> View All Submissions
          </Link>
          <Link to="/" className="btn btn-primary btn-sm text-white w-full sm:w-auto flex items-center gap-1.5">
            <FiArrowLeft /> Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
