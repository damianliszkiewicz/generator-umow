export const runtime = "nodejs";

import { auth } from "@clerk/nextjs/server";
import { renderToStream } from "@react-pdf/renderer";
import { ConvexHttpClient } from "convex/browser";
import type { Readable } from "node:stream";

import { AgreementPdfDocument } from "@/components/contracts/agreement-pdf-document";
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
  const stream = await renderToStream(AgreementPdfDocument({ viewModel }));
  const buffer = await streamToBuffer(stream as Readable);

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="umowa-${id}.pdf"`,
    },
  });
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      resolve(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))));
    });

    stream.on("error", reject);
  });
}
