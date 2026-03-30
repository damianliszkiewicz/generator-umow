import path from "node:path";

import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { AgreementViewModel } from "@/lib/contracts/view-model";

const PDF_FONT_FAMILY = "SourceSerif4Pdf";

Font.register({
  family: PDF_FONT_FAMILY,
  fonts: [
    {
      src: path.join(
        process.cwd(),
        "node_modules/@expo-google-fonts/source-serif-4/400Regular/SourceSerif4_400Regular.ttf",
      ),
      fontWeight: 400,
    },
    {
      src: path.join(
        process.cwd(),
        "node_modules/@expo-google-fonts/source-serif-4/700Bold/SourceSerif4_700Bold.ttf",
      ),
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingRight: 56,
    paddingBottom: 44,
    paddingLeft: 56,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: "#18181b",
    fontFamily: PDF_FONT_FAMILY,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },
  metaBlock: {
    width: "48%",
  },
  metaBlockRight: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 700,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 28,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    paddingBottom: 4,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 10.5,
    lineHeight: 1.6,
  },
  partyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  partyColumn: {
    width: "46%",
  },
  partyLabel: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#52525b",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  partyName: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
  },
  lineItem: {
    marginBottom: 3,
  },
  intro: {
    marginBottom: 10,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f4f4f5",
    backgroundColor: "#fafafa",
  },
  detailCell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#52525b",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 700,
  },
  detailValueMono: {
    fontFamily: "Courier",
  },
  pricePanel: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#f4f4f5",
    backgroundColor: "#fafafa",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#52525b",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  priceValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 700,
  },
  priceWords: {
    marginTop: 10,
    fontSize: 10,
    color: "#3f3f46",
  },
  saleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  saleCell: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  declarationRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  declarationIndex: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#18181b",
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 4,
    marginRight: 10,
  },
  declarationText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.6,
  },
  declarationValue: {
    fontWeight: 700,
  },
  notesPanel: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#f4f4f5",
    backgroundColor: "#fafafa",
  },
  signatureRow: {
    marginTop: 30,
    paddingTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#111827",
    paddingTop: 8,
    textAlign: "center",
    fontSize: 8,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

export function AgreementPdfDocument({ viewModel }: { viewModel: AgreementViewModel }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Miejsce i data zawarcia</Text>
            <Text style={styles.metaValue}>{viewModel.documentLocationAndDateLine}</Text>
          </View>
          <View style={[styles.metaBlock, styles.metaBlockRight]}>
            <Text style={styles.metaLabel}>Tytuł dokumentu</Text>
            <Text style={styles.metaValue}>{viewModel.title}</Text>
          </View>
        </View>

        <Text style={styles.title}>UMOWA KUPNA-SPRZEDAŻY POJAZDU</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>§ 1. Strony umowy</Text>
          <View style={styles.partyRow}>
            <View style={styles.partyColumn}>
              <Text style={styles.partyLabel}>Sprzedający</Text>
              <Text style={styles.partyName}>{viewModel.sellerDetails.fullName}</Text>
              {viewModel.sellerDetails.details.map((item) => (
                <Text key={item} style={[styles.bodyText, styles.lineItem]}>
                  {item}
                </Text>
              ))}
              <Text style={styles.bodyText}>{viewModel.sellerDetails.addressLine}</Text>
            </View>

            <View style={styles.partyColumn}>
              <Text style={styles.partyLabel}>Kupujący</Text>
              <Text style={styles.partyName}>{viewModel.buyerDetails.fullName}</Text>
              {viewModel.buyerDetails.details.map((item) => (
                <Text key={item} style={[styles.bodyText, styles.lineItem]}>
                  {item}
                </Text>
              ))}
              <Text style={styles.bodyText}>{viewModel.buyerDetails.addressLine}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>§ 2. Przedmiot umowy</Text>
          <Text style={[styles.bodyText, styles.intro]}>
            Przedmiotem niniejszej umowy jest sprzedaż pojazdu mechanicznego o następujących
            parametrach identyfikacyjnych:
          </Text>
          <View style={styles.detailsGrid}>
            {viewModel.vehicleDetails.map((item) => (
              <View key={item.label} style={styles.detailCell}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={item.mono ? [styles.detailValue, styles.detailValueMono] : styles.detailValue}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>§ 3. Cena i warunki płatności</Text>
          <View style={styles.pricePanel}>
            <Text style={styles.priceLabel}>Cena sprzedaży</Text>
            <Text style={styles.priceValue}>{viewModel.priceDisplay}</Text>
            <Text style={styles.priceWords}>Słownie: {viewModel.priceWords}</Text>
          </View>
          <View style={styles.saleGrid}>
            {viewModel.saleDetails
              .filter((item) => item.label !== "Cena sprzedaży" && item.label !== "Słownie")
              .map((item) => (
                <View key={item.label} style={styles.saleCell}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>§ 4. Oświadczenia stron</Text>
          {viewModel.declarations.map((item, index) => (
            <View key={item.label} style={styles.declarationRow}>
              <Text style={styles.declarationIndex}>{index + 1}</Text>
              <Text style={styles.declarationText}>
                {item.label}: <Text style={styles.declarationValue}>{item.value}</Text>
              </Text>
            </View>
          ))}
        </View>

        {viewModel.supplementarySections.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{`§ ${5 + index}. ${section.title}`}</Text>
            <View style={styles.notesPanel}>
              <Text style={styles.bodyText}>{section.content}</Text>
            </View>
          </View>
        ))}

        <View style={styles.signatureRow}>
          <Text style={styles.signatureBox}>Czytelny podpis sprzedającego</Text>
          <Text style={styles.signatureBox}>Czytelny podpis kupującego</Text>
        </View>
      </Page>
    </Document>
  );
}
