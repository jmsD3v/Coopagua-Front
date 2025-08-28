import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/db/queries';
import { NewUser } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/session';
import { withRoleProtection } from '@/lib/auth/middleware';

// The wrapper handles the auth check. The handler only contains the core logic.
const getHandler = async (req: Request, context: {}, sessionUser: any) => {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

const postHandler = async (req: Request, context: {}, sessionUser: any) => {
  try {
    const body = await req.json();
    const { email, password, ...otherData } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser: NewUser = {
      email,
      passwordHash,
      ...otherData,
    };

    const createdUser = await createUser(newUser);

    // Don't return the password hash
    const { passwordHash: _, ...userToReturn } = createdUser;

    return NextResponse.json(userToReturn, { status: 201 });
  } catch (error: any) {
    // Handle specific error for duplicate email
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// Export the protected routes
export const GET = withRoleProtection(getHandler, ['admin', 'superadmin']);
export const POST = withRoleProtection(postHandler, ['admin', 'superadmin']);
