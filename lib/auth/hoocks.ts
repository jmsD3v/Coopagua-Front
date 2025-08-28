import useSWR from 'swr';
import { User } from '@/lib/db/schema';

// Define a fetcher function that gets the data and returns it as JSON
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  // Use the SWR hook to fetch user data
  const { data, error, isLoading } = useSWR<User | null>('/api/user', fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
