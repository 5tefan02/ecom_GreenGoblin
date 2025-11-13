"use client";

import { useState } from "react";
import Image from "next/image";

import { UploadButton } from "@/lib/uploadthing";

type ImageUploaderFieldProps = {
  defaultUrl?: string | null;
  defaultKey?: string | null;
};

export function ImageUploaderField({
  defaultUrl = "",
  defaultKey = "",
}: ImageUploaderFieldProps) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [key, setKey] = useState(defaultKey ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasImage = Boolean(url);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/70 p-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900/70">
          Imagine produs
        </span>
        <p className="text-xs text-emerald-900/60">
          Încarcă imaginea prin UploadThing. După încărcare vei vedea previzualizarea,
          iar datele necesare sunt stocate automat, fără a le afișa în formular.
        </p>
      </div>

      <UploadButton
        endpoint="productImage"
        appearance={{
          container: "w-full",
          button:
            "w-full rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60",
        }}
        onUploadProgress={() => {
          setIsUploading(true);
          setError(null);
        }}
        onUploadError={(err) => {
          setIsUploading(false);
          setError(err.message ?? "Încărcarea a eșuat.");
        }}
        onClientUploadComplete={(files) => {
          setIsUploading(false);
          setError(null);
          const file = files?.[0];
          if (file) {
            setUrl(file.url);
            setKey(file.key);
          }
        }}
      />

      <input type="hidden" name="imageUrl" value={url} />
      <input type="hidden" name="imageKey" value={key ?? ""} />

      {isUploading ? (
        <span className="text-xs text-emerald-800">Încărcăm imaginea...</span>
      ) : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}

      {hasImage ? (
        <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-emerald-200 bg-white">
            <Image
              src={url}
              alt="Previzualizare imagine"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <span className="text-xs font-semibold text-emerald-900">Previzualizare activă</span>
            <span className="truncate text-xs text-emerald-900/70">
              Imagine încărcată prin UploadThing
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setKey("");
            }}
            className="self-center rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Elimină
          </button>
        </div>
      ) : (
        <span className="text-xs font-medium text-emerald-800">
          Adaugă o imagine pentru a continua salvarea produsului.
        </span>
      )}
    </div>
  );
}


