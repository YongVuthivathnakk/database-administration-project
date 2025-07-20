import { useState } from "react";

export default function BeekeeperForm({ initialData = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    Name: initialData.Name || "",
    Email: initialData.Email || "",
    Phone: initialData.Phone || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData.BeekeeperID ? "Edit Beekeeper" : "Add Beekeeper"}</h2>
      <label htmlFor="beekeeper-name">Name:
        <input
          id="beekeeper-name"
          name="Name"
          value={form.Name}
          onChange={handleChange}
          required
        />
      </label>
      <label htmlFor="beekeeper-email">Email:
        <input
          id="beekeeper-email"
          name="Email"
          type="email"
          value={form.Email}
          onChange={handleChange}
          required
        />
      </label>
      <label htmlFor="beekeeper-phone">Phone:
        <input
          id="beekeeper-phone"
          name="Phone"
          value={form.Phone}
          onChange={handleChange}
          required
        />
      </label>
      <button className="main" type="submit">
        {initialData.BeekeeperID ? "Update" : "Add"} Beekeeper
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: '1rem' }}>
          Cancel
        </button>
      )}
      <span className="bee-sticker" role="img" aria-label="bee">
        🐝
        <span className="bee-heart">💛</span>
      </span>
    </form>
  );
}