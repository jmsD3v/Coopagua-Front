import { NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/db/queries';
import { hashPassword } from '@/lib/auth/session';
import { withRoleProtection } from '@/lib/auth/middleware';

const getHandler = async (req: Request, { params }: any, sessionUser: any) => {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Failed to fetch user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

const patchHandler = async (
  req: Request,
  { params }: any,
  sessionUser: any
) => {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await req.json();
    let { password, ...otherData } = body;

    // Only allow certain fields to be updated
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

    // If password is being updated, hash it
    if (password) {
      sanitizedData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await updateUser(id, sanitizedData);

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
    console.error(`Failed to update user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

const deleteHandler = async (
  req: Request,
  { params }: any,
  sessionUser: any
) => {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Prevent users from deleting themselves
    if (sessionUser.id === id) {
      return NextResponse.json(
        { error: 'You cannot delete yourself' },
        { status: 400 }
      );
    }

    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Failed to delete user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// Export the protected routes
const allowedRoles = ['admin', 'superadmin'];
export const GET = withRoleProtection(getHandler, allowedRoles);
export const PATCH = withRoleProtection(patchHandler, allowedRoles);
export const DELETE = withRoleProtection(deleteHandler, allowedRoles);
