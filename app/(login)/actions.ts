// 'use server';

// import { z } from 'zod';
// import { and, eq, sql } from 'drizzle-orm';
// import { db } from '@/lib/db/drizzle';
// import {
//   User,
//   users,
//   activityLogs,
//   type NewUser,
//   type NewActivityLog,
//   ActivityType,
// } from '@/lib/db/schema';
// import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { createCheckoutPreference } from '@/lib/payments/mercadopago';
// import { getAuthenticatedUser } from '@/lib/db/queries';
// import { validatedAction } from '@/lib/auth/middleware';

// // Simplified activity logger
// async function logActivity(
//   userId: number,
//   type: ActivityType,
//   ipAddress?: string
// ) {
//   const newActivity: NewActivityLog = {
//     userId,
//     action: type,
//     ipAddress: ipAddress || '',
//   };
//   await db.insert(activityLogs).values(newActivity);
// }

// const signInSchema = z.object({
//   email: z.string().email().min(3).max(255),
//   password: z.string().min(8).max(100),
// });

// export const signIn = validatedAction(signInSchema, async (data, formData) => {
//   const { email, password } = data;

//   const [foundUser] = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);

//   if (!foundUser) {
//     return {
//       error: 'Invalid email or password. Please try again.',
//     };
//   }

//   const isPasswordValid = await comparePasswords(
//     password,
//     foundUser.passwordHash
//   );

//   if (!isPasswordValid) {
//     return {
//       error: 'Invalid email or password. Please try again.',
//     };
//   }

//   await Promise.all([
//     setSession(foundUser),
//     logActivity(foundUser.id, ActivityType.USER_LOGIN),
//   ]);

//   // The checkout redirect logic is no longer initiated from sign-in.
//   // It will be handled from the pricing page for an authenticated user.
//   redirect('/dashboard/users'); // Redirect to the new main admin page
// });

// const signUpSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

// export const signUp = validatedAction(signUpSchema, async (data) => {
//   const { email, password } = data;

//   const existingUser = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);

//   if (existingUser.length > 0) {
//     return {
//       error: 'A user with this email already exists.',
//     };
//   }

//   const passwordHash = await hashPassword(password);

//   // New users are 'socios' by default. Admins are created via the admin dashboard.
//   const newUser: NewUser = {
//     email,
//     passwordHash,
//     role: 'socio',
//   };

//   const [createdUser] = await db.insert(users).values(newUser).returning();

//   if (!createdUser) {
//     return {
//       error: 'Failed to create user. Please try again.',
//     };
//   }

//   await Promise.all([
//     logActivity(createdUser.id, ActivityType.USER_CREATE),
//     setSession(createdUser),
//   ]);

//   redirect('/dashboard/users');
// });

// export async function signOut() {
//   const user = (await getAuthenticatedUser()) as User | null;
//   if (user) {
//     await logActivity(user.id, ActivityType.USER_LOGOUT);
//   }
//   cookies().delete('session');
//   redirect('/sign-in');
// }

// // NOTE: The password/account update and delete actions now need to be
// // integrated into the new admin user management UI. They are removed from here
// // as they were designed for a user editing their own account, not an admin
// // editing others. This logic will be re-used in the admin API.
// // For simplicity, we are removing them from this file to fix compilation errors.
// // The necessary DB queries (updateUser, deleteUser) already exist.

// 'use server';

// import { z } from 'zod';
// import { and, eq, sql } from 'drizzle-orm';
// import { db } from '@/lib/db/drizzle';
// import {
//   User,
//   users,
//   activityLogs,
//   type NewUser,
//   type NewActivityLog,
//   ActivityType,
// } from '@/lib/db/schema';
// import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { getAuthenticatedUser } from '@/lib/db/queries';
// import { validatedAction } from '@/lib/auth/middleware';

// // Simplified activity logger
// async function logActivity(
//   userId: number,
//   type: ActivityType,
//   ipAddress?: string
// ) {
//   const newActivity: NewActivityLog = {
//     userId,
//     action: type,
//     ipAddress: ipAddress || '',
//   };
//   await db.insert(activityLogs).values(newActivity);
// }

// const signInSchema = z.object({
//   email: z.string().email().min(3).max(255),
//   password: z.string().min(8).max(100),
// });

// export const signIn = validatedAction(signInSchema, async (data, formData) => {
//   const { email, password } = data;

//   const [foundUser] = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);

//   if (!foundUser) {
//     return {
//       error: 'Invalid email or password. Please try again.',
//     };
//   }

//   const isPasswordValid = await comparePasswords(
//     password,
//     foundUser.passwordHash
//   );

//   if (!isPasswordValid) {
//     return {
//       error: 'Invalid email or password. Please try again.',
//     };
//   }

//   await Promise.all([
//     setSession(foundUser),
//     logActivity(foundUser.id, ActivityType.USER_LOGIN),
//   ]);

//   if (['admin', 'superadmin'].includes(foundUser.role)) {
//     redirect('/dashboard/users');
//   } else {
//     redirect('/dashboard/mi-cuenta');
//   }
// });

// const signUpSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

// export const signUp = validatedAction(signUpSchema, async (data) => {
//   const { email, password } = data;

//   const existingUser = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);

//   if (existingUser.length > 0) {
//     return {
//       error: 'A user with this email already exists.',
//     };
//   }

//   const passwordHash = await hashPassword(password);

//   // New users are 'socios' by default. Admins are created via the admin dashboard.
//   const newUser: NewUser = {
//     email,
//     passwordHash,
//     role: 'socio',
//   };

//   const [createdUser] = await db.insert(users).values(newUser).returning();

//   if (!createdUser) {
//     return {
//       error: 'Failed to create user. Please try again.',
//     };
//   }

//   await Promise.all([
//     logActivity(createdUser.id, ActivityType.USER_CREATE),
//     setSession(createdUser),
//   ]);

//   // Redirect based on role
//   if (['admin', 'superadmin'].includes(createdUser.role)) {
//     redirect('/dashboard/users');
//   } else {
//     redirect('/dashboard/mi-cuenta');
//   }
// });

// export async function signOut() {
//   const user = (await getAuthenticatedUser()) as User | null;
//   if (user) {
//     await logActivity(user.id, ActivityType.USER_LOGOUT);
//   }
//   (await cookies()).delete('session');
//   redirect('/sign-in');
// }

'use server';

import { z } from 'zod';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  users,
  activityLogs,
  type NewUser,
  type NewActivityLog,
  ActivityType,
} from '@/lib/db/schema';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAuthenticatedUser } from '@/lib/db/queries';
import { validatedAction } from '@/lib/auth/middleware';

// Simplified activity logger, aligned with new schema
async function logActivity(userId: number, type: ActivityType) {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
  };
  await db.insert(activityLogs).values(newActivity);
}

const signInSchema = z.object({
  email: z.string().email('El correo no es válido.'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export const signIn = validatedAction(signInSchema, async (data) => {
  const { email, password } = data;

  const [foundUser] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt))) // Added isNull check
    .limit(1);

  if (!foundUser) {
    return {
      error: 'Correo o contraseña inválidos. Por favor, intenta de nuevo.',
    };
  }

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash || ''
  );

  if (!isPasswordValid) {
    return {
      error: 'Correo o contraseña inválidos. Por favor, intenta de nuevo.',
    };
  }

  await Promise.all([
    setSession(foundUser),
    logActivity(foundUser.id, ActivityType.USER_LOGIN),
  ]);

  if (['admin', 'superadmin', 'tecnico'].includes(foundUser.role)) {
    redirect('/dashboard/users');
  } else {
    redirect('/dashboard/mi-cuenta');
  }
});

const signUpSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido.'),
  email: z.string().email('El correo no es válido.'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export const signUp = validatedAction(signUpSchema, async (data) => {
  const { name, email, password } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: 'Un usuario con este correo ya existe.',
    };
  }

  const passwordHash = await hashPassword(password);

  const newUser: NewUser = {
    name,
    email,
    passwordHash,
    role: 'socio',
  };

  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    return {
      error: 'No se pudo crear el usuario. Por favor, intenta de nuevo.',
    };
  }

  await Promise.all([
    logActivity(createdUser.id, ActivityType.USER_CREATE),
    setSession(createdUser),
  ]);

  // Redirect based on role (new user is always 'socio')
  redirect('/dashboard/mi-cuenta');
});

export async function signOut() {
  const user = await getAuthenticatedUser();
  if (user) {
    await logActivity(user.id, ActivityType.USER_LOGOUT);
  }
  (await cookies()).delete('session');
  redirect('/sign-in');
}
