"use client";

import { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== 입력폼 =====
  const [partnerCode, setPartnerCode] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [vatYn, setVatYn] = useState("Y");
  const [payerName, setPayerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");

  // ★ 추가된 상태값
  const [useYn, setUseYn] = useState("Y"); // Y=사용, N=미사용

  // ===== 조회 조건 =====
  const [searchName, setSearchName] = useState("");
  const [useFilter, setUseFilter] = useState("ALL"); // ALL/Y/N

  // ===============================
  // 1) 거래처 목록 조회
  // ===============================
  const loadPartners = async () => {
    setLoading(true);
    const res = await fetch("/api/partners/list");
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setPartners(data.partners);
    } else {
      setPartners([]);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // ===============================
  // 2) 신규코드 채번
  // ===============================
  const getNextCode = async () => {
    const res = await fetch("/api/partners/next-code");
    const data = await res.json();
    return data.nextCode;
  };

  // ===============================
  // 3) 저장
  // ===============================
  const savePartner = async () => {
    let code = partnerCode.trim();

    if (!code) {
      code = await getNextCode();
    }

    const body = {
      partnerCode: code,
      partnerName,
      vatYn,
      payerName,
      phone,
      address,
      remark,
      expectedAmount,
      delYn: useYn === "Y" ? "N" : "Y", // ★ 핵심 변환
    };

    const res = await fetch("/api/partners/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (result.success) {
      alert("저장되었습니다.");
      resetForm();
      loadPartners();
    } else {
      alert("저장 실패");
    }
  };

  // ===============================
  // 4) form reset
  // ===============================
  const resetForm = () => {
    setPartnerCode("");
    setPartnerName("");
    setVatYn("Y");
    setPayerName("");
    setPhone("");
    setAddress("");
    setRemark("");
    setExpectedAmount("");
    setUseYn("Y");
  };

  // ===============================
  // 5) row 클릭 → 입력폼 채우기
  // ===============================
  const onRowClick = (p: any) => {
    setPartnerCode(p.partnerCode);
    setPartnerName(p.partnerName);
    setVatYn(p.vatYn ?? "Y");
    setPayerName(p.payerName ?? "");
    setPhone(p.phone ?? "");
    setAddress(p.address ?? "");
    setRemark(p.remark ?? "");

    setUseYn(p.delYn === "N" ? "Y" : "N");

    setExpectedAmount(
      p.deposits?.[0]?.expectedAmount?.toString() ?? ""
    );
  };

  // ===============================
  // 6) 조회조건 필터
  // ===============================
  const filtered = partners
    .filter((p: any) => {
      if (!searchName) return true;
      return p.partnerName.includes(searchName);
    })
    .filter((p: any) => {
      if (useFilter === "ALL") return true;
      if (useFilter === "Y") return p.delYn === "N"; // 사용중
      if (useFilter === "N") return p.delYn === "Y"; // 미사용
      return true;
    });

  return (
    <div className="p-6 grid grid-cols-[1fr_300px] gap-6">

      {/* ==================== 좌측 목록 ==================== */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-bold mb-4">거래처 목록</h2>

        <div className="flex gap-3 mb-4">
          <input
            placeholder="거래처명 검색"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border p-2 rounded w-40"
          />

          <select
            value={useFilter}
            onChange={(e) => setUseFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="ALL">전체</option>
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>
        </div>

        <div className="overflow-auto max-h-[600px] border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">코드</th>
                <th className="border p-2">거래처명</th>
                <th className="border p-2">부가세</th>
                <th className="border p-2">입금자</th>
                <th className="border p-2">최근 입금예정액</th>
                <th className="border p-2">사용여부</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p: any) => (
                <tr
                  key={p.partnerCode}
                  onClick={() => onRowClick(p)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="border p-2">{p.partnerCode}</td>
                  <td className="border p-2">{p.partnerName}</td>
                  <td className="border p-2">{p.vatYn}</td>
                  <td className="border p-2">{p.payerName ?? "-"}</td>

                  <td className="border p-2">
                    {p.deposits?.[0]?.expectedAmount
                      ? Number(p.deposits[0].expectedAmount).toLocaleString()
                      : "-"}
                  </td>

                  <td className="border p-2">
                    {p.delYn === "N" ? "사용" : "미사용"}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    데이터 없음
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== 우측 입력폼 ==================== */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-bold mb-3">거래처 등록/수정</h2>

        <div className="space-y-3">
          <input
            value={partnerCode}
            disabled
            placeholder="자동채번"
            className="border p-2 rounded w-full bg-gray-100"
          />

          <input
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="거래처명"
            className="border p-2 rounded w-full"
          />

          <select
            value={vatYn}
            onChange={(e) => setVatYn(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Y">부가세 적용</option>
            <option value="N">부가세 미적용</option>
          </select>

          <input
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            placeholder="입금자명"
            className="border p-2 rounded w-full"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호"
            className="border p-2 rounded w-full"
          />

          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소"
            className="border p-2 rounded w-full"
          />

          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="비고"
            className="border p-2 rounded w-full h-20"
          />

          {/* ★ 사용여부 UI */}
          <select
            value={useYn}
            onChange={(e) => setUseYn(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>

          <input
            type="number"
            value={expectedAmount}
            onChange={(e) => setExpectedAmount(e.target.value)}
            placeholder="입금예정액"
            className="border p-2 rounded w-full"
          />

          <button
            onClick={savePartner}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            저장하기
          </button>

          <button
            onClick={resetForm}
            className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
          >
            신규등록
          </button>
        </div>
      </div>
    </div>
  );
}
