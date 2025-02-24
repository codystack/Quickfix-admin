import useSWR from 'swr';

export default function useOrderCategory(page: number, category: string) {
  const { data, mutate, error } = useSWR(`/orders/all?category=${category}&page=${page}`);

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

export function useUserOrder(page: number, userEmail: string) {
  const { data, mutate, error } = useSWR(`/orders/user/all?email_address=${userEmail}&page=${page}`);

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