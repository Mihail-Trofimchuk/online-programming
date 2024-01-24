import { isAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
	req: Request,
	{ params }: { params: { userId: string } }
  ) {
	try {

  
	  if (isAdmin(params.userId)) {
		return new NextResponse("Unauthorized", { status: 401 });
	  }
  
	//   console.log(userId);
	  const user = await clerkClient.users.deleteUser(params.userId);
	 
	  return NextResponse.json(params.userId);
	} catch (error) {
	  console.log("[CATEGORY_ID_DELETE]", error);
	  return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { userId: string } }
  ) {
	try {
  
	  if (!params.userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	  }

	  const teacher = await db.teacher.findFirst({ where: { clerk_id: params.userId } });

	  if(teacher) {
		const course = await db.teacher.deleteMany({ where: { clerk_id: params.userId } });
		return NextResponse.json(course);
	  }
  
	  const course = await db.teacher.create({
		data: {
		  clerk_id: params.userId, 
		}
	  });

	  const courses = await db.teacher.findMany();
	  //console.log(courses);
  
	  return NextResponse.json(course);
	} catch (error) {
	  console.log("[COURSES]", error);
	  return new NextResponse("Internal Error", { status: 500 });
	}
  }


  export async function GET(
	req: Request,
	{ params }: { params: { userId: string } }
  ) {
	try {
  
	  let bool = false;
	  if (!params.userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	  }
  
	  const course = await db.teacher.findFirst( { where: { clerk_id: params.userId } });

	  const courses = await db.teacher.findMany();
	  console.log(courses);
	
	  return NextResponse.json(course);
	} catch (error) {
	  console.log("[COURSES]", error);
	  return new NextResponse("Internal Error", { status: 500 });
	}
  }