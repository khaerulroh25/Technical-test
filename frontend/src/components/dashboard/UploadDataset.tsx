import { CloudUpload, LoaderCircle, CheckCircle2 } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  getDatasetStatus,
  uploadDataset,
  type DatasetStatus,
} from "../../services/datasetService";

interface UploadDatasetProps {
  onUploadCompleted: (datasetId: number) => void;
}
function UploadDataset({ onUploadCompleted }: UploadDatasetProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<DatasetStatus | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProcessing = status === "pending" || status === "processing";
  const handleFile = (file: File) => {
    const allowedExtensions = ["csv", "xlsx", "xls"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      alert("File harus berformat CSV atau Excel.");
      return;
    }

    setSelectedFile(file);
    setStatus(null);
    setTotalRows(0);
    setError(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (isProcessing) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleBrowseFile = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const pollDatasetStatus = (datasetId: number) => {
    const intervalId = window.setInterval(async () => {
      try {
        const dataset = await getDatasetStatus(datasetId);

        setStatus(dataset.status);
        setTotalRows(dataset.total_rows);

        if (dataset.status === "completed") {
          window.clearInterval(intervalId);

          onUploadCompleted(datasetId);
        }

        if (dataset.status === "failed") {
          window.clearInterval(intervalId);

          setError(dataset.error_message ?? "Dataset gagal diproses.");
        }
      } catch (error) {
        window.clearInterval(intervalId);

        setStatus(null);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengecek status dataset.",
        );
      }
    }, 2000);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      handleBrowseFile();
      return;
    }

    try {
      setError(null);
      setStatus("pending");

      const dataset = await uploadDataset(selectedFile);

      setStatus(dataset.status);

      pollDatasetStatus(dataset.id);
    } catch (error) {
      setStatus(null);

      setError(
        error instanceof Error ? error.message : "Dataset gagal diupload.",
      );
    }
  };

  const handleNewFile = () => {
    setSelectedFile(null);
    setStatus(null);
    setTotalRows(0);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    fileInputRef.current?.click();
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
        Upload Dataset
      </h2>

      <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseFile}
          className={`flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
            isProcessing
              ? "cursor-not-allowed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              : isDragging
                ? "cursor-pointer border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                : "cursor-pointer border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 dark:border-orange-500/40 dark:hover:border-orange-500 dark:hover:bg-orange-500/10"
          }`}
        >
          {isProcessing ? (
            <LoaderCircle
              size={48}
              strokeWidth={1.7}
              className="mb-3 animate-spin text-orange-500"
            />
          ) : status === "completed" ? (
            <CheckCircle2
              size={48}
              strokeWidth={1.7}
              className="mb-3 text-green-500"
            />
          ) : (
            <CloudUpload
              size={48}
              strokeWidth={1.7}
              className="mb-3 text-orange-500"
            />
          )}

          {selectedFile ? (
            <>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>

              {isProcessing && (
                <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                  Dataset sedang diproses...
                </p>
              )}

              {status === "completed" && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {totalRows.toLocaleString()} rows berhasil diimport.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-medium text-gray-900 dark:text-white">
                Drag & Drop CSV / Excel
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                atau klik untuk memilih file
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-center md:w-44">
          <button
            type="button"
            onClick={status === "completed" ? handleNewFile : handleUpload}
            disabled={isProcessing}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {isProcessing
              ? "Processing..."
              : status === "completed"
                ? "Upload New File"
                : selectedFile
                  ? "Upload"
                  : "Pilih File"}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        disabled={isProcessing}
        className="hidden"
      />
    </section>
  );
}

export default UploadDataset;
