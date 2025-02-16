import AppSidebar from "@/components/sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Navbar from "@/components/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="bg-[#F7F8FA] px-4 pb-24 min-h-screen">
            <header className="md:col-start-1 md:col-end-[-1]">
              <Navbar />
            </header>
            <div className="md:col-start-2 md:col-span-1">
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
