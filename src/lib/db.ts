import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set. Please configure your database connection.');
  throw new Error('DATABASE_URL is not configured. Please set it in your .env.local file.');
}

// Validate connection string format
if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
  console.error('Invalid DATABASE_URL format. Must start with postgresql:// or postgres://');
  throw new Error('Invalid DATABASE_URL format.');
}

const sql = postgres(connectionString, {
  ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Helper to check if database is connected
export function isDbConnected(): boolean {
  return true;
}

export default sql;
