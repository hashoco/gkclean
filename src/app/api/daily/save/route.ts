import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, partnerId, workDate, qty, unitPrice, totalAmount } = body;

    // UPDATE 모드
    if (id) {
      await prisma.dailyWorkLog.update({
        where: { id },
        data: {
          partnerId,
          workDate: new Date(workDate),
          qty,
          unitPrice,
          totalAmount,
        },
      });

      return NextResponse.json({ success: true, mode: "update" });
    }

    // INSERT 모드
    await prisma.dailyWorkLog.create({
      data: {
        partnerId,
        workDate: new Date(workDate),
        qty,
        unitPrice,
        totalAmount,
      },
    });

    return NextResponse.json({ success: true, mode: "insert" });
  } catch (e) {
    console.error("daily/save error:", e);
    return NextResponse.json({ success: false });
  }
}
