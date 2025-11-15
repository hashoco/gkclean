"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/SectionTitle";

export default function CompanyPage() {
  return (
    <div className="pt-24">
      
      {/* HERO */}
      <section className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white lg:text-5xl">
            신뢰받는 B2B 세탁 파트너
            <span className="block mt-2 text-green-600">GKClean</span>
          </h1>

          <p className="mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            GKClean은 헬스장 · 필라테스 · 병원 · 호텔 · 피부관리실 등  
            다양한 업종의 매장을 대상으로  
            <strong className="text-green-600 font-semibold">정시 수거 · 위생 세탁 · 정시 배송</strong>을 제공하는  
            전문 B2B 세탁 서비스입니다.
          </p>
        </div>
      </section>

     

      {/* SERVICE DESCRIPTION */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <SectionTitle preTitle="Our Mission" title="GKClean이 중요하게 생각하는 가치">
          GKClean은 매장의 운영 시간을 절약하고, 고객에게 더 나은 서비스를 제공할 수 있도록  
          안정적인 세탁 프로세스를 구축해 제공합니다.
          정시 배송률, 위생 기준, 품질 관리 등 모든 과정을 철저하게 관리합니다.
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          <div className="p-6 rounded-xl shadow-md border bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">정시 수거 · 배송</h3>
            <p className="text-gray-600 dark:text-gray-300">
              매일 정해진 시간에 수거와 배송을 진행하며,
              내부 시스템으로 일정/물량을 정확하게 관리합니다.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md border bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">위생 기준 준수</h3>
            <p className="text-gray-600 dark:text-gray-300">
              업종별 특성에 맞춘 공정과 고온 살균 세탁으로
              안정적인 위생 품질을 제공합니다.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md border bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">전문 세탁 설비 운영</h3>
            <p className="text-gray-600 dark:text-gray-300">
              산업용 전문 장비로 대량 물량을 안정적으로 처리하며,
              품질 유지에 최적화된 장비 체계를 갖추고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <SectionTitle
          preTitle="Location"
          title="GKClean 본사 위치"
        >
          매장 방문 또는 물류 협의를 원하시는 경우 아래 위치로 오시면 됩니다.
          <br />
          <strong>경기도 시흥시 신천로104번길 30</strong>
        </SectionTitle>

        <div className="mt-10 rounded-2xl overflow-hidden shadow-xl border">
          <iframe
            src="https://www.google.com/maps?q=경기도%20시흥시%20신천로104번길%2030&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      </section>

      
    </div>
  );
}
