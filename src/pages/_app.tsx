import "@/frontend/globals.css";
import Logo from "@/frontend/svg/logo";
import Split from "@/frontend/ui/split";
import NoSSR from "react-no-ssr";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSR>
      {typeof window === "undefined" ? (
        <LoadingScreen />
      ) : (
        <Component {...pageProps} />
      )}
    </NoSSR>
  );
}

const LoadingScreen = () => {
  return (
    <Split className="h-screen w-screen items-center justify-center bg-slate-50">
      <Logo height={100} className="fill-slate-950" />
    </Split>
  );
};
