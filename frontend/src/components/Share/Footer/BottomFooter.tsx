"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const BottomFooter: React.FC = () => {
  const year = new Date().getFullYear();
  
 
  const [selectedLang, setSelectedLang] = useState<string>("বাংলা");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "bn", name: "বাংলা" },
    { code: "en", name: "English" },
    ];
    
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

  const handleSelectLanguage = (langName: string) => {
    setSelectedLang(langName);
    setIsOpen(false);
   
    };
    


  return (
    <div className="border-t border-white/10 relative">
      <div className="px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-white/50 text-center sm:text-left">
          Copyright © {year} Perfect Gifts Station. All Rights Reserved.
        </p>

        {/* Dropdown Container */}
        <div ref={dropdownRef} className="relative flex items-center gap-1 text-xs sm:text-sm text-white/70">
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

          {/* Dropdown Menu List */}
          {isOpen && (
            <div className="absolute  right-0 bottom-full mb-2 w-28 bg-gray-900 border border-white/10 rounded-lg shadow-lg py-1 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.name)}
                  className="w-full cursor-pointer text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span >{lang.name}</span>
                  {selectedLang === lang.name && (
                    <Check className="w-3.5  h-3.5 text-accent" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomFooter;