"use client";

import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { downloadAgreementPdf } from "@/lib/contracts/download-agreement-pdf";
import type { AgreementViewModel } from "@/lib/contracts/view-model";
import { cn } from "@/lib/utils";

type AgreementPdfDownloadButtonProps = Pick<ButtonProps, "className" | "size" | "variant"> & {
  fileName: string;
  idleLabel: string;
  loadingLabel: string;
  viewModel: AgreementViewModel;
  wrapperClassName?: string;
};

export function AgreementPdfDownloadButton({
  className,
  fileName,
  idleLabel,
  loadingLabel,
  size,
  variant,
  viewModel,
  wrapperClassName,
}: AgreementPdfDownloadButtonProps) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handlePdfDownload() {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      await downloadAgreementPdf({ fileName, viewModel });
    } catch {
      setDownloadError("Nie udało się wygenerować dokumentu do druku. Spróbuj ponownie.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      <Button
        className={className}
        disabled={isDownloading}
        onClick={handlePdfDownload}
        size={size}
        variant={variant}
      >
        {isDownloading ? loadingLabel : idleLabel}
      </Button>
      {downloadError ? (
        <p className="max-w-64 text-sm text-[color:var(--dashboard-danger)]">{downloadError}</p>
      ) : null}
    </div>
  );
}
