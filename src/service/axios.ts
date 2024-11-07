import axios from "axios";

export const baseURL = "https://quick-pocket-api.vercel.app" // "http://192.168.0.102:6000" //

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
  } catch (error) {
    return Promise.reject(error);
  }
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401) {
        // originalConfig._retry = true;
        localStorage.removeItem('accessToken');

        // console.info('expired');

        // try {
        //   const refreshToken = localStorage.getItem("refreshToken");
        //   const refreshResponse = await axiosInstance.post("/auth/token", {
        //     refreshToken,
        //   });
        //   if (refreshResponse?.data) {
        //     localStorage.setItem(
        //       "accessToken",
        //       refreshResponse?.data.accessToken
        //     );
        //     refreshResponse.config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        //   }
        //   return await axiosInstance(originalConfig);
        // } catch (_error) {
        //   if (_error.response && _error.response.data) {
        //     return Promise.reject(_error.response.data);
        //   }
        //   return Promise.reject(_error);
        // }
      }
      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;