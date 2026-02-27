export default function TaskList({ tasks, onToggleStatus, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="card empty">
        <div className="empty__title">No tasks yet</div>
        <div className="empty__subtitle">Create your first task above.</div>
      </div>
    );
  }

  return (
    <div className="list">
      {tasks.map((t) => (
        <div key={t._id} className="card task">
          <div className="task__main">
            <div className="task__top">
              <div className="task__title">{t.title}</div>
              <span className={`pill pill--${t.status}`}>{t.status}</span>
            </div>
            {t.description ? <div className="task__desc">{t.description}</div> : null}
          </div>
          <div className="task__actions">
            <button
              className="btn btn--secondary"
              onClick={() => onToggleStatus(t)}
              title="Toggle status"
            >
              Mark {t.status === "completed" ? "Pending" : "Completed"}
            </button>
            <button className="btn btn--danger" onClick={() => onDelete(t)} title="Delete task">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

