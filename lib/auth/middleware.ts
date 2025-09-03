// import { z } from 'zod';
// import { User } from '@/lib/db/schema';
// import { getAuthenticatedUser, getUserById } from '@/lib/db/queries';
// import { redirect } from 'next/navigation';

// export type ActionState = {
//   error?: string;
//   success?: string;
//   [key: string]: any;
// };

// // A higher-order function for server actions that validates form data with Zod
// type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
//   data: z.infer<S>,
//   formData: FormData
// ) => Promise<T>;

// export function validatedAction<S extends z.ZodType<any, any>, T>(
//   schema: S,
//   action: ValidatedActionFunction<S, T>
// ) {
//   return async (prevState: ActionState, formData: FormData) => {
//     const result = schema.safeParse(Object.fromEntries(formData));
//     if (!result.success) {
//       return { error: result.error.errors[0].message };
//     }

//     return action(result.data, formData);
//   };
// }

// // A higher-order function that provides the full authenticated user to a server action
// type ActionWithUserFunction<T> = (formData: FormData, user: User) => Promise<T>;

// export function withUser<T>(action: ActionWithUserFunction<T>) {
//   return async (formData: FormData): Promise<T> => {
//     const sessionUser = await getAuthenticatedUser();
//     if (!sessionUser) {
//       redirect('/sign-in');
//     }

//     const user = await getUserById(sessionUser.id);
//     if (!user) {
//       // This case should be rare if a session exists, but it's a good safeguard
//       // It can happen if the user was deleted from the DB but a session cookie remains.
//       redirect('/sign-in');
//     }

//     return action(formData, user);
//   };
// }

// // A wrapper for Next.js API routes to protect them based on user roles.
// type SessionUser = {
//   id: number;
//   role: 'socio' | 'admin' | 'tecnico' | 'superadmin';
//   status: 'activo' | 'moroso' | 'suspendido' | 'baja';
// };

// type ApiHandler = (
//   req: Request,
//   context: { params?: any },
//   sessionUser: SessionUser
// ) => Promise<Response>;

// export function withRoleProtection(
//   handler: ApiHandler,
//   allowedRoles: User['role'][]
// ) {
//   return async (req: Request, context: { params?: any }) => {
//     const sessionUser = await getAuthenticatedUser();

//     if (!sessionUser || !allowedRoles.includes(sessionUser.role)) {
//       return new Response(JSON.stringify({ error: 'Unauthorized' }), {
//         status: 403,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     return handler(req, context, sessionUser);
//   };
// }

import { z } from 'zod';
import { User } from '@/lib/db/schema';
import { getAuthenticatedUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

// A higher-order function for server actions that validates form data with Zod
type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    return action(result.data, formData);
  };
}

// A higher-order function that provides the authenticated user to a server action
type ActionWithUserFunction<T> = (formData: FormData, user: User) => Promise<T>;

import { getUserById } from '@/lib/db/queries';

export function withUser<T>(action: ActionWithUserFunction<T>) {
  return async (formData: FormData): Promise<T> => {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) {
      redirect('/sign-in');
    }
    const user = await getUserById(sessionUser.id);
    if (!user) {
      redirect('/sign-in');
    }
    return action(formData, user);
  };
}

// A wrapper for Next.js API routes to protect them based on user roles.
export type SessionUser = {
  id: number;
  role: 'socio' | 'admin' | 'tecnico' | 'superadmin';
  status: 'activo' | 'moroso' | 'suspendido' | 'baja';
};

type ApiHandler<T> = (
  req: Request,
  context: T,
  sessionUser: SessionUser
) => Promise<Response>;

export function withRoleProtection<T extends { params?: any }>(
  handler: ApiHandler<T>,
  allowedRoles: User['role'][]
) {
  return async (req: Request, context: T) => {
    const sessionUser = await getAuthenticatedUser();

    if (!sessionUser || !allowedRoles.includes(sessionUser.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(req, context, sessionUser);
  };
}
