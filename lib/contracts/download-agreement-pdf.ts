import { createElement, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

import type { AgreementViewModel } from "@/lib/contracts/view-model";

type DownloadAgreementPdfOptions = {
  fileName: string;
  viewModel: AgreementViewModel;
};

export async function downloadAgreementPdf({
  fileName,
  viewModel,
}: DownloadAgreementPdfOptions) {
  const [{ pdf }, { AgreementPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/contracts/agreement-pdf-document"),
  ]);

  const pdfDocument = createElement(AgreementPdfDocument, { viewModel }) as ReactElement<DocumentProps>;
  const blob = await pdf(pdfDocument).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
