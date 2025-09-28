"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../types"
import { CornerDownRightIcon, Video } from "lucide-react"
import { GeneratedAvatar } from "@/components/genrated-avatar"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
 

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.name}
            className="size-12"
          />
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-shadow-muted-foreground" />
          <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="w-full flex justify-end">
        <Link
          href={`/meetings/new?agentId=${row.original.id}`}
          className={`${buttonVariants({ size: "sm" })} gap-2`}
        >
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Start meeting</span>
        </Link>
      </div>
    ),
  },
]