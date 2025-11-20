"use client";

import { SectionTitle } from "@/components/SectionTitle";

export default function PricingPage() {
  return (
    <div>

      {/* PRICING TABLE ONLY */}
      <section className="container mx-auto px-6 lg:px-8 py-20">

        <SectionTitle
          preTitle="Pricing"
          title="업종별 정액제 패키지 안내"
        >
          GKClean은 업종별 운영 특성을 분석하여 가장 효율적인 월 정액제를 제공합니다.
          <br />
          가격은 기준 물량에 따라 조정되며, 매장별 맞춤 견적도 가능합니다.
        </SectionTitle>

        {/* PRICING TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">

          {/* 헬스장 */}
          <div className="border rounded-2xl shadow-md p-8 bg-white dark:bg-gray-800 hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">헬스장</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">수건 · 운동복 · 대량 물량 매장</p>

            <p className="mt-6 text-4xl font-extrabold text-green-600">40,000원~</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">월 요금 (기준 물량 기준)</p>

            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-6"></div>

            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li>✔ 정시 수거 · 배송</li>
              <li>✔ 고온 살균 세탁</li>
              <li>✔ 개별 포장 제공</li>
              <li>✔ 물량 분석 · 운영 최적화</li>
            </ul>
          </div>

          {/* 미용실 */}
          <div className="border rounded-2xl shadow-md p-8 bg-white dark:bg-gray-800 hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">미용실</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">수건 중심, 잦은 교체 필요 업종</p>

            <p className="mt-6 text-4xl font-extrabold text-green-600">40,000원~</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">월 요금 (기준 물량 기준)</p>

            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-6"></div>

            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li>✔ 정시 수거 · 배송</li>
              <li>✔ 업종별 위생 공정 적용</li>
              <li>✔ 비용 최적화 설계</li>
              <li>✔ 월간 물량 리포트 제공</li>
            </ul>
          </div>

          {/* 에스테틱 / 피부관리샵 */}
          <div className="border rounded-2xl shadow-md p-8 bg-white dark:bg-gray-800 hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">에스테틱 · 피부관리샵</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">시트 · 가운 등 고위생 기준 필요 업종</p>

            <p className="mt-6 text-4xl font-extrabold text-green-600">45,000원~</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">월 요금 (기준 물량 기준)</p>

            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-6"></div>

            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li>✔ 고온 살균 공정</li>
              <li>✔ 개별 포장 · 검수</li>
              <li>✔ 업종별 세탁 기준 준수</li>
              <li>✔ 빠른 피드백 운영 지원</li>
            </ul>
          </div>

        </div>

      </section>
    </div>
  );
}
