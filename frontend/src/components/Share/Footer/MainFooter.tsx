"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { GrInstagram } from "react-icons/gr";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import BottomFooter from "./BottomFooter";

interface FooterLink {
  label: string;
  href: string;
}

const informationLinks: FooterLink[] = [
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "যোগাযোগ করুন", href: "/contact" },
  { label: "শর্তাবলী", href: "/terms" },
  { label: "প্রাইভেসি পলিসি", href: "/privacy-policy" },
];

const shopByLinks: FooterLink[] = [
  { label: "জন্মদিনের গিফট", href: "/category/birthday" },
  { label: "কাপল গিফট", href: "/category/couple" },
  { label: "কাস্টমাইজড আইটেম", href: "/category/customized" },
  { label: "হোম ডেকোর", href: "/category/home-decor" },
];

const supportLinks: FooterLink[] = [
  { label: "সাপোর্ট সেন্টার", href: "/support" },
  { label: "কীভাবে অর্ডার করবেন", href: "/how-to-order" },
  { label: "অর্ডার ট্র্যাকিং", href: "/track-order" },
  { label: "সচরাচর জিজ্ঞাসা", href: "/faq" },
];

const policyLinks: FooterLink[] = [
  { label: "হ্যাপি রিটার্ন", href: "/policy/happy-return" },
  { label: "রিফান্ড পলিসি", href: "/policy/refund" },
  { label: "এক্সচেঞ্জ", href: "/policy/exchange" },
  { label: "ক্যান্সেলেশন", href: "/policy/cancellation" },
];

const FooterColumn: React.FC<{ title: string; links: FooterLink[] }> = ({
  title,
  links,
}) => (
  <div>
    <h3 className="text-base font-bold text-white mb-4">{title}</h3>
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-sm text-white/60 hover:text-accent transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const MainFooter: React.FC = () => {
  return (
    <footer className="bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 sm:col-span-3">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <img
                className="w-9 h-auto"
                src="/assets/PerfectGiftsStation.png"
                alt="Perfect Gifts Station"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                Perfect Gifts Station
              </span>
            </Link>

            <p className="text-sm text-white/60 leading-relaxed mb-5 max-w-sm">
              প্রিয়জনের জন্য মনে রাখার মতো উপহার খুঁজছেন? Perfect Gifts Station-এ
              পাবেন যত্ন নিয়ে বাছাই করা, প্রিমিয়াম কোয়ালিটির গিফট আইটেম, প্রতিটি
              উপলক্ষের জন্য।
            </p>

            <ul className="flex flex-col gap-2.5 mb-5">
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href="tel:09647132995" className="hover:text-accent transition-colors">
                  ০৯৬৪৭১৩২৯৯৫
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="mailto:contact@perfectgiftsstation.com"
                  className="hover:text-accent transition-colors"
                >
                  contact@perfectgiftsstation.com
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <GrInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <FaFacebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="X"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <FooterColumn title="Information" links={informationLinks} />
          <FooterColumn title="Shop By" links={shopByLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Consumer Policy" links={policyLinks} />
        </div>
      </div>

      <BottomFooter />
    </footer>
  );
};

export default MainFooter;