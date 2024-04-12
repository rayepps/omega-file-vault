import config from "@/backend/config";
import makeDatabase from "@/backend/database";
import { useStandardResponse } from "@/backend/hooks/use-standard-response";
import { id } from "@/backend/id";
import { IdToken } from "@/backend/jwt/types";
import { Id, Only, Verification } from "@/backend/model";
import { compose } from "@exobase/core";
import { useJsonBody, useServices, useTokenAuth } from "@exobase/hooks";
import { useNext } from "@exobase/use-next";

export default compose(
  useNext(),
  useStandardResponse(),
  useTokenAuth<IdToken["extra"]>(config.auth.jwt.secret),
  useServices({
    db: () => makeDatabase(),
  }),
  async function listFiles({ args, services, auth }) {
    const { db } = services;
    const token = auth.token as unknown as IdToken;

    const files = await db.files.list({
      userId: token.sub,
    });

    return {
      files,
    };
  }
);
