import { clerkClient } from '@clerk/nextjs';
import { db } from "@/lib/db";
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { User } from '@clerk/nextjs/server';


export interface SimplifiedUser {
  id: string;
  emailAddress: string;
  createdAt: number;
  updatedAt: number;
}

const fetchUserTeacher = async (userId: string) => {
  const course = await db.teacher.findFirst( { where: { clerk_id: userId } });
  if(course) {
    return true;
  }

  return false;
};

const UserPage = async () => {


  const possibleOrderByValues = [
    "created_at",
    "updated_at",
    "+created_at",
    "+updated_at",
    "-created_at",
    "-updated_at",
  ] as const;
  
  type OrderByValue = typeof possibleOrderByValues[number];
  
  const randomOrderBy = possibleOrderByValues[Math.floor(Math.random() * possibleOrderByValues.length)] as OrderByValue;
  
  const users: User[] = await clerkClient.users.getUserList({
    orderBy: randomOrderBy,
  });
 
  


  const simplifiedUsers = await Promise.all(
    users.map(async (user) => {
 
        const teacher = await fetchUserTeacher(user.id);

        return {
          id: user.id,
          emailAddress: user.emailAddresses[0]?.emailAddress || 'N/A',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          teacher: teacher ?? false,
        };
    })
  );

  return ( 
    <div className="p-6">
    <DataTable columns={columns} data={simplifiedUsers} />
    </div>
   );
}
 
export default UserPage;