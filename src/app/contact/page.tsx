"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ⭐ 연락처 숫자만 + 자동 하이픈 포맷
  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, ""); // 숫자만 유지
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });

      if (res.ok) {
        setSuccess("발송되었습니다. 곧 담당자가 확인 후 연락드리겠습니다.");
        setName("");
        setPhone("");
        setMessage("");
      } else {
        setSuccess("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      setSuccess("서버 연결 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <SectionTitle preTitle="Contact" title="문의 방법 안내" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          {/* 전화 문의 */}
          <div className="p-8 border rounded-2xl shadow bg-white dark:bg-gray-800">
            <h3 className="text-2xl font-bold text-green-600">전화 문의</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              상담원이 즉시 응대해드립니다.
            </p>

            <a
              href="tel:01012341234"
              className="block mt-6 text-3xl font-extrabold text-gray-800 dark:text-white hover:text-green-600"
            >
              📞 010-1234-1234
            </a>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              평일 09:00 ~ 18:00 상담 가능
            </p>
          </div>

          {/* 이메일 문의 */}
          <div className="p-8 border rounded-2xl shadow bg-white dark:bg-gray-800">
            <h3 className="text-2xl font-bold text-green-600">이메일 문의</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              아래 정보를 입력해주시면 담당자가 확인 후 연락드립니다.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">

              {/* 이름 */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">이름</label>
                <input
                  type="text"
                  maxLength={20}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="홍길동"
                />
              </div>

              {/* 연락처 */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">연락처</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  maxLength={13} // 010-1234-5678
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="010-0000-0000"
                />
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">문의 내용</label>
                <textarea
                  required
                  value={message}
                  maxLength={500}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 h-32 resize-none"
                  placeholder="문의하실 내용을 입력해주세요."
                />
              </div>

              {/* 상태 메시지 */}
              {success && (
                <div className="text-green-600 font-semibold">{success}</div>
              )}

              {/* 전송 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
              >
                {loading ? "전송 중..." : "문의 접수하기"}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
