import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,92,255,0.16),_transparent_28%),linear-gradient(180deg,_#fbf9f5_0%,_var(--dashboard-page)_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
          <div className="hidden rounded-[32px] border border-[color:var(--dashboard-border)] bg-white/80 p-10 shadow-[0_8px_24px_rgba(38,34,27,0.04)] backdrop-blur lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--dashboard-muted)]">Nowe konto</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--dashboard-text)]">
              Utwórz konto i rozpocznij pracę w tym samym układzie od pierwszego kroku.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[color:var(--dashboard-muted)]">
              Formularze, postęp i podgląd PDF korzystają z jednego systemu wizualnego, więc wejście do aplikacji nie zmienia kontekstu pracy.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <SignUp
              appearance={{
                elements: {
                  cardBox: "shadow-none",
                  card: "rounded-[32px] border border-[color:var(--dashboard-border)] bg-white/88 shadow-[0_8px_24px_rgba(38,34,27,0.04)]",
                  headerTitle: "text-[color:var(--dashboard-text)]",
                  headerSubtitle: "text-[color:var(--dashboard-muted)]",
                  formButtonPrimary: "bg-[color:var(--dashboard-text)] hover:bg-black rounded-xl shadow-none",
                  socialButtonsBlockButton: "rounded-xl border border-[color:var(--dashboard-border)] shadow-none",
                  formFieldInput: "rounded-xl border border-[color:var(--dashboard-border)] shadow-none",
                  footerActionLink: "text-[color:var(--dashboard-accent)]",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
