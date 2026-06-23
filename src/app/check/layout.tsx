import Link from "next/link";
import { AppDataProvider } from "@/components/providers/app-data-provider";

export const metadata = {
  title: "Ronin E-Warranty Check",
  description: "Verify your Ronin product warranty by scanning the label QR code.",
};

/** Public customer page — no dashboard shell or login. */
export default function PublicCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppDataProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-5 sm:px-6 xl:max-w-4xl">
            <div>
              <p className="text-lg font-bold tracking-tight text-[#25408F]">RONIN</p>
              <p className="text-xs text-slate-500">E-Warranty verification</p>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 xl:max-w-4xl">{children}</main>
        <footer className="mx-auto max-w-2xl px-4 pb-8 text-center text-[11px] text-slate-400 xl:max-w-4xl">
          <Link href="/dashboard" className="hover:text-slate-600">
            Staff portal
          </Link>
        </footer>
      </div>
    </AppDataProvider>
  );
}
