import dur, { Duration } from "durhuman";

type StoredItem<T> = {
  value: T;
  expiration: number | null;
};

export interface LocalStorageItem<T = any> {
  get: () => T;
  set: (value: T) => void;
  clear: () => void;
}

const isExpired = (expiration: number | null) => {
  if (!expiration) return false;
  return expiration < Date.now();
};

export const item = <T>(
  key: string,
  defaultValue: T,
  exp: Duration | "never" = "never"
): LocalStorageItem<T> => {
  const k = `ofv_${key}`;
  const clear = () => {
    localStorage.removeItem(k);
  };
  const get = () => {
    const raw = localStorage.getItem(k);
    if (!raw) return defaultValue;
    const { expiration, value } = JSON.parse(raw) as StoredItem<T>;
    if (isExpired(expiration)) {
      clear();
      return defaultValue;
    }
    return value;
  };
  const set = (value: T) => {
    const record: StoredItem<T> = {
      expiration:
        exp === "never" ? null : Date.now() + dur(exp, "milliseconds"),
      value,
    };
    localStorage.setItem(k, JSON.stringify(record));
  };
  return {
    get,
    set,
    clear,
  };
};

export default {
  item,
};
