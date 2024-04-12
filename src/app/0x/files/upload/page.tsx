import FileInput from "@/frontend/components/file-input";
import Stack from "@/frontend/ui/stack";
import { useState } from "react";
import UploadForm from "./upload-form";

export default function Page() {
  // const [state, setState] = useState();
  return (
    <Stack className="space-y-6">
      <Stack className="items-center">
        <h2 className="text-4xl font-bold">Upload</h2>
        <p className="text-center">Select a file from your machine or drag one to the zone below</p>
      </Stack>
      <div>
        <UploadForm />
      </div>
    </Stack>
  );
}
