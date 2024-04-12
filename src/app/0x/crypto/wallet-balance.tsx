"use client";

import { useAppState } from "@/frontend/state/app";
import Stack from "@/frontend/ui/stack";
import { useEffect, useState } from "react";
import { Web3 } from "web3";

export default function WalletBalance() {
  const app = useAppState();
  const [balance, setBalance] = useState("0");
  const getBalance = async () => {
    if (!window.ethereum) {
      alert("Please download metamask");
      return;
    }
    const web3 = new Web3(window.ethereum);
    const theBalance = await web3.eth.getBalance(app.wallet!);
    console.log(theBalance);
    setBalance(Web3.utils.fromWei(theBalance, "ether"));
  };
  useEffect(() => {
    if (!app.wallet) return;
    getBalance();
  }, [app.wallet]);
  return (
    <Stack className="items-center">
      <p className="inline-block">Your current balance</p>
      <span className="inline-block font-bold text-3xl">{balance}</span>
      <span className="inline-block">ETH</span>
    </Stack>
  );
}
