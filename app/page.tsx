import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center gap-4 p-4">
      <h1 className="text-4xl font-bold">
        Bienvenido a la Cooperativa de Agua Potable
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Gestione sus servicios, consulte sus facturas y realice reclamos de forma
        rápida y sencilla.
      </p>
      <div className="flex gap-4 mt-4">
        <Link href="/sign-in">
          <Button>Iniciar Sesión</Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="outline">Registrarse</Button>
        </Link>
      </div>
    </main>
  );
}
