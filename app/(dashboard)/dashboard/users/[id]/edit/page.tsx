'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NewUser, userRoleEnum, userStatusEnum, User } from '@/lib/db/schema';
import Link from 'next/link';
import useSWR from 'swr';
import { useEffect } from 'react';

type Inputs = Omit<NewUser, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & {
  password?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: user, error: userError } = useSWR<User>(id ? `/api/admin/users/${id}` : null, fetcher);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<Inputs>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        dni: user.dni ?? '',
        membershipNumber: user.membershipNumber ?? '',
        tariffCategory: user.tariffCategory ?? '',
        role: user.role,
        status: user.status ?? 'activo',
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (data.password === '') {
        delete data.password;
      }

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Algo salió mal');
      }

      router.push('/dashboard/users');
      router.refresh();

    } catch (error: any) {
      setError('root.serverError', {
        type: 'manual',
        message: error.message,
      });
    }
  };

  if (userError) return <div>Error al cargar los datos del usuario.</div>;
  if (!user) return <div>Cargando usuario...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6">Editar Usuario</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Actualizar los datos para {user.name || user.email}.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root?.serverError && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                {errors.root.serverError.message}
              </div>
            )}

            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" {...register('name', { required: 'El nombre es requerido' })} />
              {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" {...register('email')} />
               {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
              <Input id="password" type="password" {...register('password')} placeholder="Dejar en blanco para mantener la actual" />
            </div>

            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" {...register('dni')} />
            </div>

            <div>
              <Label htmlFor="membershipNumber">Número de Socio</Label>
              <Input id="membershipNumber" {...register('membershipNumber')} />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" {...register('phone')} />
            </div>

            <div>
              <Label htmlFor="tariffCategory">Categoría Tarifaria</Label>
              <Input id="tariffCategory" {...register('tariffCategory')} />
            </div>

            <div>
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                {...register('role', { required: 'El rol es requerido' })}
                className="mt-1 block w-full rounded-md border-border bg-background py-2 pl-3 pr-10 text-base focus:border-ring focus:outline-none focus:ring-ring sm:text-sm"
              >
                {userRoleEnum.enumValues.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && <p className="mt-2 text-sm text-destructive">{errors.role.message}</p>}
            </div>

             <div>
              <Label htmlFor="status">Estado del Usuario</Label>
              <select
                id="status"
                {...register('status')}
                className="mt-1 block w-full rounded-md border-border bg-background py-2 pl-3 pr-10 text-base focus:border-ring focus:outline-none focus:ring-ring sm:text-sm"
              >
                {userStatusEnum.enumValues.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>


            <div className="flex items-center justify-end gap-x-4">
               <Button variant="ghost" asChild>
                <Link href="/dashboard/users">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
