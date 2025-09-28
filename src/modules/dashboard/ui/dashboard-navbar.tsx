"use client"

import { PanelLeftIcon, PanelLeftCloseIcon, Search as SearchIcon, Command as CommandIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { DashboardCommand } from "./dashboard-command";
import { useState } from "react";

export const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);
    

    return (
        <>
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen}/>
        
        <nav className="flex px-2 gap-x-3 items-center py-2 border-b bg-background">
            <Button className="size-12" variant="outline" onClick={toggleSidebar}>
                {(state === "collapsed" || isMobile)
                    ? <PanelLeftIcon className="size-50" />
                    : <PanelLeftCloseIcon className="size-50" />}
            </Button>

            {/* Logo */}
           

            <div className="flex-1 min-w-0">
                <div className="relative w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                        className="pl-9 h-9 w-full"
                        placeholder="Search..."
                        aria-label="Search"
                        onClick={() => setCommandOpen(true)}
                        readOnly
                    />
                    <Button
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCommandOpen(true)}
                    >
                        <CommandIcon className="size-3 mr-1" />
                        ⌘K
                    </Button>
                </div>
            </div>
        </nav>
        </>
    )
}
