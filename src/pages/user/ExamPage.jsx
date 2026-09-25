import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { submissionApi } from "../../api/submissions";
import { questionApi } from "../../api/questions";
import { assessmentApi } from "../../api/assessments";
import Loader from "../../components/common/Loader";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";
import { FiClock, FiCheckCircle, FiCode, FiSend, FiChevronLeft, FiChevronRight, FiSave } from "react-icons/fi";

export default function ExamPage() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    const initExam = async () => {
      try {
        const detail = await submissionApi.getDetail(submissionId);
        setSubmission(detail.submission);

        if (detail.submission.status !== "started") {
          toast("This assessment has already been submitted.");
          navigate(`/result/${submissionId}`, { replace: true });
          return;
        }

        const assessData = await assessmentApi.getById(detail.submission.assessment_id);
        setAssessment(assessData);

        const qData = await questionApi.getCandidateQuestions({ assessment_id: detail.submission.assessment_id, limit: 100 });
        setQuestions(qData.items || []);

        const existingMcq = {};
        (detail.answers || []).forEach((a) => { existingMcq[a.question_id] = a.answer; });
        setMcqAnswers(existingMcq);

        const existingCoding = {};
        (detail.coding_submissions || []).forEach((c) => { existingCoding[c.question_id] = { code: c.code, language: c.language || "python" }; });
        setCodingAnswers(existingCoding);

        const startedAt = new Date(detail.submission.started_at).getTime();
        const expiryTime = startedAt + assessData.duration * 60 * 1000;
        setTimeLeft(Math.max(0, Math.floor((expiryTime - Date.now()) / 1000)));
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to load examination.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    initExam();
  }, [submissionId, navigate]);

  const handleFinalSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      await submissionApi.submit(submissionId);
      toast.success("Assessment submitted successfully!");
      navigate(`/result/${submissionId}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
      setSubmitModalOpen(false);
    }
  }, [submissionId, navigate]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!autoSubmittedRef.current) {
            autoSubmittedRef.current = true;
            toast.error("Time expired! Submitting automatically.");
            handleFinalSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinalSubmit]);

  const formatTimer = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isQuestionAnswered = (qId, type) => {
    if (type === "mcq") return !!mcqAnswers[qId];
    return !!codingAnswers[qId]?.code?.trim();
  };

  const handleSaveMcq = async (optionText) => {
    if (!currentQuestion) return;
    setSaving(true);
    try {
      await submissionApi.saveAnswer(submissionId, currentQuestion.id, optionText);
      setMcqAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionText }));
      // toast.success("Answer saved", { duration: 1500 });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save answer");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCoding = async () => {
    if (!currentQuestion) return;
    const code = codingAnswers[currentQuestion.id]?.code || "";
    const lang = codingAnswers[currentQuestion.id]?.language || "python";
    setSaving(true);
    try {
      await submissionApi.saveCoding(submissionId, currentQuestion.id, code, lang);
      toast.success("Code saved", { duration: 2000 });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save code");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen text="Preparing assessment..." />;

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 mb-4">No questions found in this assessment.</p>
        <button onClick={() => navigate("/")} className="btn btn-primary btn-sm">Return to Dashboard</button>
      </div>
    );
  }

  const isLowTime = timeLeft !== null && timeLeft < 300;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">{assessment?.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Question {currentIndex + 1} of {questions.length} • {currentQuestion.marks} Marks</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm sm:text-base ${isLowTime ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-slate-100 text-slate-800 border-slate-200"}`}>
            <FiClock className={isLowTime ? "text-red-500" : "text-slate-500"} />
            <span>Time Left: {formatTimer(timeLeft)}</span>
          </div>
          <button onClick={() => setSubmitModalOpen(true)} className="btn btn-primary btn-sm text-white flex items-center gap-1.5">
            <FiSend /> Finish & Submit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs sticky top-24">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Questions Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const answered = isQuestionAnswered(q.id, q.question_type);
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center ${isCurrent ? "bg-primary text-white shadow-xs ring-2 ring-primary/30" : answered ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {idx + 1}
                    {answered && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span>Answered</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300"></span><span>Not answered</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span><span>Current</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span className="badge badge-primary badge-outline text-xs uppercase font-bold tracking-wider">
                {currentQuestion.question_type === "mcq" ? "Multiple Choice" : "Coding Challenge"}
              </span>
              <span className="text-xs font-semibold text-slate-500">Marks: <strong className="text-slate-800">{currentQuestion.marks}</strong></span>
            </div>

            <div className="prose max-w-none text-slate-800 text-base leading-relaxed mb-6 font-medium">
              <p>{currentQuestion.question_text}</p>
            </div>

            {currentQuestion.question_type === "mcq" && (
              <div className="space-y-3 mt-6">
                {(currentQuestion.options || []).map((opt, idx) => {
                  const isSelected = mcqAnswers[currentQuestion.id] === opt.option_text;
                  return (
                    <label
                      key={opt.id || idx}
                      onClick={() => handleSaveMcq(opt.option_text)}
                      className={`flex items-center gap-3.5 p-4 rounded-xl border text-sm cursor-pointer transition-all ${isSelected ? "bg-primary/5 border-primary text-slate-900 font-semibold shadow-xs" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"}`}
                    >
                      <input type="radio" name={`q_${currentQuestion.id}`} checked={isSelected} onChange={() => {}} className="radio radio-primary radio-sm" />
                      <span>{opt.option_text}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQuestion.question_type === "coding" && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiCode className="text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Language:</span>
                    <select
                      value={codingAnswers[currentQuestion.id]?.language || "python"}
                      onChange={(e) => setCodingAnswers((prev) => ({ ...prev, [currentQuestion.id]: { ...prev[currentQuestion.id], language: e.target.value } }))}
                      className="select select-bordered select-xs text-xs font-mono"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <button onClick={handleSaveCoding} disabled={saving} className="btn btn-sm btn-primary text-white flex items-center gap-1.5">
                    <FiSave /> {saving ? "Saving..." : "Save Solution"}
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
                  <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono flex items-center justify-between border-b border-slate-700">
                    <span>solution.{codingAnswers[currentQuestion.id]?.language === "javascript" ? "js" : "py"}</span>
                    <span>UTF-8</span>
                  </div>
                  <textarea
                    rows={16}
                    value={codingAnswers[currentQuestion.id]?.code || ""}
                    onChange={(e) => setCodingAnswers((prev) => ({ ...prev, [currentQuestion.id]: { ...prev[currentQuestion.id], code: e.target.value, language: prev[currentQuestion.id]?.language || "python" } }))}
                    placeholder={`# Write your solution here...\ndef solution():\n    pass`}
                    className="w-full bg-transparent text-emerald-400 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed selection:bg-slate-700"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
              <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((prev) => prev - 1)} className="btn btn-sm btn-ghost border border-slate-200 disabled:opacity-40 flex items-center gap-1">
                <FiChevronLeft /> Previous
              </button>

              <div className="text-xs text-slate-500 font-medium">
                {isQuestionAnswered(currentQuestion.id, currentQuestion.question_type) ? (
                  <span className="text-emerald-600 flex items-center gap-1"><FiCheckCircle /> Saved</span>
                ) : (
                  <span className="text-amber-600">Pending response</span>
                )}
              </div>

              {currentIndex < questions.length - 1 ? (
                <button onClick={() => setCurrentIndex((prev) => prev + 1)} className="btn btn-sm btn-primary text-white flex items-center gap-1">
                  Next <FiChevronRight />
                </button>
              ) : (
                <button onClick={() => setSubmitModalOpen(true)} className="btn btn-sm btn-success text-white flex items-center gap-1">
                  Submit Test <FiSend />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={submitModalOpen}
        title="Submit your assessment?"
        message="Are you sure you want to finish and submit? You cannot change answers after submission."
        confirmText="Yes, Submit Test"
        cancelText="Review Answers"
        loading={submitting}
        onConfirm={handleFinalSubmit}
        onCancel={() => setSubmitModalOpen(false)}
      />
    </div>
  );
}
