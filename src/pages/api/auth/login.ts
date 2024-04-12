import makeDatabase from "@/backend/database";
import { useStandardResponse } from "@/backend/hooks/use-standard-response";
import { id } from "@/backend/id";
import jwt from "@/backend/jwt";
import { Id, Only, Verification } from "@/backend/model";
import { compose } from "@exobase/core";
import { useJsonBody, useServices } from "@exobase/hooks";
import { useNext } from "@exobase/use-next";
import crypto from "crypto";
import dur from "durhuman";
import { ethers } from "ethers";
import { Web3 } from "web3";
import { Personal } from "web3-eth-personal";

export default compose(
  useNext(),
  useStandardResponse(),
  useJsonBody((z) => ({
    verificationId: z.string().transform((x) => x as Id<"verification">),
    signature: z.string(),
  })),
  useServices({
    db: () => makeDatabase(),
  }),
  async function startLoginVerification({ args, services }) {
    const { db } = services;
    const { verificationId, signature } = args;

    const verification = await db.verifications.find({
      id: verificationId,
    });

    if (!verification) {
      throw new Error("Verification with the given id does not exist", {
        cause: verificationId,
      });
    }

    if (verification.operation !== "authenticate") {
      throw new Error(
        "Verification was not created for authenticating purposes",
        {
          cause: verification,
        }
      );
    }

    const isExpired = new Date(verification.expiration).getTime() < Date.now();
    if (isExpired) {
      throw new Error("Verification is expired", {
        cause: verification,
      });
    }

    if (verification.consumed) {
      throw new Error("Verification has already been used", {
        cause: verification,
      });
    }

    const user = verification.$related.$user;
    if (!user) {
      throw new Error("Verification is not attached to a user", {
        cause: verification,
      });
    }

    const web3 = new Web3("https://cloudflare-eth.com");
    const address = web3.eth.accounts.recover(
      `Authenticate ${verification.nonce}`,
      signature
    );

    const isValidSignature =
      address.toLowerCase() === user.address.toLowerCase();
    if (!isValidSignature) {
      throw new Error("Verification failed because the signature is invalid", {
        cause: verification,
      });
    }

    await db.verifications.update(verification.id, {
      consumed: true,
    });

    const idToken = jwt.generate(user);

    return {
      idToken,
      user,
    };
  }
);
