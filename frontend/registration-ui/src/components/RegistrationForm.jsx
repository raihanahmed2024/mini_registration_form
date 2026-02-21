import { useState } from "react";
import api from "../api";

const cities = ["Riyadh", "Jeddah", "Dammam", "Makkah"];

export default function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    city: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await api.post("/registrations", form);
      alert("Registration Successful!");
      setForm({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        city: ""
      });
      onSuccess(); // [cite: 23]
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // [cite: 40, 41]
      } else {
        alert("An error occurred while saving.");
      }
    } finally {
      setLoading(false); // [cite: 22]
    }
  };

  return (
    <form onSubmit={handleSubmit} className="styled-form">
      <div className="form-group">
        <label>First Name</label>
        <input name="firstName" placeholder="Enter first name" value={form.firstName} onChange={handleChange} />
        {errors.FirstName && <div className="error-msg">{errors.FirstName}</div>}
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input name="lastName" placeholder="Enter last name" value={form.lastName} onChange={handleChange} />
        {errors.LastName && <div className="error-msg">{errors.LastName}</div>}
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        {errors.DateOfBirth && <div className="error-msg">{errors.DateOfBirth}</div>}
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
        {errors.Email && <div className="error-msg">{errors.Email}</div>}
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input name="phone" placeholder="+966..." value={form.phone} onChange={handleChange} />
        {errors.Phone && <div className="error-msg">{errors.Phone}</div>}
      </div>

      <div className="form-group">
        <label>City</label>
        <select name="city" value={form.city} onChange={handleChange}>
          <option value="">Select a city</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.City && <div className="error-msg">{errors.City}</div>}
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Saving..." : "Submit Registration"}
      </button>
    </form>
  );
}