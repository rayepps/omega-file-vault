import Header from "@/frontend/components/header";
import { PenTool } from "lucide-react";
import Link from "next/link";
import WalletBalance from "./wallet-balance";

export default function Page() {
  return (
    <div>
      <Header>
        <Link href="/0x/crypto/sign">
          <PenTool size={32} />
        </Link>
      </Header>
      <div className="py-28">
        <WalletBalance />
      </div>
    </div>
  );
}
