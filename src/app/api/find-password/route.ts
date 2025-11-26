import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { loginId, email } = await req.json();

    if (!loginId || !email) {
      return NextResponse.json(
        { success: false, message: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const lowerId = loginId.toLowerCase();

    // DB에서 아이디 + 이메일 확인
    const user = await prisma.user.findFirst({
      where: {
        loginId: lowerId,
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false });
    }

    // 비밀번호 재설정 페이지로 이동할 수 있도록 userId 전달
    return NextResponse.json({
      success: true,
      userId: user.id,
    });
  } catch (error) {
    console.error("비밀번호 찾기 오류:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
