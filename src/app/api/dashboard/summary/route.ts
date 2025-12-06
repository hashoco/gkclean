import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format, subMonths } from "date-fns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const today = new Date();
    const thisMonth = format(today, "yyyy-MM");
    const lastMonth = format(subMonths(today, 1), "yyyy-MM");

    // ⭐ 등록된 거래처 수 가져오기
    const partnerCount = await prisma.partner.count({
      where: { delYn: "N" },
    });

    // ───────────────────────────────
    // 모든 작업 로그 조회 (매출 계산용)
    // ───────────────────────────────
    const logs = await prisma.dailyWorkLog.findMany({
      include: {
        partner: {
          include: {
            deposits: true, // 단가 가져오기 위해 필요
          },
        },
      },
    });

    let thisTotal = 0;
    let lastTotal = 0;

    logs.forEach((row) => {
      const y = row.workDate.getFullYear();
      const m = String(row.workDate.getMonth() + 1).padStart(2, "0");
      const month = `${y}-${m}`;

      const partner = row.partner;

      // ⭐ 단가 계산
      const deposit = partner?.deposits?.[0];
      const unitPrice = deposit?.expectedAmount ?? 0;

      const storeType = partner?.storeType ?? "BAG";
      const qty = row.qty ?? 0;
      const deliveryFee = partner?.deliveryFee ?? 0;

      // ⭐ 매출 계산
      let sales = 0;
      if (storeType === "BAG") {
        sales = qty * unitPrice + deliveryFee;
      } else {
        sales = unitPrice + deliveryFee;
      }

      // ⭐ 당월 / 전월 매출 누적
      if (month === thisMonth) thisTotal += sales;
      if (month === lastMonth) lastTotal += sales;
    });

    // ⭐ 변화율 계산
    const calcChangeRate = (thisTotal: number, lastTotal: number) => {
      if (lastTotal === 0 && thisTotal === 0) return 0;
      if (lastTotal === 0 && thisTotal > 0) return 100;
      return Math.round(((thisTotal - lastTotal) / lastTotal) * 100);
    };

    const changeRate = calcChangeRate(thisTotal, lastTotal);

    return NextResponse.json({
      thisMonthSales: thisTotal,
      lastMonthSales: lastTotal,
      changeRate,
      partnerCount, // ⭐ 프론트에서 여기 사용
    });
  } catch (err) {
    console.error("summary ERROR:", err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
