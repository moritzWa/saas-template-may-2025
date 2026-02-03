import { seedTestUser } from './seed-test-user';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  console.log('Seeding test user...');

  const tokens = await seedTestUser();

  // Write tokens to a file for test fixtures to read
  const outputPath = path.join(__dirname, '.test-auth-tokens.json');
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));

  console.log('Test user seeded successfully. User ID:', tokens.userId);
}

export default globalSetup;
