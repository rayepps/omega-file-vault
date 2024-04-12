import * as t from "../model";
import * as db from "./types";

export const UserRecord = {
  toRelations: (row: { files: db.FileRecord[] }): Pick<t.User, "$related"> => {
    return {
      $related: {
        $files: row.files.map((c) => FileRecord.toModel(c)),
      },
    };
  },

  toModel: (row: db.UserRecord): t.Only<t.User> => {
    return {
      id: row.id,
      email: row.email!,
      name: row.name!,
      address: row.address!,
      createdAt: row.createdAt!,
      updatedAt: row.updatedAt!,
    };
  },
};

export const FileRecord = {
  toModel: (row: db.FileRecord): t.Only<t.File> => {
    return {
      id: row.id,
      userId: row.userId!,
      name: row.name!,
      ipfsHash: row.ipfsHash,
      sizeInBytes: row.sizeInBytes,
      hash: row.hash!,
      status: row.status!,
      createdAt: row.createdAt!,
    };
  },
  toRelations: (row: {
    user: db.UserRecord | null;
  }): Pick<t.File, "$related"> => {
    return {
      $related: {
        $user: UserRecord.toModel(row.user!),
      },
    };
  },
};

export const VerificationRecord = {
  toModel: (row: db.VerificationRecord): t.Only<t.Verification> => {
    return {
      id: row.id,
      userId: row.userId,
      fileId: row.fileId,
      operation: row.operation!,
      nonce: row.nonce!,
      expiration: row.expiration!,
      consumed: row.consumed ?? false,
      ttl: row.ttl!,
      createdAt: row.createdAt!,
    };
  },
  toRelations: (row: {
    user: db.UserRecord | null;
    file: db.FileRecord | null;
  }): Pick<t.Verification, "$related"> => {
    return {
      $related: {
        $user: row.user ? UserRecord.toModel(row.user) : null,
        $file: row.file ? FileRecord.toModel(row.file) : null,
      },
    };
  },
};
