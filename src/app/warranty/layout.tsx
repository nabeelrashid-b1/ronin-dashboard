import Link from "next/link";
import { AppDataProvider } from "@/components/providers/app-data-provider";
import { PortalNav } from "@/components/warranty/portal-nav";

export default function WarrantyPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppDataProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href="/dashboard" className="text-xl font-bold text-slate-900">
                  Ronin Warranty System
                </Link>
                <p className="mt-0.5 text-sm text-slate-500">
                  Complete warranty management solution
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-medium text-slate-500 hover:text-emerald-700"
              >
                Admin portal →
              </Link>
            </div>
            <div className="mt-6">
              <PortalNav />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </AppDataProvider>
  );
}
