'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchMovies, 
  fetchTVShows, 
  fetchHollywoodMovies,
  fetchBollywoodMovies,
  fetchAnimeContent,
  fetchNetflixContent,
  fetchAmazonPrimeContent,
  searchContent, 
  TMDB_IMAGE_BASE_URL,
  getLocalStorage,
  setLocalStorage,
  blockedMovieIds,
  filterAdultContent
} from '@/lib/utils';
import type { ContentItem } from '@/lib/types';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import ContentSection from '@/components/ContentSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [currentView, setCurrentView] = useState('home');
  const [movies, setMovies] = useState<ContentItem[]>([]);
  const [tvShows, setTVShows] = useState<ContentItem[]>([]);
  const [hollywoodMovies, setHollywoodMovies] = useState<ContentItem[]>([]);
  const [bollywoodMovies, setBollywoodMovies] = useState<ContentItem[]>([]);
  const [animeContent, setAnimeContent] = useState<ContentItem[]>([]);
  const [netflixContent, setNetflixContent] = useState<ContentItem[]>([]);
  const [amazonPrimeContent, setAmazonPrimeContent] = useState<ContentItem[]>([]);
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPage, setMoviesPage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [hollywoodPage, setHollywoodPage] = useState(1);
  const [bollywoodPage, setBollywoodPage] = useState(1);
  const [animePage, setAnimePage] = useState(1);
  const [netflixPage, setNetflixPage] = useState(1);
  const [amazonPrimePage, setAmazonPrimePage] = useState(1);
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false); // legacy state (will be deprecated)
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Ref to track if we're loading more content
  const isLoadingMoreRef = useRef(false);
  const savedScrollPositionRef = useRef(0);

  // Genres data
  const movieGenres = [
    { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' }, { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ];

  useEffect(() => {
    loadContent();
    loadWatchLater();
    

  const handleScroll = () => setIsScrolled(window.scrollY > 50);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isLoadingMoreRef.current && !loading && savedScrollPositionRef.current > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, savedScrollPositionRef.current);
        isLoadingMoreRef.current = false;
        savedScrollPositionRef.current = 0;
      });
    }
  }, [loading]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [
        moviesData, 
        tvData, 
        hollywoodData, 
        bollywoodData, 
        animeData,
        netflixData,
        amazonPrimeData
      ] = await Promise.all([
        fetchMovies(moviesPage),
        fetchTVShows(tvPage),
        fetchHollywoodMovies(hollywoodPage),
        fetchBollywoodMovies(bollywoodPage),
        fetchAnimeContent(animePage),
        fetchNetflixContent(netflixPage),
        fetchAmazonPrimeContent(amazonPrimePage)
      ]);

      const filteredMovies = filterAdultContent(
        moviesData.results?.filter(
          (movie: any) => !blockedMovieIds.includes(movie.id.toString())
        ) || [],
        false
      );

      const filteredHollywood = filterAdultContent(
        hollywoodData.results?.filter(
          (movie: any) => !blockedMovieIds.includes(movie.id.toString())
        ) || [],
        false
      );

      const filteredBollywood = filterAdultContent(
        bollywoodData.results?.filter(
          (movie: any) => !blockedMovieIds.includes(movie.id.toString())
        ) || [],
        false
      );

      const filteredAnime = filterAdultContent(
        animeData.results?.filter(
          (item: any) => !blockedMovieIds.includes(item.id.toString())
        ) || [],
        false
      );

      const filteredTVShows = filterAdultContent(
        tvData.results || [],
        false
      );

      const filteredNetflix = filterAdultContent(
        netflixData.results?.filter(
          (movie: any) => !blockedMovieIds.includes(movie.id.toString())
        ) || [],
        false
      );

      const filteredAmazonPrime = filterAdultContent(
        amazonPrimeData.results?.filter(
          (movie: any) => !blockedMovieIds.includes(movie.id.toString())
        ) || [],
        false
      );

      console.log('Amazon Prime raw results:', amazonPrimeData.results?.length || 0);
      console.log('Amazon Prime filtered results:', filteredAmazonPrime.length);
      console.log('Amazon Prime data sample:', amazonPrimeData.results?.slice(0, 2));

      setMovies(filteredMovies);
      setTVShows(filteredTVShows);
      setHollywoodMovies(filteredHollywood);
      setBollywoodMovies(filteredBollywood);
      setAnimeContent(filteredAnime);
      setNetflixContent(filteredNetflix);
      setAmazonPrimeContent(filteredAmazonPrime);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWatchLater = () => {
    const saved = getLocalStorage('watchLater', []);
    setWatchLater(saved);
  };

  const loadMoreContent = async (contentType: string) => {
    if (loading || isLoadingMoreRef.current) {
      return;
    }
    
    isLoadingMoreRef.current = true;
    savedScrollPositionRef.current = window.scrollY;
    
    setLoading(true);
    try {
      let nextPage;
      let currentContent;
      let setContent;
      let setPage;

      switch (contentType) {
        case 'movies':
          nextPage = moviesPage + 1;
          currentContent = movies;
          setContent = setMovies;
          setPage = setMoviesPage;
          break;
        case 'tv':
          nextPage = tvPage + 1;
          currentContent = tvShows;
          setContent = setTVShows;
          setPage = setTvPage;
          break;
        case 'hollywood':
          nextPage = hollywoodPage + 1;
          currentContent = hollywoodMovies;
          setContent = setHollywoodMovies;
          setPage = setHollywoodPage;
          break;
        case 'bollywood':
          nextPage = bollywoodPage + 1;
          currentContent = bollywoodMovies;
          setContent = setBollywoodMovies;
          setPage = setBollywoodPage;
          break;
        case 'anime':
          nextPage = animePage + 1;
          currentContent = animeContent;
          setContent = setAnimeContent;
          setPage = setAnimePage;
          break;
        case 'netflix':
          nextPage = netflixPage + 1;
          currentContent = netflixContent;
          setContent = setNetflixContent;
          setPage = setNetflixPage;
          break;
        case 'amazonprime':
          nextPage = amazonPrimePage + 1;
          currentContent = amazonPrimeContent;
          setContent = setAmazonPrimeContent;
          setPage = setAmazonPrimePage;
          break;
        default:
          return;
      }

      let newData;
      switch (contentType) {
        case 'movies':
          newData = await fetchMovies(nextPage);
          break;
        case 'tv':
          newData = await fetchTVShows(nextPage);
          break;
        case 'hollywood':
          newData = await fetchHollywoodMovies(nextPage);
          break;
        case 'bollywood':
          newData = await fetchBollywoodMovies(nextPage);
          break;
        case 'anime':
          newData = await fetchAnimeContent(nextPage);
          break;
        case 'netflix':
          newData = await fetchNetflixContent(nextPage);
          break;
        case 'amazonprime':
          newData = await fetchAmazonPrimeContent(nextPage);
          break;
        default:
          return;
      }

      const filteredNewData = filterAdultContent(
        newData.results?.filter(
          (item: any) => !blockedMovieIds.includes(item.id.toString())
        ) || [],
        false
      );

      setContent([...currentContent, ...filteredNewData]);
      setPage(nextPage);
    } catch (error) {
      console.error(`Error loading more ${contentType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchContent(searchQuery);
      
      const searchTerms = searchQuery.toLowerCase();
      const isAdultSearch = ['adult', 'sex', 'erotic', 'xxx', 'porn', 'explicit', 'nude'].some(
        term => searchTerms.includes(term)
      );
      
      const filteredResults = filterAdultContent(
        results.results?.filter(
          (item: any) => !blockedMovieIds.includes(item.id.toString())
        ) || [],
        isAdultSearch
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchLater = (item: ContentItem) => {
    const watchLaterItem = {
      id: item.id,
      type: item.media_type || (item.title ? 'movie' : 'tv'),
      title: item.title || item.name || '',
      poster: item.poster_path,
      addedAt: new Date().toISOString()
    };

    const existingIndex = watchLater.findIndex(w => w.id === item.id && w.type === watchLaterItem.type);
    let newWatchLater;
    
    if (existingIndex >= 0) {
      newWatchLater = watchLater.filter((_, index) => index !== existingIndex);
    } else {
      newWatchLater = [...watchLater, watchLaterItem];
    }

    setWatchLater(newWatchLater);
    setLocalStorage('watchLater', newWatchLater);
  };

  const isInWatchLater = (item: ContentItem) => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    return watchLater.some(w => w.id === item.id && w.type === type);
  };

  const handleHeroWatchNow = (movie: ContentItem) => {
    const movieId = movie.id;
    const movieType = 'movie';
    window.location.href = `/details?id=${movieId}&type=${movieType}`;
  };

  const handleHeroMoreDetails = (movie: ContentItem) => {
    alert(`More details for: ${movie.title || movie.name}
    This prompt will be changed to show actual details in the future.`);
  };

  const getFilteredContent = (): (ContentItem | any)[] => {
    let content: (ContentItem | any)[] = [];
    
    if (currentView === 'home') {
      content = [...movies, ...tvShows];
    } else if (currentView === 'movies') {
      content = movies;
    } else if (currentView === 'tv') {
      content = tvShows;
    } else if (currentView === 'hollywood') {
      content = hollywoodMovies;
    } else if (currentView === 'bollywood') {
      content = bollywoodMovies;
    } else if (currentView === 'anime') {
      content = animeContent;
    } else if (currentView === 'netflix') {
      content = netflixContent;
    } else if (currentView === 'amazonprime') {
      content = amazonPrimeContent;
    } else if (currentView === 'search') {
      content = searchResults;
    } else if (currentView === 'watchlater') {
      return watchLater;
    }

    // Apply filters
    if (selectedGenre !== 'all') {
      content = content.filter((item: any) => 
        item.genre_ids?.includes(parseInt(selectedGenre))
      );
    }

    if (selectedYear !== 'all') {
      content = content.filter((item: any) => {
        const year = new Date(item.release_date || item.first_air_date || '').getFullYear();
        return year.toString() === selectedYear;
      });
    }

    return content;
  };

  const ContentCard = ({ item }: { item: ContentItem | any }) => {
    const title = item.title || item.name || '';
    const posterPath = item.poster_path || item.poster;
    const releaseDate = item.release_date || item.first_air_date || '';
    const rating = item.vote_average || 0;
    const overview = item.overview || '';
    const type = item.type || item.media_type || (item.title ? 'movie' : 'tv');

    const truncateText = (text: string, maxLength: number = 120) => {
      if (!text || typeof text !== 'string') return '';
      if (text.length <= maxLength) return text;
      return text.substr(0, maxLength) + '...';
    };

    return (
      <motion.div 
        className="group relative bg-gray-900 rounded-xl overflow-hidden card-hover"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative aspect-[5/7]">
          {posterPath ? (
            <Image
              src={item.poster ? posterPath : `${TMDB_IMAGE_BASE_URL}${posterPath}`}
              alt={title}
              fill
              className="object-cover transition-all duration-150"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          
          {/* Bookmark icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToWatchLater(item);
            }}
            className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-full p-2 transition-all duration-100 hover:bg-black/80"
          >
            <svg 
              className={`w-5 h-5 transition-colors ${
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
          
          {/* Hover overlay with details */}
          <div className="card-overlay absolute inset-0 flex flex-col justify-end p-4 text-white">
            <div className="space-y-2">
              <h3 className="font-bold text-sm leading-tight">{title}</h3>
              
              {rating > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-sm font-semibold">{rating.toFixed(1)}/10</span>
                </div>
              )}
              
              {/* {overview && (
                <p className="text-sm text-gray-200 leading-relaxed">
                  {truncateText(overview)}
                </p>
              )} */}
              
              <Link
                href={`/details?id=${item.id}&type=${type}`}
                className="inline-flex items-center mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5z"/>
                </svg>
                Watch
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-black text-white overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLater.length}
        isScrolled={isScrolled}
        onViewChange={(view) => {
          if (view === 'livesports') {
            window.location.href = '/livesports';
            return;
          }
          setCurrentView(view);
          if (view !== 'search') {
            setSearchQuery('');
            setShowSearch(false);
          }
          // Reset filters when changing views
          setSelectedGenre('all');
          setSelectedYear('all');
        }}
  onSearchToggle={() => { window.location.href = '/search'; }}
  onSearchChange={() => {}}
      />

      {/* Hero Section - Only show on home page */}
  {currentView === 'home' && (
        <HeroSection 
          onWatchNow={handleHeroWatchNow}
          onMoreDetails={handleHeroMoreDetails}
        />
      )}

      {/* Main content */}
  <main className={currentView === 'home' ? "pb-8" : "pt-24 pb-8"}>
        <div className="container mx-auto px-4">
          {/* Filters */}
          {currentView !== 'watchlater' && currentView !== 'home' && (
            <div className="mb-8 space-y-4">
              
              
              {currentView !== 'search' && (
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Content is filtered for appropriate audiences. Search for specific content to view all results.</span>
                </div>
              )}
            </div>
          )}
          
          {/* Content */}
          {loading ? (
            <div className="py-10" />
          ) : currentView === 'home' ? (
            <div className="space-y-8">

              {/* Popular Movies Section */}
              <ContentSection
                title="Trending Movies"
                subtitle="Most popular movies right now"
                content={movies}
                onAddToWatchLater={addToWatchLater}
                isInWatchLater={isInWatchLater}
                sectionId="movies"
                onViewAll={() => setCurrentView('movies')}
              />
              
              {/* Popular TV Shows Section */}
              <ContentSection
                title="Popular TV Shows"
                subtitle="Binge-worthy series and shows"
                content={tvShows}
                onAddToWatchLater={addToWatchLater}
                isInWatchLater={isInWatchLater}
                sectionId="tv"
                onViewAll={() => setCurrentView('tv')}
              />
              
              {/* Hollywood Section */}
              <ContentSection
                title="Hollywood"
                subtitle="Latest blockbusters and Hollywood hits"
                content={hollywoodMovies}
                onAddToWatchLater={addToWatchLater}
                isInWatchLater={isInWatchLater}
                sectionId="hollywood"
                onViewAll={() => setCurrentView('hollywood')}
              />
              
              {/* Bollywood Section */}
              <ContentSection
                title="Bollywood"
                subtitle="Popular Hindi movies and entertainment"
                content={bollywoodMovies}
                onAddToWatchLater={addToWatchLater}
                isInWatchLater={isInWatchLater}
                sectionId="bollywood"
                onViewAll={() => setCurrentView('bollywood')}
              />
              
              {/* Anime Section */}
              <ContentSection
                title="Anime"
                subtitle="Top Japanese animation series and movies"
                content={animeContent}
                onAddToWatchLater={addToWatchLater}
                isInWatchLater={isInWatchLater}
                sectionId="anime"
                onViewAll={() => setCurrentView('anime')}
              />
              
              {/* Netflix Section */}
              <ContentSection
                title="Netflix Originals"
                subtitle="Exclusive Netflix movies and series"
                content={netflixContent}
                onAddToWatchLater={addToWatchLater}
                isInWatchLater={isInWatchLater}
                sectionId="netflix"
                onViewAll={() => setCurrentView('netflix')}
              />
              
              {/* Amazon Prime Section */}
              <ContentSection
                title="Amazon Prime"
                subtitle="Prime Video exclusive content"
                content={amazonPrimeContent}
                onAddToWatchLater={addToWatchLater}
                isInWatchLater={isInWatchLater}
                sectionId="amazonprime"
                onViewAll={() => setCurrentView('amazonprime')}
              />
              
            </div>
          ) : (
            <>
              {/* Section title */}
              <h2 className="text-2xl font-bold mb-6">
                {currentView === 'movies' && 'Popular Movies'}
                {currentView === 'tv' && 'Popular TV Shows'}
                {currentView === 'hollywood' && 'Hollywood Movies'}
                {currentView === 'bollywood' && 'Bollywood Movies'}
                {currentView === 'anime' && 'Anime Content'}
                {currentView === 'netflix' && 'Netflix Content'}
                {currentView === 'amazonprime' && 'Amazon Prime Video Content'}
                {currentView === 'search' && `Search Results for "${searchQuery}"`}
                {currentView === 'watchlater' && 'Watch Later'}
              </h2>
              
              {/* Content grid */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, staggerChildren: 0.05 }}
              >
                {getFilteredContent().map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.type || item.media_type || 'unknown'}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ContentCard item={item} />
                  </motion.div>
                ))}
              </motion.div>

              {(currentView === 'movies' || currentView === 'tv' || currentView === 'hollywood' || currentView === 'bollywood' || currentView === 'anime' || currentView === 'netflix' || currentView === 'amazonprime') && getFilteredContent().length > 0 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => loadMoreContent(currentView)}
                    disabled={loading}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <span className="tracking-wide">Loading…</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Load More</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {getFilteredContent().length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">
                    {currentView === 'search' ? 'No results found' : 'No content available'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
