import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const year = now.getFullYear();

    const start = new Date(year, 0, 1);   // 1월 1일
    const end = new Date(year + 1, 0, 1); // 다음해 1월 1일

    // ⭐ 당년 전체 로그 조회
    const logs = await prisma.dailyWorkLog.findMany({
      where: {
        workDate: { gte: start, lt: end },
      },
      include: {
        partner: {
          include: { deposits: true },
        },
      },
    });

    const map: Record<string, number> = {};

    logs.forEach((log) => {
      const partner = log.partner;
      const name = partner.partnerName;

      // 단가 = PartnerDeposit
      const unit = partner?.deposits?.[0]?.expectedAmount ?? 0;
      const deliveryFee = partner.deliveryFee ?? 0;

      const qty = log.qty ?? 0;
      const storeType = partner.storeType ?? "BAG";

      let sales = 0;

      if (storeType === "BAG") {
        sales = qty * unit + deliveryFee;
      } else {
        sales = unit + deliveryFee;
      }

      if (!map[name]) map[name] = 0;
      map[name] += sales;
    });

    // 결과 변환
    const result = Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("partners/year ERROR:", err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
