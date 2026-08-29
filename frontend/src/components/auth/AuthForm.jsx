import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthInput from "./AuthInput";

const AuthForm = () => {
  const [mode, setMode] = useState("signin");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signin, signup } = useAuth();
  const navigate = useNavigate();

  const isSignup = mode === "signup";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const validate = () => {
    if (isSignup && !formData.name.trim()) {
      return "Please enter your name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email.";
    }

    if (!formData.email.includes("@")) {
      return "Please enter a valid email.";
    }

    if (!formData.password) {
      return "Please enter your password.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = isSignup
        ? await signup(formData)
        : await signin({
            email: formData.email,
            password: formData.password,
          });

      if (!data.success) {
        setError(data.message || "Something went wrong.");
        return;
      }

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isSignup ? "signin" : "signup");
    setError("");

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div>
      <div className="mb-9">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {isSignup ? "Create account" : "Welcome back"}
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          {isSignup ? "Begin your journey." : "Good to see you again."}
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted">
          {isSignup
            ? "Create your account to get started."
            : "Sign in to continue to your workspace."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {isSignup && (
          <AuthInput
            label="Full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        )}

        <AuthInput
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
        />

        {error && (
          <div className="rounded-[var(--radius-sm)] border border-status-danger/20 bg-status-danger/5 px-4 py-3">
            <p className="text-sm text-status-danger">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-[var(--radius-sm)] bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Please wait..."
            : isSignup
            ? "Create account"
            : "Sign in"}
        </button>

      </form>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs uppercase tracking-wider text-muted">
          or
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <p className="mt-7 text-center text-sm text-muted">
        {isSignup
          ? "Already have an account?"
          : "Don't have an account?"}{" "}

        <button
          type="button"
          onClick={switchMode}
          className="font-semibold text-brand transition hover:text-brand-dark"
        >
          {isSignup ? "Sign in" : "Create one"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;