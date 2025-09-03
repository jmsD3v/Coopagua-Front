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

  redirect('/');
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

  // Redirect to home page after sign up
  redirect('/');
});

export async function signOut() {
  const user = await getAuthenticatedUser();
  if (user) {
    await logActivity(user.id, ActivityType.USER_LOGOUT);
  }
  (await cookies()).delete('session');
  redirect('/sign-in');
}
