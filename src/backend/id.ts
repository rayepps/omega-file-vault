import crypto from "crypto";
import type { Id, Model } from "./model";

export const id = <TModel extends Model>(
  model: TModel,
  rand?: string
): Id<TModel> => {
  const r = rand ?? crypto.randomBytes(16).toString("hex");
  return `ofv_${model}_${r}`;
};
