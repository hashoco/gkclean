"use client";

import React from "react";
import Link from "next/link";

export function PopupWidget() {
  return (
    <div>
      <Link
        href="/contact"
        className="fixed z-40 flex items-center justify-center px-5 py-3 text-white font-semibold transition duration-300 bg-green-500 rounded-full shadow-lg right-5 bottom-5 hover:bg-green-600 focus:bg-green-600 focus:outline-none"
      >
        서비스 문의하기
      </Link>
    </div>
  );
}
