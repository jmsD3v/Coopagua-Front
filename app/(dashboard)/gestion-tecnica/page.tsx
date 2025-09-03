import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function GestionTecnicaPage() {
  const sections = [
    {
      title: 'Pedidos de conexión',
      description: 'Ver y gestionar nuevas solicitudes de conexión de servicio.',
      href: '/dashboard/gestion-tecnica/pedidos-conexion',
    },
    {
      title: 'Baja de servicio',
      description: 'Procesar solicitudes para dar de baja el servicio de agua.',
      href: '/dashboard/gestion-tecnica/bajas-servicio',
    },
    {
      title: 'Reclamos',
      description: 'Atender y dar seguimiento a los reclamos de los socios.',
      href: '/dashboard/gestion-tecnica/reclamos',
    },
  ];

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold leading-6'>Gestión Técnica</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Seleccione una sección para administrar las operaciones técnicas.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sections.map((section) => (
          <Link href={section.href} key={section.title} passHref>
            <Card className='hover:bg-muted/50 transition-colors cursor-pointer h-full'>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
