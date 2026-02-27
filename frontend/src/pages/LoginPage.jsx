import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { login } from "../api/auth.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: saveToken, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form);
      saveToken(res.token);
      const to = location.state?.from || "/dashboard";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login">
      <div className="authCard card">
        <h2 className="h2">Welcome back</h2>
        <p className="muted">Login to view and manage your tasks.</p>

        <form className="form" onSubmit={onSubmit}>
          <div className="formRow">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              autoComplete="email"
            />
          </div>
          <div className="formRow">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={onChange("password")}
              autoComplete="current-password"
            />
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn btn--full" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="muted small">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </Layout>
  );
}

