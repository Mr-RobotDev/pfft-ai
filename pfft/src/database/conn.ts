import mongoose, { Connection } from 'mongoose';

mongoose.set('strictQuery', false);

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error('Please define the MONGODB_URL environment variable');
}

declare global {
  var mongooseConnection: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

let cached = global.mongooseConnection;
if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGO_URL as string, opts as any) as unknown as Promise<Connection>;
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
