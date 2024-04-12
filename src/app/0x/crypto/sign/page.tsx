import Header from "@/frontend/components/header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Header>
        <Link href="/0x/crypto">
          <ArrowLeft size={32} />
        </Link>
      </Header>
    </div>
  );
}
