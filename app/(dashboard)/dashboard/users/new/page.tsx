'use client';

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NewUser, userRoleEnum, connectionStatusEnum } from '@/lib/db/schema';
import Link from 'next/link';

type Inputs = Omit<
  NewUser,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'passwordHash'
> & {
  password?: string;
};

export default function NewUserPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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

      // Redirect to the users list on success
      router.push('/dashboard/users');
      router.refresh(); // a soft refresh to show the new user in the list
    } catch (error: any) {
      setError('root.serverError', {
        type: 'manual',
        message: error.message,
      });
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-2xl font-bold leading-6'>Crear Nuevo Usuario</h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Agregar un nuevo usuario a la Cooperativa.
          </p>
        </div>
      </div>
      <div className='mt-8 flow-root'>
        <div className='max-w-xl'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Form-level error */}
            {errors.root?.serverError && (
              <div className='rounded-md bg-destructive/10 p-4 text-sm text-destructive'>
                {errors.root.serverError.message}
              </div>
            )}

            {/* Name */}
            <div>
              <Label htmlFor='name'>Nombre completo</Label>
              <Input
                id='name'
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className='mt-2 text-sm text-destructive'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className='mt-2 text-sm text-destructive'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor='password'>Contraseña</Label>
              <Input
                id='password'
                type='password'
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className='mt-2 text-sm text-destructive'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Membership Number */}
            <div>
              <Label htmlFor='membershipNumber'>Número de Socio</Label>
              <Input id='membershipNumber' {...register('membershipNumber')} />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor='phone'>Teléfono</Label>
              <Input id='phone' {...register('phone')} />
            </div>

            {/* Tariff Category */}
            <div>
              <Label htmlFor='tariffCategory'>Categoría de Tarifa</Label>
              <Input id='tariffCategory' {...register('tariffCategory')} />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor='role'>Rol</Label>
              <select
                id='role'
                {...register('role', { required: 'Role is required' })}
                className='mt-1 block w-full rounded-md border-border bg-background py-2 pl-3 pr-10 text-base focus:border-ring focus:outline-none focus:ring-ring sm:text-sm'
              >
                {userRoleEnum.enumValues.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className='mt-2 text-sm text-destructive'>
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Connection Status */}
            <div>
              <Label htmlFor='connectionStatus'>Estado de Conexión</Label>
              <select
                id='connectionStatus'
                {...register('connectionStatus')}
                className='mt-1 block w-full rounded-md border-border bg-background py-2 pl-3 pr-10 text-base focus:border-ring focus:outline-none focus:ring-ring sm:text-sm'
              >
                {connectionStatusEnum.enumValues.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center justify-end gap-x-4'>
              <Button variant='ghost' asChild>
                <Link href='/dashboard/users'>Cancelar</Link>
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
