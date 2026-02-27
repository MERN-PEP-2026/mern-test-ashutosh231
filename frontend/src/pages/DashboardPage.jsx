import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import { createTask, deleteTask, fetchTasks, updateTask } from "../api/tasks.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // advanced feature: filter

  const visibleTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchTasks(token);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load tasks";
      setError(msg);
      if (err?.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async ({ title, description }) => {
    setCreating(true);
    setError("");
    try {
      const created = await createTask(token, { title, description });
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create task");
      if (err?.response?.status === 401) logout();
    } finally {
      setCreating(false);
    }
  };

  const onToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    setError("");
    try {
      const updated = await updateTask(token, task._id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update task");
      if (err?.response?.status === 401) logout();
    }
  };

  const onDelete = async (task) => {
    setError("");
    try {
      await deleteTask(token, task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete task");
      if (err?.response?.status === 401) logout();
    }
  };

  return (
    <Layout title="Dashboard">
      <div className="grid">
        <section className="stack">
          <TaskForm onCreate={onCreate} creating={creating} />

          <div className="row row--between">
            <div className="row">
              <div className="segmented">
                <button
                  className={`segmented__btn ${filter === "all" ? "isActive" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`segmented__btn ${filter === "pending" ? "isActive" : ""}`}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </button>
                <button
                  className={`segmented__btn ${filter === "completed" ? "isActive" : ""}`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            <button className="btn btn--secondary" onClick={load} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}

          {loading ? (
            <div className="card empty">Loading tasks…</div>
          ) : (
            <TaskList tasks={visibleTasks} onToggleStatus={onToggleStatus} onDelete={onDelete} />
          )}
        </section>
      </div>
    </Layout>
  );
}

