"use client";

import React from "react";
import Link from "next/link";
import { LayoutGrid, Home, ShoppingCart, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

interface MobileBottomBarProps {
  onCategoryClick?: () => void;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onCategoryClick }) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-secondary/10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        <button
          type="button"
          onClick={onCategoryClick}
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-secondary hover:text-primary transition-colors"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[11px] font-medium">ক্যাটাগরি</span>
        </button>

        <a
          href="https://wa.me/8809647132995"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-secondary hover:text-primary transition-colors"
        >
          <FaWhatsapp className="w-5 h-5" />
          <span className="text-[11px] font-medium">WhatsApp</span>
        </a>

        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-secondary hover:text-primary transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-medium">হোম</span>
        </Link>

        <Link
          href="/cart"
          className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-secondary hover:text-primary transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute top-1.5 right-[calc(50%-14px)] w-2 h-2 bg-primary rounded-full border border-white" />
          <span className="text-[11px] font-medium">কার্ট</span>
        </Link>

        <Link
          href="/login"
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-secondary hover:text-primary transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] font-medium">লগইন</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomBar;