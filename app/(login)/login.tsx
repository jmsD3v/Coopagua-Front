'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import { Logo } from '@/components/ui/logo';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className='min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center'>
          <Logo />
        </div>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-foreground'>
          {mode === 'signin' ? 'Entra a tu cuenta' : 'Crear una cuenta'}
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <form className='space-y-6' action={formAction}>
          <input type='hidden' name='redirect' value={redirect || ''} />
          <input type='hidden' name='priceId' value={priceId || ''} />
          <input type='hidden' name='inviteId' value={inviteId || ''} />
          <div>
            <Label
              htmlFor='email'
              className='block text-sm font-medium text-foreground'
            >
              Email
            </Label>
            <div className='mt-1'>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                defaultValue={state.email}
                required
                maxLength={50}
                className='appearance-none rounded-full relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm'
                placeholder='Ingrese su email'
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor='password'
              className='block text-sm font-medium text-foreground'
            >
              Contraseña
            </Label>
            <div className='mt-1'>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className='appearance-none rounded-full relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm'
                placeholder='Ingrese su contraseña'
              />
            </div>
          </div>

          {state?.error && (
            <div className='text-red-500 text-sm'>{state.error}</div>
          )}

          <div>
            <Button
              type='submit'
              className='w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring'
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className='animate-spin mr-2 h-4 w-4' />
                  Cargando...
                </>
              ) : mode === 'signin' ? (
                'Entrar'
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-card text-muted-foreground'>
                {mode === 'signin'
                  ? 'Eres nuevo en nuestra plataforma?'
                  : 'Ya tienes una cuenta?'}
              </span>
            </div>
          </div>

          <div className='mt-6'>
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className='w-full flex justify-center py-2 px-4 border border-border rounded-full shadow-sm text-sm font-medium text-foreground bg-card hover:bg-card/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring'
            >
              {mode === 'signin'
                ? 'Crea una cuenta nueva'
                : 'Entra a tu cuenta'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
