"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CategoryItem {
  label: string;
  href: string;
}

const categories: CategoryItem[] = [
  { label: "নতুন পণ্য", href: "/category/new-arrivals" },
  { label: "জন্মদিনের গিফট", href: "/category/birthday" },
  { label: "কাপল গিফট", href: "/category/couple" },
  { label: "কাস্টমাইজড আইটেম", href: "/category/customized" },
  { label: "হোম ডেকোর", href: "/category/home-decor" },
  { label: "চকোলেট ও হ্যাম্পার", href: "/category/hampers" },
  { label: "মগ ও ফটো ফ্রেম", href: "/category/mugs-frames" },
  { label: "সব পণ্য", href: "/category/all" },
];

const CategoryNavbar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("");

  return (
    <div className="hidden lg:block bg-secondary">
      <div className="px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {categories.map((item) => {
            const isActive = activeCategory === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setActiveCategory(item.label)}
                className={`shrink-0 px-3.5 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? "text-accent border-accent"
                    : "text-secondary-foreground/85 border-transparent hover:text-accent hover:border-accent/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavbar;