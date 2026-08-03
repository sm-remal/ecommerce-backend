"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

// কিছু ডামি প্রোডাক্ট ডাটা। পরবর্তীতে আপনি এটি API বা DB থেকে নিয়ে আসবেন।
const newArrivalsData = [
    {
        id: 1,
        name: "কাস্টমাইজড প্রিমিয়াম ফটো ফ্রেম",
        price: 1200,
        originalPrice: 1500,
        image: "https://images.unsplash.com/photo-1656334691462-c91530e63caa?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "premium-photo-frame-1"
    },
    {
        id: 2,
        name: "ম্যাজিক কফি মগ - কালো",
        price: 450,
        originalPrice: 600,
        image: "https://images.unsplash.com/photo-1606244232807-a2961db5c3de?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "magic-coffee-mug-black"
    },
    {
        id: 3,
        name: "লাভ কার্ড - বিশেষ সংস্করণ",
        price: 150,
        image: "https://images.unsplash.com/photo-1554221555-8f6ab36624b7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "love-card-special-edition"
    },
    {
        id: 4,
        name: "মিনি ফটো অ্যালবাম কি চেইন",
        price: 350,
        originalPrice: 400,
        image: "https://images.unsplash.com/photo-1640611024947-15f8066424c0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", // আপনার ইমেজ পাথ বসান
        slug: "mini-photo-album-keychain"
    },
     {
        id: 5,
        name: "কাস্টমাইজড ওয়াটার পট - ৫০০ মি.লি.",
        price: 800,
        image: "https://images.unsplash.com/photo-1681676007202-4d847cbf303f?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000", 
        slug: "customized-water-pot-500ml"
    },
    {
        id: 6,
        name: "সারপ্রাইজ গিফট বক্স",
        price: 2500,
        originalPrice: 3000,
        image: "https://images.unsplash.com/photo-1480717846107-87837abec1e9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
        slug: "surprise-gift-box"
    },
    {
        id: 7,
        name: "কাস্টমাইজড ফটো উইথ ম্যাজিক মিরর",
        price: 950,
        originalPrice: 1200,
        image: "https://images.unsplash.com/photo-1595871151608-bc7abd1caca3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
        slug: "customized-photo-magic-mirror"
    },
    {
        id: 8,
        name: "পোলারয়েড ফটো প্রিন্ট সেট (১০ পিস)",
        price: 280,
        originalPrice: 350,
        image: "https://images.unsplash.com/photo-1769614917552-5da98a484e2e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
        slug: "polaroid-photo-print-set"
    },
];

const NewArrivals = () => {
    return (
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
            {/* Title Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
                    New Arrivals
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mt-3 rounded-full" />
                <p className="mt-4 text-foreground/80 max-w-lg mx-auto text-sm sm:text-base">
                    আমাদের নতুন এবং চমৎকার কাস্টমাইজড গিফট কালেকশনগুলো দেখে নিন।
                </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivalsData.map((product) => {
                    // ডিসকাউন্ট পার্সেন্টেজ হিসাব
                    const discount = product.originalPrice
                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                        : null;

                    return (
                        <div key={product.id} className="group bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative">
                           
                           {/* Discount Badge */}
                           {discount && (
                                <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                    {discount}% OFF
                                </div>
                           )}

                            {/* Image Container */}
                            <Link href={`/product/${product.slug}`} className="relative w-full aspect-square p-5 flex items-center justify-center overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                                />
                                 {/* Hover Overlay with View Detail button (optional) */}
                                {/* <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <span className="bg-secondary text-white text-xs px-4 py-2 rounded-full font-semibold shadow-md">বিস্তারিত দেখুন</span>
                                </div> */}
                            </Link>

                            {/* Product Details */}
                            <div className="p-5 flex flex-col flex-grow border-t border-border/50">
                                <Link href={`/product/${product.slug}`} className="block mb-2">
                                    <h3 className="text-sm sm:text-base font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="mt-auto flex items-end justify-between gap-3">
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
                    );
                })}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-secondary text-white text-base font-semibold hover:bg-secondary/90 transition-colors shadow-md">
                   সব নতুন প্রোডাক্ট দেখুন
                </Link>
            </div>
        </section>
    );
};

export default NewArrivals;

