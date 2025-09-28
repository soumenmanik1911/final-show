import type React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/modules/dashboard/ui/dashboard-sidebar';
import { DashboardNavbar } from '@/modules/dashboard/ui/dashboard-navbar';
import {NuqsAdapter} from "nuqs/adapters/next"

interface Props{
    children: React.ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <NuqsAdapter>
        <SidebarProvider>
            <Sidebar>
                <DashboardSidebar />
            </Sidebar>
            <SidebarInset>
                <main className="flex-1 overflow-auto">
                    <DashboardNavbar/>
                    <div className="container mx-auto px-4 py-6 max-w-7xl">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
        </NuqsAdapter>




    );
}