import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthInput from "../components/auth/AuthInput";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid password reset link.");
      return;
    }

    try {
      setSubmitting(true);

      const data = await resetPassword(password, token);

      if (!data.success) {
        setError(data.message || "Unable to reset password.");
        return;
      }

      setSuccess(
        "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to reset your password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-page px-6 py-10 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card shadow-card lg:grid-cols-2">

          {/* Brand side */}
          <div className="hidden min-h-[600px] flex-col justify-between bg-brand p-12 text-white lg:flex">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                Verdant Noir
              </p>

              <div className="mt-24 max-w-md">
                <p className="mb-5 text-sm uppercase tracking-[0.2em] text-white/50">
                  Secure access
                </p>

                <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight">
                  A fresh start,
                  <br />
                  securely.
                </h1>

                <p className="mt-7 max-w-sm text-sm leading-7 text-white/65">
                  Choose a new password and continue with
                  confidence.
                </p>
              </div>
            </div>

            <p className="text-xs tracking-wide text-white/40">
              © 2026 Verdant Noir
            </p>

          </div>

          {/* Form side */}
          <div className="flex min-h-[600px] items-center justify-center p-7 sm:p-12">
            <div className="w-full max-w-md">

              <div className="mb-9">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Password recovery
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-ink">
                  Create a new password.
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted">
                  Choose a strong password with at least 8
                  characters.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <AuthInput
                  label="New password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Minimum 8 characters"
                />

                <AuthInput
                  label="Confirm password"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter your password again"
                />

                {error && (
                  <div className="rounded-[var(--radius-sm)] border border-status-danger/20 bg-status-danger/5 px-4 py-3">
                    <p className="text-sm text-status-danger">
                      {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="rounded-[var(--radius-sm)] border border-status-success/20 bg-status-success/5 px-4 py-3">
                    <p className="text-sm text-status-success">
                      {success}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !!success}
                  className="w-full rounded-[var(--radius-sm)] bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Resetting..."
                    : "Reset password"}
                </button>

              </form>

              {success && (
                <button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="mt-7 w-full text-center text-sm font-semibold text-brand transition hover:text-brand-dark"
                >
                  Continue to sign in →
                </button>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;