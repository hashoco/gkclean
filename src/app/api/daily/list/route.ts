

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(req: Request) {
  try {
    const { partnerId, from, to } = await req.json();

    const logs = await prisma.dailyWorkLog.findMany({
      where: {
        partnerId,
        workDate: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      orderBy: {
        workDate: "desc",
      },
    });

    return NextResponse.json({ success: true, logs });
  } catch (e) {
    console.error("daily/list error:", e);
    return NextResponse.json({ success: false });
  }
}
