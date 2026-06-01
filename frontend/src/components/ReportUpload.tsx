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

const safeParseResponse = async (response: Response): Promise<UploadResponse> => {
  const text = await response.text();

  if (!text) {
    return { ok: false, error: "Empty response from server" };
  }

  try {
    return JSON.parse(text) as UploadResponse;
  } catch {
    return {
      ok: false,
      error: text || "Server returned an invalid response"
    };
  }
};

export default function ReportUpload() {
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

      const data = await safeParseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus(
        `Uploaded ${data.file?.originalName || "report"} successfully.`,
      );
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
    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-semibold text-white">
        Upload Medical Report
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        Upload a `.pdf`, `.txt`, or take a photo from camera/gallery for your medical records.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div
          onDragEnter={() => setIsDragging(true)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => documentInputRef.current?.click()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed px-5 py-8 transition ${
            isDragging
              ? "border-teal-400 bg-teal-500/10"
              : "border-slate-700 bg-slate-950 hover:border-teal-400"
          }`}
        >
          <div className="text-center">
            <p className="text-base font-semibold text-white">
              Drag and drop a report here
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Or click to choose a document, take a photo, or pick from your gallery.
            </p>
            <div className="mt-4 inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              {fileBadge}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => documentInputRef.current?.click()}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-teal-400"
          >
            Upload document
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-teal-400"
          >
            Take photo
          </button>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-teal-400"
          >
            Choose from gallery
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

        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
          {file ? `Selected: ${file.name}` : "No file selected yet."}
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
            <div className="border-b border-slate-800 px-4 py-3 text-sm font-medium text-slate-200">
              Photo preview
            </div>
            <img
              src={previewUrl}
              alt="Selected report preview"
              className="max-h-[420px] w-full object-contain bg-black"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-teal-500 px-5 py-3 font-medium text-white transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload report"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      {status && (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200">
          {status}
        </div>
      )}
    </div>
  );
}
