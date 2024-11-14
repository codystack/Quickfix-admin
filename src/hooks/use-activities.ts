import useSWR from 'swr';

export default function useActivities(page: number) {
  const { data, mutate, error } = useSWR(`/admins/activities/all?page=${page}`);

  console.log('ACTIVITIES ::: ', data);
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