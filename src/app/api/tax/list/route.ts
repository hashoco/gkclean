import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startDate, endDate } = body;

    console.log("▶ 조회 기간:", startDate, "~", endDate);

    // 1) 파트너별 합계 조회
    const logs = await prisma.dailyWorkLog.groupBy({
      by: ["partnerId"],
      _sum: { totalAmount: true },
      where: {
        workDate: {
          gte: new Date(startDate + "T00:00:00"),
          lte: new Date(endDate + "T23:59:59"),
        }
      }
    });

    const partnerIds = logs.map(l => l.partnerId);

    // 2) 파트너 정보 조회
    const partners = await prisma.partner.findMany({
      where: { id: { in: partnerIds } }
    });

    // 3) 결과 매핑
    const result = logs.map(l => {
      const partner = partners.find(p => p.id === l.partnerId);
      const total = l._sum.totalAmount ?? 0;

      return {
        partnerId: l.partnerId,
        partnerName: partner?.partnerName ?? "",
        bizRegNo: partner?.bizRegNo ?? "",
        ownerName: partner?.ownerName ?? "",
        totalAmount: total,
        taxAmount: Math.floor(total * 0.1),
        workDate: startDate // 해당 월의 1일로 통일
      };
    });

    return NextResponse.json({ list: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
