import { NextResponse } from 'next/server';
import { getAuthenticatedUser, getUsers, createUser } from '@/lib/db/queries';
import { User, NewUser } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/session';

export async function GET() {
  try {
    const currentUser: User | null = await getAuthenticatedUser();

    // Protect the route: only admins and superadmins can access
    if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser: User | null = await getAuthenticatedUser();

    // Protect the route: only admins and superadmins can access
    if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
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
}
