import useSWR from 'swr';

export default function useServices(page: number) {
  const { data, mutate, error } = useSWR(`/services/all?page=${page}`);

  console.log('SERVICES ::: ', data);
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