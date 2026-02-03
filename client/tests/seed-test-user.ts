import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const AUTH_SECRET = process.env.AUTH_SECRET || 'change-this-to-a-random-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'change-this-to-another-random-secret';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saas_template';

const TEST_USER = {
  email: 'test@playwright.local',
  name: 'Playwright Test User',
  googleId: 'playwright-test-google-id-12345',
  picture: null,
  tokenVersion: 0,
};

// User schema (minimal, matching server)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  googleId: { type: String, required: true, unique: true },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now },
  hasSubscription: { type: Boolean, default: false },
  subscriptionEndsAt: { type: Date },
  stripeCustomerId: { type: String },
  exportActionUsageCount: { type: Number, default: 0 },
  waitlistData: {
    firstName: { type: String },
    lastName: { type: String },
    jobTitle: { type: String },
    companyName: { type: String },
    workEmail: { type: String },
    useCase: { type: String },
    submittedAt: { type: Date },
  },
  isWaitlisted: { type: Boolean, default: false },
  tokenVersion: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export interface TestAuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export async function seedTestUser(): Promise<TestAuthTokens> {
  await mongoose.connect(MONGODB_URI);

  // Upsert test user
  const user = await User.findOneAndUpdate(
    { googleId: TEST_USER.googleId },
    { $setOnInsert: TEST_USER },
    { upsert: true, new: true }
  );

  // Generate tokens using same secrets as server
  const accessToken = jwt.sign({ userId: user._id }, AUTH_SECRET, {
    expiresIn: '7d',
  });

  const refreshToken = jwt.sign(
    { userId: user._id, version: user.tokenVersion },
    REFRESH_SECRET,
    { expiresIn: '14d' }
  );

  await mongoose.disconnect();

  return {
    accessToken,
    refreshToken,
    userId: user._id.toString(),
  };
}

// CLI entry point
if (require.main === module) {
  seedTestUser()
    .then((tokens) => {
      // Write tokens to a file for Playwright to read
      const outputPath = path.join(__dirname, '.test-auth-tokens.json');
      fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
      console.log('Test user seeded. Tokens written to:', outputPath);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed test user:', err);
      process.exit(1);
    });
}
