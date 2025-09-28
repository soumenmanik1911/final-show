"use client"
import {Button} from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import { useState } from "react";
import { NewMeetingsDialog } from "./new-meetingdialog";


export const MeetingsListHeader = () => {
    const[isDialogOpen,setIsDialogOpen] = useState(false);
   
    return (
        <>
      <NewMeetingsDialog open ={isDialogOpen} onOpenChange={setIsDialogOpen} 
      />
     
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Meetings</h2>
            <Button onClick={() =>setIsDialogOpen(true)} className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                New Meeting
            </Button>
        </div>
        </div>
         </>
    )
}
