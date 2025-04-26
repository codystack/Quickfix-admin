import useSWR from 'swr';

export default function useUserTransactions(page: number, email_address: string) {
  const { data, mutate, error } = useSWR(`/transactions/user/all?email_address=${email_address}&page=${page}`);

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