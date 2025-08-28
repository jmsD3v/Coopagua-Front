'use client';

import useSWR from 'swr';
import { User } from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex justify-between border-b py-3 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value || 'No especificado'}</dd>
        </div>
    );
}

export default function MiCuentaPage() {
  const { data: user, error, isLoading } = useSWR<User>('/api/user', fetcher);

  if (error) return <div>Error al cargar tus datos.</div>;
  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <div>No se encontraron datos de usuario.</div>

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">
        Mi Cuenta
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Información del Socio</CardTitle>
                <CardDescription>Tus datos personales y de contacto.</CardDescription>
            </CardHeader>
            <CardContent>
                <dl className="divide-y">
                    <InfoRow label="Nombre Completo" value={user.name} />
                    <InfoRow label="Correo Electrónico" value={user.email} />
                    <InfoRow label="Teléfono" value={user.phone} />
                </dl>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Detalles de la Suscripción</CardTitle>
                <CardDescription>El estado de tu conexión y datos de abonado.</CardDescription>
            </CardHeader>
            <CardContent>
                 <dl className="divide-y">
                    <InfoRow label="Número de Socio" value={user.membershipNumber} />
                    <InfoRow label="Categoría Tarifaria" value={user.tariffCategory} />
                    <InfoRow label="Estado de Conexión" value={user.connectionStatus} />
                 </dl>
            </CardContent>
        </Card>
      </div>
       <div className="mt-6">
        <Card>
            <CardHeader>
                <CardTitle>Facturación</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Próximamente
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Esta sección mostrará tu historial de facturas y te permitirá realizar pagos.
                    </p>
                </div>
            </CardContent>
        </Card>
       </div>
    </section>
  );
}
