import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authApi } from "../../api/auth";
import { FiCode, FiMail, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValue = email.trim();
    if (!emailValue) {
      toast.error("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      await authApi.forgotPassword(emailValue);
      toast.success("Email verified");
      navigate(`/reset-password?email=${encodeURIComponent(emailValue)}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(Array.isArray(detail) ? detail.map((item) => item.msg).join(", ") : detail || "Something went wrong")
    } finally {setLoading(false);}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400" />
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
                {loading ? "Loading..." : "Reset password"}
              </button>
            </form>

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