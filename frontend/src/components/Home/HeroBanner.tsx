"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Swiper modules & React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface Slide {
  id: number;
  image: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/assets/banner/banner1.png",
    eyebrow: "স্পেশাল গিফট বক্স",
    heading: "সুন্দর স্মৃতি উপহার দিন প্রিয়জনকে!",
    subheading: "আমাদের এক্সক্লুসিভ কাস্টমাইজড গিফট বক্স ও স্টেশনরি দিয়ে সাজিয়ে তুলুন বিশেষ মুহূর্ত।",
    ctaLabel: "উপহারের কালেকশন",
    ctaHref: "/category/gift-boxes",
  },
  {
    id: 2,
    image: "/assets/banner/banner2.png",
    eyebrow: "কাস্টম মগ ও ফ্রেম",
    heading: "ভালোবাসার স্মৃতি, প্রতিদিনের মগে।",
    subheading: "নিজের পছন্দের ছবি ও মেসেজ দিয়ে তৈরি করুন প্রিমিয়াম ফটো ফ্রেম এবং কাস্টম মগ।",
    ctaLabel: "ফ্রেম কালেকশন",
    ctaHref: "/category/mugs-frames",
  },
  {
    id: 3,
    image: "/assets/banner/banner3.png",
    eyebrow: "পারফেক্ট গিফটস স্টেশন",
    heading: "সব কিছু একসাথে এক জায়গায়!",
    subheading: "উৎসব কিংবা যেকোনো অনুষ্ঠানে প্রিয় মানুষকে চমকে দিতে বেছে নিন আমাদের নতুন কালেকশন।",
    ctaLabel: "এখনই শপ করুন",
    ctaHref: "/shop",
  },
];

const HeroBanner: React.FC = () => {
  return (
    <section className="px-4 sm:px-6 mt-4">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden bg-secondary group">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: ".custom-swiper-pagination",
          }}
          navigation={{
            nextEl: ".custom-swiper-button-next",
            prevEl: ".custom-swiper-button-prev",
          }}
          loop={true}
          className="h-[380px] sm:h-[440px] lg:h-[520px] !flex !justify-center !items-center"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Banner Background Image */}
              <Image
                src={slide.image}
                alt={slide.heading}
                fill
                priority={slide.id === 1}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-right"
              />

              {/* Text overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/50 to-transparent" />

              {/* Text Content */}
              <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16">
                <div className="max-w-md lg:max-w-lg">
                  <span className="inline-block text-xs sm:text-sm font-semibold tracking-wide text-accent mb-3">
                    {slide.eyebrow}
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                    {slide.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-sm">
                    {slide.subheading}
                  </p>
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-primary text-primary-foreground text-sm sm:text-base font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
                  >
                    {slide.ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button
          type="button"
          className="custom-swiper-button-prev hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-accent hover:text-secondary transition-colors backdrop-blur-sm cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          className="custom-swiper-button-next hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-accent hover:text-secondary transition-colors backdrop-blur-sm cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Custom Pagination Dots */}
        <div className="custom-swiper-pagination absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2 !w-auto" />
      </div>

      {/* Swiper Custom Active Bullet CSS styling */}
      <style jsx global>{`
       .swiper-wrapper {
          display: flex;
          justify-content: center !important;
          align-items: center;
          
        }
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.3s ease;
          margin: 0 4px !important;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background-color: hsl(var(--accent));
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;