import React, { useState, useEffect } from 'react';
import './ReportModal.css';

export default function ReportModal({ isOpen, onClose, data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset to the first page whenever the modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Safety fallback and debug logging
    const safeData = Array.isArray(data) ? data : [];
    console.log("ReportModal Rendering - Data Length:", safeData.length);

    const totalPages = Math.ceil(safeData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = safeData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="report-modal-overlay">
            <div className="report-modal-content">
                <div className="report-modal-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <h2 style={{ margin: 0 }}>Mini Registration Report</h2>
                    <button className="close-btn" onClick={onClose} style={{ position: 'absolute', right: '20px' }}>×</button>
                </div>

                <div className="report-modal-body">
                    {/* UI View Table: Only shows current page */}
                    <table className="report-table ui-only">
                        <thead>
                            <tr>
                                <th>Sl</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone No</th>
                                <th>Date of Birth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No registrations found.</td>
                                </tr>
                            ) : (
                                currentData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>{item.firstName} {item.lastName}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.dateOfBirth ? item.dateOfBirth.split('T')[0] : 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Print View Table: Shows records in paginated chunks */}
                    <div className="print-only">
                        {Array.from({ length: totalPages }, (_, i) => i).map((pageIndex) => {
                            const pageData = safeData.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);
                            return (
                                <div key={pageIndex} className="print-page">
                                    <div className="print-page-header" style={{ marginBottom: '10px', display: 'none' }}>
                                        <h3 style={{ textAlign: 'center' }}>Mini Registration Report - Page {pageIndex + 1}</h3>
                                    </div>
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Sl</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone No</th>
                                                <th>Date of Birth</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageData.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{(pageIndex * itemsPerPage) + index + 1}</td>
                                                    <td>{item.firstName} {item.lastName}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.dateOfBirth ? item.dateOfBirth.split('T')[0] : 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {
                    totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className="page-btn"
                                    style={{
                                        borderColor: currentPage === page ? '#3b82f6' : '#cbd5e1',
                                        backgroundColor: currentPage === page ? '#3b82f6' : '#f1f5f9',
                                        color: currentPage === page ? '#fff' : '#334155',
                                        fontWeight: currentPage === page ? 'bold' : 'normal'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )
                }

                <div className="report-modal-footer">
                    <button className="print-btn" onClick={() => window.print()}>Print</button>
                    <button className="done-btn" onClick={onClose}>Done</button>
                </div>

                <div className="print-only-footer">
                    <p>Mini Registration Report</p>
                </div>
            </div>
        </div>
    );
}
