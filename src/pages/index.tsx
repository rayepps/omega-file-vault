import { Gabarito } from "next/font/google";
import Split from "@/frontend/ui/split";
import Stack from "@/frontend/ui/stack";
import Logo from "@/frontend/svg/logo";
import { Link } from "react-router-dom";
import HydrateAppState from "@/frontend/state/hydrate";
import ConnectButton from "@/frontend/components/connect-button";
import { HashRouter, Route, Routes } from "react-router-dom";
import ConnectPage from "@/frontend/routes/connect";
import { WalletConnectedGuard } from "@/frontend/guards/wallet-connected";
import FilesListPage from "@/frontend/routes/files";
import UploadFilePage from "@/frontend/routes/upload-file";
import DownloadFilePage from "@/frontend/routes/download-file";
import SignPage from "@/frontend/routes/sign";
import WalletBalancePage from "@/frontend/routes/wallet-balance";

const gabarito = Gabarito({ subsets: ["latin"] });

export default function Page() {
  return (
    <HashRouter>
      <div
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${gabarito.className}`}
      >
        <HydrateAppState />
        <Split className="items-center justify-center p-12">
          <Split className="w-full max-w-screen-lg p-6 rounded bg-slate-50">
            <Stack className="bg-slate-950 p-6 rounded w-full grow justify-between">
              <Split className="items-center justify-between space-x-4">
                <Logo className="fill-slate-50" />
                <Link to="/0x/crypto" className="text-slate-50">
                  Crypto
                </Link>
                <Link to="/0x/files" className="text-slate-50">
                  Files
                </Link>
              </Split>
              <div>
                <div>
                  <span className="text-slate-50 font-light">
                    Omega File Vault
                  </span>
                </div>
                <div>
                  <p className="text-slate-50 text-2xl">
                    The ultimate web3 wallet <br /> command center
                  </p>
                </div>
              </div>
            </Stack>
            <div className="p-6 w-full grow">
              <Routes>
                <Route path="/0x">
                  <Route
                    index
                    element={
                      <WalletConnectedGuard>
                        <WalletBalancePage />
                      </WalletConnectedGuard>
                    }
                  />
                  <Route path="files">
                    <Route
                      index
                      element={
                        <WalletConnectedGuard>
                          <FilesListPage />
                        </WalletConnectedGuard>
                      }
                    />
                    <Route
                      path="upload"
                      element={
                        <WalletConnectedGuard>
                          <UploadFilePage />
                        </WalletConnectedGuard>
                      }
                    />
                    <Route
                      path="download"
                      element={
                        <WalletConnectedGuard>
                          <DownloadFilePage />
                        </WalletConnectedGuard>
                      }
                    />
                  </Route>
                  <Route path="crypto">
                    <Route
                      index
                      element={
                        <WalletConnectedGuard>
                          <WalletBalancePage />
                        </WalletConnectedGuard>
                      }
                    />
                    <Route
                      path="sign"
                      element={
                        <WalletConnectedGuard>
                          <SignPage />
                        </WalletConnectedGuard>
                      }
                    />
                  </Route>
                </Route>
                <Route path="/" element={<ConnectPage />} />
              </Routes>
            </div>
          </Split>
        </Split>
      </div>
    </HashRouter>
  );
}
