"use client";

import { Id } from "@/backend/model";
import api from "@/frontend/api";
import useFetch from "@/frontend/hooks/use-fetch";
import { useAppState } from "@/frontend/state/app";
import Split from "@/frontend/ui/split";
import Stack from "@/frontend/ui/stack";
import { DownloadIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function FileList() {
  const listFilesRequest = useFetch(api.files.list);
  const app = useAppState();

  useEffect(() => {
    listFilesRequest.fetch({}, app);
  }, []);

  const download = (fileId: Id<"file">) => {};

  return (
    <div>
      {listFilesRequest.loading && <span>loading...</span>}
      {!listFilesRequest.loading &&
        listFilesRequest.result?.files.map((file) => (
          <Split className="p-2 space-x-2 w-full items-center">
            <FileIcon size={32} className="text-slate-300" />
            <Stack className="grow w-full items-start">
              <span>
                {file.name} ({file.status})
              </span>
              <span>{file.ipfsHash}</span>
            </Stack>
            <Link
              className="p-1.5 group hover:bg-slate-950 rounded"
              target="_blank"
              href={`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`}
            >
              <DownloadIcon
                size={24}
                className="text-slate-950 group-hover:text-slate-50"
              />
            </Link>
          </Split>
        ))}
    </div>
  );
}
