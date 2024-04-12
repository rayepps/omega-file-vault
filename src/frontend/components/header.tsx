"use client";

import Split from "@/frontend/ui/split";
import { useAppState } from "../state/app";

export default function Header({ children }: { children: React.ReactNode }) {
  const app = useAppState();
  const previewAddress = (() => {
    if (!app.wallet) return "";
    const first4 = app.wallet.slice(0, 6);
    const last4 = app.wallet.slice(app.wallet.length - 6, app.wallet.length);
    return `${first4}...${last4}`;
  })();
  return (
    <Split className="items-center space-x-2 w-full">
      <Split className="w-full space-x-2">{children}</Split>
      <div>{previewAddress}</div>
      <div>
        {/* TODO: Implement user avatar */}
        <div className="w-12 h-12 bg-slate-950 rounded-full" />
      </div>
    </Split>
  );
}
