import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "../config";
import createClient from "./client";
import * as schema from "./schema";

const makeDatabase = (
  connectionString: string = config.supabase.connectionString
) => {
  const client = postgres(connectionString, {
    idle_timeout: 1, // seconds
    max_lifetime: 6, // seconds
  });
  const db = drizzle(client, { schema, logger: config.debug.queries });
  return createClient(client, db);
};

export type { DatabaseClient as Database } from "./client";
export default makeDatabase;
