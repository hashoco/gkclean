import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { loginId, email, name, password } = await req.json();

    if (!loginId || !email || !name || !password) {
      return NextResponse.json(
        { error: "모든 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    const lowerLoginId = loginId.toLowerCase();

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "이메일 형식이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // loginId 중복
    const existingId = await prisma.user.findUnique({
      where: { loginId: lowerLoginId },
    });

    if (existingId) {
      return NextResponse.json(
        { error: "이미 사용 중인 아이디입니다." },
        { status: 400 }
      );
    }

    // email 중복
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        loginId: lowerLoginId,
        email,
        name,
        password: hashedPassword,
        isAdmin: "N",
      },
    });

    return NextResponse.json({ message: "회원가입 완료!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "서버 오류 발생" },
      { status: 500 }
    );
  }
}
