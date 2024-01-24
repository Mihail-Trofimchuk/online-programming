
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
	req: Request,
	{ params }: { params: { categoryId: string } }
  ) {
	try {
	  const { userId } = auth();
  
	  if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	  }
  
	  const category = await db.category.findUnique({
		where: {
		  id: params.categoryId,
		},
	  });
  
	  if (!category) {
		return new NextResponse("Not found", { status: 404 });
	  }
  
	  const deletedCategory = await db.category.delete({
		where: {
		  id: params.categoryId,
		},
	  });
  
	  return NextResponse.json(deletedCategory);
	} catch (error) {
	  console.log("[CATEGORY_ID_DELETE]", error);
	  return new NextResponse("Internal Error", { status: 500 });
	}
  }