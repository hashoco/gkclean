import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { partnerCode, useYn } = await req.json();

    await prisma.partner.update({
      where: { partnerCode },
      data: {
        delYn: useYn,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
