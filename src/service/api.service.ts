import axiosInstance from './axios';

class APIService {
  static fetcher = (url: string) => axiosInstance.get(url).then((res: any) => res?.data);

  static post = (url: string, body: any, config = {}) =>
    axiosInstance.post(url, body, config).then((res: any) => res);

  static update = (url: string, id: any, body: any) =>
    axiosInstance.patch(`${url}/${id}`, body).then((res: any) => res);

  static delete = (url: string, id: any) =>
    axiosInstance.delete(`${url}/${id}`).then((res: any) => res);

  static login = (payload: any) =>
    axiosInstance.post('/auth/admin/login', payload).then((res: any) => res);

  static forgotPassword = (payload: any) =>
    axiosInstance.post('/auth/admin/send-password-reset', payload).then((res: any) => res);

  static sendOTP = (payload: any) =>
    axiosInstance.post('/auth/admin/resend-otp', payload).then((res: any) => res);

  static resetPassword = (payload: any) =>
    axiosInstance.put('/auth/admin/reset-password', payload).then((res: any) => res);

  static verifyOTP = (payload: any) =>
    axiosInstance.post('/auth/admin/verify', payload).then((res: any) => res);

  static getProfile = () => axiosInstance.get('/admins/current/profile').then((res: any) => res);

  static updateUser = (payload: any) =>
    axiosInstance.put('/users/info/update', payload).then((res: any) => res);

  static deleteUser = (id: string) =>
    axiosInstance.put(`/users/${id}/delete`, {}).then((res: any) => res);

  static getTransactions = (page: number) =>
    axiosInstance.get(`/transactions/all?page=${page}`).then((res: any) => res);

  static getOrders = (page: number) =>
    axiosInstance.get(`/orders/all?page=${page}`).then((res: any) => res);

  static getActivities = (page: number) =>
    axiosInstance.get(`/admins/activities/all?page=${page}`).then((res: any) => res);

  static getServices = (page: number) => axiosInstance.get('/services/all').then((res: any) => res);

  static multiImagesUpload = (payload: any) =>
    axiosInstance.put('/images/upload', payload).then((res: any) => res);

  static singleImageUpload = (payload: any) =>
    axiosInstance.put('/image/upload', payload).then((res: any) => res);

  static updateOrder = (payload: any, id: string) =>
    axiosInstance.put(`/orders/${id}/update`, payload).then((res: any) => res);

  static deleteOrder = (id: string) =>
    axiosInstance.put(`/orders/${id}/delete`, {}).then((res: any) => res);

  // static approveBooking = (id: any) => axiosInstance.put(`/admins/bookings/${id}/approve`, {}).then((res: any) => res);

  // static declineBooking = (id: string) => axiosInstance.put(`/admins/bookings/${id}/decline`, {}).then((res: any) => res);

  static addSocial = (payload: any) =>
    axiosInstance.post('/admins/socials/add', payload).then((res: any) => res);

  static addBanner = (payload: any) =>
    axiosInstance.post('/admins/banners/add', payload).then((res: any) => res);

  static getBanners = (page: number) =>
    axiosInstance.get('/admins/banners/all').then((res: any) => res);

  static updateBanner = (payload: any, id: string) =>
    axiosInstance.put(`/admins/banners/${id}/update`, payload).then((res: any) => res);

  static removeBanner = (id: string) =>
    axiosInstance.put(`/admins/banners/${id}/delete`, {}).then((res: any) => res);

  static updateSocial = (payload: any, id: string) =>
    axiosInstance.put(`/admins/socials/${id}/update`, payload).then((res: any) => res);

  static removeSocial = (id: string) =>
    axiosInstance.put(`/admins/socials/${id}/delete`, {}).then((res: any) => res);

  static addUser = (payload: any) =>
    axiosInstance.post('/admins/user/create', payload).then((res: any) => res);

  static addAdmin = (payload: any) =>
    axiosInstance.post('/admins/admin/create', payload).then((res: any) => res);

  static suspendAdmin = (id: any) =>
    axiosInstance.post(`/admins/admin/${id}/suspend`, {}).then((res: any) => res);

  static pardonAdmin = (id: any) =>
    axiosInstance.post(`/admins/admin/${id}/pardon`, {}).then((res: any) => res);

  static deleteAdmin = (id: any) =>
    axiosInstance.post(`/admins/admin/${id}/delete`, {}).then((res: any) => res);

  static manageContact = (payload: any) =>
    axiosInstance.post('/admins/settings/manage', payload).then((res: any) => res);

  static addService = (payload: any) =>
    axiosInstance.post('/services/save', payload).then((res: any) => res);

  static updateService = (payload: any, id: any) =>
    axiosInstance.post(`/services/${id}/update`, payload).then((res: any) => res);

  static deleteService = (id: any) =>
    axiosInstance.post(`/services/${id}/delete`, {}).then((res: any) => res);

  static addLocation = (payload: any) =>
    axiosInstance.post('/locations/save', payload).then((res: any) => res);

  static updateLocation = (id: string, payload: any) =>
    axiosInstance.post(`/locations/${id}/update`, payload).then((res: any) => res);

  static deleteLocation = (id: any) =>
    axiosInstance.put(`/locations/${id}/delete`, {}).then((res: any) => res);

  static addExpress = (payload: any) =>
    axiosInstance.post('/admins/express/add', payload).then((res: any) => res);

  static updateExpress = (id: string, payload: any) =>
    axiosInstance.put(`/admins/express/${id}/update`, payload).then((res: any) => res);

  static deleteExpress = (id: any) =>
    axiosInstance.put(`/admins/express/${id}/delete`, {}).then((res: any) => res);

  static createOrder = (payload: any, tx_ref: string) =>
    axiosInstance.post(`/orders/manual/create/${tx_ref}`, payload).then((res: any) => res);
}

export default APIService;
