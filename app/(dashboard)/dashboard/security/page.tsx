'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateMyPassword, deleteMyAccount } from '../actions';

type ActionState = {
  error?: string;
  success?: string;
};

export default function SecurityPage() {
  const [passwordState, passwordFormAction, isPasswordPending] =
    useActionState<ActionState, FormData>(updateMyPassword, {});

  const [deleteState, deleteFormAction, isDeletePending] =
    useActionState<ActionState, FormData>(deleteMyAccount, {});

  return (
    <section className="flex-1 p-4 lg:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>
            Asegúrate de usar una contraseña larga y segura.
          </CardDescription>
        </CardHeader>
        <form action={passwordFormAction}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col items-start">
            {passwordState.error && (
              <p className="text-destructive text-sm mb-4">{passwordState.error}</p>
            )}
            {passwordState.success && (
              <p className="text-green-500 text-sm mb-4">{passwordState.success}</p>
            )}
            <Button type="submit" disabled={isPasswordPending}>
              {isPasswordPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Eliminar Cuenta</CardTitle>
          <CardDescription>
            Esta acción es irreversible. Toda la información de tu cuenta será
            eliminada.
          </CardDescription>
        </CardHeader>
        <form action={deleteFormAction}>
          <CardContent>
            <div>
              <Label htmlFor="passwordConfirm">
                Confirma tu contraseña para eliminar tu cuenta
              </Label>
              <Input
                id="passwordConfirm"
                name="password"
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col items-start">
             {deleteState.error && (
              <p className="text-destructive text-sm mb-4">{deleteState.error}</p>
            )}
            <Button variant="destructive" type="submit" disabled={isDeletePending}>
              {isDeletePending ? (
                 <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : 'Eliminar mi cuenta'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
