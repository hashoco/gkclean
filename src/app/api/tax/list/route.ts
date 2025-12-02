import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startDate, endDate } = body;

    console.log("▶ 세금계산서 조회 기간:", startDate, "~", endDate);

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T23:59:59");

    // ============================================================
    // 1) 해당 월의 거래처별 qty 합계 조회
    // ============================================================
    const logs = await prisma.dailyWorkLog.groupBy({
      by: ["partnerId"],
      _sum: { qty: true },
      where: {
        workDate: { gte: start, lte: end },
      },
    });

    const partnerIds = logs.map((l) => l.partnerId);
    if (partnerIds.length === 0)
      return NextResponse.json({ list: [] });

    // ============================================================
    // 2) 파트너 정보 + 단가(Deposit 최신 1건) 조회
    // ============================================================
    const partners = await prisma.partner.findMany({
      where: { id: { in: partnerIds } },
      include: {
        deposits: {
          orderBy: { createdAt: "desc" },
          take: 1, // 최신 단가
        },
      },
    });

    // ============================================================
    // 3) 공급가액/세액 계산
    // ============================================================
    const result = logs.map((logRow) => {
      const partner = partners.find((p) => p.id === logRow.partnerId);

      if (!partner) return null;

      const qtySum = logRow._sum.qty ?? 0; // BAG 계산에 사용
      const expectedAmount = partner.deposits?.[0]?.expectedAmount ?? 0;
      const deliveryFee = partner.deliveryFee ?? 0;
      const vatYn = partner.vatYn ?? "N";        // Y or N
      const storeType = partner.storeType ?? ""; // BAG or MONTH

      let supplyAmount = 0;
      let taxAmount = 0;

      // ================================================
      //  🎯 공급가액 계산 분기
      // ================================================
      if (storeType === "MONTH") {
        // (월정액) 단가 + 기본요금
        supplyAmount = expectedAmount + deliveryFee;
      } else {
        // (마대) qty × 단가 + 기본요금
        supplyAmount = qtySum * expectedAmount + deliveryFee;
      }

      // ================================================
      //  🎯 세액 계산
      // ================================================
      if (vatYn === "Y") {
        taxAmount = Math.floor(supplyAmount * 0.1);
      } else {
        taxAmount = 0;
      }

      return {
        partnerId: partner.id,
        partnerName: partner.partnerName,
        bizRegNo: partner.bizRegNo ?? "",
        ownerName: partner.ownerName ?? "",
        totalAmount: supplyAmount,
        taxAmount: taxAmount,
        workDate: startDate, // 조회 월의 1일로 세금계산서 작성
      };
    });

    return NextResponse.json({ list: result.filter(Boolean) });
  } catch (err) {
    console.error("❌ /api/tax/list ERROR:", err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
