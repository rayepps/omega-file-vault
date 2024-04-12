import * as t from "@/backend/model";
import { shake, tryit } from "radash";

export interface ApiError {
  message: string;
  details: string;
}

export interface ApiResponse<T> {
  error: ApiError | null;
  result: T;
  status: number;
}

export interface IdTokenAuth {
  idToken: string | null;
}

const parseJson = (value: string | null): object | null => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const createApi = (baseUrl: string | null) => {
  return {
    endpoint:
      <TArgs, TResponseJson, TAuth extends IdTokenAuth | null = null>(
        endpoint: `/${string}`
      ) =>
      async (
        args: TArgs,
        auth?: TAuth | null
      ): Promise<{
        error: ApiError | null;
        result: TResponseJson | null;
        status: number;
      }> => {
        const fullUrl = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
        const [netErr, response] = await tryit(() =>
          fetch(fullUrl, {
            body: (() => {
              if (!args) return undefined;
              if (args instanceof FormData) return args;
              return JSON.stringify(args);
            })(),
            method: "POST",
            headers: shake({
              "Content-Type":
                args instanceof FormData ? undefined : "application/json",
              Authorization: auth?.idToken
                ? `Bearer ${auth.idToken}`
                : undefined,
            }),
          })
        )();
        const json = parseJson(
          response ? await response.text() : null
        ) as ApiResponse<TResponseJson> | null;
        if (netErr) {
          // If the error contains a json body that
          // also contains a valid error
          if (json) {
            return {
              result: null,
              status: 500,
              error: json.error ?? (json as any),
            };
          }
          return {
            result: null,
            status: 500,
            error: {
              message: "Network Error",
              details: "There was an issue using the network.",
            },
          };
        }

        if (!json) {
          return {
            result: null,
            status: 500,
            error: {
              message: "Network Error",
              details: "There was an issue using the network.",
            },
          };
        }

        if (json.error) {
          return {
            result: null,
            status: 500,
            error: json.error as ApiError,
          };
        }
        return {
          result: json.result,
          status: json.status,
          error: null,
        };
      },
  };
};

const api = createApi(
  process.env.NODE_ENV === "production"
    ? "https://omega-file-vault.vercel.app/api"
    : `/api`
);

export default {
  auth: {
    start: api.endpoint<
      {
        address: string;
      },
      {
        verificationId: t.Id<"verification">;
        nonce: string;
      }
    >("/auth/start"),
    login: api.endpoint<
      {
        verificationId: t.Id<"verification">;
        signature: string;
      },
      {
        user: t.Only<t.User>;
        idToken: string;
      }
    >("/auth/login"),
  },
  files: {
    authorize: api.endpoint<
      {
        hash: string;
        name: string;
      },
      {
        verificationId: t.Id<"verification">;
        nonce: string;
      },
      IdTokenAuth
    >("/files/authorize"),
    list: api.endpoint<{}, { files: t.File[] }, IdTokenAuth>("/files/list"),
    download: api.endpoint<{ fileId: t.Id<"file"> }, {}, IdTokenAuth>(
      "/files/download"
    ),
    upload: api.endpoint<FormData, { file: t.File }, IdTokenAuth>(
      "/files/upload"
    ),
  },
};
