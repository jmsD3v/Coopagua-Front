'use server';

import { z } from 'zod';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  User,
  users,
  activityLogs,
  type NewUser,
  type NewActivityLog,
  ActivityType,
} from '@/lib/db/schema';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createCheckoutPreference } from '@/lib/payments/mercadopago';
import { getAuthenticatedUser } from '@/lib/db/queries';
import { validatedAction } from '@/lib/auth/middleware';

// Simplified activity logger
async function logActivity(
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
    ipAddress: ipAddress || '',
  };
  await db.insert(activityLogs).values(newActivity);
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const [foundUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!foundUser) {
    return {
      error: 'Invalid email or password. Please try again.',
    };
  }

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash
  );

  if (!isPasswordValid) {
    return {
      error: 'Invalid email or password. Please try again.',
    };
  }

  await Promise.all([
    setSession(foundUser),
    logActivity(foundUser.id, ActivityType.USER_LOGIN),
  ]);

  // The checkout redirect logic is no longer initiated from sign-in.
  // It will be handled from the pricing page for an authenticated user.
  redirect('/dashboard/users'); // Redirect to the new main admin page
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUp = validatedAction(signUpSchema, async (data) => {
  const { email, password } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: 'A user with this email already exists.',
    };
  }

  const passwordHash = await hashPassword(password);

  // New users are 'socios' by default. Admins are created via the admin dashboard.
  const newUser: NewUser = {
    email,
    passwordHash,
    role: 'socio',
  };

  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    return {
      error: 'Failed to create user. Please try again.',
    };
  }

  await Promise.all([
    logActivity(createdUser.id, ActivityType.USER_CREATE),
    setSession(createdUser),
  ]);

  redirect('/dashboard/users');
});

export async function signOut() {
  const user = (await getAuthenticatedUser()) as User | null;
  if (user) {
    await logActivity(user.id, ActivityType.USER_LOGOUT);
  }
  cookies().delete('session');
  redirect('/sign-in');
}

// NOTE: The password/account update and delete actions now need to be
// integrated into the new admin user management UI. They are removed from here
// as they were designed for a user editing their own account, not an admin
// editing others. This logic will be re-used in the admin API.
// For simplicity, we are removing them from this file to fix compilation errors.
// The necessary DB queries (updateUser, deleteUser) already exist.
