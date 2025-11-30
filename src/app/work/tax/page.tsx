"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TaxInvoicePage() {
    const [month, setMonth] = useState(""); // yyyy-MM
    const [list, setList] = useState<any[]>([]);
    const sysdate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // 페이지 로드시: 기본 전월 세팅
    useEffect(() => {
        const today = new Date();
        today.setMonth(today.getMonth() - 1);

        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");

        setMonth(`${yyyy}-${mm}`);
    }, []);

    // 월 → 기간 변환
    const getMonthRange = (monthStr: string) => {
        const [yyyy, mm] = monthStr.split("-");
        const startDate = `${yyyy}-${mm}-01`;
        const lastDay = new Date(Number(yyyy), Number(mm), 0).getDate();
        const endDate = `${yyyy}-${mm}-${lastDay}`;
        return { startDate, endDate };
    };

    // 조회 버튼 클릭
    const loadData = async () => {
        if (!month) return alert("월을 선택하세요.");

        const { startDate, endDate } = getMonthRange(month);

        const res = await fetch("/api/tax/list", {
            method: "POST",
            body: JSON.stringify({ startDate, endDate }),
        });

        const data = await res.json();
        setList(data.list ?? []);
    };

    const downloadExcel = () => {
        if (!list || list.length === 0) {
            alert("다운로드할 데이터가 없습니다.");
            return;
        }

        const excelData = list.map((row) => ({
            "전자(세금계산서) 등록 종류": "01",
            "작성일자": sysdate,
            "공급자등록번호": "4236100897",        // ⭐ 여기는 너 회사 사업자등록번호 입력
            "공급자 종사업번호": "",
            "공급자상호": "GKClean",               // ⭐ 공급자 상호
            "공급자성명": "양정섭",               // ⭐ 공급자 상호
            "공급자 사업장주소": "",
            "공급자 업태": "",
            "공급자 종목": "",
            "공급자 이메일": "djena8637@naver.com",
            "공급받는자 등록번호": row.bizRegNo,
            "공급받는자 종사업번호": "",
            "공급받는자상호": row.partnerName,
            "공급받는자 성명": row.ownerName,
            "공급받는자 사업장주소": "",
            "공급받는자 업태": "",
            "공급받는자 종목": "",
            "공급받는자 이메일1": "",
            "공급받는자 이메일2": "",
            "공급가액 합계": row.totalAmount,
            "세액합계": row.taxAmount,
            "비고": "",

            // ===== 품목 1 =====
            "일자1": row.workDate,
            "품목1": "",
            "규격1": "",
            "수량1": "",
            "단가1": "",
            "공급가액1": row.totalAmount,
            "세액1": row.taxAmount,
            "품목비고1": "",

            // ===== 품목 2~4 (비어 있음) =====
            "일자2": "",
            "품목2": "",
            "규격2": "",
            "수량2": "",
            "단가2": "",
            "공급가액2": "",
            "세액2": "",
            "품목비고2": "",

            "일자3": "",
            "품목3": "",
            "규격3": "",
            "수량3": "",
            "단가3": "",
            "공급가액3": "",
            "세액3": "",
            "품목비고3": "",

            "일자4": "",
            "품목4": "",
            "규격4": "",
            "수량4": "",
            "단가4": "",
            "공급가액4": "",
            "세액4": "",
            "품목비고4": "",

            // 결제 정보
            "현금": "",
            "수표": "",
            "어음": "",
            "외상미수금": "",
            "영수(01)청구(02)": "02"
        }));

        // 워크시트 생성
        const ws = XLSX.utils.json_to_sheet(excelData);

        // 워크북 생성
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "세금계산서현황");

        // 바이너리 변환
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        // 파일 다운로드
        const fileName = `세금계산서_${month}.xlsx`;
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
    };


    return (
        <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">

            <h1 className="text-2xl font-bold mb-4">세금계산서 발행 현황 (엑셀)</h1>

            {/* ================= 조회 조건 ================ */}
            <div className="border p-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 flex items-end gap-4 flex-wrap">

                {/* 월 선택 */}
                <div>
                    <p className="font-semibold mb-1">조회 월</p>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
                    />
                </div>

                <button
                    onClick={loadData}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    조회
                </button>

                <button
                    onClick={downloadExcel}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    엑셀 다운로드
                </button>

            </div>

            {/* ================= 조회 결과 그리드 ================ */}
            <div className="border p-4 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700">

                <h2 className="text-lg font-bold mb-4">거래처별 매출 합계</h2>

                <div className="overflow-auto max-h-[600px]">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                            <tr>
                                <th className="border p-2 dark:border-gray-700">거래처명</th>
                                <th className="border p-2 dark:border-gray-700">사업자등록번호</th>
                                <th className="border p-2 dark:border-gray-700">대표자명</th>
                                <th className="border p-2 text-right dark:border-gray-700">공급가액 합계</th>
                                <th className="border p-2 text-right dark:border-gray-700">세액 합계</th>
                                <th className="border p-2 dark:border-gray-700">작성일자</th>
                            </tr>
                        </thead>

                        <tbody>
                            {list.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="border p-2 dark:border-gray-700">{row.partnerName}</td>
                                    <td className="border p-2 dark:border-gray-700">{row.bizRegNo}</td>
                                    <td className="border p-2 dark:border-gray-700">{row.ownerName}</td>
                                    <td className="border p-2 text-right dark:border-gray-700">
                                        {(row.totalAmount ?? 0).toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-right dark:border-gray-700">
                                        {(row.taxAmount ?? 0).toLocaleString()}
                                    </td>
                                    <td className="border p-2 dark:border-gray-700">{row.workDate}</td>
                                </tr>
                            ))}

                            {list.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center p-4 text-gray-400 dark:text-gray-500"
                                    >
                                        조회된 데이터 없음
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
