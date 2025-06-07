import axios from "axios";

const token = localStorage.getItem("authToken");

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default instance;