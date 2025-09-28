import { SignUpView } from '@/modules/auth/ui/views/sign-up-views';
import {headers} from 'next/headers';
import {auth} from "@/lib/auth";
import{redirect} from "next/navigation"

const SignUpPage = async() => {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: new Headers({ cookie: headerList.get('cookie') ?? '' })
  });
  if(!!session){
    redirect("/");
  }
    return (
      <SignUpView/>
    )
  }
  
  export default SignUpPage;
  