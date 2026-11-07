import { useState, useEffect } from "react";
import { getMedicines, submitPriceChanges } from "../services/medicineService";

export default function SubmitPrice({ storeId }) {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  // Fetch all medicines on component mount
  useEffect(() => {
    getMedicines()
      .then((res) => setMedicines(res.data || []))
      .catch((err) => {
        console.error("Medicine fetch error:", err);
        setLoadError("Failed to load medicines for price submission.");
      });
  }, []);

  // Find the selected medicine object and calculate its max allowable price (MRP in rupees)
  const medicineObj = medicines.find((m) => m._id === selectedMedicine);
  const maxPrice = medicineObj?.mrpPaise ? medicineObj.mrpPaise / 100 : null;

  // Validation check: ensure the new entered price does not exceed the existing MRP
  const isPriceExceeded =
    newPrice && maxPrice !== null && Number(newPrice) > maxPrice;

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedicine || !newPrice) {
      alert("Please select a medicine and enter a new price");
      return;
    }

    if (isPriceExceeded) {
      alert("Entered price cannot be greater than MRP!");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    try {
      const payload = {
        items: [
          {
            medicineId: selectedMedicine,
            name: medicineObj?.name,
            storePrice: newPrice,
            mrp: maxPrice ? maxPrice.toString() : "100",
          },
        ],
      };

      // Store response in a variable and log it to the console for debugging
      const response = await submitPriceChanges(storeId, payload);
      console.log("Price Submission Response:", response);

      setSuccessMessage(
        "Price submission sent for MDP approval successfully! 🚀"
      );
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
    <form
      onSubmit={handlePriceSubmit}
      style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ccc",
      }}
    >
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

      {/* Warning message displayed if the entered price exceeds the existing MRP */}
      {isPriceExceeded && (
        <p style={{ color: "red", fontWeight: "bold", margin: "5px 0" }}>
          ⚠️ New price cannot exceed existing MRP (₹{maxPrice})!
        </p>
      )}

      {/* Disable the submit button if the price exceeds MRP or while submitting */}
      <button type="submit" disabled={submitting || isPriceExceeded}>
        {submitting ? "Submitting..." : "Submit for Approval"}
      </button>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </form>
  );
}