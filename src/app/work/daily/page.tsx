"use client";

import { useEffect, useState } from "react";

/* ================================
   타입 정의
================================ */
type Deposit = {
  expectedAmount: number;
};

type Partner = {
  id: number;
  partnerCode: string;
  partnerName: string;
  bizRegNo?: string;
  vatYn?: string;
  remark?: string;
  deposits?: Deposit[];
};

type DailyLog = {
  id: number;
  workDate: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
};

/* ================================
   페이지 시작
================================ */
export default function DailyWorkPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [workDate, setWorkDate] = useState("");
  const [qty, setQty] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  /* ========== 계산 ========== */
  const total =
    Number(unitPrice.replace(/,/g, "")) * Number(qty || 0);

  /* ========== 콤마 처리 함수 ========== */
  const formatComma = (val: string) => {
    if (!val) return "";
    return Number(val.replace(/,/g, "")).toLocaleString();
  };

  const handleUnitPriceChange = (value: string) => {
    const onlyNumber = value.replace(/[^\d]/g, "");
    setUnitPrice(formatComma(onlyNumber));
  };

  const handleQtyChange = (value: string) => {
    const onlyNumber = value.replace(/[^\d]/g, "");
    setQty(onlyNumber);
  };

  /* ========== 거래처 목록 조회 ========== */
  const loadPartners = async () => {
    const res = await fetch("/api/partners/list");
    const data = await res.json();
    if (data.success) setPartners(data.partners);
  };

  /* ========== 로그 목록 조회 ========== */
  const loadLogs = async (partnerId: number, from: string, to: string) => {
    const res = await fetch("/api/daily/list", {
      method: "POST",
      body: JSON.stringify({ partnerId, from, to }),
    });

    const data = await res.json();
    if (data.success) setLogs(data.logs);
  };

  /* ========== 최초 실행 ========== */
  useEffect(() => {
    loadPartners();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");

    setFromDate(`${yyyy}-${mm}-01`);
    setToDate(today.toISOString().slice(0, 10));
    setWorkDate(today.toISOString().slice(0, 10));
  }, []);

  /* ========== 거래처 선택 ========== */
  const onSelectPartner = (code: string) => {
    const p = partners.find((x) => x.partnerCode === code) || null;
    setSelectedPartner(p);
    setSelectedLogId(null);
    setQty("");

    if (p) {
      const lastPrice = p.deposits?.[0]?.expectedAmount ?? 0;
      setUnitPrice(lastPrice.toLocaleString());
      loadLogs(p.id, fromDate, toDate);
    }
  };

  /* ========== 행 클릭 → 수정 모드 ========== */
  const onClickLog = (log: DailyLog) => {
    setSelectedLogId(log.id);
    setWorkDate(log.workDate.slice(0, 10));
    setQty(String(log.qty));
    setUnitPrice(log.unitPrice.toLocaleString());
  };

  /* ========== 저장 (INSERT/UPDATE) ========== */
  const saveDaily = async () => {
    if (!selectedPartner) return alert("거래처를 선택하세요.");
    if (!workDate) return alert("일자를 입력하세요.");
    if (!qty) return alert("수량을 입력하세요.");

    const body = {
      id: selectedLogId,
      partnerId: selectedPartner.id,
      workDate,
      qty: Number(qty),
      unitPrice: Number(unitPrice.replace(/,/g, "")),
      totalAmount: total,
    };

    const res = await fetch("/api/daily/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success) {
      alert("저장되었습니다.");
      setSelectedLogId(null);
      setQty("");
      loadLogs(selectedPartner.id, fromDate, toDate);
    }
  };

  /* ========== 삭제 ========== */
  const deleteDaily = async () => {
    if (!selectedLogId) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await fetch("/api/daily/delete", {
      method: "POST",
      body: JSON.stringify({ id: selectedLogId }),
    });

    alert("삭제되었습니다.");
    setSelectedLogId(null);
    setQty("");

    if (selectedPartner)
      loadLogs(selectedPartner.id, fromDate, toDate);
  };

  /* ========== 신규 ========== */
  const resetForm = () => {
    const today = new Date().toISOString().slice(0, 10);

    setSelectedLogId(null);
    setWorkDate(today);
    setQty("");

    if (selectedPartner) {
      const lastPrice = selectedPartner?.deposits?.[0]?.expectedAmount ?? 0;
      setUnitPrice(lastPrice.toLocaleString());
    }
  };

  /* ================================
         UI 렌더링 시작
  ================================= */
  return (
    <div className="p-6 space-y-6">

      {/* =================== 상단 조건 =================== */}
      <div className="border p-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 flex flex-wrap gap-4 items-end">

        {/* 거래처 */}
        <div>
          <p className="font-semibold mb-1">거래처</p>
          <select
            value={selectedPartner?.partnerCode || ""}
            onChange={(e) => onSelectPartner(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">선택하세요</option>
            {partners.map((p) => (
              <option key={p.partnerCode} value={p.partnerCode}>
                {p.partnerName} ({p.partnerCode})
              </option>
            ))}
          </select>
        </div>

        {/* From */}
        <div>
          <p className="font-semibold mb-1">From</p>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        {/* To */}
        <div>
          <p className="font-semibold mb-1">To</p>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <button
          onClick={() =>
            selectedPartner && loadLogs(selectedPartner.id, fromDate, toDate)
          }
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          조회
        </button>
      </div>

      {/* =================== 입력 영역 =================== */}
      {selectedPartner && (
        <div className="border p-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 space-y-4">

          <div className="flex gap-4 flex-wrap">

            {/* 일자 */}
            <div>
              <p className="font-semibold mb-1">일자</p>
              <input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            {/* 수량 */}
            <div>
              <p className="font-semibold mb-1">수량</p>
              <input
                value={qty}
                onChange={(e) => handleQtyChange(e.target.value)}
                className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
                placeholder="수량 입력"
              />
            </div>

            {/* 단가 */}
            <div>
              <p className="font-semibold mb-1">단가</p>
              <input
                value={unitPrice}
                onChange={(e) => handleUnitPriceChange(e.target.value)}
                className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          <p className="text-xl font-bold">
            총액: {total.toLocaleString()}원
          </p>

          <div className="flex gap-3">
            <button
              onClick={saveDaily}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              저장하기
            </button>

            {selectedLogId && (
              <button
                onClick={deleteDaily}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                삭제하기
              </button>
            )}

            <button
              onClick={resetForm}
              className="bg-gray-300 text-black px-4 py-2 rounded dark:bg-gray-700 dark:text-white"
            >
              신규
            </button>
          </div>

        </div>
      )}

      {/* =================== 그리드 =================== */}
      {selectedPartner && (
        <div className="border p-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700">

          <h3 className="text-lg font-bold mb-4">일일 업무 기록</h3>

          {/* sum 계산 */}
          {(() => {
            var sumQty = logs.reduce((acc, cur) => acc + cur.qty, 0);
            var sumTotal = logs.reduce((acc, cur) => acc + cur.totalAmount, 0);

            return (
              <>
                {/* 그리드 */}
                <div className="max-h-[500px] overflow-y-auto border rounded-md">

                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                      <tr>
                        <th className="border p-2 dark:border-gray-700">일자</th>
                        <th className="border p-2 dark:border-gray-700">거래처명</th>
                        <th className="border p-2 dark:border-gray-700">사업자번호</th>
                        <th className="border p-2 text-center dark:border-gray-700">부가세</th>
                        <th className="border p-2 dark:border-gray-700">비고</th>
                        <th className="border p-2 text-right dark:border-gray-700">수량</th>
                        <th className="border p-2 text-right dark:border-gray-700">단가</th>
                        <th className="border p-2 text-right dark:border-gray-700">총액</th>
                      </tr>
                    </thead>

                    <tbody>
                      {logs.map((log) => (
                        <tr
                          key={log.id}
                          onClick={() => onClickLog(log)}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="border p-2 dark:border-gray-700">{log.workDate.slice(0, 10)}</td>
                          <td className="border p-2 dark:border-gray-700">{selectedPartner.partnerName}</td>
                          <td className="border p-2 dark:border-gray-700">{selectedPartner.bizRegNo ?? "-"}</td>
                          <td className="border p-2 text-center dark:border-gray-700">{selectedPartner.vatYn}</td>
                          <td className="border p-2 dark:border-gray-700">{selectedPartner.remark ?? "-"}</td>
                          <td className="border p-2 text-right dark:border-gray-700">{log.qty.toLocaleString()}</td>
                          <td className="border p-2 text-right dark:border-gray-700">{log.unitPrice.toLocaleString()}</td>
                          <td className="border p-2 text-right dark:border-gray-700">{log.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}

                      {logs.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center p-4 text-gray-400 dark:text-gray-500">
                            데이터 없음
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ================= 합계 행 ================= */}
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md flex justify-end gap-10 text-sm font-semibold">
                  <div>총 수량: {sumQty.toLocaleString()}</div>
                  <div>총 금액: {sumTotal.toLocaleString()} 원</div>
                </div>
              </>
            );
          })()}
        </div>
      )}

    </div>
  );
}
