import { db } from '@/lib/db';
import { Teacher } from '@prisma/client';
import { NextResponse } from 'next/server';


// export async function POST(
// 	request: Request,
//   ) {
// 	try {

// 	  const teachers = await db.teacher.findMany();
// 	  let arr: Array<string | null> = [];
// 	  teachers.forEach((element: Teacher) => {
// 		arr.push(element.clerk_id);
// 	  });

//       //console.log(arr);
// 	  return NextResponse.json(arr);
// 	} catch (error) {
// 	  console.log("[TEACHER]", error);
// 	  return new NextResponse("Internal Error", { status: 500 });
// 	}
// }



// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const teachers = await db.teacher.findMany();
//     res.status(200).json({ teachers });
//   } catch (error) {
//     console.error('Error fetching teachers:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

