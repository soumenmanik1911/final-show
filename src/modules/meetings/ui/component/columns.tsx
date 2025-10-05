"use client"

import { ColumnDef } from "@tanstack/react-table"
// Fixed: Import the correct type for individual meeting items


import { GeneratedAvatar } from "@/components/genrated-avatar"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import {format} from "date-fns"
const humanizeDuration = require("humanize-duration")
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
// or if the above doesn't work, try:
// import * as humanizeDuration from "humanize-duration"

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
  Download,
  Play,
} from "lucide-react"
import { MeetingGetMany } from "../../types"



function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
};
const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
};

// Fixed: Use the correct type for column definitions
export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{row.original.name}</span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="w-4 h-4 text-gray-400" />
            {/* Fixed: Add null check for agent data to prevent runtime errors */}
            <span className="text-sm text-gray-500">
              {row.original.agent?.name || "No agent assigned"}
            </span>
          </div>
          {/* Fixed: Only render avatar if agent exists */}
          {row.original.agent && (
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={row.original.agent.name}
              className="size-6"
            />
          )}
          <span className="text-sm text-gray-600">
            {/* Fixed: Add proper date formatting with null check */}
            {row.original.startTime
              ? format(new Date(row.original.startTime), "MMM dd, yyyy HH:mm")
              : "No start time set"
            }
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Fixed: Add fallback for unknown status types
      const status = row.original.status || "upcoming";
      const Icon = statusIconMap[status as keyof typeof statusIconMap] || statusIconMap.upcoming;

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground gap-x-1",
            statusColorMap[status as keyof typeof statusColorMap] || statusColorMap.upcoming
          )}
        >
          <Icon className={cn(
            status === "active" && "animate-spin"
          )} />
          {/* Fixed: Display status text alongside icon */}
          <span>{status}</span>
        </Badge>
      )
    }
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="[&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-700" />
        {/* Fixed: Add proper null check and handle zero duration */}
        <span>
          {row.original.duration !== null && row.original.duration !== undefined
            ? formatDuration(row.original.duration)
            : "No duration"
          }
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "recording",
    header: "Recording",
    cell: ({ row }) => {
      const hasRecording = row.original.recordingUrl;
      const isCompleted = row.original.status === 'completed';
      // Transcript functionality commented out for now
      // const hasTranscript = row.original.transcriptUrl;

      return (
        <div className="flex items-center gap-1">
          {hasRecording && (
            <div
              className="flex items-center gap-1 text-green-600 cursor-pointer hover:text-green-800"
              onClick={(e) => {
                e.stopPropagation();
                if (row.original.recordingUrl) {
                  window.open(row.original.recordingUrl, '_blank');
                }
              }}
              title="Download Recording"
            >
              <Download className="w-4 h-4" />
            </div>
          )}
          {/* Transcript functionality commented out for now
          {hasTranscript && (
            <div
              className="flex items-center gap-1 text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                window.open(row.original.transcriptUrl, '_blank');
              }}
              title="View Transcript"
            >
              <Play className="w-4 h-4" />
            </div>
          )}
          */}
          {!hasRecording && isCompleted && (
            <span className="text-yellow-500 text-sm" title="Recording processing">⏳</span>
          )}
          {!hasRecording && !isCompleted && (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      );
    },
  }


]
