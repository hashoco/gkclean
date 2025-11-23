"use client";

import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import { Disclosure } from "@headlessui/react";

export const Navbar = () => {
  const navigation = ["회사소개", "가격안내", "배송지역", "서비스문의"];

  return (
    <div className="w-full border-b border-gray-100 dark:border-gray-800">
      <nav className="container mx-auto flex items-center justify-between px-6 py-6 relative">

        {/* Left - Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 cursor-pointer">
            GKClean
          </span>
        </Link>

        {/* Center Menu (Desktop Only) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex space-x-10">
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
          </ul>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3 lg:space-x-4">

          {/* Dark Mode */}
          <ThemeChanger />

          {/* Mobile Menu Toggle */}
          <Disclosure as="div" className="lg:hidden">
            {({ open, close }) => (
              <>
                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {open ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                {/* Mobile Menu */}
                <Disclosure.Panel className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md px-6 py-4 z-50">
                  {navigation.map((item, index) => (
                    <Link
                      key={index}
                      href={
                        item === "회사소개"
                          ? "/company"
                          : item === "가격안내"
                            ? "/pricing"
                            : "/contact"
                      }
                       onClick={() => close()}  
                      className="block py-3 text-gray-700 dark:text-gray-300 hover:text-green-600"
                    >
                      {item}
                    </Link>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </nav>
    </div>
  );
};
