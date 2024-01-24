import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';


const CategoryPage = async () => {

const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const message = await db.message.findMany();
 

  const messages = await Promise.all(
    (await db.message.findMany()).map(async (message) => {
      return {
        id: message.id,
        name: message.name,
        username: message.username,
        motivation: message.motivation,
        education: message.education,
        email: (
          await clerkClient.users.getUser(message.userId)
        ).emailAddresses[0]?.emailAddress,
      };
    })
  );

  return ( 
    <div className="p-6">
        <DataTable columns={columns} data={messages} />
    </div>
   );
}
 
export default CategoryPage;