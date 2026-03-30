import type { AgreementViewModel } from "@/lib/contracts/view-model";

type StyleObject = Record<string, number | string | undefined>;

export type AgreementPdfFooterMetadata = {
  generatedAtDisplay: string;
  documentLabel: string;
  pageIndicator: string;
  documentBadge?: string;
};

const pageStyle: StyleObject = {
  width: "210mm",
  height: "297mm",
  margin: "0 auto",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
  color: "#18181b",
  padding: "10mm 10mm 8mm",
  fontFamily: '"Helvetica Neue", Helvetica, Arial, "Segoe UI", sans-serif',
  fontSize: "8.7pt",
  lineHeight: 1.24,
};

const headerStyle: StyleObject = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "3mm",
  marginBottom: "2.5mm",
  paddingBottom: "2mm",
  borderBottom: "1px solid #18181b",
};

const metaLabelStyle: StyleObject = {
  margin: 0,
  fontSize: "7.2pt",
  fontWeight: 700,
  color: "#71717a",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const sectionStyle: StyleObject = {
  marginTop: "2.1mm",
};

const detailCardStyle: StyleObject = {
  border: "1px solid #d4d4d8",
  padding: "1.9mm",
  breakInside: "avoid",
};

const partyCardStyle: StyleObject = {
  border: "1px solid #d4d4d8",
  backgroundColor: "#ffffff",
  padding: "1.9mm",
  breakInside: "avoid",
};

const detailLabelStyle: StyleObject = {
  margin: 0,
  fontSize: "7.1pt",
  fontWeight: 700,
  color: "#52525b",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const detailValueStyle: StyleObject = {
  margin: "2px 0 0",
  fontSize: "8.5pt",
  fontWeight: 700,
};

export function buildAgreementPdfHtmlDocument(
  viewModel: AgreementViewModel,
  footerMetadata: AgreementPdfFooterMetadata,
) {
  const saleDetailItems = viewModel.saleDetails.filter(
    (item) => item.label !== "Cena sprzedaży" && item.label !== "Słownie",
  );
  const supplementarySectionStart = 5;

  return [
    '<!DOCTYPE html>',
    '<html lang="pl">',
    '<body>',
    `<style>${documentStyles}</style>`,
    `<main style="${styleToString(pageStyle)}">`,
    `<div style="${styleToString({ display: "flex", flexDirection: "column", height: "100%" })}">`,
    '<div>',
    `<section style="${styleToString(headerStyle)}">`,
    `<div style="${styleToString({ flex: 1, minWidth: 0 })}">`,
    `<p style="${styleToString({ ...metaLabelStyle, marginBottom: "2px", color: "#a1a1aa", letterSpacing: "0.16em" })}">Dokument prywatny</p>`,
    `<h1 style="${styleToString({ margin: 0, fontSize: "12.2pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.05, color: "#18181b" })}">Umowa kupna-sprzedaży pojazdu</h1>`,
    '</div>',
    `<div style="${styleToString({ width: "42mm", textAlign: "right", minWidth: 0 })}">`,
    `<p style="${styleToString({ margin: 0, fontSize: "8.4pt", fontWeight: 700, color: "#18181b" })}">${escapeHtml(viewModel.documentLocationAndDateLine)}</p>`,
    `<p style="${styleToString({ ...metaLabelStyle, marginTop: "3px", color: "#71717a", letterSpacing: "0.08em" })}">${escapeHtml(footerMetadata.documentBadge ?? viewModel.title)}</p>`,
    '</div>',
    '</section>',
    `<section style="${styleToString(sectionStyle)}">`,
    sectionHeaderHtml("§ 1", "Strony umowy"),
    `<div style="${styleToString({ display: "flex", gap: "3mm" })}">`,
    partyColumnHtml("Sprzedający", viewModel.sellerDetails),
    partyColumnHtml("Kupujący", viewModel.buyerDetails),
    '</div>',
    '</section>',
    `<section style="${styleToString(sectionStyle)}">`,
    sectionHeaderHtml("§ 2", "Przedmiot umowy"),
    `<div style="${styleToString({
      ...detailCardStyle,
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
      gap: "1.2mm 2mm",
    })}">`,
    viewModel.vehicleDetails.map((item) => detailItemHtml(item.label, item.value, item.mono)).join(""),
    '</div>',
    '</section>',
    `<section style="${styleToString(sectionStyle)}">`,
    sectionHeaderHtml("§ 3", "Cena i warunki płatności"),
    `<div style="${styleToString({ border: "1px solid #18181b", padding: "2.2mm", display: "flex", gap: "3mm", alignItems: "flex-start" })}">`,
    `<div style="${styleToString({ width: "38%", minWidth: 0 })}">`,
    `<p style="${styleToString(detailLabelStyle)}">Cena sprzedaży</p>`,
    `<p style="${styleToString({ margin: "2px 0 0", fontSize: "14.4pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02, color: "#18181b" })}">${escapeHtml(viewModel.priceDisplay)}</p>`,
    '</div>',
    `<div style="${styleToString({ flex: 1, minWidth: 0 })}">`,
    `<p style="${styleToString({ margin: 0, fontSize: "7.9pt", color: "#52525b", fontStyle: "italic", lineHeight: 1.18 })}">${escapeHtml(viewModel.priceWords)}</p>`,
    `<div style="${styleToString({ marginTop: "1.2mm", display: "grid", gap: "1mm" })}">`,
    saleDetailItems.map((item) => saleDetailRowHtml(item.label, item.value)).join(""),
    '</div>',
    '</div>',
    '</div>',
    '</section>',
    `<section style="${styleToString(sectionStyle)}">`,
    sectionHeaderHtml("§ 4", "Oświadczenia stron"),
    `<ol style="${styleToString({ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "1mm" })}">`,
    viewModel.declarations
      .map(
        (item, index) =>
          declarationItemHtml(item.label, item.value, index),
      )
      .join(""),
    '</ol>',
    '</section>',
    '</div>',
    viewModel.supplementarySections
      .map(
        (section, index) =>
              `<section style="${styleToString({ ...sectionStyle, display: "flex", flexDirection: "column", flex: section.title === "Postanowienia końcowe" ? undefined : 1, minHeight: 0 })}">${sectionHeaderHtml(`§ ${supplementarySectionStart + index}`, section.title)}<div style="${styleToString({ border: "1px solid #d4d4d8", flex: 1, minHeight: section.title === "Postanowienia końcowe" ? undefined : "14mm", padding: "1.8mm" })}"><p style="${styleToString({ margin: 0, fontSize: "8.3pt", lineHeight: 1.28, color: "#27272a" })}">${escapeHtml(section.content)}</p></div></section>`,
      )
      .join(""),
            `<div style="${styleToString({ marginTop: "3mm" })}">`,
            `<section style="${styleToString({ display: "flex", justifyContent: "space-between", gap: "7mm", breakInside: "avoid", minHeight: "21mm", alignItems: "flex-end" })}">`,
    signatureBoxHtml("Czytelny podpis sprzedającego"),
    signatureBoxHtml("Czytelny podpis kupującego"),
    '</section>',
    footerMetadataHtml(footerMetadata),
    '</div>',
    '</div>',
    '</main>',
    '</body>',
    '</html>',
  ].join("");
}

const documentStyles = `
  @page {
    size: A4;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-family: Arial, Helvetica, "Segoe UI", sans-serif !important;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body, body * {
    font-family: Arial, Helvetica, "Segoe UI", sans-serif !important;
  }

  code, pre, .pdf-mono {
    font-family: Menlo, Monaco, "Courier New", monospace !important;
  }
`;

function partyColumnHtml(heading: string, party: AgreementViewModel["sellerDetails"]) {
  return [
    `<div style="${styleToString({ ...partyCardStyle, width: "50%", minHeight: "20mm" })}">`,
    `<p style="${styleToString(detailLabelStyle)}">${escapeHtml(heading)}</p>`,
    `<p style="${styleToString({ margin: "2px 0 1px", fontSize: "8.9pt", fontWeight: 800, lineHeight: 1.16, color: "#18181b" })}">${escapeHtml(party.fullName)}</p>`,
    party.details
      .map(
        (item) => `<p style="${styleToString({ margin: "0", fontSize: "7.8pt", color: "#52525b", lineHeight: 1.18 })}">${escapeHtml(item)}</p>`,
      )
      .join(""),
    `<p style="${styleToString({ margin: "1px 0 0", fontSize: "7.8pt", color: "#52525b", lineHeight: 1.18 })}">${escapeHtml(party.addressLine)}</p>`,
    '</div>',
  ].join("");
}

function detailItemHtml(label: string, value: string, mono?: boolean) {
  return `<div style="${styleToString({ ...vehicleItemStyle(label), borderTop: "1px solid #f4f4f5", paddingTop: "1.2mm" })}"><p style="${styleToString({ ...detailLabelStyle, fontSize: "6.9pt", color: "#a1a1aa" })}">${escapeHtml(label)}</p><p class="${mono ? "pdf-mono" : ""}" style="${styleToString({ ...detailValueStyle, marginTop: "1px", fontSize: mono ? "8.2pt" : "8.3pt", fontWeight: 800, fontFamily: mono ? 'Menlo, Monaco, "Courier New", monospace' : undefined, letterSpacing: mono ? "-0.02em" : undefined })}">${escapeHtml(value)}</p></div>`;
}

function signatureBoxHtml(label: string) {
  return `<div style="${styleToString({ width: "46%", height: "18mm", display: "flex", alignItems: "flex-end" })}"><div style="${styleToString({ width: "100%", paddingTop: "2.2mm", borderTop: "1px solid #111827", textAlign: "center" })}"><p style="${styleToString({ ...metaLabelStyle, margin: 0, fontSize: "6.6pt", letterSpacing: "0.08em", color: "#18181b" })}">${escapeHtml(label)}</p></div></div>`;
}

function sectionHeaderHtml(index: string, title: string) {
  return `<div style="${styleToString({ display: "flex", alignItems: "center", gap: "1.6mm", marginBottom: "1.2mm", pageBreakAfter: "avoid" })}"><span style="${styleToString({ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "9.5mm", padding: "2px 5px", border: "1px solid #18181b", color: "#18181b", fontSize: "6.4pt", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" })}">${escapeHtml(index)}</span><h2 style="${styleToString({ margin: 0, fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#71717a" })}">${escapeHtml(title)}</h2></div>`;
}

function footerMetadataHtml(footerMetadata: AgreementPdfFooterMetadata) {
  return [
    `<footer style="${styleToString({ marginTop: "3mm", paddingTop: "1.8mm", borderTop: "1px solid #e4e4e7", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2mm", alignItems: "center" })}">`,
    footerCellHtml(`Wygenerowano: ${footerMetadata.generatedAtDisplay}`, "left"),
    footerCellHtml(footerMetadata.documentLabel, "center"),
    footerCellHtml(footerMetadata.pageIndicator, "right"),
    "</footer>",
  ].join("");
}

function footerCellHtml(value: string, align: "left" | "center" | "right") {
  return `<p style="${styleToString({ margin: 0, fontSize: "6.6pt", color: "#71717a", fontWeight: 600, textAlign: align, letterSpacing: align === "center" ? "0.06em" : undefined, textTransform: align === "center" ? "uppercase" : undefined })}">${escapeHtml(value)}</p>`;
}

function vehicleItemStyle(label: string): StyleObject {
  if (label === "Marka i model" || label === "Numer VIN") {
    return {
      gridColumn: "span 2",
    };
  }

  return {};
}

function saleDetailRowHtml(label: string, value: string) {
  return `<div style="${styleToString({ display: "flex", justifyContent: "space-between", gap: "2mm", borderTop: "1px solid #f4f4f5", paddingTop: "1mm" })}"><span style="${styleToString({ fontSize: "6.9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a1a1aa" })}">${escapeHtml(label)}</span><span style="${styleToString({ fontSize: "7.8pt", fontWeight: 700, color: "#18181b", textAlign: "right" })}">${escapeHtml(value)}</span></div>`;
}

function declarationItemHtml(label: string, value: string, index: number) {
  return `<li style="${styleToString({ display: "flex", gap: "6px", breakInside: "avoid" })}"><span style="${styleToString({ minWidth: "12px", fontSize: "8pt", fontWeight: 800, color: "#18181b" })}">${index + 1}.</span><p style="${styleToString({ margin: 0, fontSize: "8pt", lineHeight: 1.24, color: "#3f3f46" })}">${escapeHtml(label)} <span style="${styleToString({ fontWeight: 700, color: "#18181b" })}">(${escapeHtml(value)})</span></p></li>`;
}

function styleToString(style: StyleObject) {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${toKebabCase(key)}:${String(value)}`)
    .join(";");
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}