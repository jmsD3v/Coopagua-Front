import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, client } from './drizzle';

async function main() {
  console.log('Running database migrations...');

  try {
    await migrate(db, { migrationsFolder: 'lib/db/migrations' });
    console.log('Migrations applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Ensure the connection is always closed
    await client.end();
    console.log('Database connection closed.');
  }
}

main();
