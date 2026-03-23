import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
      <Card className="w-full max-w-3xl space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">MVP</p>
          <h1 className="text-3xl font-semibold text-zinc-900">
            Generator umowy kupna-sprzedazy samochodu
          </h1>
          <p className="text-zinc-600">
            Wypelnij wieloetapowy formularz, zapisz szkic i wygeneruj PDF umowy zgodny z
            podgladem.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/sign-in">
            <Button>Zaloguj sie</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary">Utworz konto</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
