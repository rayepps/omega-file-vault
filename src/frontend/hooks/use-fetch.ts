import { useState } from "react";

export type FetchFunc<TArgs, TAuth, TResult> = (
  args: TArgs,
  auth: TAuth
) => Promise<{
  status: number;
  result: TResult;
  error: null | {
    message: string;
  };
}>;

export interface FetchState<TArgs, TAuth, TResult> {
  loading: boolean;
  result: null | TResult;
  error: null | { message: string };
  started: boolean;
  complete: boolean;
  pending: boolean;
  success: boolean;
  startedAt: number | null;
  finishedAt: number | null;
  duration: number | null;
  fetch: FetchFunc<TArgs, TAuth, TResult>;
}

export const useFetch = <TArgs, TAuth, TResult>(
  fetchFunc: FetchFunc<TArgs, TAuth, TResult>
): FetchState<TArgs, TAuth, TResult> => {
  const [state, setState] = useState<FetchState<TArgs, TAuth, TResult>>({
    loading: false,
    result: null,
    error: null,
    success: false,
    started: false,
    complete: false,
    pending: false,
    fetch: (() => new Promise((r) => r({}))) as any,
    startedAt: null,
    finishedAt: null,
    duration: null,
  });

  const fetch = async (
    args: TArgs,
    auth: TAuth
  ): Promise<{
    result: TResult;
    error: null | { message: string };
    status: number;
  }> => {
    const startedAt = Date.now();
    setState({
      ...state,
      loading: true,
      started: true,
      startedAt,
      duration: null,
    });
    const { error, result, status } = await fetchFunc(args, auth);
    const finishedAt = Date.now();
    const duration = finishedAt - startedAt;
    if (error) {
      setState({
        ...state,
        error,
        loading: false,
        complete: true,
        started: true,
        finishedAt,
        duration,
      });
    } else {
      setState({
        ...state,
        error: null,
        result,
        success: true,
        loading: false,
        complete: true,
        started: true,
        finishedAt,
        duration,
      });
    }
    return { error, result, status };
  };

  return {
    ...state,
    fetch,
  };
};

export default useFetch;
