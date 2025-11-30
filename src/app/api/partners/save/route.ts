import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      partnerCode,
      partnerName,
      bizRegNo,
      ownerName,   // ⭐ 추가됨
      vatYn,
      payerName,
      phone,
      address,
      remark,
      expectedAmount,
      delYn,
    } = body;

    let partner = await prisma.partner.findUnique({
      where: { partnerCode },
    });

    if (!partner) {
      // 신규
      partner = await prisma.partner.create({
        data: {
          partnerCode,
          partnerName,
          bizRegNo,
          ownerName,
          vatYn,
          payerName,
          phone,
          address,
          remark,
          delYn,
        },
      });
    } else {
      // 수정
      partner = await prisma.partner.update({
        where: { partnerCode },
        data: {
          partnerName,
          bizRegNo,
          ownerName,
          vatYn,
          payerName,
          phone,
          address,
          remark,
          delYn,
        },
      });
    }

    // 단가 저장 (입금예정액)
    if (expectedAmount && Number(expectedAmount) > 0) {
      await prisma.partnerDeposit.create({
        data: {
          partnerId: partner.id,
          expectedAmount: Number(expectedAmount),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
