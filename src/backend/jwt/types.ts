import type { Id } from "@/backend/model";
import { PermissionKey } from "@exobase/hooks";
import type { Duration } from "durhuman";

export type TokenAuth = {
  token: IdToken;
};

export type IdToken = {
  exp: number;
  sub: Id<"user">;
  iss: "ofv.api";
  type: "id";
  aud: "ofv.web";
  ttl: Duration;
  roles: [];
  permissions: [];
  provider: "ofv";
  extra: {
    address: string;
  };
};
