
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { month, rows } = await req.json();

    // 해당 월 데이터 삭제 후 다시 insert
    await prisma.attendance.deleteMany({
      where: { userId, date: { startsWith: month } },
    });

    const insertData = rows.map((r: any) => ({
      userId,
      date: r.date,  
      inTime: r.inTime,
      outTime: r.outTime,
      workCalc: r.workCalc,
      hours: r.hours,
      minutes: r.minutes,
    }));

    await prisma.attendance.createMany({
      data: insertData,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
