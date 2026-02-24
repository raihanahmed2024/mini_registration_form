import RegistrationForm from "./components/RegistrationForm.jsx";
import Submissions from "./components/Submissions.jsx";
import { useState } from "react";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingSubmission, setEditingSubmission] = useState(null);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setEditingSubmission(null);
  };

  return (
    <div id="app-container">
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#1e293b' }}>Registration Management</h1>
      </header>

      <div className="content-wrapper">
        <section className="form-column">
          <div className="form-card">
            <h2>{editingSubmission ? "Edit Entry" : "New Entry"}</h2>
            <RegistrationForm
              initialData={editingSubmission}
              onSuccess={handleSuccess}
              onCancel={() => setEditingSubmission(null)}
            />
          </div>
        </section>

        <section className="submissions-column">
          <div className="submissions-card">
            <h2>Recent Submissions</h2>
            <div className="table-container">
              <Submissions refreshKey={refreshKey} onEdit={setEditingSubmission} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;