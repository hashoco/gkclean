"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      loginId,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border rounded-2xl shadow-xl bg-white dark:bg-gray-900">

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          GKClean 로그인
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* 로그인 아이디 */}
          <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {/* 에러 메시지 */}
          {errorMsg && (
            <p className="text-red-500 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700"
          >
            로그인
          </button>
        </form>

        {/* 회원가입 / 비밀번호 찾기 구역 */}
        <div className="mt-6 flex justify-between text-sm">
          <Link href="/register" className="text-green-600 hover:underline">
            회원가입
          </Link>

          <Link href="/find-password" className="text-green-600 hover:underline">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
