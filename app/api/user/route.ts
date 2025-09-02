import { getAuthenticatedUser, getUserById } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sessionUser = await getAuthenticatedUser();

    if (!sessionUser) {
      // Return null or an appropriate response if there's no session
      return NextResponse.json(null);
    }

    // Session exists, now fetch the full user details from the database
    const user = await getUserById(sessionUser.id);

    return NextResponse.json(user);
  } catch (error) {
    console.error('[API_USER_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
