import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  const dbName = process.env.MONGO_DB_NAME || 'ecommerce';

  try {
    const conn = await mongoose.connect(mongoUri, { dbName });
    console.log(`MongoDB Connected: ${conn.connection.host}/${dbName}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Database connection failed. Check MONGO_URI and ensure MongoDB is running.');
    process.exit(1);
  }
};

export default connectDB;


