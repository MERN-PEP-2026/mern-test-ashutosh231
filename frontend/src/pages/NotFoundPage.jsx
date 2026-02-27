import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

export default function NotFoundPage() {
  return (
    <Layout title="Not Found">
      <div className="card empty">
        <div className="empty__title">Page not found</div>
        <div className="empty__subtitle">
          Go back to <Link to="/">home</Link>.
        </div>
      </div>
    </Layout>
  );
}

