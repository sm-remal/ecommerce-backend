'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Percent } from 'lucide-react';

// ডামি ডিসকাউন্ট প্রোডাক্ট ডাটা (পরবর্তীতে API/DB থেকে নিয়ে আসবেন)
const discountProductsData = [
  {
    id: 1,
    title: 'ম্যাজিক মিরর ফটো ফ্রেম',
    originalPrice: 2000,
    discountPrice: 1600,
    discountPercent: 20,
    image: 'https://images.unsplash.com/photo-1595871151608-bc7abd1caca3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000', // আপনার পাবলিক ফোল্ডারের ইমেজ পাথ
    rating: 4.8,
    isStock: true,
  },
  {
    id: 2,
    title: 'ম্যাজিক কফি মগ',
    originalPrice: 3200,
    discountPrice: 2500,
    discountPercent: 22,
    image: 'https://images.unsplash.com/photo-1606244232807-a2961db5c3de?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    rating: 4.9,
    isStock: true,
  },
  {
    id: 3,
    title: 'খোদাই করা কাঠের গহনা বাক্স',
    originalPrice: 1800,
    discountPrice: 1500,
    discountPercent: 17,
    image: 'https://images.unsplash.com/photo-1480717846107-87837abec1e9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    rating: 4.7,
    isStock: true,
  },
  {
    id: 4,
    title: 'সারপ্রাইজ গিফট বক্স',
    originalPrice: 5000,
    discountPrice: 4200,
    discountPercent: 16,
    image: 'https://images.unsplash.com/photo-1480717846107-87837abec1e9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    rating: 5.0,
    isStock: true,
  },
];

const DiscountProducts = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#BC2D92]/10 text-[#BC2D92] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" /> স্পেশাল অফার
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F0B3E] tracking-tight">
              ধামাকা ডিসকাউন্ট প্রডাক্টস
            </h2>
          </div>
          
          <Link 
            href="/offers" 
            className="mt-4 md:mt-0 text-sm font-semibold text-[#BC2D92] hover:text-[#2F0B3E] transition-colors flex items-center gap-1 group"
          >
            সব অফার দেখুন 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discountProductsData.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              {/* Image & Badges */}
              <div className="relative w-full h-56 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10 bg-[#BC2D92] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                  <span>{product.discountPercent}% ছাড়</span>
                </div>

                {/* Quick Action Overlay Buttons */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 bg-white/90 text-[#2F0B3E] hover:bg-[#BC2D92] hover:text-white rounded-full shadow-md transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/90 text-[#2F0B3E] hover:bg-[#BC2D92] hover:text-white rounded-full shadow-md transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Image */}
                <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#2F0B3E] line-clamp-1 group-hover:text-[#BC2D92] transition-colors">
                    {product.title}
                  </h3>
                  
                  {/* Price Section */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-extrabold text-[#BC2D92]">
                      ৳ {product.discountPrice.toLocaleString('bn-BD')}
                    </span>
                    <span className="text-sm font-medium text-gray-400 line-through">
                      ৳ {product.originalPrice.toLocaleString('bn-BD')}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button className="mt-4 w-full bg-[#2F0B3E] hover:bg-[#BC2D92] text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-95">
                  <ShoppingBag className="w-4 h-4" />
                  কার্টে যোগ করুন
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DiscountProducts;