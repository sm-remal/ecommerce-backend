'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqData: FaqItem[] = [
  {
    question: 'আমি কীভাবে ছবি ও নাম কাস্টমাইজেশনের জন্য পাঠাব?',
    answer: 'অর্ডার করার সময় আমাদের ওয়েবসাইটে ছবি আপলোডের অপশন পাবেন। এছাড়া অর্ডার নিশ্চিত করার পর আমাদের টিম আপনার সাথে হোয়াটসঅ্যাপে যোগাযোগ করে ছবি ও তথ্য সংগ্রহ করবে।',
  },
  {
    question: 'আমার দেওয়া ছবি ও তথ্যের গোপনীয়তা (Privacy) বজায় থাকবে কি?',
    answer: 'হ্যাঁ, ১০০%! আমরা কাস্টমারদের প্রাইভেসি অত্যন্ত গুরুত্ব সহকারে নিই। আপনার ছবি বা তথ্য কেবল উপহার তৈরিতে ব্যবহার করা হয় এবং কাজ শেষ হলে ডিলিট করে দেওয়া হয়।',
  },
  {
    question: 'ডেলিভারি পেতে কত দিন সময় লাগে?',
    answer: 'সাধারণত ঢাকার ভেতরে ২-৩ কার্যদিবস এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন করা হয়।',
  },
  {
    question: 'পেমেন্ট কীভাবে করব? ক্যাশ অন ডেলিভারি আছে কি?',
    answer: 'হ্যাঁ, সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। এছাড়া বিকাশ, নগদ বা রকেটের মাধ্যমে অগ্রিম পেমেন্ট করতে পারবেন।',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="bg-[#FBF596] text-[#2F0B3E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            জিজ্ঞাসাবাদ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F0B3E] mt-3">
            সাধারণ কিছু প্রশ্ন ও উত্তর (FAQ)
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-purple-50/30 text-left transition-colors"
              >
                <span className="flex items-center gap-3 text-base font-bold text-[#2F0B3E]">
                  <HelpCircle className="w-5 h-5 text-[#BC2D92] shrink-0" />
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#BC2D92] transition-transform duration-300 shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
                  >
                    <p className="p-5 text-sm text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
