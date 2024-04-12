import Header from "@/frontend/components/header";
import { PenTool } from "lucide-react";
import WalletBalance from "@/frontend/components/wallet-balance";
import { Link } from "react-router-dom";

export default function WalletBalancePage() {
  return (
    <div>
      <Header>
        <Link to="/0x/crypto/sign">
          <PenTool size={32} />
        </Link>
      </Header>
      <div className="py-28">
        <WalletBalance />
      </div>
    </div>
  );
}
