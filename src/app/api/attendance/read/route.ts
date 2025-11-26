import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { month } = await req.json(); // "2025-11"

    // 🚀 date LIKE '2025-11%' 형태로 조회
    const rows = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          startsWith: month, // 월별 조회
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return Response.json({ success: true, rows });
  } catch (err) {
    console.error("Attendance read error:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
