import { db } from './drizzle';
import { users, teams, teamMembers } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: 'superadmin',
      },
    ])
    .returning();

  console.log('Initial user created.');

  // Create a default team for the superadmin to belong to
  const [team] = await db
    .insert(teams)
    .values({
      name: 'Cooperativa',
    })
    .returning();

  // Note: The teamMembers table still uses a varchar 'role'.
  // This might need to be updated in the future if team roles are used.
  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner', // This 'owner' is for the team, not the app role.
  });

  console.log('Seed process finished.');
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
