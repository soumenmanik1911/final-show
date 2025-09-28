import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../..//types";
import { useRouter } from "next/navigation";
import {useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { agentsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/genrated-avatar";


interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
        onSuccess: () => {
          // Invalidate and refetch agents list using tRPC query key
          queryClient.invalidateQueries({ 
            queryKey: trpc.agents.getMany.queryKey() 
          });
          // Reset form
          form.reset();
          // Call success callback to close dialog
          onSuccess?.();
        },
        onError: (error) => {
          console.error('Failed to create agent:', error);
        },
    })
  )
  
  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
        onSuccess: () => {
          // Invalidate and refetch agents list using tRPC query key
          queryClient.invalidateQueries({ 
            queryKey: trpc.agents.getMany.queryKey() 
          });
          // Reset form
          form.reset();
          // Call success callback to close dialog
          onSuccess?.();
        },
        onError: (error) => {
          console.error('Failed to update agent:', error);
        },
    })
  )
  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instruction: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({ ...values, id: initialValues!.id });
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar 
          seed={form.watch("name")} 
          variant="botttsNeutral" 
          className="border size-16" 
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Agent name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="instruction"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Input {...field} placeholder="What should the agent do?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button 
            disabled={isPending} 
            type="submit"
            className="w-full sm:w-auto"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
