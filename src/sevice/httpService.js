import axios from 'axios';


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 600000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token ) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
  
  return config;
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, config = {}) => instance.get(url, config).then(responseBody),
  post: (url, body, config = {}) => instance.post(url, body, config).then(responseBody),
  put: (url, body, config = {}) => instance.put(url, body, config).then(responseBody),
  patch: (url, body, config = {}) => instance.patch(url, body, config).then(responseBody),
  delete: (url, body, config = {}) => instance.delete(url, {data: body}, config).then(responseBody),

};

export default requests;
