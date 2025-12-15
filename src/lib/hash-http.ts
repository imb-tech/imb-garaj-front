import axios from "axios";

import { generateToken } from "@/hooks/useHashtoken"; 

const hashHttp = axios.create({
  baseURL: import.meta.env.VITE_HASHED_URL,
});

hashHttp.interceptors.request.use(async (config) => {
  const { generatedToken, timestamp } = await generateToken();
  config.headers.Authorization = `2034:${generatedToken}:${timestamp}`;
  return config;
});

export default hashHttp;
