import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await prisma.dailyWorkLog.groupBy({
      by: ["partnerId"],
      _sum: { totalAmount: true },
    });

    const partners = await prisma.partner.findMany({
      select: { id: true, partnerName: true },
    });

    const map = Object.fromEntries(
      partners.map((p) => [p.id, p.partnerName])
    );

    const result = rows.map((r) => ({
      partner: map[r.partnerId],
      amount: r._sum.totalAmount ?? 0,
    }));

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
