import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-forms";

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange :(open: boolean)=> void;
};

export const NewAgentDialog =({
    open,
    onOpenChange,

}: NewAgentDialogProps) =>{
    return(
        <ResponsiveDialog
            open={open}
            
            onOpenChange={onOpenChange}
            description="create a new agent"
            title="Create Agent"
        >
            <AgentForm 
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}/>
        </ResponsiveDialog>
    )
}
