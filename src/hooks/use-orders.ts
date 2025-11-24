import useSWR from 'swr';

export default function useOrders(page: number = 1, pageSize?: number) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const searchParams = new URLSearchParams();

  searchParams.set('page', `${safePage}`);

  if (pageSize && Number.isFinite(pageSize) && pageSize > 0) {
    searchParams.set('limit', `${pageSize}`);
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/orders/all?${queryString}` : '/orders/all';

  const { data, mutate, error } = useSWR(endpoint);

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