// import { NextResponse } from 'next/server';
// import { getUserById, updateUser, deleteUser } from '@/lib/db/queries';
// import { User } from '@/lib/db/schema';
// import { hashPassword } from '@/lib/auth/session';
// import { withRoleProtection } from '@/lib/auth/middleware';
// import type { SessionUser } from '@/lib/auth/middleware';

// // --- GET Handler ---
// const getHandler = async (
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) => {
//   try {
//     const { id } = await context.params;
//     const userId = parseInt(id, 10);
//     if (isNaN(userId)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }
//     const user = await getUserById(userId);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     return NextResponse.json(user);
//   } catch (error) {
//     console.error(`Failed to fetch user:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// // --- PATCH Handler ---
// const patchHandler = async (
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) => {
//   try {
//     const { id } = await context.params;
//     const userId = parseInt(id, 10);
//     if (isNaN(userId)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }

//     const body = await req.json();
//     let { password, ...otherData } = body;

//     const allowedFields = [
//       'email',
//       'name',
//       'membershipNumber',
//       'role',
//       'status',
//       'phone',
//       'tariffCategory',
//     ];
//     const sanitizedData = Object.fromEntries(
//       Object.entries(otherData).filter(([key]) => allowedFields.includes(key))
//     );

//     if (password) {
//       sanitizedData.passwordHash = await hashPassword(password);
//     }

//     const updatedUser = await updateUser(userId, sanitizedData);

//     if (!updatedUser) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const { passwordHash: _, ...userToReturn } = updatedUser;
//     return NextResponse.json(userToReturn);
//   } catch (error: any) {
//     if (error.code === '23505') {
//       return NextResponse.json(
//         { error: 'A user with this email or membership number already exists' },
//         { status: 409 }
//       );
//     }
//     console.error(`Failed to update user:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// // --- DELETE Handler ---
// const deleteHandler = async (
//   req: Request,
//   context: { params: Promise<{ id: string }> },
//   sessionUser: SessionUser
// ) => {
//   try {
//     const { id } = await context.params;
//     const userId = parseInt(id, 10);
//     if (isNaN(userId)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }
//     if (sessionUser.id === userId) {
//       return NextResponse.json(
//         { error: 'You cannot delete yourself' },
//         { status: 400 }
//       );
//     }
//     const deletedUser = await deleteUser(userId);
//     if (!deletedUser) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error(`Failed to delete user:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// // --- EXPORT PROTECTED ROUTES ---
// const allowedRoles: User['role'][] = ['admin', 'superadmin'];

// export const GET = withRoleProtection(getHandler, allowedRoles);
// export const PATCH = withRoleProtection(patchHandler, allowedRoles);
// export const DELETE = withRoleProtection(deleteHandler, allowedRoles);

import { NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/db/queries';
import { User } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/session';
import { withRoleProtection } from '@/lib/auth/middleware';
import type { SessionUser } from '@/lib/auth/middleware';

// --- GET Handler ---
const getHandler = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// --- PATCH Handler ---
const patchHandler = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    let { password, ...otherData } = body;

    const allowedFields = [
      'email',
      'name',
      'membershipNumber',
      'role',
      'status',
      'phone',
      'tariffCategory',
    ];
    const sanitizedData = Object.fromEntries(
      Object.entries(otherData).filter(([key]) => allowedFields.includes(key))
    );

    if (password) {
      sanitizedData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await updateUser(userId, sanitizedData);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash: _, ...userToReturn } = updatedUser;
    return NextResponse.json(userToReturn);
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A user with this email or membership number already exists' },
        { status: 409 }
      );
    }
    console.error(`Failed to update user ${userId}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// --- DELETE Handler ---
const deleteHandler = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
  sessionUser: SessionUser
) => {
  const { id } = await context.params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  if (sessionUser.id === userId) {
    return NextResponse.json(
      { error: 'You cannot delete yourself' },
      { status: 400 }
    );
  }

  try {
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// --- EXPORT PROTECTED ROUTES ---
const allowedRoles: User['role'][] = ['admin', 'superadmin'];

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRoleProtection(getHandler, allowedRoles)(req, context);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withRoleProtection(patchHandler, allowedRoles)(req, context);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Si tu middleware requiere sessionUser, adaptalo para inyectarlo correctamente
  return withRoleProtection(deleteHandler, allowedRoles)(req, context);
}
