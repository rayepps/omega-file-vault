import { WalletConnectedGuard } from "@/frontend/guards/wallet-connected";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WalletConnectedGuard>{children}</WalletConnectedGuard>;
}
