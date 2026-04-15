import type { Metadata } from "next";

import { PublicSampleAgreementPage } from "@/components/marketing/public-sample-agreement-page";

export const metadata: Metadata = {
  title: "Przykładowa umowa kupna-sprzedaży samochodu",
  description:
    "Publiczny podgląd przykładowej umowy kupna-sprzedaży samochodu wraz z możliwością pobrania przykładowego PDF.",
};

export default function SampleAgreementPage() {
  return <PublicSampleAgreementPage />;
}
