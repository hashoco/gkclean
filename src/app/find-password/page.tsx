"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FindPasswordPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await fetch("/api/find-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, email }),
    });

    const data = await res.json();

    if (!data.success) {
      setErrorMsg("해당 정보와 일치하는 계정을 찾을 수 없습니다.");
      return;
    }

    // userId를 URL에 담아서 reset 페이지로 이동
    router.push(`/reset-password?userId=${data.userId}`);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border rounded-2xl shadow-xl bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          비밀번호 찾기
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          <input
            type="email"
            placeholder="등록된 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
          />

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700"
          >
            다음 단계로 이동
          </button>
        </form>
      </div>
    </div>
  );
}
