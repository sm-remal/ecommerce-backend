"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  User,
  ShoppingCart,
  MapPin,
  Search,
  ChevronDown,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import TopNavbar from "./TopNavbar";
import CategoryNavbar from "./CategoryNavbar";
import MobileBottomBar from "./Mobilebottombar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { clearStoredAuthUser } from "@/lib/auth-storage";
import { logoutUser } from "@/services/auth.service";


interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const mobileCategories: NavItem[] = [
  { label: "নতুন পণ্য", href: "/category/new-arrivals" },
  {
    label: "জন্মদিনের গিফট",
    href: "/category/birthday",
    children: [
      { label: "ছেলেদের জন্য", href: "/category/birthday/for-him" },
      { label: "মেয়েদের জন্য", href: "/category/birthday/for-her" },
      { label: "বাচ্চাদের জন্য", href: "/category/birthday/for-kids" },
    ],
  },
  { label: "কাপল গিফট", href: "/category/couple" },
  {
    label: "কাস্টমাইজড আইটেম",
    href: "/category/customized",
    children: [
      { label: "ফটো মগ", href: "/category/customized/photo-mug" },
      { label: "ফটো ফ্রেম", href: "/category/customized/photo-frame" },
    ],
  },
  { label: "হোম ডেকোর", href: "/category/home-decor" },
  { label: "চকোলেট ও হ্যাম্পার", href: "/category/hampers" },
  { label: "মগ ও ফটো ফ্রেম", href: "/category/mugs-frames" },
  { label: "সব পণ্য", href: "/category/all" },
];

const SearchBar: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`flex items-center w-full rounded-full border border-secondary/15 bg-white overflow-hidden shadow-sm focus-within:border-primary/40 transition-colors ${className}`}
  >
    <input
      type="search"
      placeholder="প্রোডাক্ট খুঁজুন..."
      className="w-full bg-transparent px-4 py-2.5 text-sm text-secondary placeholder-secondary/40 focus:outline-none"
    />
    <button
      type="button"
      aria-label="Search"
      className="shrink-0 m-1 p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <Search className="w-4 h-4" />
    </button>
  </div>
);

const MainNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logoutLocalUser } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userInitials = useMemo(() => {
    const name = user?.name?.trim() || "User";
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";
  }, [user?.name]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutUser();
      clearStoredAuthUser();
      logoutLocalUser();
      setIsProfileOpen(false);
      toast.success("Logged out successfully", { position: "top-right" });
      router.push("/login");
    } catch (error) {
      clearStoredAuthUser();
      logoutLocalUser();
      setIsProfileOpen(false);
      const message = error instanceof Error ? error.message : "Logout failed";
      toast.error(message, { position: "top-right" });
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="sticky top-0 z-100">
      <TopNavbar />

      <div className="bg-white">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-secondary hover:bg-primary/10 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 lg:mr-8">
              <img
                className="w-9 lg:w-11 h-auto"
                src="/assets/PerfectGiftsStation.png"
                alt="Perfect Gifts Station"
              />
              <span className="hidden sm:block text-lg lg:text-xl font-bold tracking-tight text-secondary">
                Perfect Gifts Station
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-auto">
              <SearchBar />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Track Order (desktop only) */}
              <button
                type="button"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>ট্র্যাক অর্ডার</span>
              </button>

              {/* Profile */}
              <div
                className="relative"
                ref={profileRef}
                onMouseEnter={() => isAuthenticated && setIsProfileOpen(true)}
                onMouseLeave={() => isAuthenticated && setIsProfileOpen(false)}
              >
                <button
                  type="button"
                  aria-label="User profile menu"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center justify-center gap-1 rounded-lg p-1.5 text-secondary transition-colors hover:bg-primary/10 hover:text-primary sm:p-2"
                >
                  {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary/15 bg-primary/10 text-xs font-semibold text-primary shadow-sm">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name || "User avatar"}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{userInitials}</span>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          isProfileOpen && "rotate-180",
                        )}
                      />
                    </div>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          isProfileOpen && "rotate-180",
                        )}
                      />
                    </>
                  )}
                </button>

                {isProfileOpen && !isAuthenticated && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
                    <Link
                      href="/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Login
                    </Link>

                    <div className="my-1 border-t border-gray-300 dark:border-slate-800" />

                    <Link
                      href="/registration"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                      Registration
                    </Link>
                  </div>
                )}

                {isProfileOpen && isAuthenticated && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2">
                      <p className="text-sm font-semibold text-secondary">
                        {user?.name || "User"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>

                    <div className="my-1 border-t border-gray-300 dark:border-slate-800" />

                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 px-3.5 py-2 text-left text-sm font-medium text-secondary transition-colors hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4 text-muted-foreground" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                type="button"
                aria-label="Shopping cart"
                className="relative p-2 sm:p-2.5 text-secondary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-white" />
              </button>
              
            </div>
          </div>

          {/* Mobile Search Bar (full width, below top row) */}
          <div className="lg:hidden mt-3">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Category Strip */}
        <CategoryNavbar />
      </div>

      {/* Mobile Navigation Drawer (full screen) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-top-2 duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-secondary/10 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 -ml-2 text-secondary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <img
                className="w-8 h-auto"
                src="/assets/PerfectGiftsStation.png"
                alt="Perfect Gifts Station"
              />
              <span className="text-lg font-bold tracking-tight text-secondary">
                Perfect Gifts Station
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="User profile"
                className="p-2 text-secondary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Shopping cart"
                className="p-2 text-secondary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Search */}
          <div className="px-4 py-3 shrink-0">
            <SearchBar />
          </div>

          {/* Drawer Category List */}
          <div className="flex-1 overflow-y-auto pb-24">
            {mobileCategories.map((item) => {
              const hasChildren = !!item.children?.length;
              const isExpanded = expandedCategory === item.label;
              return (
                <div key={item.label} className="border-b border-secondary/5">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => !hasChildren && setIsMobileMenuOpen(false)}
                      className="flex-1 px-4 py-3.5 text-[15px] font-medium text-secondary hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        aria-label={`Toggle ${item.label}`}
                        onClick={() =>
                          setExpandedCategory(isExpanded ? null : item.label)
                        }
                        className="px-4 py-3.5 text-secondary/60"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {hasChildren && isExpanded && (
                    <div className="bg-primary/5 pb-1">
                      {item.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-8 py-2.5 text-sm text-secondary/70 hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Tab Bar */}
      <MobileBottomBar onCategoryClick={() => setIsMobileMenuOpen(true)} />
    </div>
  );
};

export default MainNavbar;
