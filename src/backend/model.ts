import { Duration } from "durhuman";

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type Model = "user" | "file" | "verification";

export type Id<M extends Model> = `ofv_${M}_${string}`;

//
// HELPER
//

export type Only<TModelType extends { $related: any }> = Omit<
  TModelType,
  "$related"
>;

//
//  USERS
//

export interface User {
  id: Id<"user">;
  email: null | string;
  name: null | string;
  /**
   * The user's wallet address 0x...
   */
  address: string;
  createdAt: Date;
  updatedAt: null | Date;

  $related: {
    $files: Only<File>[];
  };
}

//
// FILES
//

export interface File {
  id: Id<"file">;
  userId: Id<"user">;
  name: string;
  ipfsHash: string | null;
  sizeInBytes: number | null;
  status: "pending" | "uploaded";
  createdAt: Date;
  hash: string;

  $related: {
    $user: Only<User>;
  };
}

//
// VERIFICATION
//

export interface Verification {
  id: Id<"verification">;
  userId: null | Id<"user">;
  fileId: null | Id<"file">;
  operation: "authenticate" | "upload-file";
  nonce: string;
  ttl: Duration;
  expiration: Date;
  consumed: boolean;
  createdAt: Date;

  $related: {
    $user: null | Only<User>;
    $file: null | Only<File>;
  };
}
