import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-forms";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
    agent: AgentGetOne; // Agent data to edit
    open: boolean;
    onOpenChange :(open: boolean)=> void;
};

export const UpdateAgentDialog =({
    agent,
    open,
    onOpenChange,

}: UpdateAgentDialogProps) => {
    return(
        <ResponsiveDialog
            open={open}
            
            onOpenChange={onOpenChange}
            description="Update your agent settings"
            title="Update Agent"
        >
            <AgentForm 
                initialValues={agent}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}/>
        </ResponsiveDialog>
    )
}
