import config from "@/backend/config";
import makeDatabase from "@/backend/database";
import { useStandardResponse } from "@/backend/hooks/use-standard-response";
import { id } from "@/backend/id";
import { IdToken } from "@/backend/jwt/types";
import { File, Only, User, Verification } from "@/backend/model";
import { compose } from "@exobase/core";
import { useCors, useJsonBody, useServices, useTokenAuth } from "@exobase/hooks";
import { useNext } from "@exobase/use-next";
import crypto from "crypto";
import dur from "durhuman";

export default compose(
  useNext(),
  useCors({ origins: "*" }),
  useStandardResponse(),
  useTokenAuth<IdToken["extra"]>(config.auth.jwt.secret),
  useJsonBody((z) => ({
    name: z.string(),
    hash: z.string(),
  })),
  useServices({
    db: () => makeDatabase(),
  }),
  async function authorizeFileUpload({ args, services, auth }) {
    const { db } = services;
    const { hash, name } = args;

    // generate random nonce
    const nonce = crypto.randomBytes(16).toString("hex");

    const file: Only<File> = {
      id: id("file"),
      userId: id("user", auth.token.extra.address),
      hash,
      name,
      ipfsHash: null,
      sizeInBytes: null,
      status: "pending",
      createdAt: new Date(),
    };

    // create verification dto
    const verification: Only<Verification> = {
      id: id("verification"),
      operation: "upload-file",
      createdAt: new Date(),
      fileId: file.id,
      userId: id("user", auth.token.extra.address),
      nonce,
      ttl: "10 minutes",
      expiration: new Date(Date.now() + dur("10 minutes", "ms")),
      consumed: false,
    };

    await db.transaction(async (tx) => {
      await tx.files.create(file);
      await tx.verifications.create(verification);
    });

    return {
      verificationId: verification.id,
      nonce,
    };
  }
);
