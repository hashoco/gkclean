"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";

export default function DashboardPage() {
  // --- Mock Data ---
  const attendanceData = [
    { day: "월", hours: 4 },
    { day: "화", hours: 6 },
    { day: "수", hours: 5 },
    { day: "목", hours: 4 },
    { day: "금", hours: 7 },
  ];

  const salesData = [
    { month: "1월", amount: 120 },
    { month: "2월", amount: 150 },
    { month: "3월", amount: 180 },
    { month: "4월", amount: 140 },
    { month: "5월", amount: 200 },
    { month: "6월", amount: 190 },
  ];

  const partnerPie = [
    { name: "A 거래처", value: 40 },
    { name: "B 거래처", value: 25 },
    { name: "C 거래처", value: 20 },
    { name: "기타", value: 15 },
  ];

  const colors = ["#34d399", "#60a5fa", "#f472b6", "#fbbf24"];

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">업무지원 대시보드</h1>

      {/* ====================== KPI 카운터 ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI 1 */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">
            이번주 총 근무시간
          </h3>
          <p className="text-3xl font-bold mt-2">26시간</p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">
            이번달 예상 매출
          </h3>
          <p className="text-3xl font-bold mt-2">₩ 4,530,000</p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">
            등록된 거래처
          </h3>
          <p className="text-3xl font-bold mt-2">12곳</p>
        </div>
      </div>

      {/* ====================== 차트 3개 ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 근태현황 (막대차트) */}
        <div className="border p-5 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold mb-4">근태현황)</h2>

          <BarChart width={450} height={250} data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar dataKey="hours" fill="#34d399" radius={[5, 5, 0, 0]} />
          </BarChart>
        </div>

        {/* 매출현황 (라인차트) */}
        <div className="border p-5 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold mb-4">매출현황 (월별)</h2>

          <LineChart width={450} height={250} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="month" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </div>

        {/* 거래처 비중 (원형차트) */}
        <div className="border p-5 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold mb-4">거래처별 비중</h2>

          <PieChart width={400} height={300}>
            <Pie
              data={partnerPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {partnerPie.map((_, idx) => (
                <Cell key={idx} fill={colors[idx]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>
    </div>
  );
}
