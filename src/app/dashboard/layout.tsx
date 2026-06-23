import { AppDataProvider } from "@/components/providers/app-data-provider";
import { Header } from "@/components/layout/header";
import { ResetToast } from "@/components/layout/reset-toast";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppDataProvider>
      <div className="flex h-screen overflow-hidden bg-slate-100 print:block print:h-auto print:overflow-visible">
        <div className="print:hidden">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:block print:overflow-visible">
          <div className="print:hidden">
            <Header />
          </div>
          <main className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0">
            <ResetToast />
            {children}
          </main>
        </div>
      </div>
    </AppDataProvider>
  );
}
