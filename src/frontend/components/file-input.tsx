import * as _ from "radash";
import { ChangeEventHandler } from "react";

export default function FileInput({
  onChange,
}: {
  onChange?: (file: File) => void;
}) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const fileList = event.target.files;
    const file = fileList?.[0];
    file && onChange?.(file);
  };

  return (
    <div>
      <form>
        <label
          className="w-full h-20 flex flex-row hover:cursor-pointer items-center justify-center border-[3px] border-dashed border-slate-950 rounded-xl"
          htmlFor="file-upload"
        >
          <span className="text-slate-950">Select File</span>
        </label>
        <input
          onChange={handleChange}
          id="file-upload"
          type="file"
          name="file"
          className="invisible"
        />
      </form>
    </div>
  );
}
