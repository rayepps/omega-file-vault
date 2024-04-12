"use client";

import { useAppState } from "@/frontend/state/app";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export const WalletConnectedGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const appState = useAppState();
  
  if (!appState.user) {
    if (appState.hydrated) {
      router.push("/");
    }
    return null;
  }
  return <>{children}</>;
};
