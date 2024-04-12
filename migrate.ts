import config from "@/backend/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const client = postgres(config.supabase.connectionString);
const db = drizzle(client);

// This will run migrations on the
// database, skipping the ones already
// applied
migrate(db, { migrationsFolder: "./drizzle" }).finally(() => {
  // Don't forget to close the connection,
  // otherwise the script will hang
  return client.end();
});
