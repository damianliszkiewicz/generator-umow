import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PublicLandingPage } from "@/components/marketing/public-landing-page";

export const metadata: Metadata = {
  title: "Generator umowy kupna-sprzedaży samochodu",
  description:
    "Publiczny landing generatora umowy kupna-sprzedaży samochodu z przykładowym podglądem dokumentu i ścieżką od szkicu do PDF.",
};

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <PublicLandingPage />;
}
