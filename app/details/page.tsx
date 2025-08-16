'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  fetchContentDetails, 
  fetchSeasonDetails, 
  TMDB_IMAGE_BASE_URL,
  formatRuntime,
  getLocalStorage,
  setLocalStorage,
  filterAdultContent,
  blockedMovieIds
} from '@/lib/utils';
import type { Movie, TVShow, Season, Episode } from '@/lib/types';
import Navbar from '@/components/Navbar';

function DetailsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<Movie | TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchLater, setWatchLater] = useState<any[]>([]);

  const contentId = searchParams.get('id');
  const contentType = searchParams.get('type') as 'movie' | 'tv';

  useEffect(() => {
    if (contentId && contentType) {
      loadContent();
      loadWatchLater();
    }
  }, [contentId, contentType]);

  useEffect(() => {
    if (content && contentType === 'tv' && selectedSeason) {
      loadSeasonData();
    }
  }, [content, selectedSeason]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadWatchLater = () => {
    const saved = getLocalStorage('watchLater', []);
    setWatchLater(saved);
    setWatchLaterCount(saved.length);
  };

  const loadContent = async () => {
    if (!contentId || !contentType) return;
    
    setLoading(true);
    try {
      const data = await fetchContentDetails(contentId, contentType);
      setContent(data);
      
      // If it's a TV show, load the first season by default
      if (contentType === 'tv' && data?.number_of_seasons) {
        setSelectedSeason(1);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonData = async () => {
    if (!contentId || !selectedSeason) return;
    
    try {
      const data = await fetchSeasonDetails(contentId, selectedSeason);
      setSeasonData(data);
    } catch (error) {
      console.error('Error loading season data:', error);
    }
  };

  const addToWatchLater = () => {
    if (!content) return;

    const watchLaterItem = {
      id: content.id,
      type: contentType,
      title: 'title' in content ? content.title : content.name,
      poster: content.poster_path,
      addedAt: new Date().toISOString()
    };

    const existingIndex = watchLater.findIndex(w => w.id === content.id && w.type === contentType);
    let newWatchLater;
    
    if (existingIndex >= 0) {
      newWatchLater = watchLater.filter((_, index) => index !== existingIndex);
    } else {
      newWatchLater = [...watchLater, watchLaterItem];
    }

    setWatchLater(newWatchLater);
    setLocalStorage('watchLater', newWatchLater);
    setWatchLaterCount(newWatchLater.length);
  };

  const isInWatchLater = () => {
    if (!content) return false;
    return watchLater.some(w => w.id === content.id && w.type === contentType);
  };

  const handleWatchNow = (episodeId?: number) => {
    if (!content) return;
    
    const watchUrl = contentType === 'tv' && episodeId 
      ? `/watch?id=${contentId}&type=${contentType}&season=${selectedSeason}&episode=${episodeId}`
      : `/watch?id=${contentId}&type=${contentType}`;
    
    router.push(watchUrl);
  };

  const getBackdropUrl = () => {
    if (!content?.backdrop_path) return '/placeholder-backdrop.jpg';
    return `${TMDB_IMAGE_BASE_URL.replace('w500', 'w1280')}${content.backdrop_path}`;
  };

  const getPosterUrl = () => {
    if (!content?.poster_path) return '/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}${content.poster_path}`;
  };

  const getTitle = () => {
    if (!content) return '';
    return 'title' in content ? content.title : content.name;
  };

  const getReleaseYear = () => {
    if (!content) return '';
    const date = 'release_date' in content ? content.release_date : content.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  const getGenres = () => {
    if (!content?.genres) return [];
    return content.genres.slice(0, 3);
  };

  const getRuntime = () => {
    if (!content) return '';
    
    if (contentType === 'movie' && 'runtime' in content && content.runtime) {
      return formatRuntime(content.runtime);
    }
    if (contentType === 'tv' && 'episode_run_time' in content && content.episode_run_time && Array.isArray(content.episode_run_time) && content.episode_run_time[0]) {
      return `${content.episode_run_time[0]} min per episode`;
    }
    return '';
  };

  const getCertification = () => {
    if (!content) return '';
    try {
      if (contentType === 'movie' && (content as any).release_dates) {
        const rels = (content as any).release_dates.results || [];
        const us = rels.find((r: any) => r.iso_3166_1 === 'US');
        const cert = us?.release_dates?.find((d: any) => d.certification)?.certification;
        return cert || '';
      }
      if (contentType === 'tv' && (content as any).content_ratings) {
        const ratings = (content as any).content_ratings.results || [];
        const us = ratings.find((r: any) => r.iso_3166_1 === 'US');
        return us?.rating || '';
      }
    } catch {}
    return '';
  };

  const getPrimaryGenre = () => getGenres()[0]?.name || '';

  const trailer = (() => {
    if (!content) return null;
    const vids = (content as any).videos?.results || [];
    return vids.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || vids[0] || null;
  })();

  // Build recommendations list from TMDB 'similar' results already included in details fetch
  const getRecommendations = () => {
    if (!content) return [] as any[];
    const similar = (content as any).similar?.results || [];
    if (!Array.isArray(similar) || similar.length === 0) return [] as any[];
    // Basic filtering: remove current item, blocked IDs, missing posters, low rated noise, adult-ish content
    const allowAdult = false; // always filter here; could expose toggle later
    let recs = filterAdultContent(
      similar.filter((item: any) =>
        item.id !== content.id &&
        !blockedMovieIds.includes(item.id?.toString()) &&
        item.poster_path
      ),
      allowAdult
    );
    // Optional quality filtering
    recs = recs.filter((r: any) => (r.vote_average || 0) >= 5.5);
    // De-duplicate by id
    const seen = new Set();
    const unique: any[] = [];
    for (const r of recs) { if (!seen.has(r.id)) { seen.add(r.id); unique.push(r); } }
    return unique.slice(0, 15);
  };

  const recommendations = getRecommendations();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar
          currentView="details"
          showSearch={false}
          searchQuery={searchQuery}
          watchLaterCount={watchLaterCount}
          isScrolled={isScrolled}
          onViewChange={() => {}}
          onSearchToggle={() => { window.location.href = '/search'; }}
          onSearchChange={() => {}}
        />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <p className="text-gray-400 text-sm tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar
          currentView="details"
          showSearch={false}
          searchQuery={searchQuery}
          watchLaterCount={watchLaterCount}
          isScrolled={isScrolled}
          onViewChange={() => {}}
          onSearchToggle={() => { window.location.href = '/search'; }}
          onSearchChange={() => {}}
        />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="text-gray-400 mb-6">The content you're looking for could not be found.</p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-black text-white">
      <Navbar
        currentView="details"
        showSearch={false}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={() => {}}
        onSearchToggle={() => { window.location.href = '/search'; }}
        onSearchChange={() => {}}
      />

      {/* Hero Section with Backdrop */}
  <div className="relative h-[88vh] overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl()}
            alt={getTitle()}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Back to Home Button - Fixed positioning on the left */}
        <div className="fixed top-24 left-4 z-50">
          <Link
            href="/"
            className="flex items-center space-x-2 bg-black/90 hover:bg-black backdrop-blur-sm text-white px-4 py-3 rounded-xl transition-all duration-300 border border-white/30 hover:border-white/50 shadow-2xl hover:shadow-3xl group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center h-full pt-24 pb-10">
          <div className="container mx-auto px-4 lg:px-16 max-w-7xl">
            <div className="max-w-2xl">
              {/* Title */}
              <h1 className="font-bold leading-tight text-5xl lg:text-6xl mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                {getTitle()}
              </h1>
              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 mb-6">
                {getReleaseYear() && <span className="opacity-90">{getReleaseYear()}</span>}
                {getCertification() && (
                  <span className="bg-red-600 text-white font-semibold px-2 py-1 rounded-sm text-[11px] leading-none">{getCertification()}</span>
                )}
                {getRuntime() && <span className="opacity-90">{getRuntime()}</span>}
                {getPrimaryGenre() && <span className="opacity-90">{getPrimaryGenre()}</span>}
              </div>
              {/* Overview */}
              <p className="text-gray-200 text-base lg:text-lg leading-relaxed mb-8 line-clamp-[10] max-h-[15rem]">
                {content.overview}
              </p>
              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => handleWatchNow()}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-sm font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l7-5z"/></svg>
                  PLAY
                </button>
                <button
                  onClick={addToWatchLater}
                  className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-7 py-3 rounded-sm font-semibold text-sm tracking-wide transition-all border border-white/20 hover:border-white/40"
                >
                  <svg className={`w-5 h-5 ${isInWatchLater() ? 'fill-current' : ''}`} fill={isInWatchLater() ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  {isInWatchLater() ? 'MY LIST ✓' : '+ MY LIST'}
                </button>
              </div>
              {trailer && (
                <button
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                  className="flex items-center gap-3 group text-white/90 hover:text-white transition-colors"
                >
                  <span className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-white/70 group-hover:border-white transition-colors">
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l7-5z"/></svg>
                  </span>
                  <span className="text-sm tracking-widest font-medium">WATCH TRAILER</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section for TV Shows */}
  {contentType === 'tv' && content && 'number_of_seasons' in content && (
        <div className="py-12 bg-black/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Episodes</h2>
              
              {/* Season Selector */}
              {'number_of_seasons' in content && content.number_of_seasons > 1 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {Array.from({ length: content.number_of_seasons }, (_, i) => i + 1).map(seasonNum => (
                    <button
                      key={seasonNum}
                      onClick={() => setSelectedSeason(seasonNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedSeason === seasonNum
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Season {seasonNum}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Episodes Slider */}
            {seasonData?.episodes && (
              <div className="episodes-slider group">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-6 pb-6" style={{ width: 'max-content' }}>
                    {seasonData.episodes.map((episode: Episode) => (
                      <div
                        key={episode.id}
                        className="group/card bg-gray-900/50 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 cursor-pointer border border-gray-800 hover:border-gray-600 flex-shrink-0 w-72 hover:scale-105 hover:shadow-2xl"
                        onClick={() => handleWatchNow(episode.episode_number)}
                      >
                        <div className="relative aspect-video bg-gray-800">
                          {episode.still_path ? (
                            <Image
                              src={`${TMDB_IMAGE_BASE_URL}${episode.still_path}`}
                              alt={episode.name}
                              fill
                              className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                              sizes="320px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-red-600 rounded-full p-3 transform scale-75 group-hover/card:scale-100 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l7-5z"/>
                              </svg>
                            </div>
                          </div>

                          {/* Episode Number */}
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-semibold">
                            Episode {episode.episode_number}
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover/card:text-red-400 transition-colors">
                            {episode.name}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            {episode.air_date && (
                              <span>{new Date(episode.air_date).getFullYear()}</span>
                            )}
                            {episode.runtime && (
                              <span>{episode.runtime} min</span>
                            )}
                            {episode.vote_average > 0 && (
                              <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span>{episode.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          
                          {episode.overview && (
                            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                              {episode.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Scroll indicators */}
                <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 scroll-button">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const container = e.currentTarget.parentElement?.parentElement?.querySelector('.overflow-x-auto');
                      if (container) {
                        container.scrollBy({ left: -400, behavior: 'smooth' });
                      }
                    }}
                    className="bg-black/80 hover:bg-black text-white rounded-full p-3 shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
                
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 scroll-button">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const container = e.currentTarget.parentElement?.parentElement?.querySelector('.overflow-x-auto');
                      if (container) {
                        container.scrollBy({ left: 400, behavior: 'smooth' });
                      }
                    }}
                    className="bg-black/80 hover:bg-black text-white rounded-full p-3 shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="py-14 bg-black/40 border-t border-white/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-fuchsia-300 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">Recommended for You</h2>
              <span className="text-xs uppercase tracking-widest text-gray-400">Based on this {contentType === 'movie' ? 'movie' : 'show'}</span>
            </div>
            <div className="episodes-slider group">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
                  {recommendations.map((item: any) => {
                    const title = item.title || item.name;
                    const year = (item.release_date || item.first_air_date || '').slice(0,4);
                    const mediaType = contentType; // similar returns same type
                    return (
                      <Link
                        key={item.id}
                        href={`/details?id=${item.id}&type=${mediaType}`}
                        className="group/card w-52 flex-shrink-0 rounded-xl overflow-hidden bg-gray-900/60 border border-white/10 hover:border-fuchsia-400/40 transition-all hover:shadow-[0_4px_18px_-4px_rgba(168,85,247,0.45)]"
                      >
                        <div className="relative aspect-[2/3]">
                          <Image
                            src={`${TMDB_IMAGE_BASE_URL}${item.poster_path}`}
                            alt={title}
                            fill
                            className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                            sizes="208px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          {item.vote_average > 0 && (
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                              {item.vote_average.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-3 space-y-1">
                          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover/card:text-fuchsia-300 transition-colors">{title}</h3>
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>{year}</span>
                            {item.vote_average > 0 && (
                              <span className="text-gray-300">★ {item.vote_average.toFixed(1)}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
              {/* Horizontal scroll buttons (reuse style) */}
              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 scroll-button">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    const container = e.currentTarget.parentElement?.parentElement?.querySelector('.overflow-x-auto');
                    container?.scrollBy({ left: -400, behavior: 'smooth' });
                  }}
                  className="bg-black/80 hover:bg-black text-white rounded-full p-3 shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
              </div>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 scroll-button">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    const container = e.currentTarget.parentElement?.parentElement?.querySelector('.overflow-x-auto');
                    container?.scrollBy({ left: 400, behavior: 'smooth' });
                  }}
                  className="bg-black/80 hover:bg-black text-white rounded-full p-3 shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DetailsPage() {
  return (
  <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-gray-400 text-sm tracking-wide">Loading…</p></div>}>
      <DetailsPageContent />
    </Suspense>
  );
}
