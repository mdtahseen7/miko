'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TMDB_IMAGE_BASE_URL } from '@/lib/utils';
import type { ContentItem } from '@/lib/types';

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  content: ContentItem[];
  onAddToWatchLater: (item: ContentItem) => void;
  isInWatchLater: (item: ContentItem) => boolean;
  sectionId: string;
  onViewAll?: () => void;
}

export default function ContentSection({ 
  title, 
  subtitle, 
  content, 
  onAddToWatchLater, 
  isInWatchLater,
  sectionId,
  onViewAll 
}: ContentSectionProps) {
  
  const ContentCard = ({ item }: { item: ContentItem | any }) => {
    const itemTitle = item.title || item.name || '';
    const posterPath = item.poster_path || item.poster;
    const rating = item.vote_average || 0;
    const type = item.type || item.media_type || (item.title ? 'movie' : 'tv');

    return (
      <motion.div 
        className="group relative bg-gray-900 rounded-xl overflow-hidden transition-all duration-300"
        whileHover={{ 
          scale: 1.03, 
          y: -5,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ willChange: "transform" }}
      >
        <div className="relative aspect-[2/3]">
          {posterPath ? (
            <Image
              src={`${TMDB_IMAGE_BASE_URL}${posterPath}`}
              alt={itemTitle}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Bookmark icon */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onAddToWatchLater(item);
            }}
            className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:bg-black/80 opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <svg 
              className={`w-4 h-4 transition-colors ${
                isInWatchLater(item) ? 'text-red-500 fill-current' : 'text-white'
              }`} 
              fill={isInWatchLater(item) ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
              />
            </svg>
          </motion.button>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-200">
            <h4 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">{itemTitle}</h4>
            {rating > 0 && (
              <div className="flex items-center space-x-1 mb-2">
                <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-xs">{rating.toFixed(1)}</span>
              </div>
            )}
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                href={`/details?id=${item.id}&type=${type}`}
                className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5z"/>
                </svg>
                Watch
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (content.length === 0) return null;

  return (
    <motion.section 
      className="mb-8 sm:mb-10 md:mb-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div>
          <motion.h2 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p 
              className="text-gray-400 text-xs sm:text-sm md:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {onViewAll && (
          <motion.button 
            onClick={onViewAll}
            className="text-red-500 hover:text-red-400 transition-colors text-xs sm:text-sm font-medium flex items-center group"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
            <motion.svg 
              className="w-3 sm:w-4 h-3 sm:h-4 ml-1"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        )}
      </motion.div>
      
      {/* Horizontal scrolling container */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <motion.div 
            className="flex space-x-4 w-max"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {content.slice(0, 10).map((item, index) => (
              <motion.div 
                key={`${sectionId}-${item.id}-${index}`} 
                className="w-32 sm:w-36 md:w-40 lg:w-48 flex-shrink-0"
                initial={{ opacity: 0, x: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.3 + index * 0.05,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <ContentCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Gradient fade on right edge */}
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </motion.div>
    </motion.section>
  );
}
