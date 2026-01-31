import { useEffect, useState } from "react";

function FeedbackForm({ onSave, editData }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  // Load data when editing
  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      rating: Number(form.rating), // ensure number type
      id: Date.now(),
    });

    // reset after submit
    setForm({ name: "", email: "", rating: 5, comment: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 my-4">
      <h3>{editData ? "Edit Feedback" : "Add Feedback"}</h3>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="border p-2 block mb-2"
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="border p-2 block mb-2"
      />

      <select
        name="rating"
        value={form.rating}
        onChange={handleChange}
        className="border p-2 block mb-2"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} Star
          </option>
        ))}
      </select>

      <textarea
        name="comment"
        value={form.comment}
        onChange={handleChange}
        placeholder="Your feedback..."
        className="border p-2 block mb-2"
      />

      <button className="bg-green-600 text-white px-4 py-2">
        {editData ? "Update Feedback" : "Submit Feedback"}
      </button>
    </form>
  );
}

export default FeedbackForm;
