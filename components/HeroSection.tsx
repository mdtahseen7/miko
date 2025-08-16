'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  // Load watch later list once
  useEffect(() => {
    const saved = getLocalStorage('watchLater', []);
    setWatchLater(saved);
  }, []);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        setLoading(true);
        // Fetch popular movies (first page)
        const moviesResponse = await fetchMovies(1);
        
        if (moviesResponse.results && moviesResponse.results.length > 0) {
          // Get top 7 movies for carousel
          const topMovies = moviesResponse.results.slice(0, 6);
          const movieDetailsPromises = topMovies.map((movie: any) => fetchContentDetails(movie.id.toString(), 'movie'));
          
          const movieDetails = await Promise.all(movieDetailsPromises);
          const validMovies = movieDetails.filter(movie => movie !== null) as Movie[];
          
          if (validMovies.length > 0) {
            setFeaturedMovies(validMovies);
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

  // Auto-rotate carousel
  useEffect(() => {
    if (featuredMovies.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length);
        setIsTransitioning(false);
      }, 150);
    }, 4000); // Change every 4 seconds

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
      <div className="relative h-[calc(100vh-80px)] bg-gray-900 animate-pulse">
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
    <div 
      className="relative h-[92vh] bg-black overflow-hidden mb-14 sm:mb-12 lg:mb-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        {/* Dark overlay gradients now extend beneath navbar for better readability */}
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

      {/* Carousel Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex space-x-3">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
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

      {/* Main Content */}
  <div className="relative z-20 container mx-auto px-6 lg:px-16 h-full flex items-start pt-60 sm:pt-28 md:pt-40 lg:pt-64 pb-24">
        <div className="max-w-2xl">
          <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <h1 className="text-4xl md:text-6xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              {currentMovie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-200 font-medium mb-6">
              <span>{formatReleaseYear(currentMovie.release_date)}</span>
              {getCertification(currentMovie) && (
                <span className="bg-red-600 text-white font-semibold px-2 py-1 rounded-sm text-[11px] leading-none tracking-wide">
                  {getCertification(currentMovie)}
                </span>
              )}
              {getRuntime(currentMovie) && <span>{getRuntime(currentMovie)}</span>}
              {getPrimaryGenre(currentMovie) && <span>{getPrimaryGenre(currentMovie)}</span>}
            </div>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 max-w-xl">
              {truncateOverview(currentMovie.overview, 130)}
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={handleWatchNow}
                className="flex items-center gap-2 px-7 py-3 rounded-sm font-semibold text-sm tracking-wide text-white bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-600 hover:from-fuchsia-400 hover:via-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-fuchsia-900/40 hover:shadow-fuchsia-700/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l7-5z"/></svg>
                PLAY
              </button>
              <button
                onClick={() => toggleWatchLater(currentMovie)}
                className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-sm font-semibold text-sm tracking-wide transition-colors border border-white/30 hover:border-white/50"
              >
                <svg className={`w-5 h-5 ${isInWatchLater(currentMovie) ? 'fill-current' : ''}`} fill={isInWatchLater(currentMovie) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                {isInWatchLater(currentMovie) ? 'MY LIST ✓' : '+ MY LIST'}
              </button>
            </div>
            {getTrailer(currentMovie) && (
              <button
                onClick={() => {
                  const t = getTrailer(currentMovie); if (t) window.open(`https://www.youtube.com/watch?v=${t.key}`, '_blank');
                }}
                className="flex items-center gap-4 group text-white/90 hover:text-white tracking-wider"
              >
                <span className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/70 group-hover:border-white transition-colors">
                  <svg className="w-7 h-7 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l7-5z"/></svg>
                </span>
                <span className="text-sm font-medium">WATCH TRAILER</span>
              </button>
            )}
          </div>
        </div>
      </div>

        {/* Navigation Arrows (Hidden on mobile) */}
        {featuredMovies.length > 1 && (
          <>
            <button
                onClick={() => goToSlide(currentMovieIndex === 0 ? featuredMovies.length - 1 : currentMovieIndex - 1)}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-lg transition duration-300 hover:scale-110 backdrop-blur-md z-30"
                aria-label="Previous movie"
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
            </button>

            <button
                onClick={() => goToSlide(currentMovieIndex === featuredMovies.length - 1 ? 0 : currentMovieIndex + 1)}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-lg transition duration-300 hover:scale-110 backdrop-blur-md z-30"
                aria-label="Next movie"
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
            </button>
          </>
        )}
    </div>
  );
}
