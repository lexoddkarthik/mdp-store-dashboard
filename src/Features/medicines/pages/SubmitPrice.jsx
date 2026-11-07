import { useState, useEffect } from "react";
import { getMedicines, submitPriceChanges } from "../services/medicineService";

export default function SubmitPrice({ storeId }) {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getMedicines()
      .then((res) => setMedicines(res.data || []))
      .catch((err) => {
        console.error("Medicine fetch error:", err);
        setLoadError("Failed to load medicines for price submission.");
      });
  }, []);

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedicine || !newPrice) {
      alert("Please select a medicine and enter a new price");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    try {
      const medicineObj = medicines.find(m => m._id === selectedMedicine);
      
      const payload = {
        items: [
          {
            medicineId: selectedMedicine,
            name: medicineObj?.name,
            storePrice: newPrice,
            mrp: medicineObj?.mrpPaise ? (medicineObj.mrpPaise / 100).toString() : "100"
          }
        ]
      };

      // Response ni variable lo store chesi console lo print chesthunnam
      const response = await submitPriceChanges(storeId, payload);
      console.log("Price Submission Response:", response);

      setSuccessMessage("Price submission sent for MDP approval successfully! 🚀");
      setNewPrice("");
      setSelectedMedicine("");
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Failed to submit price changes");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePriceSubmit} style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc" }}>
      <h3>Submit Price Change</h3>
      
      <div style={{ marginBottom: "10px" }}>
        <label>Select Medicine: </label>
        <select 
          value={selectedMedicine} 
          onChange={(e) => setSelectedMedicine(e.target.value)}
        >
          <option value="">-- Choose Medicine --</option>
          {medicines.map((med) => (
            <option key={med._id} value={med._id}>
              {med.name} (MRP: ₹{med.mrpPaise ? med.mrpPaise / 100 : "N/A"})
            </option>
          ))}
        </select>
      </div>
      {loadError && <p style={{ color: "red" }}>{loadError}</p>}

      <div style={{ marginBottom: "10px" }}>
        <label>New Store Price (₹): </label>
        <input 
          type="number" 
          placeholder="Enter new price" 
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit for Approval"}
      </button>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}