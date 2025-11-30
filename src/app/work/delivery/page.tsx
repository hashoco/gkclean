"use client";

import { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [partnerCode, setPartnerCode] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [bizRegNo, setBizRegNo] = useState(""); 
  const [ownerName, setOwnerName] = useState(""); // ⭐ 대표자명 추가
  const [vatYn, setVatYn] = useState("Y");
  const [payerName, setPayerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [useYn, setUseYn] = useState("Y");

  const [searchName, setSearchName] = useState("");
  const [useFilter, setUseFilter] = useState("ALL");

  // ===================================
  // 1) 거래처 목록 조회
  // ===================================
  const loadPartners = async () => {
    setLoading(true);
    const res = await fetch("/api/partners/list");
    const data = await res.json();
    setLoading(false);

    if (data.success) setPartners(data.partners);
    else setPartners([]);
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // ===================================
  // 2) 거래처코드 채번
  // ===================================
  const getNextCode = async () => {
    const res = await fetch("/api/partners/next-code");
    const data = await res.json();
    return data.nextCode;
  };

  // ===================================
  // 3) 금액 콤마 처리
  // ===================================
  const formatComma = (value: string) => {
    if (!value) return "";
    return Number(value.replace(/,/g, "")).toLocaleString();
  };

  const handleAmountChange = (value: string) => {
    const onlyNumber = value.replace(/[^\d]/g, "");
    setExpectedAmount(formatComma(onlyNumber));
  };

  // ===================================
  // 4) 저장
  // ===================================
  const savePartner = async () => {
    let code = partnerCode.trim();
    if (!code) code = await getNextCode();

    const body = {
      partnerCode: code,
      partnerName,
      bizRegNo,
      ownerName,   // ⭐ 추가
      vatYn,
      payerName,
      phone,
      address,
      remark,
      expectedAmount: expectedAmount.replace(/,/g, ""),
      delYn: useYn === "Y" ? "N" : "Y",
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

  // ===================================
  // 5) 입력 초기화
  // ===================================
  const resetForm = () => {
    setPartnerCode("");
    setPartnerName("");
    setBizRegNo("");
    setOwnerName("");
    setVatYn("Y");
    setPayerName("");
    setPhone("");
    setAddress("");
    setRemark("");
    setExpectedAmount("");
    setUseYn("Y");
  };

  // ===================================
  // 6) Row 클릭
  // ===================================
  const onRowClick = (p: any) => {
    setPartnerCode(p.partnerCode);
    setPartnerName(p.partnerName);
    setBizRegNo(p.bizRegNo ?? "");
    setOwnerName(p.ownerName ?? ""); // ⭐ 대표자명
    setVatYn(p.vatYn ?? "Y");
    setPayerName(p.payerName ?? "");
    setPhone(p.phone ?? "");
    setAddress(p.address ?? "");
    setRemark(p.remark ?? "");
    setUseYn(p.delYn === "N" ? "Y" : "N");

    setExpectedAmount(
      p.deposits?.[0]?.expectedAmount
        ? formatComma(String(p.deposits[0].expectedAmount))
        : ""
    );
  };

  // ===================================
  // 7) 필터링
  // ===================================
  const filtered = partners
    .filter((p: any) =>
      !searchName.trim()
        ? true
        : p.partnerName.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((p: any) => {
      if (useFilter === "ALL") return true;
      if (useFilter === "Y") return p.delYn === "N";
      if (useFilter === "N") return p.delYn === "Y";
      return true;
    });

  return (
    <div className="p-6 grid grid-cols-[1fr_300px] gap-6 text-gray-900 dark:text-gray-100">

      {/* ================= 좌측 목록 ================= */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-md dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">거래처 목록</h2>

        {/* 검색 */}
        <div className="flex gap-3 mb-4">
          <input
            placeholder="거래처명 검색"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border p-2 rounded w-40 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <select
            value={useFilter}
            onChange={(e) => setUseFilter(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="ALL">전체</option>
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>
        </div>

        {/* 목록 */}
        <div className="overflow-auto max-h-[600px] border rounded dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
              <tr className="text-gray-900 dark:text-gray-100">
                <th className="border p-2 dark:border-gray-700">코드</th>
                <th className="border p-2 dark:border-gray-700">거래처명</th>
                <th className="border p-2 dark:border-gray-700">사업자번호</th>
                <th className="border p-2 dark:border-gray-700">대표자명</th>
                <th className="border p-2 text-center dark:border-gray-700">부가세</th>
                <th className="border p-2 dark:border-gray-700">입금자</th>
                <th className="border p-2 text-right dark:border-gray-700">단가</th>
                <th className="border p-2 text-center dark:border-gray-700">사용</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p: any) => (
                <tr
                  key={p.partnerCode}
                  onClick={() => onRowClick(p)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <td className="border p-2 dark:border-gray-700">{p.partnerCode}</td>
                  <td className="border p-2 dark:border-gray-700">{p.partnerName}</td>
                  <td className="border p-2 dark:border-gray-700">{p.bizRegNo ?? "-"}</td>
                  <td className="border p-2 dark:border-gray-700">{p.ownerName ?? "-"}</td>
                  <td className="border p-2 text-center dark:border-gray-700">{p.vatYn}</td>
                  <td className="border p-2 dark:border-gray-700">{p.payerName ?? "-"}</td>
                  <td className="border p-2 text-right dark:border-gray-700">
                    {p.deposits?.[0]?.expectedAmount
                      ? Number(p.deposits[0].expectedAmount).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border p-2 text-center dark:border-gray-700">
                    {p.delYn === "N" ? "Y" : "N"}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-400 dark:text-gray-500">
                    데이터 없음
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 우측 입력 ================= */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-md dark:border-gray-700">
        <h2 className="text-lg font-bold mb-3">거래처 등록/수정</h2>

        <div className="space-y-2">

          <input
            value={partnerCode}
            disabled
            placeholder="자동채번"
            className="border p-1.5 rounded w-full bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          />

          <input
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="거래처명"
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <input
            value={bizRegNo}
            onChange={(e) => setBizRegNo(e.target.value)}
            placeholder="사업자 등록번호"
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <input
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="대표자명"
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <select
            value={vatYn}
            onChange={(e) => setVatYn(e.target.value)}
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="Y">부가세 적용</option>
            <option value="N">부가세 미적용</option>
          </select>

          <input
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            placeholder="입금자명"
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호"
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소"
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="비고"
            className="border p-1.5 rounded w-full h-16 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <input
            value={expectedAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="단가"
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <select
            value={useYn}
            onChange={(e) => setUseYn(e.target.value)}
            className="border p-1.5 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>

          <button
            onClick={savePartner}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            저장하기
          </button>

          <button
            onClick={resetForm}
            className="w-full bg-gray-300 dark:bg-gray-700 text-black dark:text-gray-100 p-2 rounded"
          >
            신규등록
          </button>
        </div>
      </div>
    </div>
  );
}
