import Header from "@/frontend/components/header";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignPage() {
  return (
    <div>
      <Header>
        <Link to="/0x/crypto">
          <ArrowLeft size={32} />
        </Link>
      </Header>
    </div>
  );
}
