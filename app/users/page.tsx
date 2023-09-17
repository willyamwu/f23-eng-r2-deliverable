import { Separator } from "@/components/ui/separator";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import UserList from "./user-list";

export default async function ProfilesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  const { data: profiles } = await supabase.from("profiles").select("*");

  return (
    <>
      <TypographyH2>Users List</TypographyH2>
      <TypographyP>
        Welcome to the user list! You are now all part of a special club and can access each other&apos;s information and connect!
        Go to your profile and add a bio to let people learn more about you.
      </TypographyP>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {profiles?.map((profiles) => <UserList key={profiles.id} {...profiles} />)}
      </div>
    </>
  );
}
