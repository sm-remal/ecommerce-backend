'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    name: 'আরিফ আহমেদ',
    role: 'ঢাকা',
    comment: 'ম্যাজিক কফি মগটি একদম চমৎকার ছিল! ইমেজের কোয়ালিটি অনেক ভালো ছিল এবং প্রাইভেসি নিয়ে কোনো টেনশন করতে হয়নি।',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  {
    id: 2,
    name: 'নুসরাত জাহান',
    role: 'গাজীপুর',
    comment: 'খোদাই করা কাঠের গহনা বাক্সটির ফিনিশিং দারুণ। এত কম সময়ে ডেলিভারি পাব ভাবিনি। থ্যাংক ইউ পারফেক্ট গিফট স্টেশন!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 3,
    name: 'তানভীর হোসেন',
    role: 'চট্টগ্রাম',
    comment: 'সারপ্রাইজ গিফট বক্সের কাস্টমাইজেশন একদম আমার মনের মতো হয়েছে। প্যাকেজিং টাও অনেক প্রিমিয়াম ছিল।',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-purple-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-[#BC2D92]/10 text-[#BC2D92] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            কাস্টমার রিভিউ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F0B3E] mt-3">
            আমাদের সন্তুষ্ট গ্রাহকদের মতামত
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            হাজারো ভালোবাসার মুহূর্তকে বাস্তবে রূপ দেওয়ার কিছু সুন্দর গল্প।
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsData.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[#BC2D92]/10" />

              <div>
                {/* Rating */}
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                  "{review.comment}"
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#BC2D92]">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2F0B3E]">{review.name}</h3>
                  <p className="text-xs text-gray-400">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;