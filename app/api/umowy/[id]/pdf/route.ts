export const runtime = "nodejs";

import { auth } from "@clerk/nextjs/server";
import puppeteer from "puppeteer-core";
import { ConvexHttpClient } from "convex/browser";
import { existsSync } from "node:fs";

import { buildAgreementPdfHtmlDocument } from "@/components/contracts/agreement-pdf-html-document";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { mapContractToViewModel } from "@/lib/contracts/view-model";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const authState = await auth();

  if (!authState.userId) {
    return new Response("Brak autoryzacji", { status: 401 });
  }

  const token = await authState.getToken({ template: "convex" });
  if (!token) {
    return new Response("Brak tokenu Convex", { status: 401 });
  }

  convex.setAuth(token);

  const contract = await convex.query(api.contracts.getById, {
    contractId: id as Id<"contracts">,
  });

  const viewModel = mapContractToViewModel(contract as Doc<"contracts">);
  const generatedAtDisplay = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const html = buildAgreementPdfHtmlDocument(viewModel, {
    generatedAtDisplay,
    documentLabel: "Umowa kupna-sprzedaży pojazdu",
    pageIndicator: "Strona 1 / 1",
    documentBadge: "Oryginał",
  });
  const pdf = await renderHtmlToPdf(html);

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${id}.pdf"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

async function renderHtmlToPdf(html: string) {
  const browser = await puppeteer.launch({
    executablePath: resolveBrowserExecutablePath(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      scale: 0.96,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}

function resolveBrowserExecutablePath() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];

  const browserPath = candidates.find((candidate) => existsSync(candidate));

  if (!browserPath) {
    throw new Error("Nie znaleziono lokalnej przeglądarki Chrome lub Edge do renderowania PDF.");
  }

  return browserPath;
}
