import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export default function NotFound() {
  return (
    <div className='flex items-center justify-center min-h-[100dvh]'>
      <div className='max-w-md space-y-8 p-4 text-center'>
        <div className='flex justify-center'>
          <Logo />
        </div>
        <h1 className='text-4xl font-bold tracking-tight'>
          Página No Encontrada
        </h1>
        <p className='text-base'>
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          href='/'
          className='max-w-48 mx-auto flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
