import { CloudUpload } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

function UploadDataset() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const allowedExtensions = ["csv", "xlsx", "xls"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      alert("File harus berformat CSV atau Excel.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        Upload Dataset
      </h2>

      <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseFile}
          className={`flex min-h-40 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
            isDragging
              ? "border-orange-500 bg-orange-50"
              : "border-orange-200 hover:border-orange-400 hover:bg-orange-50/50"
          }`}
        >
          <CloudUpload
            size={48}
            strokeWidth={1.7}
            className="mb-3 text-orange-500"
          />

          {selectedFile ? (
            <>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>

              <p className="mt-1 text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-900">
                Drag & Drop CSV / Excel
              </p>

              <p className="mt-1 text-sm text-gray-500">
                atau klik Upload untuk memilih file
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-center md:w-44">
          <button
            type="button"
            onClick={handleBrowseFile}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
          >
            Upload
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
    </section>
  );
}

export default UploadDataset;
