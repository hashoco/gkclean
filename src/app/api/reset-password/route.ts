import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { userId, password } = await req.json();

    if (!userId || !password) {
      return NextResponse.json(
        { success: false, message: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 비밀번호 해시 생성
    const hashed = await bcrypt.hash(password, 10);

    // DB 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("비밀번호 재설정 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류 발생" },
      { status: 500 }
    );
  }
}
