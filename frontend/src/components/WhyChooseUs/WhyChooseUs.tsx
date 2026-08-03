'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Gift, Headphones, HeartHandshake } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Gift,
    title: '১০০% কাস্টমাইজড উপহার',
    description: 'আপনার প্রিয়জনের পছন্দ অনুযায়ী ছবি ও নাম দিয়ে নিখুঁতভাবে তৈরি উপহার।',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'প্রিমিয়াম কোয়ালিটি',
    description: 'সেরা মানের উপাদান ও দীর্ঘস্থায়ী কোয়ালিটি নিশ্চিত করে আমরা ডেলিভারি করি।',
  },
  {
    id: 3,
    icon: Truck,
    title: 'দ্রুত ও নিরাপদ ডেলিভারি',
    description: 'সারাদেশে সঠিক সময়ে ও নিরাপদে আপনার উপহার পৌঁছে দেওয়ার নিশ্চয়তা।',
  },
  {
    id: 4,
    icon: Headphones,
    title: '২৪/৭ কাস্টমার সাপোর্ট',
    description: 'যেকোনো প্রয়োজন বা জিজ্ঞাসায় আমাদের টিম সবসময় আপনার সেবায় নিয়োজিত।',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-[#FBF596] text-[#2F0B3E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            কেন আমরা সেরা?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F0B3E] mt-3">
            কেন পারফেক্ট গিফট স্টেশন বেছে নেবেন?
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            আমরা শুধু উপহার বিক্রি করি না, প্রতিটি উপহারের সাথে অনুভূতিগুলো সুন্দরভাবে পৌঁছে দিই।
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-b from-purple-50/40 to-white border border-purple-100/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#BC2D92] text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#2F0B3E] transition-all duration-300 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2F0B3E] mb-2 group-hover:text-[#BC2D92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;