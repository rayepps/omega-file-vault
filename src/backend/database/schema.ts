import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import * as t from "../model";

//
// UTIL
//

const id = <TModel extends t.Model>(name: string) =>
  pg.text(name).primaryKey().$type<t.Id<TModel>>();

const fk = <TModel extends t.Model>(name: string, column: () => pg.PgColumn) =>
  pg.text(name).$type<t.Id<TModel>>().references(column);

const json = <TType>(name: string) => pg.json(name).$type<TType>();

const enumm = <TEnum extends string>(name: string) =>
  pg.text(name).$type<TEnum>();

const string = <TType extends string = string>(name: string) =>
  pg.text(name).$type<TType>();

//
// TABLES
//

export const users = pg.pgTable("users", {
  // Primary Key
  id: id<"user">("id"),

  // Attributes
  email: string("email"),
  name: string("name"),
  address: string("address"),

  // Audit
  createdBy: pg.text("created_by").$type<t.Id<"user">>(),
  createdAt: pg.timestamp("created_at"),
  updatedBy: pg.text("updated_by").$type<t.Id<"user">>(),
  updatedAt: pg.timestamp("updated_at"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  files: many(files),
}));

export const files = pg.pgTable("files", {
  // Primary Key
  id: id<"file">("id"),

  // Foreign Keys
  userId: fk<"user">("user_id", () => users.id),

  // Attributes
  ipfsHash: string("ipfs_hash"),
  hash: string("hash"),
  name: string("name"),
  sizeInBytes: pg.integer("size_in_bytes"),
  status: enumm<t.File["status"]>("status"),

  // Audit
  createdBy: pg.text("created_by").$type<t.Id<"user">>(),
  createdAt: pg.timestamp("created_at"),
});

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));

export const verifications = pg.pgTable("verifications", {
  // Primary Key
  id: id<"verification">("id"),

  // Foreign Keys
  userId: fk<"user">("user_id", () => users.id),
  fileId: fk<"file">("file_id", () => files.id),

  // Attributes
  nonce: string("nonce"),
  ttl: string<t.Verification["ttl"]>("ttl"),
  expiration: pg.timestamp("expiration"),
  consumed: pg.boolean("consumed"),
  operation: enumm<t.Verification["operation"]>("operation"),

  // Audit
  createdAt: pg.timestamp("created_at"),
});

export const verificationsRelations = relations(verifications, ({ one }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
  file: one(files, {
    fields: [verifications.fileId],
    references: [files.id],
  }),
}));
