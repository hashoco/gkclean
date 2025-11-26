"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const pwRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!userId) {
      setErrorMsg("잘못된 접근입니다.");
      return;
    }

    if (!pwRegex.test(password)) {
      setErrorMsg(
        "비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다."
      );
      return;
    }

    if (password !== passwordCheck) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setErrorMsg("비밀번호 변경에 실패했습니다.");
      return;
    }

    alert("비밀번호가 성공적으로 변경되었습니다!");
    router.push("/login");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border rounded-2xl shadow-xl bg-white dark:bg-gray-900">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          비밀번호 재설정
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
}
