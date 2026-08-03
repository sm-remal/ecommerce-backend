"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';

// Swiper modules & React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Grid } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";


const bestSellerData = [
    {
        id: 1,
        name: "কাস্টমাইজড প্রিমিয়াম ফটো ফ্রেম",
        price: 1200,
        originalPrice: 1500,
        image: "https://images.unsplash.com/photo-1656334691462-c91530e63caa?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "premium-photo-frame-1",
        rating: 5,
        sales: 150
    },
    {
        id: 2,
        name: "ম্যাজিক কফি মগ - কালো",
        price: 450,
        originalPrice: 600,
        image: "https://images.unsplash.com/photo-1606244232807-a2961db5c3de?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "magic-coffee-mug-black",
        rating: 5,
        sales: 210
    },
    {
        id: 3,
        name: "লাভ কার্ড - বিশেষ সংস্করণ",
        price: 150,
        image: "https://images.unsplash.com/photo-1554221555-8f6ab36624b7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "love-card-special-edition",
        rating: 4,
        sales: 95
    },
    {
        id: 4,
        name: "মিনি ফটো অ্যালবাম কি চেইন",
        price: 350,
        originalPrice: 400,
        image: "https://images.unsplash.com/photo-1640611024947-15f8066424c0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "mini-photo-album-keychain",
        rating: 5,
        sales: 180
    },
     {
        id: 5,
        name: "কাস্টমাইজড ওয়াটার পট - ৫০০ মি.লি.",
        price: 800,
        image: "https://images.unsplash.com/photo-1681676007202-4d847cbf303f?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "customized-water-pot-500ml",
        rating: 5,
        sales: 120
    },
    {
        id: 6,
        name: "সারপ্রাইজ গিফট বক্স",
        price: 2500,
        originalPrice: 3000,
        image: "https://images.unsplash.com/photo-1480717846107-87837abec1e9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "surprise-gift-box",
        rating: 5,
        sales: 75
    },
    {
        id: 7,
        name: "কাস্টমাইজড ফটো উইথ ম্যাজিক মিরর",
        price: 950,
        originalPrice: 1200,
        image: "https://images.unsplash.com/photo-1595871151608-bc7abd1caca3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "customized-photo-magic-mirror",
        rating: 4,
        sales: 110
    },
    {
        id: 8,
        name: "পোলারয়েড ফটো প্রিন্ট সেট (১০ পিস)",
        price: 280,
        originalPrice: 350,
        image: "https://images.unsplash.com/photo-1554304246-c4a6a4ac95ba?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "polaroid-photo-print-set",
        rating: 5,
        sales: 250
    },
];

const BestSeller = () => {
    return (
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
            {/* Title Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
                    Best Sellers
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mt-3 rounded-full" />
                <p className="mt-4 text-foreground/80 max-w-lg mx-auto text-sm sm:text-base">
                    আমাদের গ্রাহকদের সবচেয়ে প্রিয় এবং জনপ্রিয় কাস্টমাইজড গিফটগুলো দেখে নিন।
                </p>
            </div>

            {/* Product Grid using Swiper with Grid module */}
            <div className="relative pb-10 best-seller-swiper">
                <Swiper
                    modules={[Pagination, Autoplay, Grid]}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        el: ".best-seller-swiper-pagination",
                    }}
                    grid={{
                        rows: 2,
                        fill: "row"
                    }}
                    spaceBetween={16}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 12 },
                        640: { slidesPerView: 3, spaceBetween: 16 },
                        1024: { slidesPerView: 4, spaceBetween: 20 },
                        1280: { slidesPerView: 4, spaceBetween: 24 },
                    }}
                    className="w-full h-auto"
                >
                    {bestSellerData.map((product) => {
                        return (
                            <SwiperSlide key={product.id} className="h-auto">
                                <div className="group bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative h-full">
                                   
                                   {/* Best Seller Badge */}
                                   <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                                       <Star className="w-3 h-3 text-accent fill-accent" />
                                       BEST SELLER
                                   </div>

                                    {/* Image Container */}
                                    <Link href={`/product/${product.slug}`} className="relative w-full aspect-square p-5 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </Link>

                                    {/* Product Details */}
                                    <div className="p-5 flex flex-col flex-grow border-t border-border/50">
                                        {/* Rating and Sales */}
                                        <div className="flex items-center justify-between mb-2 text-xs text-foreground/70">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < product.rating ? 'text-accent fill-accent' : 'text-border fill-border'}`} />
                                                ))}
                                            </div>
                                            <span>{product.sales}+ বিক্রি হয়েছে</span>
                                        </div>

                                        <Link href={`/product/${product.slug}`} className="block mb-2">
                                            <h3 className="text-sm sm:text-base font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                                            {/* Price Info */}
                                            <div className="flex flex-col">
                                                {product.originalPrice && (
                                                    <span className="text-xs sm:text-sm text-foreground/60 line-through">
                                                        ৳{product.originalPrice}
                                                    </span>
                                                )}
                                                <span className="text-base sm:text-lg font-bold text-primary">
                                                    ৳{product.price}
                                                </span>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-secondary hover:bg-secondary hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Custom Swiper Pagination Dots */}
                <div className="best-seller-swiper-pagination absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 !w-auto z-10" />
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
                <Link href="/shop?filter=best-seller" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-secondary text-white text-base font-semibold hover:bg-secondary/90 transition-colors shadow-md">
                   সব বেস্ট সেলার প্রোডাক্ট দেখুন
                </Link>
            </div>

            {/* Pagination Custom Styling */}
            <style jsx global>{`
                .best-seller-swiper .swiper-grid-column .swiper-wrapper {
                    flex-direction: row !important;
                }
                .best-seller-swiper .swiper-slide {
                    margin-top: 0 !important;
                    margin-bottom: 16px; /* Row gap */
                }
                @media (min-width: 640px) {
                    .best-seller-swiper .swiper-slide {
                        margin-bottom: 20px;
                    }
                }
                @media (min-width: 1024px) {
                    .best-seller-swiper .swiper-slide {
                        margin-bottom: 24px;
                    }
                }

                .best-seller-swiper-pagination .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background-color: hsl(var(--muted-foreground) / 0.3);
                    opacity: 1;
                    border-radius: 9999px;
                    transition: all 0.3s ease;
                    margin: 0 3px !important;
                }
                .best-seller-swiper-pagination .swiper-pagination-bullet-active {
                    width: 24px;
                    background-color: hsl(var(--primary));
                }
            `}</style>
        </section>
    );
};

export default BestSeller;
