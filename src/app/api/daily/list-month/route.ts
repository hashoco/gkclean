import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { yearMonth } = body;

    if (!yearMonth) {
      return NextResponse.json({ success: false, rows: [] });
    }

    // 날짜 범위
    const [yyyy, mm] = yearMonth.split("-");
    const fromStr = `${yyyy}-${mm}-01`;
    const lastDay = new Date(Number(yyyy), Number(mm), 0).getDate();
    const toStr = `${yyyy}-${mm}-${String(lastDay).padStart(2, "0")}`;

    const from = new Date(`${fromStr}T00:00:00.000Z`);
    const to = new Date(`${toStr}T23:59:59.999Z`);

    // DB 조회
    const result = await prisma.dailyWorkLog.findMany({
      where: {
        workDate: {
          gte: from,
          lte: to,
        },
      },
      select: {
        partnerId: true,
        workDate: true,
        qty: true,
      },
    });

    // ⭐ workDate → YYYY-MM-DD 로 변환
    const rows = result.map((row) => ({
      partnerId: row.partnerId,
      qty: row.qty,
      workDate: row.workDate.toISOString().slice(0, 10),
    }));

    return NextResponse.json({ success: true, rows });

  } catch (err) {
    console.error("list-month error:", err);
    return NextResponse.json({ success: false, rows: [] }, { status: 500 });
  }
}
