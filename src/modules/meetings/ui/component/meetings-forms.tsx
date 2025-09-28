import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../..//types"; // Changed from AgentGetOne to MeetingGetOne
import { useRouter } from "next/navigation";
import {useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schema"; // Changed from agentsInsertSchema to meetingsInsertSchema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/genrated-avatar"; // Kept as is, assuming it's reusable or not needed for meetings
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Check, X } from "lucide-react"; // Added icons for better button design


interface MeetingFormProps { // Changed from AgentFormProps to MeetingFormProps
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne; // Changed from AgentGetOne to MeetingGetOne
}

export const MeetingForm = ({ // Changed from AgentForm to MeetingForm
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => { // Changed from AgentFormProps to MeetingFormProps
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch available agents for the dropdown
  const { data: agents } = useQuery(trpc.agents.getMany.queryOptions({}));

  const createMeeting = useMutation( // Changed from createAgent to createMeeting
    trpc.meetings.create.mutationOptions({ // Changed from trpc.agents.create to trpc.meetings.create
        onSuccess: (data) => {
          // Invalidate and refetch meetings list using tRPC query key // Changed from agents to meetings
          queryClient.invalidateQueries({
            queryKey: trpc.meetings.getMany.queryKey() // Changed from trpc.agents.getMany to trpc.meetings.getMany
          });
          // Reset form
          form.reset();
          // Call success callback to close dialog
          onSuccess?.(data.id); // Changed to pass the created
        },
        onError: (error) => {
          console.error('Failed to create meeting:', error); // Changed from 'Failed to create agent' to 'Failed to create meeting'
        },
    })
  )

  const updateMeeting = useMutation( // Changed from updateAgent to updateMeeting
    trpc.meetings.update.mutationOptions({ // Changed from trpc.agents.update to trpc.meetings.update
        onSuccess: () => {
          // Invalidate and refetch meetings list using tRPC query key // Changed from agents to meetings
          queryClient.invalidateQueries({
            queryKey: trpc.meetings.getMany.queryKey() // Changed from trpc.agents.getMany to trpc.meetings.getMany
          });
          // Reset form
          form.reset();
          // Call success callback to close dialog
          onSuccess?.();
        },
        onError: (error) => {
          console.error('Failed to update meeting:', error); // Changed from 'Failed to update agent' to 'Failed to update meeting'
        },
    })
  )
  const form = useForm<z.infer<typeof meetingsInsertSchema>>({ // Changed from agentsInsertSchema to meetingsInsertSchema
    resolver: zodResolver(meetingsInsertSchema), // Changed from agentsInsertSchema to meetingsInsertSchema
    defaultValues: {
      name: initialValues?.name ?? "", // Changed to use name for meeting title
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending; // Changed from createAgent.isPending || updateAgent.isPending to createMeeting.isPending || updateMeeting.isPending

  // Watch the selected agent ID to display agent avatar and name
  const selectedAgentId = form.watch("agentId");
  const selectedAgent = agents?.items?.find(agent => agent.id === selectedAgentId);

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => { // Changed from agentsInsertSchema to meetingsInsertSchema
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues!.id }); // Changed from updateAgent to updateMeeting
    } else {
      createMeeting.mutate(values); // Changed from createAgent to createMeeting
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6 p-6 bg-white rounded-lg shadow-md" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Meeting Avatar Section - Enhanced with better styling */}
        <div className="flex justify-center">
          <GeneratedAvatar
            seed={form.watch("name")} // Changed to use "name" for meeting title
            variant="botttsNeutral"
            className="border-2 border-gray-200 size-20 shadow-lg" // Increased size and added shadow for better visibility
          />
        </div>

        {/* Title Field - Enhanced with better spacing */}
        <FormField
          name="name" // Changed to use "name" for meeting title field
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-lg font-semibold text-gray-700">Title</FormLabel> 
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter meeting title"
                  className="h-12 text-lg" // Increased height and font size for better UX
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Agent Selection Field - Enhanced with selected agent display */}
        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-lg font-semibold text-gray-700">Agent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agents?.items?.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id} className="text-lg py-3"> {/* Increased font size and padding for agent names */}
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Agent Display - Added for better visibility when agent is selected */}
        {selectedAgent && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
            <GeneratedAvatar
              seed={selectedAgent.name}
              variant="botttsNeutral"
              className="border-2 border-gray-300 size-16"
            />
            <div>
              <p className="text-xl font-bold text-gray-800">{selectedAgent.name}</p> {/* Increased font size for agent name visibility */}
              <p className="text-sm text-gray-600">Selected Agent</p>
            </div>
          </div>
        )}

        {/* Form Buttons - Enhanced with icons and better styling */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          {onCancel && (
            <Button
              variant="outline"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
              className="w-full sm:w-auto h-12 text-lg flex items-center gap-2 hover:bg-gray-100"
            >
              <X className="w-5 h-5" /> {/* Added cancel icon */}
              Cancel
            </Button>
          )}
          <Button
            disabled={isPending}
            type="submit"
            className="w-full sm:w-auto h-12 text-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" /> // Added loading spinner
            ) : (
              <Check className="w-5 h-5" /> // Added check icon for success state
            )}
            {isEdit ? "Update Meeting" : "Create Meeting"} 
          </Button>
        </div>
      </form>
    </Form>
  )
}