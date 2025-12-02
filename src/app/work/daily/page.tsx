"use client";

import { useEffect, useState } from "react";

/* =========================================
    타입 정의
========================================= */
type Partner = {
  id: number;
  partnerCode: string;
  partnerName: string;
  delYn: string;
  storeType: string;
  unitPrice: number; // ⭐ 단가
};

type DailyCell = {
  partnerId: number;
  workDate: string;
  qty: number;
};

/* =========================================
    메인 페이지
========================================= */
export default function DailyWorkPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [yearMonth, setYearMonth] = useState("");

  const [days, setDays] = useState<string[]>([]);
  const [cells, setCells] = useState<DailyCell[]>([]);

  /* =========================================
      거래처 목록 로드 (단가 포함)
  ========================================== */
  const loadPartners = async () => {
    const res = await fetch("/api/partners/list");
    const data = await res.json();

    if (data.success) {
      const filtered = data.partners.filter((p: any) => p.delYn === "N");

      setPartners(
        filtered.map((p: any) => ({
          id: p.id,
          partnerCode: p.partnerCode,
          partnerName: p.partnerName,
          delYn: p.delYn,
          storeType: p.storeType,
          unitPrice: p.deposits?.[0]?.expectedAmount ?? 0, // ⭐ 최신 deposit 단가 매핑
        }))
      );
    }
  };

  /* =========================================
      yearMonth → 날짜 생성
  ========================================== */
  const generateDays = (ym: string) => {
    const [year, month] = ym.split("-").map(Number);
    const last = new Date(year, month, 0).getDate();

    const list: string[] = [];
    for (let d = 1; d <= last; d++) {
      const dd = String(d).padStart(2, "0");
      list.push(`${ym}-${dd}`);
    }
    return list;
  };

  /* =========================================
      월 전체 데이터 로드
  ========================================== */
  const loadMonthData = async (ym: string, partnerList: Partner[]) => {
    if (!ym || partnerList.length === 0) return;

    const res = await fetch("/api/daily/list-month", {
      method: "POST",
      body: JSON.stringify({ yearMonth: ym }),
    });

    const data = await res.json();

    const days = generateDays(ym);
    const map = new Map<string, number>();

    if (data.success) {
      data.rows.forEach((row: any) =>
        map.set(`${row.partnerId}_${row.workDate}`, row.qty)
      );
    }

    const fullCells: DailyCell[] = [];
    for (const d of days) {
      for (const p of partnerList) {
        const key = `${p.id}_${d}`;
        const qty = map.get(key) ?? 0;

        fullCells.push({ partnerId: p.id, workDate: d, qty });
      }
    }

    setCells(fullCells);
  };

  /* =========================================
      초기 실행
  ========================================== */
  useEffect(() => {
    loadPartners();

    const today = new Date();
    setYearMonth(today.toISOString().slice(0, 7));
  }, []);

  /* =========================================
      yearMonth 변경 시 자동 갱신
  ========================================== */
  useEffect(() => {
    if (!yearMonth || partners.length === 0) return;

    setDays(generateDays(yearMonth));
    loadMonthData(yearMonth, partners);
  }, [yearMonth, partners]);

  /* =========================================
      셀 수정
  ========================================== */
  const updateCell = (partnerId: number, workDate: string, value: string) => {
    const qty = Number(value.replace(/[^\d]/g, "")) || 0;

    setCells((prev) =>
      prev.map((c) =>
        c.partnerId === partnerId && c.workDate === workDate
          ? { ...c, qty }
          : c
      )
    );
  };

  /* =========================================
      방향키 이동 (기본 모드)
  ========================================== */
  const handleArrowKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    day: string,
    partnerId: number
  ) => {
    const rowIndex = days.indexOf(day);
    const colIndex = partners.findIndex((p) => p.id === partnerId);

    let nextRow = rowIndex;
    let nextCol = colIndex;

    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const isArrow = arrowKeys.includes(e.key);

    if (!isArrow) return;   // ⭐ 숫자 입력/백스페이스 등 정상입력 허용

    if (e.key === "ArrowUp") nextRow = Math.max(0, rowIndex - 1);
    if (e.key === "ArrowDown") nextRow = Math.min(days.length - 1, rowIndex + 1);
    if (e.key === "ArrowLeft") nextCol = Math.max(0, colIndex - 1);
    if (e.key === "ArrowRight")
      nextCol = Math.min(partners.length - 1, colIndex + 1);

    const nextId = `cell-${days[nextRow]}-${partners[nextCol].id}`;
    const nextEl = document.getElementById(nextId) as HTMLInputElement | null;

    if (nextEl) {
      e.preventDefault();  // ⭐ arrow key 이동만 막기
      nextEl.focus();
      nextEl.select();
    }
  };


  /* =========================================
      저장
  ========================================== */
  const saveMonth = async () => {
    if (cells.length === 0) return alert("저장할 데이터가 없습니다.");

    const res = await fetch("/api/daily/save-month", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        yearMonth,
        rows: cells,
      }),
    });

    const data = await res.json();
    if (data.success) alert("저장되었습니다.");
    else alert("저장 실패");
  };

  /* =========================================
      요일 계산
  ========================================== */
  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr).getDay();
    return ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"][d];
  };

  /* ⭐ 토요일 row 배경색 */
  const isSaturday = (dateStr: string) => new Date(dateStr).getDay() === 6;

  /* =========================================
      거래처별 월 합계
  ========================================== */
  const calcPartnerSum = (partnerId: number) =>
    cells
      .filter((c) => c.partnerId === partnerId)
      .reduce((acc, cur) => acc + cur.qty, 0);

  /* =========================================
      거래처별 금액 계산 (BAG / MONTH)
  ========================================== */
  const calcPartnerAmount = (partner: Partner) => {
    const sum = calcPartnerSum(partner.id);

    if (partner.storeType === "MONTH") {
      return partner.unitPrice; // 수량 무관
    }

    return sum * partner.unitPrice; // BAG
  };

  /* =========================================
      헤더 색상
  ========================================== */
  const headerBg = (storeType: string) => {
    if (storeType === "BAG") return "bg-blue-200";
    if (storeType === "MONTH") return "bg-green-200";
    return "bg-gray-100";
  };

  /* =========================================
      렌더링
  ========================================== */
  return (
    <div className="p-6 space-y-6">

      {/* ======== 조회 영역 ======== */}
      <div className="border p-4 rounded-lg bg-white flex items-end gap-4">
        <div>
          <p className="font-semibold mb-1">조회 월</p>
          <input
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={() => loadMonthData(yearMonth, partners)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          조회하기
        </button>

        <button
          onClick={saveMonth}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          저장하기
        </button>
      </div>

      {/* ======== 합계 / 금액 표시 ======== */}
      <div className="overflow-x-auto border rounded-lg bg-white p-4">
        <table className="min-w-max text-sm">
          <thead>
            <tr>
              <th className="border px-3 py-2 bg-gray-100 sticky left-0 z-20">
                거래처별 합계 / 금액
              </th>

              {partners.map((p) => (
                <th
                  key={p.id}
                  className={`border px-3 py-2 text-center ${headerBg(
                    p.storeType
                  )}`}
                >
                  {p.partnerName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border px-3 py-2 sticky left-0 bg-white font-semibold z-10">
                합계 / 금액
              </td>

              {partners.map((p) => {
                const sum = calcPartnerSum(p.id);
                const amount = calcPartnerAmount(p);

                return (
                  <td key={p.id} className="border px-3 py-2 text-right">
                    {sum.toLocaleString()} /{" "}
                    <span className="font-semibold">
                      {amount.toLocaleString()}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ======== 본 그리드 ======== */}
      <div className="overflow-auto border rounded-lg bg-white p-4">
        <table className="min-w-max border-collapse text-sm">
          <thead>
            <tr>
              <th className="border px-3 py-2 bg-gray-100 sticky left-0 z-20">
                일자
              </th>

              {partners.map((p) => (
                <th
                  key={p.id}
                  className={`border px-3 py-2 text-center ${headerBg(
                    p.storeType
                  )}`}
                >
                  {p.partnerName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map((day) => {
              const sat = isSaturday(day);
              const bg = sat ? "bg-[#f8e7c7]" : "bg-white";

              return (
                <tr key={day} className={bg}>
                  <td
                    className={`border px-3 py-2 sticky left-0 font-semibold z-10 ${sat ? "bg-[#f8e7c7]" : "bg-white"
                      }`}
                  >
                    {day} {getDayName(day)}
                  </td>

                  {partners.map((p) => {
                    const cell = cells.find(
                      (c) => c.partnerId === p.id && c.workDate === day
                    );

                    return (
                      <td key={`${p.id}_${day}`} className="border p-0">
                        <input
                          id={`cell-${day}-${p.id}`}
                          type="text"
                          value={cell?.qty ?? ""}
                          onChange={(e) =>
                            updateCell(p.id, day, e.target.value)
                          }
                          onKeyDown={(e) => handleArrowKey(e, day, p.id)}
                          className={`w-full p-2 text-right ${sat ? "bg-[#f8e7c7]" : "bg-white"
                            }`}
                          placeholder="0"
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
