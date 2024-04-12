import { Web3 } from "web3";
import { useAppState } from "@/frontend/state/app";
import useFetch from "@/frontend/hooks/use-fetch";
import api from "@/frontend/api";
import { isString } from "radash";
import { useNavigate } from "react-router-dom";

export default function ConnectButton({ children }: { children: string }) {
  const app = useAppState();
  const startAuthRequest = useFetch(api.auth.start);
  const loginRequest = useFetch(api.auth.login);
  const navigate = useNavigate();

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please download metamask");
      return;
    }

    // Connect wallet
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();

    // Start auth flow - get nonce
    const start = await startAuthRequest.fetch(
      {
        address: accounts[0],
      },
      null
    );
    if (start.error) {
      // TODO: Display error to user
      console.error(start.error);
      return;
    }

    const signature = await web3.eth.personal.sign(
      `Authenticate ${start.result!.nonce}`,
      accounts[0],
      ""
    );

    const login = await loginRequest.fetch(
      {
        verificationId: start.result!.verificationId,
        signature: signature,
      },
      null
    );
    if (login.error) {
      // TODO: Display error to user
      console.error(login.error);
      return;
    }

    app.login(login.result!.user, login.result!.idToken, accounts);

    navigate("/0x/crypto");
  };

  return (
    <button
      onClick={connect}
      className="rounded bg-slate-950 text-slate-50 w-full p-3"
    >
      {children}
    </button>
  );
}
