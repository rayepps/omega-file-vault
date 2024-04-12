import FileInput from "@/frontend/components/file-input";
import Stack from "@/frontend/ui/stack";
import { useState } from "react";
import UploadForm from "@/frontend/components/upload-form";
import Header from "@/frontend/components/header";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function UploadFilePage() {
  return (
    <div className="space-y-12">
      <Header>
        <Link to="/0x/files">
          <ArrowLeft size={32} />
        </Link>
      </Header>
      <Stack className="space-y-6">
        <Stack className="items-center">
          <h2 className="text-4xl font-bold">Upload</h2>
          <p className="text-center">
            Select a file from your machine or drag one to the zone below
          </p>
        </Stack>
        <div>
          <UploadForm />
        </div>
      </Stack>
    </div>
  );
}
