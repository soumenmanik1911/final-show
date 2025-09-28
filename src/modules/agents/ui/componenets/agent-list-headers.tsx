"use client"
import {Button} from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agentdialog";
import { useState } from "react";
import { useAgentFilters } from "../../hooks/use-filter";
import { AgentsSearchFilter } from "./agent-search-filter";

export const AgentListHeaders = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useAgentFilters();
    return (
        <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
     
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold"> my Agents</h2>
            <Button onClick={() => setIsDialogOpen(true)}><PlusIcon/>Create Agent
            </Button>
        </div>
        <AgentsSearchFilter/>
        </div>  
         </>
    )
}
