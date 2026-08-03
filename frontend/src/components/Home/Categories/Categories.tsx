"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// Swiper modules & React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
}

const categoriesData: Category[] = [
  {
    id: 1,
    name: "Photo Frames",
    description: "আপনার সেরা মুহূর্তগুলোকে দেয়ালে বা টেবিলে সাজিয়ে রাখার জন্য প্রিমিয়াম কোয়ালিটি ফ্রেম।",
    image: "https://images.unsplash.com/photo-1656334691462-c91530e63caa?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "frames",
  },
  {
    id: 2,
    name: "Coffee Mugs",
    description: "ম্যাজিক মগ ও রেগুলার কাস্টমাইজড মগ, যা আপনার সকালের কফিতে আনবে নতুন আনন্দ।",
    image: "https://images.unsplash.com/photo-1488381397757-59d6261610f4?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "mugs",
  },
  {
    id: 3,
    name: "Photo Albums",
    description: "মিনি অ্যালবাম কি চেইন যা আপনার স্মৃতি গুলি ছোট্ট পাতায় বন্দি থাকবে।",
    image: "https://images.unsplash.com/photo-1550243558-90e523b5870e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "photo-albums",
  },
  {
    id: 4,
    name: "Love Cards",
    description: "কাস্টমাইজড লাভ কার্ড, প্রিয়জনকে উপহার দেওয়ার জন্য একদম সেরা।",
    image: "https://images.unsplash.com/photo-1554221555-8f6ab36624b7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "cards",
  },
  {
    id: 5,
    name: "Polaroid Prints",
    description: "কিউট এবং দেখতে সুন্দর যা দেয়ালে টুয়েলভ ট্যাপ দিয়ে সাজিয়ে রাখা যায় অথবা মানিব্যাগে।",
    image: "https://images.unsplash.com/photo-1612547036242-77002603e5aa?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvbGFyb2lkJTIwcGhvdG98ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "polaroid-picture",
  },
  {
    id: 6,
    name: "Vanity Mirror",
    description: "সাধারণ আয়না, কিন্তু লাইট জ্বালালেই ভেতরে আপনার সুন্দর ছবি দেখা যাবে।",
    image: "https://images.unsplash.com/photo-1572014788455-fdd2bc0e9e51?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "magic-mirror",
  },
  {
    id: 7,
    name: "Water Bottle",
    description: "আপনার ছবি ওয়াটার বোতলে কাস্টমাইজ করে নিতে পারবেন। প্রতিদিনের পানি খাওয়ার সাথে ভালোবাসার ছোঁয়া।",
    image: "https://images.unsplash.com/photo-1681676007202-4d847cbf303f?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "water-pot",
  },
  {
    id: 8,
    name: "Gift Combo",
    description: "বিভিন্ন কাস্টমাইজ প্রডাক্ট কম্বো ধামাকা অফারে।",
    image: "https://images.unsplash.com/photo-1668463919545-73f4bb38e1d3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    slug: "combo-offer",
  },
];

const Categories: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
          Featured Categories
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-2 rounded-full" />
      </div>

      {/* Categories Swiper Carousel */}
      <div className="relative pb-10">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: ".categories-swiper-pagination",
          }}
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 2.5, spaceBetween: 12 },
            480: { slidesPerView: 3.5, spaceBetween: 16 },
            640: { slidesPerView: 4.5, spaceBetween: 16 },
            768: { slidesPerView: 5.5, spaceBetween: 20 },
            1024: { slidesPerView: 6.5, spaceBetween: 20 },
            1280: { slidesPerView: 7, spaceBetween: 24 },
          }}
          // === পরিবর্তন: এখান থেকে flex স্টাইলগুলো সরিয়ে দেওয়া হয়েছে ===
          className="w-full" 
        >
          {categoriesData.map((category) => (
            <SwiperSlide key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center text-center focus:outline-none"
              >
                {/* ... (Image Container and Name remain the same) */}
                <div className="w-full aspect-square bg-white border border-border/60 rounded-2xl p-4 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 30vw, 15vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                <h3 className="mt-3 text-xs sm:text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors line-clamp-1">
                  {category.name}
                </h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Swiper Pagination Dots */}
        <div className="categories-swiper-pagination absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 !w-auto z-10" />
      </div>

   
      <style jsx global>{`
        
        .swiper-wrapper {
          display: flex;
          justify-content: center !important;
          align-items: center;
          
        }

      
        .categories-swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: hsl(var(--muted-foreground) / 0.3);
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.3s ease;
          margin: 0 3px !important;
        }
        .categories-swiper-pagination .swiper-pagination-bullet-active {
          width: 24px;
          background-color: hsl(var(--primary));
        }
      `}</style>
    </section>
  );
};

export default Categories;