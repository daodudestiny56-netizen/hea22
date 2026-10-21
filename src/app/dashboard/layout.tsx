import { MobileNav, Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper-2">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className="flex-1">{children}</main>
        <p className="px-5 py-6 text-xs text-muted sm:px-8">
          This tool gives general guidance only and does not provide a diagnosis. Always follow the advice of a
          qualified health worker.
        </p>
      </div>
    </div>
  );
}
