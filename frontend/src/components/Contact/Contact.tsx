'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Target, 
  Eye
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6';

const Contact = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ================= 1. ABOUT US SECTION ================= */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="bg-[#BC2D92]/10 text-[#BC2D92] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              আমাদের গল্প
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F0B3E] mt-3">
              আমাদের সম্পর্কে (About Us)
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              পারফেক্ট গিফটস স্টেশন একঝাঁক তরুণ ও ডেডিকেটেড টিম মেম্বারদের নিয়ে পথ চলা শুরু করে। আমাদের মূল লক্ষ্য কাস্টমারদের প্রতিটি আবেগ ও স্মৃতিকে সততার সাথে সুন্দর সুন্দর উপহারে রূপান্তর করা।
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#BC2D92] text-white flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F0B3E] mb-2">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                গ্রাহকদের আপোষহীন প্রিমিয়াম কোয়ালিটি পণ্য সরবরাহ করা এবং তাদের ছবি ও তথ্যের ১০০% প্রাইভেসি বা গোপনীয়তা নিশ্চিত করা।
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2F0B3E] text-white flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#2F0B3E] mb-2">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                বাংলাদেশের এক নম্বর কাস্টমাইজড গিফট প্ল্যাটফর্ম হিসেবে নিজেদের প্রতিষ্ঠিত করা, যেখানে কাস্টমাররা চোখ বন্ধ করে আস্থা রাখতে পারেন।
              </p>
            </motion.div>
          </div>
        </div>

        {/* ================= 2. CONTACT INFO & MAP ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#2F0B3E] mb-2">যোগাযোগের তথ্য</h3>
              <p className="text-sm text-gray-600">যেকোনো প্রশ্ন বা অর্ডারের সহায়তায় সরাসরি আমাদের সাথে যোগাযোগ করুন।</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/8801734584990" 
                target="_blank" 
                rel="noreferrer"
                className="p-4 rounded-xl bg-green-50/50 border border-green-200/60 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="p-3 bg-green-500 text-white rounded-lg">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">WhatsApp</p>
                  <p className="text-sm font-bold text-gray-800">01734584990</p>
                </div>
              </a>

              {/* Hotline */}
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/60 flex items-center gap-4">
                <div className="p-3 bg-[#BC2D92] text-white rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Hotline Number</p>
                  <p className="text-sm font-bold text-gray-800">01734584990</p>
                </div>
              </div>

              {/* Email */}
              <a 
                href="mailto:perfectgiftsstation@gmail.com"
                className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="p-3 bg-blue-500 text-white rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-gray-500">Email Address</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">perfectgiftsstation@gmail.com</p>
                </div>
              </a>

              {/* Working Hours */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center gap-4">
                <div className="p-3 bg-amber-500 text-white rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Contact Hours</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-800">সকাল ১০:০০ - রাত ০৮:০০</p>
                </div>
              </div>

            </div>

            {/* Address */}
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-[#2F0B3E] text-white rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2F0B3E]">Office / Shop Address</h4>
                <p className="text-sm text-gray-600 mt-1">Collate Gate, Tongi, Gazipur, Bangladesh</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">সোশ্যাল মিডিয়ায় আমরা</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/perfectgiftsstation"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-gray-200 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all shadow-sm flex items-center justify-center"
                >
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/perfectgiftsstation/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-gray-200 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all shadow-sm flex items-center justify-center"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@perfectgiftsstation"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-gray-200 text-[#2F0B3E] hover:bg-[#2F0B3E] hover:text-white transition-all shadow-sm flex items-center justify-center"
                >
                  <FaTiktok className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Map Embed */}
          <div className="lg:col-span-5 h-full min-h-[350px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative">
            <iframe
              title="Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.423982463773!2d90.39868847605937!3d23.90998968258356!2m3!1f0!1f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c4a511634b3f%3A0xc3c7d6c62c9545!2sCollege%20Gate%2C%20Tongi%2C%20Gazipur!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd"
              className="w-full h-full min-h-[380px] border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;