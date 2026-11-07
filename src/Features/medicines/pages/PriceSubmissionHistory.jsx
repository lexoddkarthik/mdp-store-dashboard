import { useState, useEffect } from "react";
import { getPriceSubmissionHistory } from "../services/medicineService";

export default function PriceSubmissionHistory({ storeId = 1 }) {
  // State variables for history list, loading status, and error handling
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect triggers automatically when component mounts or storeId changes
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        // Call the service function to fetch price submission history
        const response = await getPriceSubmissionHistory(storeId);
        
        // Handle response data safely
        const listData = response.data || response || [];
        setHistory(Array.isArray(listData) ? listData : []);
      } catch (err) {
        console.error("API Error Details:", err);
        setError("Failed to fetch price submission history from server");
      } finally {
        // Stop the loading indicator
        setLoading(false);
      }
    };

    fetchHistory();
  }, [storeId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Price Submission History</h2>

      {/* Error Display */}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      {/* Loading Indicator */}
      {loading && <p>Loading history...</p>}

      {/* Render History List or Empty State */}
      {!loading && history.length === 0 && !error ? (
        <p>No price submission history found.</p>
      ) : (
        history.map((submission, index) => {
          const status = (submission.overallStatus || submission.status || "").toLowerCase();
          const items = submission.items || submission.medicines || [];
          
          // Badge color logic based on status
          let badgeBg = "#fff3cd";
          let badgeColor = "#856404";
          if (status === "approved") {
            badgeBg = "#d4edda";
            badgeColor = "#155724";
          } else if (status === "rejected") {
            badgeBg = "#f8d7da";
            badgeColor = "#721c24";
          }

          return (
            <div 
              key={submission.id || submission._id || index} 
              style={{ 
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              {/* Card Header: Batch Code & Status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
                <div>
                  <span style={{ color: "#666", fontSize: "14px" }}>Batch Code: </span>
                  <span style={{ fontWeight: "bold", color: "#333", fontSize: "14px" }}>
                    {submission.submissionCode || submission.batchCode || submission.code || "N/A"}
                  </span>
                </div>
                <div>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "4px", 
                    fontSize: "12px", 
                    fontWeight: "bold", 
                    textTransform: "uppercase",
                    backgroundColor: badgeBg,
                    color: badgeColor
                  }}>
                    {submission.overallStatus || submission.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Meta Info */}
              <div style={{ fontSize: "14px", color: "#555", marginBottom: "12px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <p style={{ margin: 0 }}>
                  <strong>Submitted Date:</strong>{" "}
                  {submission.submittedDate || submission.createdAt 
                    ? new Date(submission.submittedDate || submission.createdAt).toLocaleString() 
                    : "N/A"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Total Medicines:</strong>{" "}
                  {submission.itemsCount || items.length || submission.numberOfMedicines || 0}
                </p>
              </div>

              {/* Medicines Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ddd", padding: "8px 12px", backgroundColor: "#f8f9fa", color: "#333", textAlign: "left" }}>Medicine Name</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px 12px", backgroundColor: "#f8f9fa", color: "#333", textAlign: "left" }}>Old Price</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px 12px", backgroundColor: "#f8f9fa", color: "#333", textAlign: "left" }}>New Price</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px 12px", backgroundColor: "#f8f9fa", color: "#333", textAlign: "left" }}>MRP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((med, medIndex) => (
                      <tr key={medIndex}>
                        <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>{med.medicineName || med.name}</td>
                        {/* 100 tho divide chesi paise nunchi rupees ki convert chesthunnam */}
                        <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>
                          ₹{(med.oldPricePaise ?? med.oldPrice) != null ? ((med.oldPricePaise ?? med.oldPrice) / 100).toFixed(2) : "0.00"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>
                          ₹{(med.newPricePaise ?? med.newPrice) != null ? ((med.newPricePaise ?? med.newPrice) / 100).toFixed(2) : "0.00"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px 12px" }}>
                          ₹{(med.mrpPaise ?? med.mrp) != null ? ((med.mrpPaise ?? med.mrp) / 100).toFixed(2) : "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rejection Reason (Okkavela status rejected aithe matrame) */}
              {submission.rejectionReason && (
                <div style={{ marginTop: "12px", backgroundColor: "#fdf3f4", borderLeft: "4px solid #dc3545", padding: "8px 12px", color: "#721c24", fontSize: "13px" }}>
                  <strong>Rejection Reason:</strong> {submission.rejectionReason}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}