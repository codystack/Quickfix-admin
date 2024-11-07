import useSWR from 'swr';

export default function useProducts(page: number) {
  const { data, mutate, error } = useSWR(`/marketplace/all?page=${page}`);

  console.log('PRODUCTS', data);
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