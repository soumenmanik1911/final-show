"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import{columns} from "./component/columns"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DEFAULT_PAGE_SIZE } from "@/constants";

export const MeetingsView = () => {
    const trpc = useTRPC();

    // Added: State for pagination and search functionality
    const [page, setPage] = useState(1);
    const [limit] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState("");
    const offset = (page - 1) * limit;

    // Commented out: Previous useSuspenseQuery implementation
    // const { data } = useSuspenseQuery(
    //     trpc.meetings.getMany.queryOptions({})
    // );

    // Added: Use useQuery for better control over loading and error states with pagination and search
    const { data, isLoading, error } = useQuery(
        trpc.meetings.getMany.queryOptions({ limit, offset, search: search.trim() || undefined })
    );

    // Added: Loading state handling for better user experience
    if (isLoading) {
        return <LoadingState title="Loading meetings" description="Please wait while we load your meetings" />;
    }

    // Added: Error state handling to inform users of issues
    if (error) {
        return <ErrorState title="Error loading meetings" description="There was an error loading your meetings. Please try again." />;
    }

    // Uncommented: Add null check and empty state handling to prevent rendering issues when data is not available
    if (!data || !data.items || data.items.length === 0) {
        return (
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">No meetings found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Added: Search input for filtering meetings with responsive layout */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <Input
                    placeholder="Search meetings..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset to first page when searching
                    }}
                    className="max-w-sm"
                />
                <div className="text-sm text-gray-600">
                    Total: {data.total} meetings
                </div>
            </div>

            {/* Added: Responsive wrapper for the table to handle overflow on smaller screens */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <DataTable
                    data={data.items}
                    columns={columns}
                />
            </div>

            {/* Added: Pagination controls with responsive design */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                    Page {page} of {data.totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                    >
                        Next
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
