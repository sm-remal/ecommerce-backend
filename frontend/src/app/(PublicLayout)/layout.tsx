"use client"; 

import React, { ReactNode } from "react";
import MainFooter from "@/components/Share/Footer/MainFooter";
import MainNavbar from "@/components/Share/Navbar/MainNavbar";

interface PublicLayoutProps{
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <MainNavbar></MainNavbar>
      
      <main className="flex-1">
        {children}
      </main>
      
     <MainFooter></MainFooter>
      {/* <ToastContainer position="top-right" /> */}
    </div>
  );
}