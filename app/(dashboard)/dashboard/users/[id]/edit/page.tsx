'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import UsuarioFormCompleto from '@/components/ui/usuarioFormCompleto';
import { User, Address, Meter } from '@/lib/db/schema';

// The form component defines its own data type
type FormValues = Parameters<
  React.ComponentProps<typeof UsuarioFormCompleto>['onSubmit']
>[0];

// The API returns a user with nested addresses and meters
type UserWithDetails = User & {
  addresses: (Address & {
    meters: Meter[];
  })[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [transformedData, setTransformedData] =
    useState<Partial<FormValues> | null>(null);

  const {
    data: user,
    error: userError,
    isLoading: isLoadingUser,
  } = useSWR<UserWithDetails>(id ? `/api/admin/users/${id}` : null, fetcher);

  useEffect(() => {
    if (user) {
      // Transform the nested user data into the flat structure the form expects
      const address = user.addresses?.[0] || {};
      const meter = address.meters?.[0] || {};

      const defaultVals: Partial<FormValues> = {
        name: user.name,
        email: user.email || '',
        businessName: user.businessName || '',
        membershipNumber: user.membershipNumber || '',
        documentType: user.documentType || 'DNI',
        documentNumber: user.documentNumber || '',
        vatCondition: user.vatCondition || 'Consumidor Final',
        tariffCategory: user.tariffCategory || '',
        coefficient: Number(user.coefficient) || undefined,
        isTaxExempt: user.isTaxExempt,
        enablePdfPrinting: user.enablePdfPrinting,
        status: user.status === 'baja' ? 'baja' : 'activo',
        isMember: user.role === 'socio' ? 'socio' : 'no_socio',

        addressStreet: address.street || '',
        addressNumber: address.number || '',
        addressNeighborhood: address.neighborhood || '',
        addressCity: address.city || '',
        route: address.route || '',
        addressBlock: address.block || '',
        addressPlot: address.plot || '',
        addressChNumber: address.chNumber || '',
        addressSection: address.section || '',
        addressDistrict: address.district || '',

        meterNumber: meter.serialNumber || '',
      };
      setTransformedData(defaultVals);
    }
  }, [user]);

  const handleUpdateUser = async (data: FormValues) => {
    setIsSubmitting(true);
    setFormError(null);

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
        throw new Error(result.error || 'Something went wrong');
      }

      router.push('/dashboard/users');
      router.refresh();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold leading-6'>Editar Usuario</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Modificar los detalles de {user?.name || 'usuario'}.
        </p>
      </div>

      {/* Form submission error */}
      {formError && (
        <div className='p-4 mb-4 rounded-md bg-destructive/10 text-sm text-destructive'>
          {formError}
        </div>
      )}

      {/* Data loading error */}
      {userError && (
        <div className='p-4 mb-4 rounded-md bg-destructive/10 text-sm text-destructive'>
          Error al cargar los datos del usuario: {userError.message}
        </div>
      )}

      {/* Loading state */}
      {isLoadingUser && !userError && <p>Cargando datos del usuario...</p>}

      {/* Render form only when data is ready */}
      {user && transformedData && (
        <UsuarioFormCompleto
          onSubmit={handleUpdateUser}
          isLoading={isSubmitting}
          defaultValues={transformedData}
        />
      )}
    </div>
  );
}
