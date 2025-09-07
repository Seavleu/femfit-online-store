import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI } from './env';

// Only throw error if we're actually trying to connect
// This prevents the error during SSR when the module is imported

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Initialize connection only when needed
const initializeConnection = () => {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (process.env.NODE_ENV === 'development') {
    // Use a global variable to preserve client across hot reloads in dev
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production, create a new client per instance
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }
};

/**
 * Connects to the MongoDB database and returns the DB instance
 */
export const connectToDatabase = async (): Promise<Db> => {
  if (!clientPromise) {
    initializeConnection();
  }
  
  if (!clientPromise) {
    throw new Error('Failed to initialize MongoDB connection');
  }
  
  const client = await clientPromise;
  // You can customize the database name here or via env variable if needed
  return client.db('femfit');
};

// Export the clientPromise to be reused (lazy initialization)
export default (() => {
  if (!clientPromise) {
    initializeConnection();
  }
  return clientPromise;
})();
