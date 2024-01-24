import { isAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
	{ params }: { params: { teacherId: string } },
	req: Request,
  ) {
	try {
	  const { userId } = auth();
	  const clerk_id = params.teacherId;
   
	 
	  if (!isAdmin(userId)) {
		return new NextResponse("Forbiden", { status: 403 });
	  }

	  const newTeacher = await db.teacher.create({
		data: {
		  clerk_id
		}
	  });
  
	  return NextResponse.json(newTeacher);
	} catch (error) {
	  console.log("[TEACHER]", error);
	  return new NextResponse("Internal Error", { status: 500 });
	}
  }