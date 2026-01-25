import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { Toaster } from './ui/toaster';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 overflow-auto">{children}</div>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
