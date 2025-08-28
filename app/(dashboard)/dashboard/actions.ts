'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { comparePasswords, hashPassword } from '@/lib/auth/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, getUserById } from '@/lib/db/queries';
import { validatedAction } from '@/lib/auth/middleware';
import { revalidatePath } from 'next/cache';

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
});

// This is a new server action, similar to the old one, but user-centric
// and in a more logical location.
export const updateMyAccount = validatedAction(
  updateAccountSchema,
  async (data, formData) => {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) {
      return { error: 'User not authenticated' };
    }

    // These actions require the full user object from the DB
    const user = await getUserById(sessionUser.id);
    if (!user) {
      return { error: 'User not found in database' };
    }

    const { name, email } = data;

    // Check if email is being changed and if the new one is already taken
    if (email !== user.email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existingUser) {
        return { error: 'This email is already in use.' };
      }
    }

    await db
      .update(users)
      .set({ name, email, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Revalidate paths to reflect updated user info across the app
    revalidatePath('/dashboard');
    revalidatePath('/api/user');

    return { success: 'Account updated successfully.' };
  }
);

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, 'Current password must be at least 8 characters'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from the current one',
    path: ['newPassword'],
  });

export const updateMyPassword = validatedAction(
  updatePasswordSchema,
  async (data) => {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) {
      return { error: 'User not authenticated' };
    }

    // These actions require the full user object from the DB
    const user = await getUserById(sessionUser.id);
    if (!user || !user.passwordHash) {
      return { error: 'User not found in database or has no password set' };
    }

    const { currentPassword, newPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return { error: 'Current password is incorrect.' };
    }

    const newPasswordHash = await hashPassword(newPassword);

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Note: We don't log this activity here, but could be added later.

    return { success: 'Password updated successfully.' };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const deleteMyAccount = validatedAction(
  deleteAccountSchema,
  async (data) => {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) {
      return { error: 'User not authenticated' };
    }

    // These actions require the full user object from the DB
    const user = await getUserById(sessionUser.id);
    if (!user || !user.passwordHash) {
      return { error: 'User not found in database or has no password set' };
    }

    const isPasswordValid = await comparePasswords(
      data.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      return { error: 'Incorrect password.' };
    }

    // Soft delete the user
    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        email: sql`CONCAT(${users.email}, '-', ${users.id}, '-deleted')`,
      })
      .where(eq(users.id, user.id));

    // Log user out by deleting the session cookie
    cookies().delete('session');
    redirect('/sign-in');
  }
);
