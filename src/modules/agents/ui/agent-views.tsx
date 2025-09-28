"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DataTable } from "./componenets/data-table";
import { columns } from "./componenets/columns";
import { AgentsEmptyState } from "./componenets/agents-empty-state";
import { useState } from "react";
import { NewAgentDialog } from "./componenets/new-agentdialog";
import { useAgentFilters } from "../hooks/use-filter";
import { DataPagination } from "./componenets/data-pagination";
import { useRouter } from "next/navigation";

export const AgentsView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const [filters, setFilters] = useAgentFilters();
  
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      search: filters.search,
      limit: 10,
      offset: (filters.page - 1) * 10
    })
  );
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Show empty state if no agents
  if (!data || !data.items || data.items.length === 0) {
    return (
      <>
        <NewAgentDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
        />
        <AgentsEmptyState onCreateAgent={() => setIsDialogOpen(true)} />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable data={data.items} columns={columns}
      onRowClick={(row) => router.push(`/agents/${row.id}`, { scroll: false })} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};