"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import{columns} from "./component/columns"

export const MeetingsView = () => {
    const trpc = useTRPC();
    
    // Fixed: Use the correct tRPC pattern with useSuspenseQuery and queryOptions
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({})
    );

    // Fixed: Add null check and empty state handling
    // if (!data || !data.items || data.items.length === 0) {
    //     return (
    //         <div className="w-full p-4 bg-white rounded-lg shadow-md">
    //             <div className="flex items-center justify-center h-32">
    //                 <div className="text-gray-500">No meetings found</div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
            {/* Fixed: Use data.items directly since we've already checked for null */}
            <DataTable
                data={data.items}
                columns={columns}
            />
        </div>
    );
}
