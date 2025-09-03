// 'use client';

// import useSWR, { useSWRConfig } from 'swr';
// import { User } from '@/lib/db/schema';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';

// const fetcher = async (url: string) => {
//   const res = await fetch(url);

//   // If the status code is not in the range 200-299,
//   // we still try to parse and throw it.
//   if (!res.ok) {
//     const errorPayload = await res.json().catch(() => ({
//       error: 'An unknown error occurred.',
//     }));
//     const error = new Error(
//       errorPayload.error || 'An error occurred while fetching the data.'
//     );
//     throw error;
//   }

//   return res.json();
// };

// export default function UsersPage() {
//   const {
//     data: users,
//     error,
//     isLoading,
//   } = useSWR<User[] | { error: string }>('/api/admin/users', fetcher);
//   const { mutate } = useSWRConfig();
//   const [errorState, setErrorState] = useState<string | null>(null);

//   useEffect(() => {
//     // Log data for debugging if it's not an array
//     if (users && !Array.isArray(users)) {
//       console.error('Data received is not an array:', users);
//     }
//   }, [users]);

//   const handleDelete = async (userId: number) => {
//     if (
//       !window.confirm(
//         'Are you sure you want to delete this user? This action cannot be undone.'
//       )
//     ) {
//       return;
//     }

//     try {
//       const response = await fetch(`/api/admin/users/${userId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(result.error || 'Failed to delete user');
//       }

//       // Refresh the user list after deletion
//       mutate('/api/admin/users');
//     } catch (error: any) {
//       setErrorState(error.message);
//     }
//   };

//   if (error)
//     return (
//       <div className='p-4 text-destructive'>
//         Error al cargar los usuarios: {error.message}.
//       </div>
//     );
//   if (isLoading) return <div>Cargando...</div>;

//   // Defensive check to handle API errors or unexpected data types
//   if (!Array.isArray(users)) {
//     // Handle cases where the API returns an error object
//     if (users && typeof users === 'object' && 'error' in users) {
//       return <div>Error al cargar los usuarios: {users.error}</div>;
//     }
//     return (
//       <div>
//         Error: Se esperaba una lista de usuarios, pero se recibieron datos no
//         válidos. Por favor, mire la consola para obtener más información.
//       </div>
//     );
//   }

//   return (
//     <div className='p-4 sm:p-6 lg:p-8'>
//       {errorState && (
//         <div className='rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4'>
//           {errorState}
//         </div>
//       )}
//       <div className='sm:flex sm:items-center'>
//         <div className='sm:flex-auto'>
//           <h1 className='text-2xl font-bold leading-6'>Users</h1>
//           <p className='mt-2 text-sm text-muted-foreground'>
//             Una lista de los socios en la cooperativa incluyendo sus datos y
//             roles.
//           </p>
//         </div>
//         <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
//           <Button asChild>
//             <Link href='/dashboard/users/new'>Agregar usuario</Link>
//           </Button>
//         </div>
//       </div>
//       <div className='mt-8 flow-root'>
//         <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
//           <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
//             <table className='min-w-full divide-y divide-border'>
//               <thead>
//                 <tr>
//                   <th
//                     scope='col'
//                     className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0'
//                   >
//                     Nombre
//                   </th>
//                   <th
//                     scope='col'
//                     className='px-3 py-3.5 text-left text-sm font-semibold'
//                   >
//                     Email
//                   </th>
//                   <th
//                     scope='col'
//                     className='px-3 py-3.5 text-left text-sm font-semibold'
//                   >
//                     Socio #
//                   </th>
//                   <th
//                     scope='col'
//                     className='px-3 py-3.5 text-left text-sm font-semibold'
//                   >
//                     Estado
//                   </th>
//                   <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
//                     <span className='sr-only'>Acciones</span>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className='divide-y divide-border'>
//                 {users.map((user) => (
//                   <tr key={user.id}>
//                     <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0'>
//                       {user.name}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>
//                       {user.email}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>
//                       {user.membershipNumber}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'>
//                       <span
//                         className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
//                           user.status === 'activo'
//                             ? 'bg-green-500/10 text-green-400 ring-green-500/20'
//                             : 'bg-red-500/10 text-red-400 ring-red-500/20'
//                         }`}
//                       >
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-4'>
//                       <Link
//                         href={`/dashboard/users/${user.id}/edit`}
//                         className='text-primary hover:text-primary/80 cursor-pointer'
//                       >
//                         Editar
//                       </Link>
//                       <Button
//                         variant='link'
//                         className='text-destructive p-0 h-auto cursor-pointer'
//                         onClick={() => handleDelete(user.id)}
//                       >
//                         Eliminar
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import useSWR, { useSWRConfig } from 'swr';
import { User } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
    return res.json();
  });

export default function UsersPage() {
  const {
    data: users,
    error,
    isLoading,
  } = useSWR<User[]>('/api/admin/users', fetcher);
  const { mutate } = useSWRConfig();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (userId: number) => {
    setDeleteError(null);
    if (
      !window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
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
      mutate('/api/admin/users');
    } catch (error: any) {
      setDeleteError(error.message);
    }
  };

  if (error) return <div>Error al cargar los usuarios.</div>;
  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      {deleteError && (
        <div className='rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4'>
          {deleteError}
        </div>
      )}
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-2xl font-bold leading-6'>Usuarios</h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Una lista de los socios en la cooperativa incluyendo sus datos y
            roles.
          </p>
        </div>
        <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
          <Button asChild>
            <Link href='/dashboard/users/new'>Agregar usuario</Link>
          </Button>
        </div>
      </div>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0'
                  >
                    Nombre
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold'
                  >
                    Email
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold'
                  >
                    Rol
                  </th>
                  <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                    <span className='sr-only'>Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {users?.map((user) => (
                  <tr key={user.id}>
                    <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0'>
                      {user.name}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm'>
                      {user.email}
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm'>
                      {user.role}
                    </td>
                    <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-4'>
                      <Link href={`/dashboard/users/${user.id}/edit`}>
                        Editar
                      </Link>
                      <button
                        className='text-red-600 hover:text-red-900'
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </button>
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
