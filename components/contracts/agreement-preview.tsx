import type { AgreementViewModel } from "@/lib/contracts/view-model";

import { Card } from "@/components/ui/card";

type AgreementPreviewProps = {
  viewModel: AgreementViewModel;
};

export function AgreementPreview({ viewModel }: AgreementPreviewProps) {
  return (
    <Card className="space-y-6 print:shadow-none print:border-none">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">UMOWA KUPNA-SPRZEDAZY POJAZDU</h1>
        <p className="text-sm text-zinc-600">{viewModel.title}</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-semibold">1. Strony umowy</h2>
        <p>
          <span className="font-medium">Sprzedajacy:</span> {viewModel.sellerLine}
        </p>
        <p>
          <span className="font-medium">Kupujacy:</span> {viewModel.buyerLine}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">2. Przedmiot umowy</h2>
        <p>{viewModel.vehicleLine}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">3. Cena i wydanie pojazdu</h2>
        <p>Cena: {viewModel.price.toFixed(2)} PLN</p>
        <p>Slownie: {viewModel.priceWords}</p>
        <p>Sposob platnosci: {viewModel.paymentMethod}</p>
        <p>Data zawarcia: {viewModel.saleDate}</p>
        <p>Miejsce zawarcia: {viewModel.salePlace}</p>
        <p>Data przekazania pojazdu: {viewModel.handoverDate}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">4. Oswiadczenia stron</h2>
        <ul className="space-y-1">
          {viewModel.declarations.map((item) => (
            <li key={item.label}>
              - {item.label}: <span className="font-medium">{item.value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">5. Uwagi dodatkowe</h2>
        <p>{viewModel.notes}</p>
      </section>

      <section className="grid grid-cols-1 gap-10 pt-8 md:grid-cols-2">
        <div>
          <p className="border-t border-zinc-400 pt-2 text-center text-sm">Podpis sprzedajacego</p>
        </div>
        <div>
          <p className="border-t border-zinc-400 pt-2 text-center text-sm">Podpis kupujacego</p>
        </div>
      </section>
    </Card>
  );
}
