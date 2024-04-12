import api from "@/frontend/api";
import FileInput from "@/frontend/components/file-input";
import useFetch from "@/frontend/hooks/use-fetch";
import { useAppState } from "@/frontend/state/app";
import Stack from "@/frontend/ui/stack";
import { useState } from "react";
import { FileIcon, XIcon } from "lucide-react";
import Split from "@/frontend/ui/split";
import Spinner from "@/frontend/ui/spinner";
import { Web3 } from "web3";
import { hashFile } from "@/lib/hash-file";
import { useNavigate } from "react-router-dom";

export default function UploadForm() {
  const [file, setFile] = useState<File>();
  const uploadRequest = useFetch(api.files.upload);
  const authorizeUploadRequest = useFetch(api.files.authorize);
  const app = useAppState();
  const navigate = useNavigate();

  const signAndUpload = async () => {
    if (!file) return;
    if (!window.ethereum) return;
    if (!app.wallet) return;

    const hash = await hashFile.fromFile(file);
    const authorize = await authorizeUploadRequest.fetch(
      {
        name: file.name,
        hash,
      },
      app
    );
    if (authorize.error) {
      // TODO: Tell user
      console.error(authorize.error);
      return;
    }

    const web3 = new Web3(window.ethereum);
    const signature = await web3.eth.personal.sign(
      `File ${hash}${authorize.result!.nonce}`,
      app.wallet,
      ""
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("verificationId", authorize.result!.verificationId);
    formData.append("signature", signature);

    const upload = await uploadRequest.fetch(formData, app);
    if (upload.error) {
      // TODO: Tell user
      console.error(authorize.error);
      return;
    }

    navigate("/0x/files");
  };

  return (
    <div>
      {!file && <FileInput onChange={setFile} />}
      {file && (
        <div className="space-y-2">
          <button
            className="p-2 space-x-2 flex flex-row hover:bg-slate-100 w-full group items-center"
            onClick={() => setFile(undefined)}
          >
            <FileIcon size={32} className="text-slate-300" />
            <Stack className="grow w-full items-start">
              <span>{file.name}</span>
              <span>{file.size}</span>
            </Stack>
            <XIcon
              size={24}
              className="text-slate-50 group-hover:text-slate-950"
            />
          </button>
          <button
            className="rounded p-2 bg-slate-950 text-slate-50 w-full flex flex-row items-center justify-center"
            onClick={signAndUpload}
          >
            {authorizeUploadRequest.loading || uploadRequest.loading ? (
              <Spinner />
            ) : (
              "Sign & Upload"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
