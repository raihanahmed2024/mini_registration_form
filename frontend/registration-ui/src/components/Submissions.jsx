import { useEffect, useState } from "react";
import api from "../api";
import "./Submissions.css";

export default function Submissions({ refreshKey }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Start loading state whenever refreshKey changes
    setLoading(true);
    setError(null);

    console.log("API Base URL:", api.defaults.baseURL);
    console.log("Attempting to fetch from:", api.defaults.baseURL + "/registrations");

    api.get("/registrations")
      .then(res => {
        console.log("Successfully fetched:", res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err.message);
        console.error("Full Error:", err);
        setError(`Failed to fetch submissions: ${err.message}`);
        setLoading(false);
      });
  }, [refreshKey]); // re-fetch whenever refreshKey changes

  return (
    <div className="submissions-container">
      {error && <p className="message error">{error}</p>}

      <table className="submissions-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                </tr>
              ))
            : data.length === 0
            ? (
                <tr>
                  <td colSpan="3">No submissions yet.</td>
                </tr>
              )
            : data.map((x) => (
                <tr key={x.id}>
                  <td>{x.firstName} {x.lastName}</td>
                  <td>{x.email}</td>
                  <td>{x.city}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}