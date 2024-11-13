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

  static getProfile = () => axiosInstance.get("/admins/current/profile").then((res: any) => res);

  static updateUser = (payload: any) => axiosInstance.put("/users/info/update", payload).then((res: any) => res);

  static getBookings = (page: number) => axiosInstance.get("/admins/bookings/all").then((res: any) => res);


  static getProducts = (page: number) => axiosInstance.get("/marketplace/all").then((res: any) => res);

  static getInterests = (page: number) => axiosInstance.get("/admin/auth/verify").then((res: any) => res);

  static multiImagesUpload = (payload: any) => axiosInstance.put("/images/upload", payload).then((res: any) => res);

  static singleImageUpload = (payload: any) => axiosInstance.put("/image/upload", payload).then((res: any) => res);

  static addProduct = (payload: any) => axiosInstance.post("/marketplace/add", payload).then((res: any) => res);

  static approveBooking = (id: any) => axiosInstance.put(`/admins/bookings/${id}/approve`, {}).then((res: any) => res);

  static declineBooking = (id: string) => axiosInstance.put(`/admins/bookings/${id}/decline`, {}).then((res: any) => res);

  static addSocial = (payload: any) => axiosInstance.post("/admins/socials/add", payload).then((res: any) => res);

  static addBanner = (payload: any) => axiosInstance.post("/admins/banners/add", payload).then((res: any) => res);

  static getBanners = (page: number) => axiosInstance.get("/admin/banners/all").then((res: any) => res);

  static updateBanner = (payload: any, id: string) => axiosInstance.put(`/admins/banners/${id}/update`, payload).then((res: any) => res);

  static removeBanner = (id: string) => axiosInstance.put(`/admins/banners/${id}/delete`, {}).then((res: any) => res);

  static addAdmin = (payload: any) => axiosInstance.post("/admins/admin/create", payload).then((res: any) => res);


}

export default APIService;