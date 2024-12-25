import useSWR from 'swr';

export default function useOrderStatus(page: number, status: string) {
  const { data, mutate, error } = useSWR(`/orders/all/status?status=${status}&page=${page}`);
  console.log('ORDERS BY STATUS L:::: ', data);

  const loading = !data && !error;
  const loggedOut =
    (error && error?.message === 'No token provided.') ||
    error?.response?.status === 401 ||
    error?.response?.status === 403 ||
    error?.response?.data?.message === 'No user found!' ||
    data?.accountStatus === 'frozen';

  return {
    loading,
    loggedOut,
    data,
    mutate,
  };
}
