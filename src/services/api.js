
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "/api/v1"
    : "https://mdp-mvp.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
