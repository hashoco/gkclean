import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const last = await prisma.partner.findFirst({
      orderBy: { partnerCode: "desc" },
    });

    const nextCode = last
      ? String(Number(last.partnerCode) + 1).padStart(4, "0")
      : "0001";

    return NextResponse.json({ success: true, nextCode });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, nextCode: "0001" });
  }
}
