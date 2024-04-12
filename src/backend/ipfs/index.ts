import { ipfsClient } from "./client";
import config from "@/backend/config";
import pinataSDK from "@pinata/sdk";

const makeIpfs = (): IPFSClient => {
  const pinata = new pinataSDK({ pinataJWTKey: config.pinata.jwt });
  return ipfsClient(pinata);
};

export type IPFSClient = ReturnType<typeof ipfsClient>;
export default makeIpfs;
