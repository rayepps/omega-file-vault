import "@/frontend/globals.css";
import NoSSR from "react-no-ssr";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSR>
      <Component {...pageProps} />
    </NoSSR>
  );
}
