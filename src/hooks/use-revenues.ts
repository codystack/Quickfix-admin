import useSWR from 'swr';

export default function useRevenue() {
  const { data, mutate, error } = useSWR(`/transactions/revenue`);

  console.log("REVENUE DATA ::: ", data);
  

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