import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import Split from "@/frontend/ui/split";
import Stack from "@/frontend/ui/stack";
import Logo from "@/frontend/svg/logo";
import Link from "next/link";
import { useAppState } from "@/frontend/state/app";
import { useEffect } from "react";
import HydrateAppState from "@/frontend/state/hydrate";
import { WalletConnectedGuard } from "@/frontend/guards/wallet-connected";

const gabarito = Gabarito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OFV | Omega File Vault",
  description: "Your ultimate web3 wallet command center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gabarito.className} bg-purple-100`}>
        <HydrateAppState />

        <Split className="items-center justify-center p-12">
          <Split className="w-full max-w-screen-lg p-6 rounded bg-slate-50">
            <Stack className="bg-slate-950 p-6 rounded w-full justify-between">
              <Split>
                <Logo className="fill-slate-50" />
                <Link href="/0x/crypto" className="text-slate-50">
                  Crypto
                </Link>
                <Link href="/0x/files" className="text-slate-50">
                  Files
                </Link>
              </Split>
              <div>
                <div>
                  <span className="text-slate-50 font-light">
                    Omega File Vault
                  </span>
                </div>
                <div>
                  <p className="text-slate-50 text-2xl">
                    The ultimate web3 wallet <br /> command center
                  </p>
                </div>
              </div>
            </Stack>
            <div className="p-6 w-full">{children}</div>
          </Split>
        </Split>
      </body>
    </html>
  );
}
