import makeDatabase from "@/backend/database";
import { useStandardResponse } from "@/backend/hooks/use-standard-response";
import { id } from "@/backend/id";
import jwt from "@/backend/jwt";
import { Only, User, Verification } from "@/backend/model";
import { compose } from "@exobase/core";
import { useCors, useJsonBody, useServices } from "@exobase/hooks";
import { useNext } from "@exobase/use-next";
import crypto from "crypto";
import dur from "durhuman";

export default compose(
  useNext(),
  useCors({ origins: "*" }),
  useStandardResponse(),
  useJsonBody((z) => ({
    address: z.string().startsWith("0x"),
  })),
  useServices({
    db: () => makeDatabase(),
  }),
  async function startLoginVerification({ args, services }) {
    const { db } = services;
    const { address } = args;

    // generate random nonce
    const nonce = crypto.randomBytes(16).toString("hex");

    // create user dto - only used if user doesn't already exist
    const user: Only<User> = {
      id: id("user", address),
      email: null,
      name: null,
      address,
      createdAt: new Date(),
      updatedAt: null,
    };

    // create verification dto
    const verification: Only<Verification> = {
      id: id("verification"),
      operation: "authenticate",
      createdAt: new Date(),
      fileId: null,
      userId: id("user", address),
      nonce,
      ttl: "10 minutes",
      expiration: new Date(Date.now() + dur("10 minutes", "ms")),
      consumed: false,
    };

    await db.transaction(async (tx) => {
      // save verification to database
      const existingUser = await db.users.find({
        id: id("user", address),
      });
      if (!existingUser) {
        await tx.users.create(user);
      }
      await tx.verifications.create(verification);
    });

    return {
      verificationId: verification.id,
      nonce,
    };
  }
);
