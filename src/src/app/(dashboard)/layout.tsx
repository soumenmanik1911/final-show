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
            </Sidebar>
            <SidebarInset>
                <DashboardSidebar />
                
                <main>
                    <DashboardNavbar/>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
        </NuqsAdapter>
       
           
        
    );
}