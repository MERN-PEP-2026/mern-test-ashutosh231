import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { requestSignupOtp, verifySignupOtp } from "../api/auth.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { login: saveToken } = useAuth();

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestSignupOtp(form);
      setOtpSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifySignupOtp({ email: form.email, otp });
      if (res?.token) {
        saveToken(res.token);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Register">
      <div className="authCard card">
        <h2 className="h2">Create account</h2>
        <p className="muted">
          Register with email OTP verification. We will send a 6-digit code to your email.
        </p>

        <form className="form" onSubmit={otpSent ? onVerifyOtp : onSubmit}>
          <div className="formRow">
            <label className="label">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={onChange("name")}
              disabled={otpSent}
            />
          </div>
          <div className="formRow">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              autoComplete="email"
              disabled={otpSent}
            />
          </div>
          <div className="formRow">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={onChange("password")}
              autoComplete="new-password"
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <div className="formRow">
              <label className="label">OTP</label>
              <input
                className="input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code from email"
              />
            </div>
          )}

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn btn--full" type="submit" disabled={loading}>
            {loading ? "Please wait…" : otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <div className="muted small">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </Layout>
  );
}

