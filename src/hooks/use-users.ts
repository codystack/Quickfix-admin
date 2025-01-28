import useSWR from 'swr';

export default function useUsers(page: number) {
  const { data, mutate, error } = useSWR(`/users/all?page=${page}`);

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

export function useUsersList() {
  const { data, mutate, error } = useSWR(`/users/list`);

  console.log('USERS LISTS OF ALL USERS::: ', data);

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
