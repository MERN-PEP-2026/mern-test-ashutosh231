import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Layout({ title, children }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="topbar__left">
          <Link to="/" className="brand">
            Task Manager
          </Link>
          {title ? <span className="pageTitle">{title}</span> : null}
        </div>
        <div className="topbar__right">
          {isAuthenticated ? (
            <button className="btn btn--ghost" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <div className="authLinks">
              <Link className="link" to="/login">
                Login
              </Link>
              <Link className="link" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="container">{children}</main>
    </div>
  );
}

