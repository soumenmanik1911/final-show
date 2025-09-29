import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  ChevronRightIcon,
  TrashIcon,
  PencilIcon,
  MoreVerticalIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Props {
  meetingId: string;
  meetingName: string;
  status: string;
  onEdit: () => void;
  onRemove: () => void;
}


export const MeetingIdViewHeader = ({
  meetingId,
  meetingName,
  status,
  onEdit,
  onRemove,
}: Props) => {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Processing</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Upcoming</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/meetings">Meetings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon className="size-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>{meetingName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{meetingName}</span>
          {getStatusBadge(status)}
        </div>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <PencilIcon className="size-4" />
            <span className="ml-2">Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemove}>
            <TrashIcon className="size-4" />
            <span className="ml-2">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
