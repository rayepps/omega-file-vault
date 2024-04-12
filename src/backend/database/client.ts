import * as t from "@/backend/model";
import { and, count, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Sql } from "postgres";
import * as mappers from "./mappers";
import * as schema from "./schema";

const createDatabaseClient = (
  pg: Sql<{}>,
  _db: PostgresJsDatabase<typeof schema>
) => {
  const methods = (db: PostgresJsDatabase<typeof schema>) => ({
    pg,
    db,

    //
    // USERS
    //
    users: {
      find: async (
        arg: { email: string } | { id: t.Id<"user"> }
      ): Promise<t.User | null> => {
        const { email, id } = arg as Partial<{
          email: string;
          id: t.Id<"user">;
        }>;
        const row = await db.query.users.findFirst({
          where: email
            ? eq(schema.users.email, email)
            : eq(schema.users.id, id!),
          with: {
            files: true,
          },
        });
        if (!row) return null;
        return {
          ...mappers.UserRecord.toModel(row),
          ...mappers.UserRecord.toRelations(row),
        };
      },
      list: async (): Promise<t.User[]> => {
        const rows = await db.query.users.findMany({
          with: {
            files: true,
          },
        });
        if (rows.length === 0) return [];
        return rows.map((r) => ({
          ...mappers.UserRecord.toModel(r),
          ...mappers.UserRecord.toRelations(r),
        }));
      },
      create: async (user: t.Only<t.User>) => {
        await db.insert(schema.users).values(user);
      },
      update: async (
        id: t.Id<"user">,
        user: Partial<Omit<t.Only<t.User>, "id">>
      ) => {
        await db.update(schema.users).set(user).where(eq(schema.users.id, id));
      },
    },

    //
    // FILES
    //
    files: {
      create: async (file: t.Only<t.File>) => {
        await db.insert(schema.files).values(file);
      },
      list: async ({
        userId,
      }: {
        userId?: t.Id<"user">;
      }): Promise<t.File[]> => {
        const rows = await db.query.files.findMany({
          where: userId ? eq(schema.files.userId, userId) : undefined,
          with: {
            user: true,
          },
        });
        if (rows.length === 0) return [];
        return rows.map((r) => ({
          ...mappers.FileRecord.toModel(r),
          ...mappers.FileRecord.toRelations(r),
        }));
      },
      find: async ({ id }: { id: t.Id<"file"> }): Promise<t.File | null> => {
        const row = await db.query.files.findFirst({
          where: eq(schema.files.id, id),
          with: {
            user: true,
          },
        });
        if (!row) return null;
        return {
          ...mappers.FileRecord.toModel(row),
          ...mappers.FileRecord.toRelations(row),
        };
      },
      update: async (id: t.Id<"file">, file: Partial<Omit<t.File, "id">>) => {
        await db.update(schema.files).set(file).where(eq(schema.files.id, id));
      },
    },

    //
    // VERIFICATIONS
    //
    verifications: {
      create: async (verification: t.Only<t.Verification>) => {
        await db.insert(schema.verifications).values(verification);
      },
      list: async (): Promise<t.Verification[]> => {
        const rows = await db.query.verifications.findMany({
          with: {
            user: true,
            file: true,
          },
        });
        if (rows.length === 0) return [];
        return rows.map((r) => ({
          ...mappers.VerificationRecord.toModel(r),
          ...mappers.VerificationRecord.toRelations(r),
        }));
      },
      find: async ({
        id,
      }: {
        id: t.Id<"verification">;
      }): Promise<t.Verification | null> => {
        const row = await db.query.verifications.findFirst({
          where: eq(schema.verifications.id, id),
          with: {
            user: true,
            file: true,
          },
        });
        if (!row) return null;
        return {
          ...mappers.VerificationRecord.toModel(row),
          ...mappers.VerificationRecord.toRelations(row),
        };
      },
      update: async (
        id: t.Id<"verification">,
        verification: Partial<Omit<t.Verification, "id">>
      ) => {
        await db
          .update(schema.verifications)
          .set(verification)
          .where(eq(schema.verifications.id, id));
      },
    },
  });

  return {
    ...methods(_db),
    transaction: async (
      callback: (tx: ReturnType<typeof methods>) => Promise<void>
    ) => {
      return await _db.transaction(async (tx) => {
        await callback(methods(tx));
      });
    },
  };
};

export default createDatabaseClient;

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
