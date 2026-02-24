import { useEffect, useState, useMemo } from "react";
import api from "../api";
import "./Submissions.css";
import ReportModal from "./ReportModal";

export default function Submissions({ refreshKey, onEdit }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Advanced Grid States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/registrations");
      setData(res.data);
    } catch (err) {
      setError(`Failed to fetch submissions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await api.delete(`/registrations/${id}`);
        setData(prevData => prevData.filter(item => item.id !== id));
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete submission.");
      }
    }
  };

  // 1. Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(item => {
      const lowerSearch = searchTerm.toLowerCase();
      if (searchField === "name") {
        return `${item.firstName} ${item.lastName}`.toLowerCase().includes(lowerSearch);
      } else if (searchField === "email") {
        return item.email?.toLowerCase().includes(lowerSearch);
      } else if (searchField === "city") {
        return item.city?.toLowerCase().includes(lowerSearch);
      } else {
        // 'all'
        return (
          `${item.firstName} ${item.lastName}`.toLowerCase().includes(lowerSearch) ||
          item.email?.toLowerCase().includes(lowerSearch) ||
          item.city?.toLowerCase().includes(lowerSearch)
        );
      }
    });
  }, [data, searchTerm, searchField]);

  // 2. Sort Data
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";

        if (sortConfig.key === 'name') {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Reset pagination when filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField, sortConfig]);

  // 3. Paginate Data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSearchField("all");
    setSortConfig({ key: null, direction: 'asc' });
    setCurrentPage(1);
  };

  return (
    <div className="submissions-container">
      {error && <p className="message error">{error}</p>}

      <div className="submissions-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
        <div className="search-controls" style={{ display: 'flex', gap: '10px' }}>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          >
            <option value="all">All Fields</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="city">City</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '250px' }}
          />
          {(searchTerm || sortConfig.key !== null) && (
            <button
              onClick={clearFilters}
              style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
            >
              Clear
            </button>
          )}
        </div>
        <button
          onClick={() => setIsReportOpen(true)}
          style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          View Report
        </button>
      </div>

      <table className="submissions-table">
        <thead>
          <tr>
            <th>Sl</th>
            <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>Name {getSortIndicator('name')}</th>
            <th onClick={() => requestSort('email')} style={{ cursor: 'pointer' }}>Email {getSortIndicator('email')}</th>
            <th onClick={() => requestSort('city')} style={{ cursor: 'pointer' }}>City {getSortIndicator('city')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
                <td>Loading...</td>
              </tr>
            ))
            : currentData.length === 0
              ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No submissions found.</td>
                </tr>
              )
              : currentData.map((x, index) => (
                <tr key={x.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{x.firstName} {x.lastName}</td>
                  <td>{x.email}</td>
                  <td>{x.city}</td>
                  <td style={{ display: 'flex', gap: '5px' }}>
                    <button className="edit-btn" onClick={() => onEdit(x)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(x.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: '#f1f5f9' }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '6px 12px',
                border: '1px solid',
                borderColor: currentPage === page ? '#3b82f6' : '#cbd5e1',
                backgroundColor: currentPage === page ? '#3b82f6' : '#fff',
                color: currentPage === page ? '#fff' : '#334155',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: currentPage === page ? 'bold' : 'normal'
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', backgroundColor: '#f1f5f9' }}
          >
            Next
          </button>
        </div>
      )}

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        data={sortedData}
      />
    </div>
  );
}