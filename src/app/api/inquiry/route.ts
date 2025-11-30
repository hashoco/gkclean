

import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { name, phone, message } = await req.json();

    // 1) DB 저장
    await prisma.inquiry.create({
      data: {
        name,
        phone,
        subject: "GKClean 세탁 서비스 문의",
        message,
      },
    });

    // 2) 이메일 발송
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, // 본인에게 알림
      subject: `[GKClean 문의 접수] ${name}님`,
      text: `
새로운 문의가 접수되었습니다.

이름: ${name}
연락처: ${phone}

문의내용:
${message}

- GKClean 시스템 자동 발송
`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("문의 처리 실패:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}
