'use client';

import useSWR, { useSWRConfig } from 'swr';
import { User } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UsersPage() {
  const { data: users, error, isLoading } = useSWR<User[] | { error: string }>('/api/admin/users', fetcher);
  const { mutate } = useSWRConfig();
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    // Log data for debugging if it's not an array
    if (users && !Array.isArray(users)) {
      console.error("Data received is not an array:", users);
    }
  }, [users]);

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete user');
      }

      // Refresh the user list after deletion
      mutate('/api/admin/users');

    } catch (error: any) {
      setErrorState(error.message);
    }
  };

  if (error) return <div>Failed to load users. You might not have admin privileges.</div>;
  if (isLoading) return <div>Loading...</div>;

  // Defensive check to ensure users is an array
  if (!Array.isArray(users)) {
    return <div>Error: Expected a list of users, but received something else. Please check the console.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       {errorState && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">
          {errorState}
        </div>
      )}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A list of all the subscribers in the cooperative including their name, email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button asChild>
            <Link href="/dashboard/users/new">Add user</Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Membership #
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {user.membershipNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          user.connectionStatus === 'activa'
                            ? 'bg-green-500/10 text-green-400 ring-green-500/20'
                            : 'bg-red-500/10 text-red-400 ring-red-500/20'
                        }`}
                      >
                        {user.connectionStatus}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-4">
                      <Link href={`/dashboard/users/${user.id}/edit`} className="text-primary hover:text-primary/80 cursor-pointer">
                        Edit
                      </Link>
                      <Button variant="link" className="text-destructive p-0 h-auto cursor-pointer" onClick={() => handleDelete(user.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
