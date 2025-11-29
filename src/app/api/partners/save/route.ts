import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      partnerCode,
      partnerName,
      vatYn,
      payerName,
      phone,
      address,
      remark,
      expectedAmount,
    } = body;

    // 존재 여부 확인
    let partner = await prisma.partner.findUnique({
      where: { partnerCode },
    });

    if (!partner) {
      // 신규 INSERT
      partner = await prisma.partner.create({
        data: {
          partnerCode,
          partnerName,
          vatYn,
          payerName,
          phone,
          address,
          remark,
        },
      });
    } else {
      // 수정 UPDATE
      partner = await prisma.partner.update({
        where: { partnerCode },
        data: {
          partnerName,
          vatYn,
          payerName,
          phone,
          address,
          remark,
        },
      });
    }

    // === 입금예정액 히스토리 저장 ===
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
    return NextResponse.json({ success: false });
  }
}
