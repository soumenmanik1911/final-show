// 
import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: new Headers({ cookie: headerList.get("cookie") ?? "" }),
  });

  if (!!session) {
    redirect("/");
  }

  return <SignInView />;
};

export default SignInPage;
