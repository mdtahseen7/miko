'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  fetchMovies, 
  TMDB_IMAGE_BASE_URL,
  fetchContentDetails 
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

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        setLoading(true);
        // Fetch popular movies (first page)
        const moviesResponse = await fetchMovies(1);
        
        if (moviesResponse.results && moviesResponse.results.length > 0) {
          // Get top 5 movies for carousel
          const topMovies = moviesResponse.results.slice(0, 5);
          const movieDetailsPromises = topMovies.map((movie: any) => 
            fetchContentDetails(movie.id.toString(), 'movie')
          );
          
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
    }, 6000); // Change every 6 seconds

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
      className="relative h-[calc(100vh-80px)] bg-black overflow-hidden"
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
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
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
      <div className="relative z-20 container mx-auto px-6 lg:px-20 h-full flex items-center">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Movie Title */}
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            {/* Movie Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center space-x-1 bg-black/50 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{formatReleaseYear(currentMovie.release_date)}</span>
              </span>
              
              <span className="flex items-center space-x-1 bg-black/50 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Movie</span>
              </span>

              <div className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : '0.0'}/10</span>
              </div>
            </div>

            {/* Genres */}
            {currentMovie.genres && currentMovie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentMovie.genres.slice(0, 3).map((genre: any) => (
                  <span
                    key={genre.id}
                    className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-white/20"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Movie Overview */}
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
              {truncateOverview(currentMovie.overview, 180)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleWatchNow}
                className="group relative flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5z" />
                </svg>
                <span className="relative z-10">Watch Now</span>
              </button>
              {/* More Details Button - will add later not usable right now*/}
              {/* <button
                onClick={handleMoreDetails}
                className="group relative flex items-center justify-center space-x-2 bg-black/20 hover:bg-black/40 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 border border-white/20 hover:border-white/40 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="relative z-10">More Details</span>
              </button> */}
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
    </div>
  );
}
