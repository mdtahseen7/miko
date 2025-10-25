'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchMovies, 
  TMDB_IMAGE_BASE_URL,
  fetchContentDetails,
  formatRuntime,
  getLocalStorage,
  setLocalStorage
} from '@/lib/utils';
import type { ContentItem, Movie } from '@/lib/types';

interface HeroSectionProps {
  onWatchNow?: (movie: ContentItem) => void;
  onMoreDetails?: (movie: ContentItem) => void;
}

export default function HeroSection({ onWatchNow, onMoreDetails }: HeroSectionProps) {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        setLoading(true);

        const moviesResponse = await fetchMovies(1);
        
        if (moviesResponse.results && moviesResponse.results.length > 0) {
          const topMovies = moviesResponse.results.slice(0, 6);
          const movieDetailsPromises = topMovies.map((movie: any) => fetchContentDetails(movie.id.toString(), 'movie'));
          
          const movieDetails = await Promise.all(movieDetailsPromises);
          const validMovies = movieDetails.filter(movie => movie !== null) as Movie[];
          
          if (validMovies.length > 0) {
            setFeaturedMovies(validMovies);
            setTimeout(() => setHasInitiallyLoaded(true), 100);
          }
        }
      } catch (error) {
        console.error('Error loading featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);

  useEffect(() => {
    if (featuredMovies.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length);
        setIsTransitioning(false);
      }, 150);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [featuredMovies.length, isPaused]);

  const formatReleaseYear = (releaseDate: string) => {
    return new Date(releaseDate).getFullYear();
  };

  const truncateOverview = (text: string, maxLength: number = 200) => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleWatchNow = () => {
    const currentMovie = featuredMovies[currentMovieIndex];
    if (currentMovie && onWatchNow) {
      onWatchNow(currentMovie as ContentItem);
    }
  };

  const handleMoreDetails = () => {
    const currentMovie = featuredMovies[currentMovieIndex];
    if (currentMovie && onMoreDetails) {
      onMoreDetails(currentMovie as ContentItem);
    }
  };

  const goToSlide = (index: number) => {
    if (index !== currentMovieIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMovieIndex(index);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Minimum swipe distance (in px) to trigger slide change
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next
      goToSlide(currentMovieIndex === featuredMovies.length - 1 ? 0 : currentMovieIndex + 1);
    } else if (isRightSwipe) {
      // Swipe right - go to previous
      goToSlide(currentMovieIndex === 0 ? featuredMovies.length - 1 : currentMovieIndex - 1);
    }
  };

  const currentMovie = featuredMovies[currentMovieIndex];

  const isInWatchLater = (movie: any) => watchLater.some(w => w.id === movie.id && w.type === 'movie');
  const toggleWatchLater = (movie: any) => {
    const exists = isInWatchLater(movie);
    const updated = exists
      ? watchLater.filter(w => !(w.id === movie.id && w.type === 'movie'))
      : [...watchLater, { id: movie.id, type: 'movie', title: movie.title, poster: movie.poster_path, addedAt: new Date().toISOString() }];
    setWatchLater(updated);
    setLocalStorage('watchLater', updated);
  };

  const getCertification = (movie: any): string => {
    try {
      const rels = movie.release_dates?.results || [];
      const us = rels.find((r: any) => r.iso_3166_1 === 'US');
      const cert = us?.release_dates?.find((d: any) => d.certification)?.certification;
      return cert || '';
    } catch { return ''; }
  };

  const getRuntime = (movie: any): string => {
    if (movie.runtime) return formatRuntime(movie.runtime);
    return '';
  };

  const getPrimaryGenre = (movie: any): string => movie.genres?.[0]?.name || '';

  const getTrailer = (movie: any) => {
    const vids = movie.videos?.results || [];
    return vids.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || vids[0];
  };

  if (loading) {
    return (
      <div className="relative h-screen bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="h-8 bg-gray-700 rounded mb-4 w-48"></div>
            <div className="h-12 bg-gray-700 rounded mb-6 w-96"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5"></div>
              <div className="h-4 bg-gray-700 rounded w-3/5"></div>
            </div>
            <div className="flex space-x-4">
              <div className="h-12 bg-gray-700 rounded w-32"></div>
              <div className="h-12 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    return null;
  }

  return (
    <motion.div 
      className="relative h-screen md:h-screen bg-black"
      style={{ height: 'calc(100vh - 4rem)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={`https://image.tmdb.org/t/p/original${isMobile ? currentMovie.poster_path : currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            fill
            className="object-cover object-center h-full w-full"
            priority
            sizes="100vw"
          />
        </div>
  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
  <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Trending Badge */}
      {/* <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          <span>Trending Now</span>
        </div>
      </div> */}

      {/* Carousel Indicators - Desktop only */}
      {featuredMovies.length > 1 && (
        // <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="hidden md:block absolute bottom-8 right-10 z-30">
          <div className="flex space-x-3">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentMovieIndex 
                    ? 'bg-white scale-110 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Desktop Main Content */}
      <motion.div 
        // className="hidden md:flex relative z-20 container mx-auto px-4 sm:px-6 lg:px-16 h-full items-start pt-28 sm:pt-24 md:pt-32 lg:pt-48 pb-12 sm:pb-20"
        className="hidden md:flex relative z-20 container mx-auto px-4 sm:px-6 lg:px-16 h-full items-start pt-36 sm:pt-32 md:pt-44 lg:pt-60 pb-12 sm:pb-20"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="max-w-xl sm:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentMovieIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {currentMovie.title}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-5 text-xs sm:text-sm text-gray-200 font-medium mb-3 sm:mb-4 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
              <span>{formatReleaseYear(currentMovie.release_date)}</span>
              {getCertification(currentMovie) && (
                <span className="bg-red-600 text-white font-semibold px-2 py-1 rounded-sm text-[10px] sm:text-[11px] leading-none tracking-wide">
                  {getCertification(currentMovie)}
                </span>
              )}
              {getRuntime(currentMovie) && <span>{getRuntime(currentMovie)}</span>}
              {getPrimaryGenre(currentMovie) && <span>{getPrimaryGenre(currentMovie)}</span>}
              </motion.div>
              <motion.p 
                className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 md:mb-6 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {truncateOverview(currentMovie.overview, 120)}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.button
                  onClick={handleWatchNow}
                  className="flex items-center justify-center gap-2 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-600 hover:from-fuchsia-400 hover:via-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-fuchsia-900/40 hover:shadow-fuchsia-700/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l7-5z"/></svg>
                  PLAY
                </motion.button>
                <motion.button
                  onClick={() => toggleWatchLater(currentMovie)}
                  className="flex items-center justify-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm tracking-wide transition-colors border border-white/30 hover:border-white/50 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className={`w-4 sm:w-5 h-4 sm:h-5 ${isInWatchLater(currentMovie) ? 'fill-current' : ''}`} fill={isInWatchLater(currentMovie) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  {isInWatchLater(currentMovie) ? 'MY LIST ✓' : '+ MY LIST'}
                </motion.button>
              </motion.div>
              {getTrailer(currentMovie) && (
                <motion.button
                  onClick={() => {
                    const t = getTrailer(currentMovie); if (t) window.open(`https://www.youtube.com/watch?v=${t.key}`, '_blank');
                  }}
                  className="flex items-center gap-3 sm:gap-4 group text-white/90 hover:text-white tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-full flex items-center justify-center border-2 border-white/70 group-hover:border-white transition-colors">
                    <svg className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l7-5z"/></svg>
                  </span>
                  <span className="text-xs sm:text-sm font-medium">WATCH TRAILER</span>
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile Main Content */}
      <motion.div 
        className="md:hidden relative z-20 h-full flex flex-col justify-end px-4 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentMovieIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col transform -translate-y-10"
          >
            {/* Title */}
            <motion.h1 
              className="text-3xl font-bold text-white mb-3 leading-tight tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {currentMovie.title}
            </motion.h1>

            {/* Year and Certification Badge */}
            <motion.div 
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-xs font-medium">{formatReleaseYear(currentMovie.release_date)}</span>
              </div>
              
              {/* Certification Badge */}
              {getCertification(currentMovie) && (
                <div className="bg-red-600 backdrop-blur-sm px-1.5 py-0.1 rounded shadow-lg">
                  <span className="text-white font-bold text-[10px]">{getCertification(currentMovie)}</span>
                </div>
              )}
            </motion.div>

            {/* Genre Tags */}
            <motion.div 
              className="flex flex-wrap gap-1.5 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {currentMovie.genres?.slice(0, 3).map((genre: { id: number; name: string }) => (
                <span 
                  key={genre.id} 
                  className="bg-black/50 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-white/20"
                >
                  {genre.name}
                </span>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Watch Now Button */}
              <motion.button
                onClick={handleWatchNow}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-5 py-3 rounded-lg font-bold text-sm tracking-wide shadow-xl hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch Now
              </motion.button>

              {/* Info Button */}
              <motion.button
                onClick={handleMoreDetails}
                className="flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full border-2 border-white/30 hover:bg-black/70 hover:border-white/50 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

        {/* Navigation Arrows (Hidden on mobile) */}
        {featuredMovies.length > 1 && (
          <>
            <motion.button
                onClick={() => goToSlide(currentMovieIndex === 0 ? featuredMovies.length - 1 : currentMovieIndex - 1)}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-lg transition duration-300 hover:scale-110 backdrop-blur-md z-30"
                aria-label="Previous movie"
                initial={hasInitiallyLoaded ? false : { opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: hasInitiallyLoaded ? 0.3 : 0.6, delay: hasInitiallyLoaded ? 0 : 1.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </motion.button>

            <motion.button
                onClick={() => goToSlide(currentMovieIndex === featuredMovies.length - 1 ? 0 : currentMovieIndex + 1)}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-lg transition duration-300 hover:scale-110 backdrop-blur-md z-30"
                aria-label="Next movie"
                initial={hasInitiallyLoaded ? false : { opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: hasInitiallyLoaded ? 0.3 : 0.6, delay: hasInitiallyLoaded ? 0 : 1.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </motion.button>
          </>
        )}
    </motion.div>
  );
}


