"use client";



import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  YAxis
} from "recharts";
import { useEffect, useState } from "react";

/* ============================
      타입 정의 (백엔드 응답과 동일)
============================ */
type Summary = {
  thisMonthSales: number;
  lastMonthSales: number;
  changeRate: number; // 백엔드에서 제공하는 변화율 그대로 사용
  partnerCount: number;
};

type MonthlySales = {
  month: string;
  amount: number;
};

type PartnerPie = {
  name: string;
  value: number;
};

type Top5Partner = {
  partner: string;
  amount: number;
};

/* ============================
      헬퍼 함수
============================ */
const formatNumber = (v: number) => v?.toLocaleString() ?? "0";

const getBadgeColor = (diff: number) => {
  if (diff > 0) return "text-green-600 bg-green-100 border-green-300";
  if (diff < 0) return "text-red-600 bg-red-100 border-red-300";
  return "text-gray-600 bg-gray-100 border-gray-300";
};

// 길면 ... 처리 (예: 최대 10글자)
const trimLabel = (label: string, max = 10) =>
  label.length > max ? label.slice(0, max) + "…" : label;

// YAxis 커스텀 tick 컴포넌트
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fill="#666"
      fontSize="12"
    >
      {trimLabel(payload.value)}
    </text>
  );
};


export default function DashboardPage() {
  /* ============================
      상태값
  ============================ */
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [partnerPie, setPartnerPie] = useState<PartnerPie[]>([]);
  const [top5Partners, setTop5Partners] = useState<Top5Partner[]>([]);

  /* ============================
      데이터 로딩
  ============================ */
  useEffect(() => {
    async function load() {
      const s = await fetch("/api/dashboard/summary").then((r) => r.json());
      const m = await fetch("/api/dashboard/monthly-sales").then((r) => r.json());
      const p = await fetch("/api/dashboard/partners").then((r) => r.json());


      setSummary(s);
      setMonthlySales(m);
      setPartnerPie(p);

    }

    load();
  }, []);

  if (!summary) return <div className="p-6">Loading...</div>;

  /* ============================
      프론트 계산
============================ */

  // 전월 대비 절대 증감액 (차액)
  const salesDiff = summary.thisMonthSales - summary.lastMonthSales;

  // 변화율은 백엔드에서 제공하는 changeRate 사용
  const salesRate = summary.changeRate;

  const colors = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24"];

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">

      <h1 className="text-2xl font-bold mb-6">업무지원 대시보드</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* 매출 */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">전월 총 매출</h3>
          <p className="text-3xl font-bold mt-2">
            ₩ {formatNumber(summary.lastMonthSales)}
          </p>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-lg border text-sm font-semibold ${getBadgeColor(
              salesDiff
            )}`}
          >
            {salesDiff > 0 && "▲ "}
            {salesDiff < 0 && "▼ "}
            {salesRate}%
          </span>
        </div>

        {/* 이번달 매출 */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">당월 총 매출</h3>
          <p className="text-3xl font-bold mt-2">
            ₩ {formatNumber(summary.thisMonthSales)}
          </p>
        </div>

        {/* 거래처 수 */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">등록 거래처</h3>
          <p className="text-3xl font-bold mt-2">
            {summary.partnerCount} 곳
          </p>
        </div>
      </div>

      {/* 차트 2개 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* 라인차트 */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
          <h2 className="text-lg font-bold mb-4">월별 매출 추이</h2>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />

              <Tooltip
                formatter={(value: number) => formatNumber(value)}
                labelFormatter={(label) => `${label}`}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#60a5fa"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* Pie */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
          <h2 className="text-lg font-bold mb-4">거래처별 매출 비중(당년)</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={partnerPie}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                tickFormatter={(v) => `${v.toLocaleString()}원`}
              />

              <YAxis
                dataKey="name"
                type="category"
                width={140} // 이름 표시 영역 넓힘
                tick={<CustomYAxisTick />} // ⭐ 여기
              />

              <Tooltip
                formatter={(value, _, item: any) =>
                  `${item.payload.name} : ${Number(value).toLocaleString()}원`
                }
              />

              <Bar dataKey="value" fill="#60a5fa" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>


      </div>


    </div>
  );
}
