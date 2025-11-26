"use client";

import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import { Disclosure, Menu } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();

  const navigation = ["회사소개", "가격안내", "배송지역", "서비스문의"];

  // 업무지원 메뉴 리스트
  const workMenus = [
    { name: "근태관리", href: "/work/attendance" },
    { name: "배달관리", href: "/work/delivery" },
    { name: "고객관리", href: "/work/customer" },
  ];

  // 관리자 전용 메뉴
  if (session?.user?.isAdmin === "Y") {
    workMenus.push({ name: "관리자 설정", href: "/work/admin" });
  }

  return (
    <div className="w-full border-b border-gray-100 dark:border-gray-800">
      <nav className="container mx-auto flex items-center justify-between px-6 py-6 relative">

        {/* Left Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 cursor-pointer">
            GKClean
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex space-x-10 items-center">
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

            {/* 업무지원 메뉴 (로그인 상태일 때만 표시) */}
            {session && (
              <Menu as="div" className="relative">
                <Menu.Button className="text-lg text-gray-800 dark:text-gray-200 hover:text-green-600">
                  업무지원 ▾
                </Menu.Button>
                <Menu.Items className="absolute mt-2 right-0 bg-white dark:bg-gray-800 shadow-md rounded-md w-40 py-2 z-50">
                  {workMenus.map((item, idx) => (
                    <Menu.Item key={idx}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          className={`block px-4 py-2 text-sm ${active
                            ? "bg-gray-100 dark:bg-gray-700 text-green-600"
                            : "text-gray-800 dark:text-gray-200"
                            }`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            )}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 lg:space-x-6 pr-4">
          {/* 로그인 버튼 (로그인 안 했을 때만) */}
          {/* 로그인 상태일 때 인사 메시지 */}
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

          {/* 로그인 상태일 때 → 로그아웃 버튼 */}
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden lg:block text-gray-800 dark:text-gray-200 hover:text-green-600 text-lg"
            >
              로그아웃
            </button>
          )}


          {/* DarkMode */}
          <ThemeChanger />

          {/* Mobile Menu */}
          <Disclosure as="div" className="lg:hidden">
            {({ open, close }) => (
              <>
                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor">
                    {open ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md px-6 py-4 z-50">
                  {navigation.map((item, index) => (
                    <Link
                      key={index}
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

                  {/* 업무지원 (Mobile) */}
                  {session && (
                    <>
                      <p className="mt-3 mb-1 text-gray-800 dark:text-gray-200 font-semibold">
                        업무지원
                      </p>
                      {workMenus.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => close()}
                          className="block py-2 pl-3 text-gray-700 dark:text-gray-300 hover:text-green-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </>
                  )}

                  {/* 로그인 버튼 (Mobile) */}
                  {/* 로그인 상태일 때 인사 메시지 */}
                  {session && (
                    <span className="hidden lg:block text-gray-800 dark:text-gray-200 text-lg">
                      {session.user.name}님 반갑습니다.
                    </span>
                  )}

                  {!session && (
                    <Link
                      href="/login"
                      onClick={() => close()}
                      className="block py-3 mt-2 text-gray-800 dark:text-gray-200 hover:text-green-600"
                    >
                      로그인
                    </Link>
                  )}
                  {/* 모바일: 로그인 후 */}
                  {session && (
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
