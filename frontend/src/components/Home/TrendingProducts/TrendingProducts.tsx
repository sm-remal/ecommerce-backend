'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShoppingBag, Heart, Star } from 'lucide-react';

const categories = ['All', 'For Him', 'For Her', 'Couples'];

const trendingProductsData = [
  {
    id: 1,
    title: 'কাস্টম চামড়ার জার্নাল',
    price: 1500,
    category: 'For Him',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1743385779331-15e7e53c2253?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  },
  {
    id: 2,
    title: 'বিশেষ লাভ কার্ড',
    price: 1500,
    category: 'Couples',
    rating: 5.0,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1554221555-8f6ab36624b7?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  },
  {
    id: 3,
    title: 'খোদাই করা কাঠের গহনা বাক্স',
    price: 1500,
    category: 'For Her',
    rating: 4.8,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1480717846107-87837abec1e9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  },
  {
    id: 4,
    title: 'মিনি ফটো অ্যালবাম কি-চেইন',
    price: 4900,
    category: 'Couples',
    rating: 4.7,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1640611024947-15f8066424c0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  },
];

const TrendingProducts = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredProducts = activeTab === 'All'
    ? trendingProductsData
    : trendingProductsData.filter(item => item.category === activeTab);
    

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#BC2D92]/10 text-[#BC2D92] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#BC2D92]" /> ট্রেন্ডিং নাউ
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F0B3E]">
              সবচেয়ে জনপ্রিয় উপহার সামগ্রী
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-xl self-start md:self-auto">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 relative ${
                  activeTab === tab
                    ? 'text-white shadow-md'
                    : 'text-gray-600 hover:text-[#2F0B3E]'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#BC2D92] rounded-lg"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative w-full h-56 bg-gray-50 flex items-center justify-center p-4">
                  <div className="absolute top-3 right-3 z-10">
                    <button className="p-2 bg-white/90 text-[#2F0B3E] hover:bg-[#BC2D92] hover:text-white rounded-full shadow-sm transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span className="font-bold">{product.rating}</span>
                      <span className="text-gray-400">({product.reviews})</span>
                    </div>
                    <h3 className="text-base font-bold text-[#2F0B3E] line-clamp-1 group-hover:text-[#BC2D92] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-lg font-extrabold text-[#BC2D92] mt-2">
                      ৳ {product.price.toLocaleString('bn-BD')}
                    </p>
                  </div>

                  <button className="mt-4 w-full bg-[#2F0B3E] hover:bg-[#BC2D92] text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95">
                    <ShoppingBag className="w-4 h-4" />
                    অর্ডার করুন
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default TrendingProducts;