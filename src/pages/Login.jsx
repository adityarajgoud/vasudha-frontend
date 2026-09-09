import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Globe,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP Reset Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStep, setOtpStep] = useState(1); // 1: Send Email, 2: Enter OTP & New Password
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalMsg, setModalMsg] = useState({ type: "", text: "" });
  const [modalLoading, setModalLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data.user, data.token);

      if (data.user.role === "SUPER_ADMIN") {
        navigate("/superadmin/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setModalMsg({ type: "", text: "" });
    setModalLoading(true);

    try {
      const { data } = await API.post("/auth/forgot-password", {
        email: resetEmail,
      });
      setModalMsg({ type: "success", text: data.message });
      setOtpStep(2);
    } catch (err) {
      setModalMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to dispatch OTP.",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setModalMsg({ type: "", text: "" });
    setModalLoading(true);

    try {
      const { data } = await API.post("/auth/reset-password", {
        email: resetEmail,
        otp,
        password: newPassword,
      });
      setModalMsg({ type: "success", text: data.message });
      setTimeout(() => {
        setShowOtpModal(false);
        setOtpStep(1);
        setModalMsg({ type: "", text: "" });
      }, 2000);
    } catch (err) {
      setModalMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-200">
            <Globe className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Administrative Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Super Admin & Admin Access
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@vasudhaindia.org"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(true);
                  setResetEmail(email);
                }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot PIN/Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-md shadow-emerald-200 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Default Super Admin:{" "}
            <span className="text-slate-600 font-mono">
              superadmin@vasudhaindia.org
            </span>
          </p>
        </div>
      </div>

      {/* Forgot Password OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Reset Password with OTP
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {otpStep === 1
                ? "Enter your registered email to receive a 6-digit reset PIN."
                : "Enter the 6-digit OTP dispatched to your email and your new password."}
            </p>

            {modalMsg.text && (
              <div
                className={`mb-4 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  modalMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {modalMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {modalMsg.text}
              </div>
            )}

            {otpStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-3">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@vasudhaindia.org"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="w-1/2 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    {modalLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full px-3 py-2 text-center tracking-widest font-mono text-lg bg-slate-50 border border-slate-200 rounded-lg"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 chars)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpStep(1)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="w-1/2 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    {modalLoading ? "Updating..." : "Set Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
