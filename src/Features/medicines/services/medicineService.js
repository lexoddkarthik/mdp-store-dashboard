import api from "../../../services/api";

export const getMedicines = async (searchTerm = "") => {
  const search = searchTerm.trim();

  const config = search
    ? { params: { search } }
    : undefined;

  const response = await api.get("/medicines", config);

  return response.data;
};

export const submitPriceChanges = async (storeId, priceData) => {
  const response = await api.post(
    `/stores/${storeId}/price-submissions`,
    priceData
  );

  return response.data;
};

export const getPriceSubmissionHistory = (storeId) => {
  return api
    .get(`/stores/${storeId}/price-submissions`)
    .then((response) => response.data);
};