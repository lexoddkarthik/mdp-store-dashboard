import SubmitPrice from "./Features/medicines/pages/SubmitPrice";
import MedicineList from "./Features/medicines/pages/MedicineList";
import PriceSubmissionHistory from "./Features/medicines/pages/PriceSubmissionHistory";

function App() {
  const storeId = "6ace08f59394a2ba50fdffc1";

  return (
    <div style={{ padding: "20px" }}>
      <h1>MDP Store Operations Dashboard</h1>
      <SubmitPrice storeId={storeId} />
      <hr />
      <MedicineList />
      <hr />
      <h2>Price Submission History</h2>
      <PriceSubmissionHistory storeId={storeId} />
    </div>
  );
}

export default App;
