"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Phone, Truck } from "lucide-react";

const infoItems: string[] = [
  "ফ্রি ডেলিভারি",
  "ক্যাশ অন ডেলিভারি সুবিধা",
  "৫০০০+ সন্তুষ্ট গ্রাহক",
  "অর্ডার করুন ০৯৬৪৭১৩২৯৯৫",
  "প্রিমিয়াম কোয়ালিটি প্রোডাক্ট",
];

const TopNavbar: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>("বাংলা");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "bn", name: "বাংলা" },
    { code: "en", name: "English" },
  ];

  const handleSelectLanguage = (langName: string) => {
    setSelectedLang(langName);
    setIsOpen(false);
  };

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হওয়ার লজিক
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-secondary text-secondary-foreground relative z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 gap-3 text-xs sm:text-sm">
        {/* Phone number */}
        <a
          href="tel:09647132995"
          className="flex items-center gap-1.5 font-medium shrink-0 hover:text-accent transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>০৯৬৪৭১৩২৯৯৫</span>
        </a>

        {/* Scrolling info items (desktop only) */}
        <div className="hidden lg:flex flex-1 justify-center overflow-hidden whitespace-nowrap">
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: [0, -120, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {infoItems.map((item, idx) => (
              <React.Fragment key={item}>
                <span className="text-secondary-foreground/90">{item}</span>
                {idx < infoItems.length - 1 && (
                  <span className="text-accent/60">|</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Free delivery badge */}
          <div className="flex items-center gap-1.5 font-medium">
            <Truck className="w-3.5 h-3.5 text-accent" />
            <span>ফ্রি ডেলিভারি</span>
          </div>

          {/* Separator line */}
          <span className="text-white/20">|</span>

          {/* Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex cursor-pointer items-center gap-1 px-2 py-1 hover:text-accent transition-colors rounded-md focus:outline-none"
            >
              <span>{selectedLang}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu List (Positoned below the button) */}
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-28 bg-gray-900 border border-white/10 rounded-lg shadow-xl py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.name)}
                    className="w-full cursor-pointer text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{lang.name}</span>
                    {selectedLang === lang.name && (
                      <Check className="w-3.5 h-3.5 text-accent" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;