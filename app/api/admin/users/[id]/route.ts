// import { NextResponse } from 'next/server';
// import {
//   getAuthenticatedUser,
//   getUserById,
//   updateUser,
//   deleteUser,
// } from '@/lib/db/queries';
// import { User } from '@/lib/db/schema';
// import { hashPassword } from '@/lib/auth/session';

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const currentUser: User | null = await getAuthenticatedUser();

//     // Protect the route
//     if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }

//     const user = await getUserById(id);

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error(`Failed to fetch user ${params.id}:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const currentUser: User | null = await getAuthenticatedUser();

//     // Protect the route
//     if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }

//     const body = await request.json();
//     let { password, ...otherData } = body;

//     // Only allow certain fields to be updated
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

//     // If password is being updated, hash it
//     if (password) {
//       sanitizedData.passwordHash = await hashPassword(password);
//     }

//     const updatedUser = await updateUser(id, sanitizedData);

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
//     console.error(`Failed to update user ${params.id}:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const currentUser: User | null = await getAuthenticatedUser();

//     // Protect the route
//     if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }

//     // Prevent users from deleting themselves
//     if (currentUser.id === id) {
//       return NextResponse.json(
//         { error: 'You cannot delete yourself' },
//         { status: 400 }
//       );
//     }

//     const deletedUser = await deleteUser(id);

//     if (!deletedUser) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     return new NextResponse(null, { status: 204 }); // No Content
//   } catch (error) {
//     console.error(`Failed to delete user ${params.id}:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';
// import { getUserById, deleteUser } from '@/lib/db/queries';
// import { User } from '@/lib/db/schema';
// import { hashPassword } from '@/lib/auth/session';
// import { withRoleProtection } from '@/lib/auth/middleware';
// import { db } from '@/lib/db/drizzle';
// import { users, addresses, meters } from '@/lib/db/schema';
// import { eq } from 'drizzle-orm';

// // --- GET Handler ---
// const getHandler = async (req: Request, { params }: any, sessionUser: any) => {
//   try {
//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }
//     const user = await getUserById(id);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     return NextResponse.json(user);
//   } catch (error) {
//     console.error(`Failed to fetch user ${params.id}:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// // --- PATCH Handler ---
// const patchHandler = async (
//   req: Request,
//   { params }: any,
//   sessionUser: any
// ) => {
//   try {
//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }

//     const body = await req.json();
//     const {
//       name,
//       email,
//       password,
//       businessName,
//       documentType,
//       documentNumber,
//       vatCondition,
//       phone,
//       membershipNumber,
//       tariffCategory,
//       coefficient,
//       isTaxExempt,
//       enablePdfPrinting,
//       isMember,
//       status,
//       addressStreet,
//       addressNumber,
//       addressNeighborhood,
//       addressCity,
//       addressRoute,
//       addressBlock,
//       addressPlot,
//       addressChNumber,
//       addressSection,
//       addressDistrict,
//       meterNumber,
//     } = body;

//     const updatedUser = await db.transaction(async (tx) => {
//       const userData: Partial<typeof users.$inferInsert> = {
//         name,
//         email,
//         businessName,
//         documentType,
//         documentNumber,
//         vatCondition,
//         phone,
//         membershipNumber,
//         tariffCategory,
//         coefficient,
//         isTaxExempt,
//         enablePdfPrinting,
//         role: isMember === 'socio' ? 'socio' : 'superadmin',
//         status: status === 'baja' ? 'baja' : 'activo',
//         updatedAt: new Date(),
//       };
//       if (password) {
//         userData.passwordHash = await hashPassword(password);
//       }
//       const returnedUsers = await tx
//         .update(users)
//         .set(userData)
//         .where(eq(users.id, id))
//         .returning();

//       const addressData = {
//         street: addressStreet,
//         number: addressNumber,
//         neighborhood: addressNeighborhood,
//         city: addressCity,
//         route: addressRoute,
//         block: addressBlock,
//         plot: addressPlot,
//         chNumber: addressChNumber,
//         section: addressSection,
//         district: addressDistrict,
//       };
//       await tx
//         .update(addresses)
//         .set(addressData)
//         .where(eq(addresses.userId, id));

//       if (meterNumber) {
//         const userAddress = await tx.query.addresses.findFirst({
//           where: eq(addresses.userId, id),
//         });
//         if (userAddress) {
//           await tx
//             .update(meters)
//             .set({ serialNumber: meterNumber })
//             .where(eq(meters.addressId, userAddress.id));
//         }
//       }
//       return returnedUsers[0];
//     });

//     if (!updatedUser) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     const { passwordHash: _, ...userToReturn } = updatedUser;
//     return NextResponse.json(userToReturn);
//   } catch (error: any) {
//     if (error.code === '23505') {
//       return NextResponse.json(
//         { error: 'A user with this email or document number already exists.' },
//         { status: 409 }
//       );
//     }
//     console.error(`Failed to update user ${params.id}:`, error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// // --- DELETE Handler ---
// const deleteHandler = async (
//   req: Request,
//   { params }: any,
//   sessionUser: any
// ) => {
//   try {
//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
//     }
//     if (sessionUser.id === id) {
//       return NextResponse.json(
//         { error: 'You cannot delete yourself' },
//         { status: 400 }
//       );
//     }
//     const deletedUser = await deleteUser(id);
//     if (!deletedUser) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error(`Failed to delete user ${params.id}:`, error);
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
  try {
    const { id } = await context.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(`Failed to fetch user:`, error);
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
  try {
    const { id } = await context.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

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
    console.error(`Failed to update user:`, error);
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
  try {
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
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete user:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// --- EXPORT PROTECTED ROUTES ---
const allowedRoles: User['role'][] = ['admin', 'superadmin'];

export const GET = withRoleProtection(getHandler, allowedRoles);
export const PATCH = withRoleProtection(patchHandler, allowedRoles);
export const DELETE = withRoleProtection(deleteHandler, allowedRoles);
