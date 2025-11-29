import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",

  withCredentials: true, // ✅ CORS cookie/session support

  headers: {
    "Content-Type": "application/json",
  },

  // ✅ Big payload (image, base64, file, etc.) support
  maxContentLength: 10 * 1024 * 1024, // 10MB
  maxBodyLength: 10 * 1024 * 1024,    // 10MB
});
