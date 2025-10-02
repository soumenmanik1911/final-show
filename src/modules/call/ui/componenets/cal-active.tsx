import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout

 } from "@stream-io/video-react-sdk";

 interface Props{
    onLeave :()=> void;
    meetingName : string
    
 }

 export const CallAcctive = ({onLeave,meetingName}:Props) =>{
    return(
        <div className="flex flex-col h-full justify-between text-teal-50">
            <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center m-4">
                <Link href="/"  className="flex items-center justify-center rounded-full w-fit">
                <Image src="/global.svg" alt="logo" width={30} height={30} className="rounded-full"/>
                </Link>
                <h3 className="text-2xl font-bold">
                    {meetingName}
                </h3>

            </div>
            <SpeakerLayout/>
            <div className=" bg-black rounded-full">
                 <CallControls onLeave={onLeave}
                 />
                 </div>

           

        </div>
    )
 }