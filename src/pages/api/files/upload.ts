import conf from "@/backend/config";
import makeDatabase from "@/backend/database";
import { useStandardResponse } from "@/backend/hooks/use-standard-response";
import { id } from "@/backend/id";
import formidable from "formidable";
import { IdToken } from "@/backend/jwt/types";
import { Id, Only, Verification } from "@/backend/model";
import { compose } from "@exobase/core";
import { useJsonBody, useServices, useTokenAuth } from "@exobase/hooks";
import { useNext } from "@exobase/use-next";
import PersistentFile from "formidable/PersistentFile";
import { Web3 } from "web3";
import zod from "zod";
import { NextApiRequest } from "next";
import { PassThrough, Writable } from "stream";
import { hashFile } from "@/lib/hash-file";
import makeIpfs from "@/backend/ipfs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default compose(
  useNext(),
  useStandardResponse(),
  useTokenAuth<IdToken["extra"]>(conf.auth.jwt.secret),
  useServices({
    db: () => makeDatabase(),
    ipfs: makeIpfs,
  }),
  async function uploadFile({ services, auth, framework }) {
    const { db, ipfs } = services;
    const { req } = framework;

    const {
      verificationId,
      signature,
      file: content,
    } = await parseMultipartRequest(req);

    const verification = await db.verifications.find({
      id: verificationId,
    });
    if (!verification) {
      throw new Error("No verification exists for this file", {
        cause: { verificationId },
      });
    }

    if (verification.operation !== "upload-file") {
      throw new Error("Verification was not created for file upload purposes", {
        cause: verification,
      });
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

    const hash = await hashFile.fromBuffer(content);

    const web3 = new Web3("https://cloudflare-eth.com");
    const address = web3.eth.accounts.recover(
      `File ${hash}${verification.nonce}`,
      signature
    );

    const isValidSignature =
      address.toLowerCase() === auth.token.extra.address.toLowerCase();
    if (!isValidSignature) {
      throw new Error("Verification failed because the signature is invalid", {
        cause: verification,
      });
    }

    const file = verification.$related.$file;
    if (!file) {
      throw new Error("Verification is not linked to file", {
        cause: verification,
      });
    }

    const { ipfsHash } = await ipfs.upload({
      file,
      content,
    });

    await db.transaction(async (tx) => {
      await tx.verifications.update(verification.id, {
        consumed: true,
      });
      await tx.files.update(file.id, {
        ipfsHash,
        status: "uploaded",
      });
    });

    return {
      file: {
        ...file,
        ipfsHash,
      },
    };
  }
);

/**
 * Schema to parse and transform the form data
 */
const schema = zod.object({
  verificationId: zod
    .array(zod.string().startsWith("ofv_verification_"))
    .length(1)
    .transform((x) => x[0] as Id<"verification">),
  signature: zod
    .array(zod.string())
    .length(1)
    .transform((x) => x[0]),
  file: zod.instanceof(Buffer),
});

/**
 * This is disgusting and ugly but it's a neccisary evil to
 * read the file object from the multipart FormData as a
 * buffer.
 */
const parseMultipartRequest = async (req: NextApiRequest) => {
  let file: Buffer | null = null;
  const form = formidable({
    fileWriteStreamHandler: () => {
      const chunks: Uint8Array[] = [];
      return new Writable({
        write(chunk, enc, next) {
          chunks.push(chunk);
          next();
        },
        final(cb) {
          file = Buffer.concat(chunks);
          cb();
        },
      });
    },
  });
  const body = await new Promise<object>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ ...fields, ...files });
    });
  });
  return schema.parse({
    ...body,
    file,
  });
};
