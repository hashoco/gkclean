"use client";

import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import { Disclosure, Menu } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const navigation = ["회사소개", "가격안내", "배송지역", "서비스문의"];

  // === 업무지원 메뉴 (카테고리 + 항목) ===
  const workMenus = [
    {
      category: "업무지원 홈",
      items: [{ name: "대시보드", href: "/work/dashboard" }],
    },
    {
      category: "인사관리",
      items: [{ name: "근태관리", href: "/work/attendance" }],
    },
    {
      category: "공정관리",
      items: [{ name: "거래처관리", href: "/work/delivery" },
      { name: "일일업무일지", href: "/work/daily" },
      ],

    },
    {
      category: "회계관리",
      items: [{ name: "세금계산서현황(엑셀)", href: "/work/tax" }],

    },
  ];

  if (session?.user?.isAdmin === "Y") {
    workMenus.push({
      category: "관리자 기능",
      items: [{ name: "관리자 설정", href: "/work/admin" }],
    });
  }

  const toggleCategory = (cat: string) => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="w-full border-b border-gray-100 dark:border-gray-800">
      <nav className="container mx-auto flex items-center justify-between px-6 py-6 relative">

        {/* ===== Logo ===== */}
        <Link href="/">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 cursor-pointer">
            GKClean
          </span>
        </Link>

        {/* ===== Desktop Navigation ===== */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex space-x-10 items-center">

            {/* 기본 상단 메뉴 */}
            {navigation.map((menu, index) => (
              <li key={index}>
                <Link
                  href={
                    menu === "회사소개"
                      ? "/company"
                      : menu === "가격안내"
                        ? "/pricing"
                        : menu === "배송지역"
                          ? "/area"
                          : "/contact"
                  }
                  className="text-lg text-gray-800 dark:text-gray-200 hover:text-green-600"
                >
                  {menu}
                </Link>
              </li>
            ))}

            {/* ===== 업무지원 드롭다운 (아코디언 포함) ===== */}
            {session && (
              <Menu as="div" className="relative">
                <Menu.Button className="text-lg text-gray-800 dark:text-gray-200 hover:text-green-600 cursor-pointer font-semibold">
                  업무지원 ▾
                </Menu.Button>

                <Menu.Items
                  className="absolute mt-2 right-0
                           w-72 py-4
                           bg-white dark:bg-gray-900
                           shadow-2xl rounded-xl
                           border border-gray-200 dark:border-gray-700
                           animate-fadeIn z-50"
                >
                  {workMenus.map((group, idx) => (
                    <div key={idx} className="px-4">

                      {/* 카테고리 버튼 */}
                      <button
                        onClick={() => toggleCategory(group.category)}
                        className="w-full flex justify-between items-center
                                   text-left text-sm font-semibold
                                   text-gray-700 dark:text-gray-200
                                   py-3 px-3 mb-1
                                   rounded-lg
                                   hover:bg-gray-100 dark:hover:bg-gray-800
                                   transition-colors"
                      >
                        {group.category}
                        <span className="text-xs opacity-70">
                          {openCategory === group.category ? "▲" : "▼"}
                        </span>
                      </button>

                      {/* 펼칠 영역 */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${openCategory === group.category ? "max-h-48" : "max-h-0"
                          }`}
                      >
                        {group.items.map((item, subIdx) => (
                          <Menu.Item key={subIdx}>
                            {({ close }) => (
                              <Link
                                href={item.href}
                                onClick={() => close()}   // ★ 여기 추가됨 (드롭다운 자동 닫기)
                                className="block text-sm text-gray-600 dark:text-gray-300
                                          py-2 pl-6 pr-3
                                          rounded-md
                                          hover:text-green-600 hover:bg-green-50 
                                          dark:hover:bg-gray-800
                                          transition-colors"
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>

                      {/* 구분선 */}
                      {idx !== workMenus.length - 1 && (
                        <div className="my-3 border-b border-gray-200 dark:border-gray-700"></div>
                      )}
                    </div>
                  ))}
                </Menu.Items>
              </Menu>
            )}
          </ul>
        </div>

        {/* ===== Right (로그인/다크모드) ===== */}
        <div className="flex items-center space-x-4 lg:space-x-6 pr-4">

          {session && (
            <span className="hidden lg:block text-gray-800 dark:text-gray-200 text-lg">
              {session.user.name}님 반갑습니다.
            </span>
          )}

          {!session && (
            <Link
              href="/login"
              className="hidden lg:block text-gray-800 dark:text-gray-200 hover:text-green-600 text-lg"
            >
              로그인
            </Link>
          )}

          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden lg:block text-gray-800 dark:text-gray-200 hover:text-green-600 text-lg"
            >
              로그아웃
            </button>
          )}

          <ThemeChanger />

          {/* ===== Mobile Menu ===== */}
          <Disclosure as="div" className="lg:hidden">
            {({ open, close }) => (
              <>
                <Disclosure.Button className="p-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor">
                    {open ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md px-6 py-4 z-50">

                  {navigation.map((item, idx) => (
                    <Link
                      key={idx}
                      href={
                        item === "회사소개"
                          ? "/company"
                          : item === "가격안내"
                            ? "/pricing"
                            : item === "배송지역"
                              ? "/area"
                              : "/contact"
                      }
                      onClick={() => close()}
                      className="block py-3 text-gray-700 dark:text-gray-300 hover:text-green-600"
                    >
                      {item}
                    </Link>
                  ))}

                  {session && (
                    <>
                      <p className="mt-4 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
                        업무지원
                      </p>

                      {workMenus.map((group, idx) => (
                        <div key={idx} className="mb-2">
                          <button
                            onClick={() => toggleCategory(group.category)}
                            className="w-full flex justify-between items-center
                                       text-gray-800 dark:text-gray-200
                                       py-2 text-sm"
                          >
                            {group.category}
                            <span className="text-xs opacity-70">
                              {openCategory === group.category ? "▲" : "▼"}
                            </span>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${openCategory === group.category ? "max-h-40" : "max-h-0"
                              }`}
                          >
                            {group.items.map((item, subIdx) => (
                              <Link
                                key={subIdx}
                                href={item.href}
                                onClick={() => close()}
                                className="block py-1 pl-6 text-gray-700 dark:text-gray-300 hover:text-green-600"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {!session ? (
                    <Link
                      href="/login"
                      onClick={() => close()}
                      className="block py-3 text-gray-800 dark:text-gray-200 hover:text-green-600"
                    >
                      로그인
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        close();
                        signOut({ callbackUrl: "/" });
                      }}
                      className="block py-3 text-gray-800 dark:text-gray-200 hover:text-green-600 w-full text-left"
                    >
                      로그아웃
                    </button>
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </nav>
    </div>
  );
};
