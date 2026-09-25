import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { authApi } from "../../api/auth";
import { FiCode, FiKey, FiLock, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!token.trim()) errs.token = "Reset token is required";
    if (!newPassword) errs.newPassword = "New password is required";
    else if (newPassword.length < 6) errs.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.resetPassword(token.trim(), newPassword);
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xs">
              <FiCode className="text-2xl" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset your password</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your reset token and choose a new password.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                <FiCheckCircle />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Password Updated!</h3>
              <p className="text-sm text-slate-500">Redirecting to login...</p>
              <Link to="/login" className="btn btn-primary btn-sm text-white">Log In Now</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Reset Token</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiKey className="text-base" />
                  </div>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => { setToken(e.target.value); if (errors.token) setErrors({ ...errors, token: null }); }}
                    placeholder="Paste token received"
                    className={`input input-bordered w-full pl-10 text-sm font-mono ${errors.token ? "input-error" : ""}`}
                  />
                </div>
                {errors.token && <p className="text-xs text-red-600 mt-1 font-medium">{errors.token}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiLock className="text-base" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); if (errors.newPassword) setErrors({ ...errors, newPassword: null }); }}
                    placeholder="Min 6 characters"
                    className={`input input-bordered w-full pl-10 pr-10 text-sm ${errors.newPassword ? "input-error" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-xs text-red-600 mt-1 font-medium">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiLock className="text-base" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null }); }}
                    placeholder="Re-enter password"
                    className={`input input-bordered w-full pl-10 text-sm ${errors.confirmPassword ? "input-error" : ""}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1 font-medium">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full text-white shadow-xs mt-2">
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                Update Password
              </button>
            </form>
          )}

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">Back to log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
