'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { BotIcon, StarIcon, VideoIcon,FileJson2 } from "lucide-react";
import { MeetMeLogo } from "@/components/logo";
import { DashboardUserButton } from "./dashboard-user-button";

  const firstSection = [
    {
        icon :VideoIcon,
        label : "Meetings",
        href : "/meetings",
    },
    {
        icon :BotIcon,
        label :"Agents",
        href :"/agents",
    }
  ];
  const SecondSection = [
    {
        icon :VideoIcon,
        label : "Meetings",
        href : "/meetings",
    },
    {
        icon :BotIcon,
        label :"AI Voice Assistant",
        href :"/vapi-test",
    },
    {
        icon :FileJson2,
        label :"how to use",
        href :"/how-to-use",
    },
    {
        icon :StarIcon,
        label :"My Feedback",
        href :"/my-feedback",
    }
  ];

  export const DashboardSidebar =() =>{
    return(
      <Sidebar className="sidebar-black bg-black border-gray-800" variant="floating">
        <SidebarHeader className="bg-black border-b border-gray-800 p-4">
          <Link href="/" className="block">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-900 rounded-xl transition-all duration-200 group cursor-pointer">
              <MeetMeLogo width={40} height={40} className="group-hover:scale-105 transition-transform duration-200" />
              <div className="min-w-0">
                <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 block truncate">
                  Meet-Me
                </span>
                <span className="text-xs text-gray-400 block">AI Assistant</span>
              </div>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="bg-black">
          <SidebarGroup className="py-2">
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {firstSection.map((item) => (
                  <SidebarMenuItem key={item.href} className="mb-1">
                    <SidebarMenuButton asChild className="h-11">
                      <Link 
                        href={item.href} 
                        className="sidebar-button-hover flex items-center px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-all duration-200 group"
                      >
                        <item.icon className="mr-3 size-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 group-hover:text-blue-400" />
                        <span className="text-sm font-medium tracking-tight group-hover:ml-1 transition-all duration-200 truncate">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator className="bg-gray-800 mx-3 my-2" />
          <SidebarGroup className="py-2">
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              More
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {SecondSection.map((item) => (
                  <SidebarMenuItem key={item.href} className="mb-1">
                    <SidebarMenuButton asChild className="h-11">
                      <Link 
                        href={item.href} 
                        className="sidebar-button-hover flex items-center px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-all duration-200 group"
                      >
                        <item.icon className="mr-3 size-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 group-hover:text-yellow-400" />
                        <span className="text-sm font-medium tracking-tight group-hover:ml-1 transition-all duration-200 truncate">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-black border-t border-gray-800 p-3">
          <div className="p-2">
            <DashboardUserButton/>
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }