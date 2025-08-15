'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      <div className="group relative bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Bookmark icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToWatchLater(item);
            }}
            className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:bg-black/80 opacity-0 group-hover:opacity-100"
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
          </button>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{itemTitle}</h4>
            {rating > 0 && (
              <div className="flex items-center space-x-1 mb-2">
                <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-xs">{rating.toFixed(1)}</span>
              </div>
            )}
            
            <Link
              href={`/details?id=${item.id}&type=${type}`}
              className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5z"/>
              </svg>
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (content.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{title}</h2>
          {subtitle && (
            <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-red-500 hover:text-red-400 transition-colors text-sm font-medium flex items-center group"
          >
            View All
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Horizontal scrolling container */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex space-x-4 w-max">
            {content.slice(0, 10).map((item, index) => (
              <div key={`${sectionId}-${item.id}-${index}`} className="w-40 sm:w-48 flex-shrink-0">
                <ContentCard item={item} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient fade on right edge */}
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
