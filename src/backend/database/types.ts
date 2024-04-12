import * as schema from "./schema";

export type UserRecord = typeof schema.users.$inferSelect;
export type FileRecord = typeof schema.files.$inferSelect;
export type VerificationRecord = typeof schema.verifications.$inferSelect;
