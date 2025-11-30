import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { partnerCode: "asc" },
      include: {
        deposits: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ success: true, partners });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
