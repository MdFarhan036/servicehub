import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  /*
    Required for HTTP-only JWT cookies
  */
  withCredentials: true,
});

export default API;