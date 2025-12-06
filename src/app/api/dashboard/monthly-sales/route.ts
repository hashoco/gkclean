import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format, subMonths } from "date-fns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const today = new Date();

    // 최근 12개월 key 배열 생성
    const months: { key: string; amount: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const d = subMonths(today, i);
      const key = format(d, "yyyy-MM");
      months.push({ key, amount: 0 });
    }

    // 모든 로그 가져오기
    const logs = await prisma.dailyWorkLog.findMany({
      include: {
        partner: { include: { deposits: true } },
      },
    });

    logs.forEach((row) => {
      const y = row.workDate.getFullYear();
      const m = String(row.workDate.getMonth() + 1).padStart(2, "0");
      const monthKey = `${y}-${m}`;

      const target = months.find((m) => m.key === monthKey);
      if (!target) return;

      const partner = row.partner;
      const deposit = partner?.deposits?.[0]?.expectedAmount ?? 0;
      const deliveryFee = partner?.deliveryFee ?? 0;
      const qty = row.qty ?? 0;
      const storeType = partner?.storeType ?? "BAG";

      let sales = 0;
      if (storeType === "BAG") sales = qty * deposit + deliveryFee;
      else sales = deposit + deliveryFee;

      target.amount += sales;
    });

    // 최신순으로 정렬 + key → month 로 변경
    const result = months.reverse().map((m) => ({
      month: m.key,
      amount: m.amount,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("monthly-sales ERROR:", err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
