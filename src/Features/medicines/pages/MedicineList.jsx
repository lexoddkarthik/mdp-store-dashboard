
import { useState, useEffect, useRef } from "react";
import { getMedicines } from "../services/medicineService";

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Throttling variables
  const lastCall = useRef(0);

  // Debouncing: Search API
  useEffect(() => {
    const fetchDynamicMedicines = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMedicines(searchTerm);

        const listData = response.data || response || [];

        setMedicines(Array.isArray(listData) ? listData : []);
      } catch (err) {
        console.error("API Error Details:", err);
        setError("Failed to fetch medicines from server");
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(() => {
      fetchDynamicMedicines();
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [searchTerm]);

  // Throttling: Scroll event
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();

      if (now - lastCall.current >= 1000) {
        lastCall.current = now;

        console.log("Throttled scroll event executed");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Medicine Search (Name & Composition)</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Medicine Name or Composition..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{
            padding: "8px",
            width: "350px",
            fontSize: "16px"
          }}
        />
      </div>

      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      {loading && <p>Searching medicines...</p>}

      {!loading && medicines.length === 0 && !error ? (
        <p>No medicines found.</p>
      ) : (
        medicines.map((medicine) => (
          <div
            key={medicine._id || medicine.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: "10px 0"
            }}
          >
            <h3>{medicine.name}</h3>

            <p>
              <strong>Composition:</strong>{" "}
              {medicine.composition || "N/A"}
            </p>

            <p>
              <strong>MRP:</strong> ₹
              {medicine.mrpPaise
                ? medicine.mrpPaise / 100
                : "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

