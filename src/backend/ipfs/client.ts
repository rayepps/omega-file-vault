import PinataClient from "@pinata/sdk";
import { File, Only, User } from "@/backend/model";
import { Readable } from "stream";

export const ipfsClient = (pinata: PinataClient) => {
  return {
    upload: async ({
      file,
      content,
    }: {
      file: Only<File>;
      content: Buffer;
    }) => {
      const res = await pinata.pinFileToIPFS(Readable.from(content), {
        pinataMetadata: {
          name: file.name,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      });
      return {
        ipfsHash: res.IpfsHash,
      };
    },
  };
};
