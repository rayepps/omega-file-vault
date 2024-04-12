import { tryit } from "radash";
import z from "zod";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

/**
 * Record missing variables so we can warn
 * the dev after all are loaded
 */
let missing: string[] = [];

const get = <T = string>(
  name: string,
  defaultValue?: T | null,
  cast?: (v: any) => T
): T => {
  const val = process.env[name];
  if (!val) {
    if (defaultValue !== undefined) {
      return defaultValue as T;
    }
    missing.push(name);
    return undefined as unknown as T;
  }
  return cast ? cast(val) : (val as unknown as T);
};

const [err, env] = tryit(() =>
  z.enum(["local", "production"]).parse(get("APP_ENV"))
)();
if (err) {
  throw new Error("Cannot run app without an APP_ENV environment variable", {
    cause: err,
  });
}

const config = {
  env,
  supabase: {
    connectionString: get("SUPABASE_CONNECTION_STRING"),
  },
  debug: {
    queries: get("DEBUG_PG_QUERIES", false, Boolean),
  },
  auth: {
    jwt: {
      secret: get("AUTH_JWT_SECRET"),
    },
  },
  pinata: {
    jwt: get('PINATA_JWT')
  }
};

if (missing.length > 0) {
  console.warn(
    `Missing required environment varaibles:\n  ${missing.join("\n  ")}`
  );
}

export type Config = typeof config;

export default config as Config;
