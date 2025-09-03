import { db } from './drizzle';
import { users } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function seed() {
  console.log('Seeding database...');

  // 1. Check if the superadmin user already exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'test@test.com'),
  });

  if (existingUser) {
    console.log(
      'Superadmin user (test@test.com) already exists. Seeding not required.'
    );
    return;
  }

  // 2. If not, create the superadmin user
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  await db
    .insert(users)
    .values([
      {
        name: 'Super Admin',
        email: email,
        passwordHash: passwordHash,
        role: 'superadmin',
        membershipNumber: '00001',
        tariffCategory: 'Admin',
        status: 'activo',
      },
    ])
    .returning();

  console.log('Initial superadmin user created successfully.');
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
