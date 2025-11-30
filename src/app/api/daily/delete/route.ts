

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.dailyWorkLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("daily/delete error:", e);
    return NextResponse.json({ success: false });
  }
}
