import { useState } from "react";
import { Link } from "react-router";
import { authApi } from "../../api/auth";
import { FiCode, FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
      toast.success("Reset link created");
    } catch {
      toast.error("Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
              <FiCode className="text-2xl" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
          <p className="text-sm text-slate-500">We will send reset instructions to your email</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <FiCheckCircle className="text-4xl text-emerald-500 mx-auto" />
              <p className="text-sm text-slate-600">If {email} exists, reset instructions have been generated.</p>
              <Link to="/reset-password" className="btn btn-outline btn-sm">Enter Reset Token</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input input-bordered w-full pl-9 text-sm"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full text-white">
                {loading ? "Sending..." : "Send Reset Instructions"}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
              <FiArrowLeft /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
