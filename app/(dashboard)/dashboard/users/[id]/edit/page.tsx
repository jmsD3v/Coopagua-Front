// 'use client';

// import { useRouter, useParams } from 'next/navigation';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   NewUser,
//   userRoleEnum,
//   userStatusEnum,
//   User,
// } from '@/lib/db/schema';
// import Link from 'next/link';
// import useSWR from 'swr';
// import { useEffect } from 'react';

// type Inputs = Omit<
//   NewUser,
//   'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'passwordHash'
// > & {
//   password?: string;
// };

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export default function EditUserPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { id } = params;

//   const { data: user, error: userError } = useSWR<User>(
//     id ? `/api/admin/users/${id}` : null,
//     fetcher
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setError,
//     reset,
//   } = useForm<Inputs>();

//   // Pre-populate the form with user data when it's loaded
//   useEffect(() => {
//     if (user) {
//       reset({
//         name: user.name ?? '',
//         email: user.email ?? '',
//         phone: user.phone ?? '',
//         membershipNumber: user.membershipNumber ?? '',
//         tariffCategory: user.tariffCategory ?? '',
//         role: user.role,
//         status: user.status ?? 'activa',
//       });
//     }
//   }, [user, reset]);

//   const onSubmit: SubmitHandler<Inputs> = async (data) => {
//     try {
//       // Don't send an empty password field
//       if (data.password === '') {
//         delete data.password;
//       }

//       const response = await fetch(`/api/admin/users/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || 'Something went wrong');
//       }

//       // Redirect to the users list on success
//       router.push('/dashboard/users');
//       router.refresh();
//     } catch (error: any) {
//       setError('root.serverError', {
//         type: 'manual',
//         message: error.message,
//       });
//     }
//   };

//   if (userError) return <div>Falló la carga del usuario.</div>;
//   if (!user) return <div>Cargando el usuario...</div>;

//   return (
//     <div className='p-4 sm:p-6 lg:p-8'>
//       <div className='sm:flex sm:items-center'>
//         <div className='sm:flex-auto'>
//           <h1 className='text-2xl font-bold leading-6'>Editar Usuario</h1>
//           <p className='mt-2 text-sm text-muted-foreground'>
//             Edita los detalles de {user.name || user.email}.
//           </p>
//         </div>
//       </div>
//       <div className='mt-8 flow-root'>
//         <div className='max-w-xl'>
//           <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
//             {errors.root?.serverError && (
//               <div className='rounded-md bg-destructive/10 p-4 text-sm text-destructive'>
//                 {errors.root.serverError.message}
//               </div>
//             )}

//             {/* Name */}
//             <div>
//               <Label htmlFor='name'>Nombre y Apellido</Label>
//               <Input
//                 id='name'
//                 {...register('name', { required: 'Name is required' })}
//               />
//               {errors.name && (
//                 <p className='mt-2 text-sm text-destructive'>
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <Label htmlFor='email'>Email</Label>
//               <Input
//                 id='email'
//                 type='email'
//                 {...register('email', { required: 'Email is required' })}
//               />
//               {errors.email && (
//                 <p className='mt-2 text-sm text-destructive'>
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <Label htmlFor='password'>Nueva Contraseña (optional)</Label>
//               <Input
//                 id='password'
//                 type='password'
//                 {...register('password')}
//                 placeholder='Leave blank to keep current password'
//               />
//             </div>

//             {/* Membership Number */}
//             <div>
//               <Label htmlFor='membershipNumber'>Número de Socio</Label>
//               <Input id='membershipNumber' {...register('membershipNumber')} />
//             </div>

//             {/* Phone */}
//             <div>
//               <Label htmlFor='phone'>Teléfono</Label>
//               <Input id='phone' {...register('phone')} />
//             </div>

//             {/* Tariff Category */}
//             <div>
//               <Label htmlFor='tariffCategory'>Categoría de Tarifa</Label>
//               <Input id='tariffCategory' {...register('tariffCategory')} />
//             </div>

//             {/* Role */}
//             <div>
//               <Label htmlFor='role'>Rol</Label>
//               <select
//                 id='role'
//                 {...register('role', { required: 'Role is required' })}
//                 className='mt-1 block w-full rounded-md border-border bg-background py-2 pl-3 pr-10 text-base focus:border-ring focus:outline-none focus:ring-ring sm:text-sm'
//               >
//                 {userRoleEnum.enumValues.map((role) => (
//                   <option key={role} value={role}>
//                     {role}
//                   </option>
//                 ))}
//               </select>
//               {errors.role && (
//                 <p className='mt-2 text-sm text-destructive'>
//                   {errors.role.message}
//                 </p>
//               )}
//             </div>

//             {/* Connection Status */}
//             <div>
//               <Label htmlFor='connectionStatus'>Estado de Conexión</Label>
//               <select
//                 id='connectionStatus'
//                 {...register('status')}
//                 className='mt-1 block w-full rounded-md border-border bg-background py-2 pl-3 pr-10 text-base focus:border-ring focus:outline-none focus:ring-ring sm:text-sm'
//               >
//                 {userStatusEnum.enumValues.map((status) => (
//                   <option key={status} value={status}>
//                     {status}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Action Buttons */}
//             <div className='flex items-center justify-end gap-x-4'>
//               <Button variant='ghost' asChild>
//                 <Link href='/dashboard/users'>Cancelar</Link>
//               </Button>
//               <Button type='submit' disabled={isSubmitting}>
//                 {isSubmitting ? 'Saving...' : 'Save Changes'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import useSWR from 'swr';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { User, Address, Meter } from '@/lib/db/schema';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { documentTypeEnum, vatConditionEnum } from '@/lib/db/schema';

// type FormValues = {
//   name: string;
//   email?: string;
//   password?: string;
//   businessName?: string;
//   membershipNumber?: string;
//   route?: string;
//   meterNumber?: string;
//   addressStreet: string;
//   addressNumber?: string;
//   addressBlock?: string;
//   addressPlot?: string;
//   addressChNumber?: string;
//   addressSection?: string;
//   addressDistrict?: string;
//   addressNeighborhood?: string;
//   addressCity: string;
//   documentType: 'DNI' | 'CUIT' | 'Pasaporte';
//   documentNumber: string;
//   vatCondition:
//     | 'Responsable Inscripto'
//     | 'Monotributo'
//     | 'Exento'
//     | 'Consumidor Final';
//   tariffCategory?: string;
//   coefficient?: number;
//   isTaxExempt: boolean;
//   enablePdfPrinting: boolean;
//   isMember: 'socio' | 'no_socio';
//   status: 'activo' | 'baja';
// };

// type UserWithDetails = User & {
//   addresses: (Address & {
//     meters: Meter[];
//   })[];
// };

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export default function EditUserPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { id } = params;

//   const {
//     data: user,
//     error: userError,
//     isLoading: isLoadingUser,
//   } = useSWR<UserWithDetails>(id ? `/api/admin/users/${id}` : null, fetcher);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setError,
//     reset,
//   } = useForm<FormValues>();

//   useEffect(() => {
//     if (user) {
//       const address = user.addresses?.[0] || {};
//       const meter = address.meters?.[0] || {};
//       const defaultVals: FormValues = {
//         name: user.name,
//         email: user.email || '',
//         password: '',
//         businessName: user.businessName || '',
//         membershipNumber: user.membershipNumber || '',
//         documentType: user.documentType || 'DNI',
//         documentNumber: user.documentNumber || '',
//         vatCondition: user.vatCondition || 'Consumidor Final',
//         tariffCategory: user.tariffCategory || '',
//         coefficient: Number(user.coefficient) || 0,
//         isTaxExempt: user.isTaxExempt,
//         enablePdfPrinting: user.enablePdfPrinting,
//         status: user.status === 'baja' ? 'baja' : 'activo',
//         isMember: user.role === 'socio' ? 'socio' : 'no_socio',
//         addressStreet: address.street || '',
//         addressNumber: address.number || '',
//         addressNeighborhood: address.neighborhood || '',
//         addressCity: address.city || '',
//         route: address.route || '',
//         addressBlock: address.block || '',
//         addressPlot: address.plot || '',
//         addressChNumber: address.chNumber || '',
//         addressSection: address.section || '',
//         addressDistrict: address.district || '',
//         meterNumber: meter.serialNumber || '',
//       };
//       reset(defaultVals);
//     }
//   }, [user, reset]);

//   const onSubmit: SubmitHandler<FormValues> = async (data) => {
//     try {
//       if (data.password === '') {
//         delete data.password;
//       }
//       const response = await fetch(`/api/admin/users/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });
//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.error || 'Something went wrong');
//       }
//       router.push('/dashboard/users');
//       router.refresh();
//     } catch (error: any) {
//       setError('root.serverError', { type: 'manual', message: error.message });
//     }
//   };

//   if (userError)
//     return (
//       <div className='p-4'>Error al cargar el usuario: {userError.message}</div>
//     );
//   if (isLoadingUser || !user) return <div className='p-4'>Cargando...</div>;

//   return (
//     <div className='p-4 sm:p-6 lg:p-8'>
//       <div className='mb-8'>
//         <h1 className='text-2xl font-bold leading-6'>Editar Usuario</h1>
//         <p className='mt-2 text-sm text-muted-foreground'>
//           Modificar los detalles de {user.name}.
//         </p>
//       </div>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className='grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 shadow-lg rounded-lg'
//       >
//         {errors.root?.serverError && (
//           <p className='md:col-span-3 text-destructive'>
//             {errors.root.serverError.message}
//           </p>
//         )}

//         {/* Fields */}
//         <div>
//           <Label htmlFor='name'>Usuario (Nombre/Apellido)</Label>
//           <Input id='name' {...register('name')} />
//         </div>
//         <div>
//           <Label htmlFor='email'>Email (login)</Label>
//           <Input id='email' type='email' {...register('email')} />
//         </div>
//         <div>
//           <Label htmlFor='password'>Nueva Contraseña</Label>
//           <Input
//             id='password'
//             type='password'
//             {...register('password')}
//             placeholder='Dejar en blanco para no cambiar'
//           />
//         </div>
//         <div>
//           <Label htmlFor='membershipNumber'>N° Socio</Label>
//           <Input id='membershipNumber' {...register('membershipNumber')} />
//         </div>
//         <div>
//           <Label htmlFor='route'>Ruta</Label>
//           <Input id='route' {...register('route')} />
//         </div>
//         <div className='md:col-span-3'>
//           <Label htmlFor='meterNumber'>N° Medidor</Label>
//           <Input id='meterNumber' {...register('meterNumber')} />
//         </div>
//         <div className='md:col-span-3'>
//           <Label htmlFor='businessName'>Razón Social</Label>
//           <Input id='businessName' {...register('businessName')} />
//         </div>
//         <div>
//           <Label htmlFor='addressStreet'>Dirección</Label>
//           <Input id='addressStreet' {...register('addressStreet')} />
//         </div>
//         <div>
//           <Label htmlFor='addressNumber'>N°</Label>
//           <Input id='addressNumber' {...register('addressNumber')} />
//         </div>
//         <div>
//           <Label htmlFor='addressPlot'>Manzana/Parcela</Label>
//           <Input id='addressPlot' {...register('addressPlot')} />
//         </div>
//         <div>
//           <Label htmlFor='addressChNumber'>N° CH</Label>
//           <Input id='addressChNumber' {...register('addressChNumber')} />
//         </div>
//         <div>
//           <Label htmlFor='addressSection'>Sección</Label>
//           <Input id='addressSection' {...register('addressSection')} />
//         </div>
//         <div>
//           <Label htmlFor='addressDistrict'>Circunscripción</Label>
//           <Input id='addressDistrict' {...register('addressDistrict')} />
//         </div>
//         <div>
//           <Label htmlFor='addressNeighborhood'>Barrio</Label>
//           <Input
//             id='addressNeighborhood'
//             {...register('addressNeighborhood')}
//           />
//         </div>
//         <div className='md:col-span-2'>
//           <Label htmlFor='addressCity'>Localidad</Label>
//           <Input id='addressCity' {...register('addressCity')} />
//         </div>
//         <div>
//           <Label>Tipo Documento</Label>
//           <select
//             className='w-full border rounded-lg p-2 mt-1 bg-background'
//             {...register('documentType')}
//           >
//             {documentTypeEnum.enumValues.map((val) => (
//               <option key={val} value={val}>
//                 {val}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <Label htmlFor='documentNumber'>N° Documento</Label>
//           <Input id='documentNumber' {...register('documentNumber')} />
//         </div>
//         <div>
//           <Label>IVA</Label>
//           <select
//             className='w-full border rounded-lg p-2 mt-1 bg-background'
//             {...register('vatCondition')}
//           >
//             {vatConditionEnum.enumValues.map((val) => (
//               <option key={val} value={val}>
//                 {val}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <Label htmlFor='tariffCategory'>Categoría</Label>
//           <Input id='tariffCategory' {...register('tariffCategory')} />
//         </div>
//         <div>
//           <Label htmlFor='coefficient'>Coeficiente</Label>
//           <Input
//             type='number'
//             step='0.0001'
//             id='coefficient'
//             {...register('coefficient', { valueAsNumber: true })}
//           />
//         </div>
//         <div>
//           <Label>Estado Anterior</Label>
//           <Input disabled placeholder='(No implementado)' />
//         </div>
//         <div className='md:col-span-3 flex items-center gap-4 pt-4'>
//           <label className='flex items-center gap-2 cursor-pointer'>
//             <input
//               type='checkbox'
//               className='w-4 h-4'
//               {...register('isTaxExempt')}
//             />{' '}
//             Exento de Percepción de Renta
//           </label>
//           <label className='flex items-center gap-2 cursor-pointer'>
//             <input
//               type='checkbox'
//               className='w-4 h-4'
//               {...register('enablePdfPrinting')}
//             />{' '}
//             Impresión PDF
//           </label>
//         </div>
//         <div className='md:col-span-2'>
//           <Label>Condición</Label>
//           <RadioGroup
//             className='flex gap-6 mt-2'
//             defaultValue='socio'
//             {...register('isMember')}
//           >
//             <div className='flex items-center space-x-2'>
//               <RadioGroupItem value='socio' id='r-socio' />
//               <Label htmlFor='r-socio'>Socio</Label>
//             </div>
//             <div className='flex items-center space-x-2'>
//               <RadioGroupItem value='no_socio' id='r-no-socio' />
//               <Label htmlFor='r-no-socio'>No Socio</Label>
//             </div>
//           </RadioGroup>
//         </div>
//         <div>
//           <Label>Estado</Label>
//           <select
//             className='w-full border rounded-lg p-2 mt-1 bg-background'
//             {...register('status')}
//           >
//             <option value='activo'>Alta</option>
//             <option value='baja'>Baja</option>
//           </select>
//         </div>
//         <div className='md:col-span-3 flex justify-end gap-4 mt-6'>
//           <Button type='button' variant='outline' onClick={() => reset()}>
//             Resetear
//           </Button>
//           <Button type='submit' disabled={isSubmitting}>
//             {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

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
