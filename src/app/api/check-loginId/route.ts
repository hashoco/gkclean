
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  const { loginId } = await req.json();
  const lowerId = loginId.toLowerCase();

  const exists = await prisma.user.findUnique({
    where: { loginId: lowerId },
  });

  return NextResponse.json({ exists: !!exists });
}
