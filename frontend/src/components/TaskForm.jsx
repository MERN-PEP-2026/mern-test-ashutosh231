import { useState } from "react";

export default function TaskForm({ onCreate, creating }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="card form" onSubmit={submit}>
      <div className="formRow">
        <label className="label">Title</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Finish assignment"
        />
      </div>
      <div className="formRow">
        <label className="label">Description</label>
        <textarea
          className="input textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details…"
          rows={3}
        />
      </div>
      <div className="row row--right">
        <button className="btn" type="submit" disabled={creating || !title.trim()}>
          {creating ? "Creating…" : "Create Task"}
        </button>
      </div>
    </form>
  );
}

