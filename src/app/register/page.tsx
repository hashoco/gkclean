"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  // 입력값 상태
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 메시지 상태
  const [errorMsg, setErrorMsg] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);

  // ------------------------------
  // 아이디 중복 확인 API
  // ------------------------------
  const checkLoginId = async () => {
    if (!loginId) return;

    const res = await fetch("/api/check-loginId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId }),
    });

    const data = await res.json();
    setIsIdAvailable(!data.exists);
  };

  // ------------------------------
  // 유효성 검사
  // ------------------------------

  const idRegex = /^[a-zA-Z0-9]{4,20}$/;
  const nameRegex = /^[a-zA-Z가-힣0-9]{2,20}$/;
  const pwRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = async () => {
    if (!idRegex.test(loginId)) {
      setErrorMsg("아이디는 영어 또는 숫자 4~20자로 입력해주세요.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setErrorMsg("올바른 이메일 형식이 아닙니다.");
      return false;
    }

    if (!nameRegex.test(name)) {
      setErrorMsg("이름은 2~20자의 한글/영문/숫자로 입력해주세요.");
      return false;
    }

    if (!pwRegex.test(password)) {
      setErrorMsg(
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
      );
      return false;
    }

    if (password !== passwordCheck) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return false;
    }

    // 아이디 중복 체크 필수
    const res = await fetch("/api/check-loginId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId }),
    });
    const data = await res.json();

    if (data.exists) {
      setErrorMsg("이미 사용 중인 아이디입니다.");
      return false;
    }

    return true;
  };

  // ------------------------------
  // 회원가입 요청
  // ------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const isValid = await validateForm();
    if (!isValid) return;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loginId,
        email,
        name,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "회원가입에 실패했습니다.");
      return;
    }
alert("회원가입이 완료되었습니다!");

    router.push("/login");
  };

  // ------------------------------
  // JSX (UI)
  // ------------------------------
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border rounded-2xl shadow-xl bg-white dark:bg-gray-900">

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          회원가입
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* 아이디 */}
          <div>
            <input
              type="text"
              placeholder="아이디 (영문/숫자 4~20자)"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              onBlur={checkLoginId}
              className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
            {isIdAvailable === false && (
              <p className="text-red-500 text-sm mt-1">이미 사용 중인 아이디입니다.</p>
            )}
            {isIdAvailable === true && (
              <p className="text-green-600 text-sm mt-1">사용 가능한 아이디입니다.</p>
            )}
          </div>

          {/* 이메일 */}
          <input
            type="email"
            placeholder="이메일 (비밀번호 찾기용)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {/* 이름 */}
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호 (대문자/소문자/숫자/특수문자 포함 8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {/* 비밀번호 확인 */}
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {/* 에러 메시지 */}
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700"
          >
            회원가입
          </button>
        </form>

        {/* 아래 링크 */}
        <div className="mt-6 text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-green-600 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
