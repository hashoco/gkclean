import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

export function Footer() {
  const menu = [
    { name: "서비스 소개", href: "/about" },
    { name: "요금 안내", href: "/pricing" },
    { name: "이용 가이드", href: "/guide" },
    { name: "파트너 신청", href: "/partner" }
  ];

  const policy = [
    { name: "이용약관", href: "/terms" },
    { name: "개인정보 처리방침", href: "/privacy" },
    { name: "고객센터", href: "/support" }
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-10 py-10">
      <Container>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">

          {/* 브랜드 정보 */}
          <div className="lg:col-span-2">
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

        </div>

        {/* copyright */}
        <div className="mt-10 text-sm text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} GK CLEAN. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
