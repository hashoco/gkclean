import Link from "next/link";
import React from "react";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-10 py-10">
      <Container>

        {/* 가로 정렬 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* 브랜드 설명 */}
          <div>
            <Link href="/" className="flex items-center space-x-2 text-2xl font-semibold">
              <span>GK CLEAN</span>
            </Link>

            <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">
              GK CLEAN은 바쁜 일상 속에서도 깨끗함을 유지할 수 있도록  
              세탁 구독 서비스와 매장 맞춤형 케어 솔루션을 제공합니다.
              <br />
              매일 더 나은 편리함을 만드는 것이 우리의 목표입니다.
            </p>
          </div>

          {/* 회사 정보 (오른쪽에 배치됨) */}
          <div className="flex flex-col justify-center text-gray-500 dark:text-gray-400 text-sm leading-relaxed lg:items-end">
            <p>📍 주소: 경기도 시흥시 신천동 570-1</p>
            <p>👤 대표: 양정섭</p>
            <p>📞 연락처: 010-6212-2272</p>
          </div>

        </div>

        {/* copyright */}
        <div className="mt-10 text-sm text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} GK CLEAN. All rights reserved.
        </div>

      </Container>
    </footer>
  );
}
