import mongoose from 'mongoose';

const buildMongoUriFromParts = () => {
  const host = process.env.MONGO_HOST;
  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;

  if (!host || !user || !password) {
    return null;
  }

  // Encode credentials so special characters do not break SRV URIs.
  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  return `mongodb+srv://${encodedUser}:${encodedPassword}@${host}`;
};

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    buildMongoUriFromParts() ||
    'mongodb://127.0.0.1:27017/ecommerce';
  const dbName = process.env.MONGO_DB_NAME || 'ecommerce';

  try {
    const conn = await mongoose.connect(mongoUri, { dbName });
    console.log(`MongoDB Connected: ${conn.connection.host}/${dbName}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);

    if (error?.message?.toLowerCase().includes('auth')) {
      console.error(
        'MongoDB authentication failed. Verify Atlas DB user/password, IP access list, and URL-encode special password characters.'
      );
    } else {
      console.error('Database connection failed. Check MONGO_URI and ensure MongoDB is running.');
    }

    process.exit(1);
  }
};

export default connectDB;


