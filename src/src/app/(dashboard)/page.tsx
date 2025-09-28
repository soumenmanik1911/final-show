import { HomeView } from "@/modules/home/ui/view/home-view";
import { Button } from "@/components/ui/button";
import {headers} from 'next/headers';
import {auth} from "@/lib/auth";
import{redirect} from "next/navigation"


const HomePage = async ()=> {
  const session = await auth.api.getSession({headers: await headers()});
  if(!session){
    redirect("/sign-in");
  }
  return(   
 
  <HomeView/>
 
  )
}

export default HomePage;