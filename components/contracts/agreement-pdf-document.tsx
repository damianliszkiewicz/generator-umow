import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { AgreementViewModel } from "@/lib/contracts/view-model";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 12,
    marginBottom: 4,
  },
  item: {
    marginBottom: 2,
  },
  signatureRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#111827",
    paddingTop: 4,
    textAlign: "center",
  },
});

export function AgreementPdfDocument({ viewModel }: { viewModel: AgreementViewModel }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>UMOWA KUPNA-SPRZEDAZY POJAZDU</Text>
        <Text style={styles.subtitle}>{viewModel.title}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Strony umowy</Text>
          <Text style={styles.item}>Sprzedajacy: {viewModel.sellerLine}</Text>
          <Text style={styles.item}>Kupujacy: {viewModel.buyerLine}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. Przedmiot umowy</Text>
          <Text>{viewModel.vehicleLine}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. Cena i wydanie pojazdu</Text>
          <Text>Cena: {viewModel.price.toFixed(2)} PLN</Text>
          <Text>Slownie: {viewModel.priceWords}</Text>
          <Text>Sposob platnosci: {viewModel.paymentMethod}</Text>
          <Text>Data zawarcia: {viewModel.saleDate}</Text>
          <Text>Miejsce zawarcia: {viewModel.salePlace}</Text>
          <Text>Data przekazania pojazdu: {viewModel.handoverDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Oswiadczenia stron</Text>
          {viewModel.declarations.map((item) => (
            <Text key={item.label}>- {item.label}: {item.value}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Uwagi dodatkowe</Text>
          <Text>{viewModel.notes}</Text>
        </View>

        <View style={styles.signatureRow}>
          <Text style={styles.signatureBox}>Podpis sprzedajacego</Text>
          <Text style={styles.signatureBox}>Podpis kupujacego</Text>
        </View>
      </Page>
    </Document>
  );
}
