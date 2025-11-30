import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { yearMonth, rows } = body;

    if (!yearMonth || !rows) {
      return NextResponse.json({ success: false });
    }

    // ==========================================================
    // ⚠️ yearMonth 보정 처리 (YYYY-MM-DD → YYYY-MM 로 잘라내기)
    // ==========================================================
    // yearMonth = "2025-11" 또는 "2025-11-01" 둘 다 허용
    if (yearMonth.length >= 7) {
      yearMonth = yearMonth.slice(0, 7); // "YYYY-MM"만 남기기
    }

    // ==========================================================
    // 날짜 범위 계산 (해당 월 전체)
    // ==========================================================
    const [yyyy, mm] = yearMonth.split("-");

    const fromStr = `${yyyy}-${mm}-01`;
    const lastDay = new Date(Number(yyyy), Number(mm), 0).getDate();
    const toStr = `${yyyy}-${mm}-${String(lastDay).padStart(2, "0")}`;

    // Prisma DateTime 형식으로 변환
    const from = new Date(`${fromStr}T00:00:00.000Z`);
    const to = new Date(`${toStr}T23:59:59.999Z`);

    // ==========================================================
    // 1) 기존 데이터 삭제
    // ==========================================================
    await prisma.dailyWorkLog.deleteMany({
      where: {
        workDate: {
          gte: from,
          lte: to,
        },
      },
    });

    // ==========================================================
    // 2) 신규 데이터 생성
    // ==========================================================
    const insertRows = rows
      .filter((r: any) => r.qty && Number(r.qty) > 0) // 수량 없는 행은 저장 제외
      .map((r: any) => ({
        partnerId: r.partnerId,
        qty: Number(r.qty),
        workDate: new Date(`${r.workDate}T00:00:00.000Z`),
        unitPrice: 0,
        totalAmount: 0,
      }));

    if (insertRows.length > 0) {
      await prisma.dailyWorkLog.createMany({
        data: insertRows,
      });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("save-month error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
