import axiosInstance from './axios';

class APIService {

  static fetcher = (url: string) => axiosInstance.get(url).then((res: any) => res?.data);

  static post = (url: string, body: any, config = {}) => axiosInstance.post(url, body, config).then((res: any) => res);

  static update = (url: string, id: any, body: any) => axiosInstance.patch(`${url}/${id}`, body).then((res: any) => res);

  static delete = (url: string, id: any) => axiosInstance.delete(`${url}/${id}`).then((res: any) => res);

  static login = (payload: any) => axiosInstance.post("/auth/admin/login", payload).then((res: any) => res);

  static forgotPassword = (payload: any) => axiosInstance.post("/auth/admin/send-password-reset", payload).then((res: any) => res);

  static sendOTP = (payload: any) => axiosInstance.post("/auth/admin/resend-otp", payload).then((res: any) => res);

  static resetPassword = (payload: any) => axiosInstance.put("/auth/admin/reset-password", payload).then((res: any) => res);

  static verifyOTP = (payload: any) => axiosInstance.post("/auth/admin/verify", payload).then((res: any) => res);

  static getBookings = (page: number) => axiosInstance.get("/auth/admin/verify").then((res: any) => res);

  static getBanners = (page: number) => axiosInstance.get("/admin/auth/verify").then((res: any) => res);

  static getProducts = (page: number) => axiosInstance.get("/admin/auth/verify").then((res: any) => res);

  static getInterests = (page: number) => axiosInstance.get("/admin/auth/verify").then((res: any) => res);

}

export default APIService;