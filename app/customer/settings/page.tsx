import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AccountSecurity from "@/components/AccountSecurity";

export default async function CustomerSettings() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";

  return (
    <div>
      <AccountSecurity email={email} />
    </div>
  );
}
