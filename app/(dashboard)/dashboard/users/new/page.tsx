'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UsuarioFormCompleto from '@/components/ui/usuarioFormCompleto';

// The form component defines its own data type.
type FormValues = Parameters<
  React.ComponentProps<typeof UsuarioFormCompleto>['onSubmit']
>[0];

export default function NewUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      router.push('/dashboard/users');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold leading-6'>Crear Nuevo Usuario</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Rellena los campos para añadir un nuevo socio/usuario a la
          cooperativa.
        </p>
      </div>

      {error && (
        <div className='p-4 mb-4 rounded-md bg-destructive/10 text-sm text-destructive'>
          {error}
        </div>
      )}

      <UsuarioFormCompleto onSubmit={handleCreateUser} isLoading={isLoading} />
    </div>
  );
}
