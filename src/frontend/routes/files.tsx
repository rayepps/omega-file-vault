import Header from "@/frontend/components/header";
import { UploadIcon, DownloadIcon } from "lucide-react";
import { Link } from "react-router-dom";
import FileList from "@/frontend/components/file-list";

export default function FilesListPage() {
  return (
    <div>
      <Header>
        <Link to="/0x/files/upload">
          <UploadIcon size={32} />
        </Link>
        <Link to="/0x/files/download">
          <DownloadIcon size={32} />
        </Link>
      </Header>
      <div className="py-28 min-h-[400px] max-h-[600px] overflow-y-scroll">
        <FileList />
      </div>
    </div>
  );
}
