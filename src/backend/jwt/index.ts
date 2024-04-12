import * as t from "@/backend/model";
import dur, { type Duration } from "durhuman";
import * as jwt from "jsonwebtoken";
import { tryit } from "radash";
import config from "../config";
import { IdToken } from "./types";

export const TTL: Duration = "30 days";

export const generate = (user: t.Only<t.User>) => {
  const payload: IdToken = {
    exp: Date.now() + dur(TTL, "ms"),
    sub: user.id,
    iss: "ofv.api",
    type: "id",
    aud: "ofv.web",
    roles: [],
    permissions: [],
    ttl: "30 days",
    provider: "ofv",
    extra: {
      address: user.address,
    },
  };
  return jwt.sign(payload, config.auth.jwt.secret);
};

export const parse = (idToken: string | null | undefined): IdToken | null => {
  if (!idToken) return null;
  const [err, token] = tryit(() => {
    return jwt.verify(idToken, config.auth.jwt.secret);
  })();
  if (err) return null;
  return token as IdToken;
};

export default {
  generate,
  parse,
};
