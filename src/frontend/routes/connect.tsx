import ConnectButton from "@/frontend/components/connect-button";
import Stack from "@/frontend/ui/stack";

export default function ConnectPage() {
  return (
    <div>
      <Stack className="items-center">
        <p>Start by connecting your wallet</p>
        <ConnectButton>Connect Now</ConnectButton>
      </Stack>
    </div>
  );
}
