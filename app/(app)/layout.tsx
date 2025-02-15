import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex flex-row w-full">
        <AppSidebar />
        <section className="flex flex-col w-full">
          <div className="flex">
            <div className="flex gap-2 items-center">
              <SidebarTrigger className="gap-1" />
              <Separator orientation="vertical" className=" h-7" />
            </div>
            <Navbar />
          </div>
          <div>{children}</div>
        </section>
      </div>
    </SidebarProvider>
  );
}
