import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "./AuthInput";
import { forgotPassword } from "../../services/authService";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setSubmitting(true);

      const data = await forgotPassword(email.trim());

      if (!data.success) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess(
        "Password reset link has been sent to your email."
      );

      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-9">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Account recovery
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          Forgot your password?
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted">
          Enter the email associated with your account and we'll
          send you a secure password reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setSuccess("");
          }}
          placeholder="you@example.com"
        />

        {/* Error */}
        {error && (
          <div className="rounded-[var(--radius-sm)] border border-status-danger/20 bg-status-danger/5 px-4 py-3">
            <p className="text-sm text-status-danger">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-[var(--radius-sm)] border border-status-success/20 bg-status-success/5 px-4 py-3">
            <p className="text-sm text-status-success">
              {success}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-[var(--radius-sm)] bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {/* Back */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => navigate("/auth")}
          className="text-sm font-semibold text-brand transition hover:text-brand-dark"
        >
          ← Back to sign in
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;