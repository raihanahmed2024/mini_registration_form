import { useState, useEffect } from "react";
import api from "../api";

const cities = ["Riyadh", "Jeddah", "Dammam", "Makkah"];

export default function RegistrationForm({ initialData, onSuccess, onCancel }) {
  const defaultFormState = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    city: ""
  };

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Sync form state when initialData changes (entering/leaving edit mode)
  useEffect(() => {
    if (initialData) {
      // Format the date string from ISO (e.g. 2000-01-01T00:00:00.000Z) to YYYY-MM-DD
      const formattedDate = initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : "";

      setForm({
        ...initialData,
        dateOfBirth: formattedDate
      });
    } else {
      setForm(defaultFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (initialData && initialData.id) {
        // Edit mode
        await api.put(`/registrations/${initialData.id}`, form);
        alert("Registration Updated Successfully!");
      } else {
        // Create mode
        await api.post("/registrations", form);
        alert("Registration Successful!");
      }

      setForm(defaultFormState);
      onSuccess();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("An error occurred while saving.");
      }
    } finally {
      setLoading(false);
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

      <div className="button-group" style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={loading} className="submit-btn" style={{ flex: 1 }}>
          {loading ? "Saving..." : (initialData ? "Update Registration" : "Submit Registration")}
        </button>
        {initialData && (
          <button type="button" disabled={loading} className="cancel-btn" onClick={onCancel} style={{ flex: 1, backgroundColor: '#64748b' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}