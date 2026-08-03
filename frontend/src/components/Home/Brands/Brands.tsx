'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const brandLogos = [
  { id: 1, name: 'Chhayaghar', logo: '/assets/brands/brand1.png' },
  { id: 2, name: 'CraftStation', logo: '/assets/brands/brand2.png' },
  { id: 3, name: 'GiftArt', logo: '/assets/brands/brand3.png' },
  { id: 4, name: 'LoveBox', logo: '/assets/brands/brand4.png' },
  { id: 5, name: 'WoodCraft', logo: '/assets/brands/brand5.png' },
];

const Brands = () => {
  return (
    <section className="py-10 bg-gradient-to-r from-[#2F0B3E]/5 via-[#BC2D92]/5 to-[#2F0B3E]/5 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#2F0B3E]/60 mb-6">
          বিশ্বস্ত পার্টনার ও প্রিমিয়াম ভেন্ডরসমূহ
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-center">
          {brandLogos.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md hover:border-[#BC2D92]/30 transition-all duration-300 grayscale hover:grayscale-0"
            >
              <div className="relative w-28 h-12">
                {/* ফাইল না থাকলে টেস্ট করার জন্য ফলব্যাক টেক্সট */}
                <div className="w-full h-full flex items-center justify-center font-bold text-[#2F0B3E] text-sm">
                  {brand.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;