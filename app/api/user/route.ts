import { getAuthenticatedUser } from '@/lib/db/queries';

export async function GET() {
  const user = await getAuthenticatedUser();
  return Response.json(user);
}
