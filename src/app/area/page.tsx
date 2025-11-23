"use client";

import { SectionTitle } from "@/components/SectionTitle";

export default function AreaPage() {
  return (
    <div >

      {/* HERO */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white lg:text-5xl">
            GKClean 배송 지역 안내
          </h1>
          <p className="mt-5 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            현재 GKClean은 <strong className="text-green-600">서울 · 경기 서남권 중심</strong>으로  
            매일 정시 수거·배송 서비스를 운영하고 있습니다.  
            아래 지역은 당일 또는 예약 기반 배송이 가능합니다.
          </p>
        </div>
      </section>

      {/* 지역 리스트 */}
      <section className="container mx-auto px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-10">
          현재 서비스 중인 지역
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* 서울권 */}
          <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold text-green-600">서울권</h3>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
              <li>✔ 구로구</li>
              <li>✔ 양천구</li>
              <li>✔ 금천구</li>
            </ul>
          </div>

          {/* 경기 서남권 */}
          <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold text-green-600">수도권</h3>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
              <li>✔ 시흥시</li>
              <li>✔ 안산시</li>
              <li>✔ 광명시</li>
              <li>✔ 부천시</li>
              <li>✔ 안양시</li>
              <li>✔ 인천시</li>
            </ul>
          </div>

          {/* 협의 가능 지역 */}
          <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold text-green-600">이외</h3>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
              <li>기타 지역 협의가능</li>
            </ul>
          </div>

        </div>
      </section>

     

    </div>
  );
}
