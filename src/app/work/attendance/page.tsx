"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

// ========= 타입 =========
interface AttendanceRow {
  date: string;
  inTime: string;
  outTime: string;
  workCalc: string;
  hours: number;
  minutes: number;
}


export default function AttendancePage() {
  const [month, setMonth] = useState<string>(dayjs().format("YYYY-MM"));
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loadMessage, setLoadMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 페이지 로드시 조회
  useEffect(() => {
    fetchMonthData(month);
  }, [month]);

  // ========= 조회 =========
  const fetchMonthData = async (targetMonth: string) => {
    const res = await fetch("/api/attendance/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: targetMonth }),
    });

    const data = await res.json();

    if (data.success && data.rows.length > 0) {
      // 저장된 데이터 사용
      setLoadMessage("✔ 저장된 근태 데이터를 불러왔습니다.");

      const mapped = data.rows.map((d: any) => ({
        date: d.date,
        inTime: d.inTime,
        outTime: d.outTime,
        workCalc: d.workCalc,
        hours: d.hours,
        minutes: d.minutes,
      }));

      setRows(mapped);
    } else {
      // 기본값 생성
      setLoadMessage(
        "ℹ 이번 달 데이터가 없어 기본 근무시간(08:30~12:30)으로 생성되었습니다."
      );
      generateMonthData(targetMonth);
    }
  };

  // ========= 기본 데이터 생성 =========
  const generateMonthData = (targetMonth: string) => {
    const start = dayjs(targetMonth + "-01");
    const daysInMonth = start.daysInMonth();

    const newRows: AttendanceRow[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = start.date(i);
      const defaultIn = "08:30";
      const defaultOut = "12:30";

      const work = calcWorkTime(defaultIn, defaultOut);

      newRows.push({
        date: dateObj.format("YYYY-MM-DD"),
        inTime: defaultIn,
        outTime: defaultOut,
        workCalc: work.calc,
        hours: work.hours,
        minutes: work.minutes,
      });
    }

    setRows(newRows);
  };

  // ========= 근무시간 계산 =========
  const calcWorkTime = (inTime: string, outTime: string) => {
    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);

    let start = inH * 60 + inM;
    let end = outH * 60 + outM;
    if (end < start) end += 24 * 60;

    const total = end - start;
    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    return {
      calc: `${hours}:${minutes.toString().padStart(2, "0")}`,
      hours,
      minutes,
    };
  };

  // ========= 행 수정 =========
  const updateRow = (
    index: number,
    key: keyof AttendanceRow,
    value: string
  ) => {
    const updated = [...rows];
    (updated[index] as any)[key] = value;

    if (key === "inTime" || key === "outTime") {
      const work = calcWorkTime(updated[index].inTime, updated[index].outTime);
      updated[index].workCalc = work.calc;
      updated[index].hours = work.hours;
      updated[index].minutes = work.minutes;
    }

    setRows(updated);
  };

  // ========= 저장 =========
  const saveData = async () => {
    setIsSaving(true);

    const res = await fetch("/api/attendance/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, rows }),
    });

    setIsSaving(false);

    if (res.ok) {
      alert("근태 데이터가 저장되었습니다!");
      fetchMonthData(month); // 저장 후 다시 조회
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  // ========= 총합 =========
  const totalHours = rows.reduce((sum, r) => sum + r.hours, 0);
  const totalMinutes = rows.reduce((sum, r) => sum + r.minutes, 0);
  const finalHours = totalHours + Math.floor(totalMinutes / 60);
  const finalMinutes = totalMinutes % 60;

  return (
    <div className="container mx-auto py-10 px-4">
      {/* 제목 + 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">근태관리</h1>

        <button
          onClick={saveData}
          disabled={isSaving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {/* 월 선택 */}
      <div className="mb-3 flex items-center gap-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* 상태 메시지 */}
      {loadMessage && (
        <div className="mb-4 text-gray-700 dark:text-gray-300 text-sm">
          {loadMessage}
        </div>
      )}

      {/* 스크롤 테이블 */}
      <div className="overflow-y-auto max-h-[600px] border rounded-md shadow-sm">
        <table className="w-full border-collapse text-center">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr>
              <th className="border p-2 w-20">일자</th>
              <th className="border p-2 w-28">출근</th>
              <th className="border p-2 w-28">퇴근</th>
              <th className="border p-2 w-28">계산</th>
              <th className="border p-2 w-20">시간</th>
              <th className="border p-2 w-20">분</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => {
              const isSunday = dayjs(r.date).day() === 0;

              return (
                <tr key={i} className={isSunday ? "bg-yellow-100" : ""}>
                  <td className="border p-2">
                    {dayjs(r.date).format("MM월 DD일")}
                  </td>

                  <td className="border p-2">
                    <input
                      type="time"
                      value={r.inTime}
                      onChange={(e) => updateRow(i, "inTime", e.target.value)}
                      className="p-1 border rounded"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      type="time"
                      value={r.outTime}
                      onChange={(e) => updateRow(i, "outTime", e.target.value)}
                      className="p-1 border rounded"
                    />
                  </td>

                  <td className="border p-2">{r.workCalc}</td>
                  <td className="border p-2">{r.hours}</td>
                  <td className="border p-2">{r.minutes}</td>
                </tr>
              );
            })}

            {/* 총합 */}
            <tr className="bg-gray-100 font-bold">
              <td className="border p-2" colSpan={4}>
                총합
              </td>
              <td className="border p-2">{finalHours}</td>
              <td className="border p-2">{finalMinutes}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
