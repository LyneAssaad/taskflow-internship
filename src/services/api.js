import axios from "axios";

const api = axios.create({
  baseURL: "https://taskflow-internship-production.up.railway.app",
});


api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = token;
    }

    return config;

  },
  (error) => {

    return Promise.reject(error);

  }
);


export default api;