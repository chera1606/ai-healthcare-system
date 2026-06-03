import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type DragEvent } from "react";

type UploadResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  file?: {
    originalName: string;
    storedName: string;
    mimetype: string;
    size: number;
  };
};


interface ReportUploadProps {
  onUploadSuccess?: (message: string) => void;
}

export default function ReportUpload({ onUploadSuccess }: ReportUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setStatus("");
    setError("");
  };

  const handleSelectedFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setStatus("");
    setError("");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0] || null;
    handleSelectedFile(droppedFile);
  };

  const fileBadge = (() => {
    if (!file) {
      return "No file selected";
    }

    if (file.type === "application/pdf") {
      return "PDF";
    }

    if (file.type === "text/plain") {
      return "TXT";
    }

    if (file.type.startsWith("image/")) {
      return "IMAGE";
    }

    return "FILE";
  })();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);

    try {
      setLoading(true);
      setError("");
      setStatus("");

      const response = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      
      if (!text) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(text) as UploadResponse;

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const successMessage = `Uploaded ${data.file?.originalName || "report"} successfully.`;
      setStatus(successMessage);
      if (onUploadSuccess) onUploadSuccess(successMessage);
      
      setFile(null);
      setPreviewUrl("");
      form.reset();
      if (documentInputRef.current) documentInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl shadow-black/30">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Upload Medical Report</h2>
        <p className="mt-2 text-slate-300">
          Upload PDF, TXT, or images to add them to your searchable medical intelligence database
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDragEnter={() => setIsDragging(true)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => documentInputRef.current?.click()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed px-8 py-12 transition-all duration-300 ${
            isDragging
              ? "border-teal-400 bg-teal-500/10 scale-[1.02]"
              : "border-slate-700 bg-slate-950/50 hover:border-teal-400/50 hover:bg-slate-950"
          }`}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <svg className="h-8 w-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-white">
              Drag and drop your medical report here
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Supports PDF, TXT, and images (JPG, PNG)
            </p>
            <div className="mt-4 inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              {fileBadge}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => documentInputRef.current?.click()}
            className="group rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition-all hover:border-teal-400 hover:text-teal-300"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Document
            </span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="group rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition-all hover:border-teal-400 hover:text-teal-300"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Camera
            </span>
          </button>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="group rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition-all hover:border-teal-400 hover:text-teal-300"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Gallery
            </span>
          </button>
        </div>

        <input
          ref={documentInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {file && (
          <div className="rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {file.name}
            </span>
          </div>
        )}

        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
            <div className="border-b border-slate-800 px-4 py-3 text-sm font-medium text-slate-200">
              Photo preview
            </div>
            <img
              src={previewUrl}
              alt="Selected report preview"
              className="max-h-[400px] w-full object-contain bg-black"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-teal-400 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-teal-500/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Report"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
          {error}
        </div>
      )}

      {status && (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-emerald-200">
          {status}
        </div>
      )}
    </div>
  );
}
