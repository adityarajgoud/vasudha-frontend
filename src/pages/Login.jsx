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
    <div className="flex min-h-[85vh] items-center justify-center bg-slate-50 px-4 py-8 sm:py-10">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 sm:mb-5">
              <Globe className="h-6 w-6 text-white" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Administrative portal
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to access the Vasudha administration platform.
            </p>
          </div>

          {/* Login Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@vasudhaindia.org"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(true);
                    setResetEmail(email);
                  }}
                  className="text-left text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-emerald-600 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Authenticating..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-slate-100 pt-5 sm:mt-7">
            <p className="break-words text-xs leading-5 text-slate-400">
              Default Super Admin:{" "}
              <span className="font-mono text-slate-600">
                superadmin@vasudhaindia.org
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-3 py-4 sm:items-center sm:px-4 sm:py-6">
          <div className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl sm:max-h-[calc(100vh-3rem)]">
            {/* Modal Header */}
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <KeyRound className="h-4 w-4 text-slate-600" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Reset password
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {otpStep === 1
                      ? "Enter your registered email to receive a 6-digit reset PIN."
                      : "Enter the 6-digit OTP sent to your email and choose a new password."}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Modal Message */}
              {modalMsg.text && (
                <div
                  className={`mb-5 flex items-start gap-2.5 rounded-lg border p-3.5 text-sm ${
                    modalMsg.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {modalMsg.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}

                  <span className="min-w-0 break-words">{modalMsg.text}</span>
                </div>
              )}

              {/* Step 1: Request OTP */}
              {otpStep === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@vasudhaindia.org"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setShowOtpModal(false)}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-1"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="h-10 w-full rounded-lg bg-emerald-600 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                    >
                      {modalLoading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Reset Password */
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Verification code
                    </label>

                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-center font-mono text-lg tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      New password
                    </label>

                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-1"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="h-10 w-full rounded-lg bg-emerald-600 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                    >
                      {modalLoading ? "Updating..." : "Set password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
