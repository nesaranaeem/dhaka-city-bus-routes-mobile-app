import axios from "axios";

const transportApi = axios.create({
  baseURL: "https://transport-route-bd-server.vercel.app/api/v1",
});

export const fetchRoutes = (apiKey) =>
  transportApi.get(`/bus/allRoutes?apikey=${apiKey}`);

export const searchBuses = (apiKey, from, to) =>
  transportApi.get(`/bus?apikey=${apiKey}&from=${from}&to=${to}`);

export const allBuses = (apiKey, page, limit) =>
  transportApi.get(`/bus?apikey=${apiKey}&page=${page}&limit=${limit}`);
export const version = (apiKey, version) =>
  transportApi.get(`/version?apikey=${apiKey}&version=${version}`);
