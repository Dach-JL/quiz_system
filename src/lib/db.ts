import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // During build phase, DATABASE_URL might not be available
  // We handle this to prevent build failures if db is not strictly needed at build time
}

const sql = postgres(connectionString || '', {
  ssl: 'require',
});

export default sql;
