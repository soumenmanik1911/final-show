import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meetings-forms";
import { useRouter } from "next/navigation";

interface NewMeetingsDialogProps {
    open: boolean;
    onOpenChange :(open: boolean)=> void;
};

export const NewMeetingsDialog =({
    open,
    onOpenChange,

}: NewMeetingsDialogProps) =>{
    const router = useRouter();
    return(
        <ResponsiveDialog
            open={open}
            
            onOpenChange={onOpenChange}
            description="Schedule a new meeting"
            title="New Meeting"
        >
          <MeetingForm onSuccess={(id) => {
            onOpenChange(false);
            router.push(`/meetings/${id}`);
            // onCancel={() =>onOpenChange}
            //   onCancel={() => onOpenChange(false)}
          }}
          />
        </ResponsiveDialog>
    )
}
