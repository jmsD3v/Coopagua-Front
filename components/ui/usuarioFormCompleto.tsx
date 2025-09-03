'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  documentTypeEnum,
  vatConditionEnum,
  userRoleEnum,
} from '@/lib/db/schema';

// This can be expanded with Zod for validation later.
type FormValues = {
  name: string;
  email?: string;
  password?: string;
  businessName?: string;
  membershipNumber?: string;
  route?: string;
  meterNumber?: string;
  addressStreet: string;
  addressNumber?: string;
  addressBlock?: string;
  addressPlot?: string;
  addressChNumber?: string;
  addressSection?: string;
  addressDistrict?: string;
  addressNeighborhood?: string;
  addressCity: string;
  documentType: 'DNI' | 'CUIT' | 'Pasaporte';
  documentNumber: string;
  vatCondition:
    | 'Responsable Inscripto'
    | 'Monotributo'
    | 'Exento'
    | 'Consumidor Final';
  tariffCategory?: string;
  coefficient?: number;
  isTaxExempt: boolean;
  enablePdfPrinting: boolean;
  isMember: 'socio' | 'no_socio';
  status: 'activo' | 'baja';
  role: 'socio' | 'admin' | 'tecnico' | 'superadmin';
};

interface UsuarioFormCompletoProps {
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
  defaultValues?: Partial<FormValues>;
}

export default function UsuarioFormCompleto({
  onSubmit,
  isLoading,
  defaultValues,
}: UsuarioFormCompletoProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='grid grid-cols-1 md:grid-cols-3 gap-6'
    >
      {/* Row 1: Usuario/Socio/Ruta */}
      <div>
        <Label htmlFor='name'>Usuario (Nombre y Apellido)</Label>
        <Input id='name' {...register('name')} />
      </div>
      <div>
        <Label htmlFor='email'>Email (para login)</Label>
        <Input id='email' type='email' {...register('email')} />
      </div>
      <div>
        <Label htmlFor='password'>Contraseña</Label>
        <Input
          id='password'
          type='password'
          placeholder='Dejar en blanco si no se crea login'
          {...register('password')}
        />
      </div>
      <div>
        <Label htmlFor='membershipNumber'>N° Socio</Label>
        <Input id='membershipNumber' {...register('membershipNumber')} />
      </div>
      <div>
        <Label htmlFor='route'>Ruta</Label>
        <Input id='route' {...register('route')} />
      </div>
      <div>
        <Label>Rol</Label>
        <select
          className='w-full border rounded-lg p-1.25 bg-background'
          {...register('role')}
        >
          {userRoleEnum.enumValues
            .filter((role) => role !== 'superadmin')
            .map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
        </select>
      </div>

      {/* Row 2: Medidor */}
      <div className='md:col-span-3'>
        <Label htmlFor='meterNumber'>N° Medidor</Label>
        <Input id='meterNumber' {...register('meterNumber')} />
      </div>

      {/* Row 3: Razón Social */}
      <div className='md:col-span-3'>
        <Label htmlFor='businessName'>Razón Social (si aplica)</Label>
        <Input id='businessName' {...register('businessName')} />
      </div>

      {/* Row 4: Dirección */}
      <div>
        <Label htmlFor='addressStreet'>Dirección</Label>
        <Input id='addressStreet' {...register('addressStreet')} />
      </div>
      <div>
        <Label htmlFor='addressNumber'>N°</Label>
        <Input id='addressNumber' {...register('addressNumber')} />
      </div>
      <div>
        <Label htmlFor='addressPlot'>Manzana/Parcela</Label>
        <Input id='addressPlot' {...register('addressPlot')} />
      </div>

      {/* Row 5: Datos Catastrales */}
      <div>
        <Label htmlFor='addressChNumber'>N° CH</Label>
        <Input id='addressChNumber' {...register('addressChNumber')} />
      </div>
      <div>
        <Label htmlFor='addressSection'>Sección</Label>
        <Input id='addressSection' {...register('addressSection')} />
      </div>
      <div>
        <Label htmlFor='addressDistrict'>Circunscripción</Label>
        <Input id='addressDistrict' {...register('addressDistrict')} />
      </div>

      {/* Row 6: Barrio y Localidad */}
      <div>
        <Label htmlFor='addressNeighborhood'>Barrio</Label>
        <Input id='addressNeighborhood' {...register('addressNeighborhood')} />
      </div>
      <div className='md:col-span-2'>
        <Label htmlFor='addressCity'>Localidad</Label>
        <Input id='addressCity' {...register('addressCity')} />
      </div>

      {/* Row 7: Documento */}
      <div>
        <Label>Tipo Documento</Label>
        <select
          className='w-full border rounded-lg p-1.25 bg-background'
          {...register('documentType')}
        >
          {documentTypeEnum.enumValues.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor='documentNumber'>N° Documento</Label>
        <Input id='documentNumber' {...register('documentNumber')} />
      </div>
      <div>
        <Label>IVA</Label>
        <select
          className='w-full border rounded-lg p-1.25 bg-background'
          {...register('vatCondition')}
        >
          {vatConditionEnum.enumValues.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      {/* Row 8: Categoría y Coeficiente */}
      <div>
        <Label htmlFor='tariffCategory'>Categoría</Label>
        <Input id='tariffCategory' {...register('tariffCategory')} />
      </div>
      <div>
        <Label htmlFor='coefficient'>Coeficiente</Label>
        <Input
          type='number'
          step='0.0001'
          id='coefficient'
          {...register('coefficient', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label>Estado Anterior</Label>
        <Input disabled placeholder='(No implementado)' />
      </div>

      {/* Row 9: Checks */}
      <div className='md:col-span-3 flex items-center gap-4 pt-4'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            className='w-4 h-4'
            {...register('isTaxExempt')}
          />
          Exento de Percepción de Renta
        </label>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            className='w-4 h-4'
            {...register('enablePdfPrinting')}
          />
          Impresión PDF
        </label>
      </div>

      {/* Row 10: Socio/No socio */}
      <div className='md:col-span-2'>
        <Label>Condición</Label>
        <RadioGroup
          className='flex gap-6 mt-2'
          defaultValue='socio'
          {...register('isMember')}
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='socio' id='r-socio' />
            <Label htmlFor='r-socio'>Socio</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='no_socio' id='r-no-socio' />
            <Label htmlFor='r-no-socio'>No Socio</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label>Estado</Label>
        <select
          className='w-full border rounded-lg p-1.25 mt-1 bg-background'
          {...register('status')}
        >
          <option value='activo'>Alta</option>
          <option value='baja'>Baja</option>
        </select>
      </div>

      {/* Row 11: Buttons */}
      <div className='md:col-span-3 flex justify-end gap-4 mt-6'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.push('/dashboard/users')}
        >
          Cancelar
        </Button>
        <Button type='reset' variant='outline'>
          Blanquear
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
