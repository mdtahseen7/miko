'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  fetchContentDetails, 
  fetchSeasonDetails, 
  getVideoUrl, 
  TMDB_IMAGE_BASE_URL,
  formatRuntime,
  getLocalStorage
} from '@/lib/utils';
import { availableSources } from '@/lib/sources';
import type { Movie, TVShow, Season, Episode } from '@/lib/types';
import Navbar from '@/components/Navbar';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<Movie | TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSource, setCurrentSource] = useState(availableSources[0]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(0);
  const [securityLevel, setSecurityLevel] = useState<'secure' | 'balanced' | 'permissive'>('balanced');
  const [showSearch, setShowSearch] = useState(false);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const contentId = searchParams.get('id');
  const contentType = searchParams.get('type') as 'movie' | 'tv';

  useEffect(() => {
    if (contentId && contentType) {
      loadContent();
    }
  }, [contentId, contentType]);

  useEffect(() => {
    if (content && contentType === 'tv' && selectedSeason) {
      loadSeasonData();
    }
  }, [content, selectedSeason]);

  useEffect(() => {
    // Load watch later count
    const watchLater = getLocalStorage('watchLater', []);
    setWatchLaterCount(watchLater.length);

    // Handle scroll for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Basic popup blocking for no-sandbox sources
  useEffect(() => {
    if (currentSource.requiresNoSandbox) {
      const originalOpen = window.open;
      window.open = function(...args) {
        setPopupBlocked(prev => prev + 1);
        console.log('Popup blocked from streaming source');
        return null;
      };

      return () => {
        window.open = originalOpen;
      };
    }
  }, [currentSource]);

  const loadContent = async () => {
    if (!contentId || !contentType) return;
    
    setLoading(true);
    try {
      const data = await fetchContentDetails(contentId, contentType);
      setContent(data);
      
      if (contentType === 'tv' && data?.seasons) {
        const firstSeason = data.seasons.find((s: Season) => s.season_number > 0);
        if (firstSeason) {
          setSelectedSeason(firstSeason.season_number);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonData = async () => {
    if (!contentId || contentType !== 'tv') return;
    
    try {
      const data = await fetchSeasonDetails(contentId, selectedSeason);
      setSeasonData(data);
      setSelectedEpisode(1);
    } catch (error) {
      console.error('Error loading season data:', error);
    }
  };

  const getCurrentVideoUrl = () => {
    if (!content || !currentSource) return '';
    
    return getVideoUrl(
      currentSource.id,
      contentId!,
      contentType,
      contentType === 'tv' ? selectedSeason : undefined,
      contentType === 'tv' ? selectedEpisode : undefined
    );
  };

  const getTitle = () => {
    if (!content) return '';
    
    if (contentType === 'tv') {
      const tvShow = content as TVShow;
      const episode = seasonData?.episodes?.find(ep => ep.episode_number === selectedEpisode);
      return `${tvShow.name} - S${selectedSeason}E${selectedEpisode}: ${episode?.name || 'Episode ' + selectedEpisode}`;
    }
    
    return (content as Movie).title;
  };

  const getBackdropUrl = () => {
    if (!content?.backdrop_path) return '';
    return `${TMDB_IMAGE_BASE_URL.replace('w500', 'w1280')}${content.backdrop_path}`;
  };

  const handleViewChange = (view: string) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'livesports') {
      router.push('/livesports');
    } else if (view === 'settings') {
      router.push('/settings');
    } else {
      router.push(`/?view=${view}`);
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const getFilteredSources = () => {
    return availableSources.filter(source => {
      switch (securityLevel) {
        case 'secure':
          return !source.requiresNoSandbox;
        case 'balanced':
          return true; // Show all sources but warn about unsafe ones
        case 'permissive':
          return true;
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black" />
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
          <Link href="/" className="text-red-500 hover:text-red-400">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar
        currentView="watch"
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={handleViewChange}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
      />

      <div className="pt-20">
        {/* Background with backdrop */}
        {getBackdropUrl() && (
          <div 
            className="fixed inset-0 z-0 opacity-30"
            style={{
              backgroundImage: `url(${getBackdropUrl()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
            }}
          />
        )}
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            {/* Movie Title and Info */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {contentType === 'movie' ? (content as Movie).title : (content as TVShow).name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                <span className="text-lg">
                  {contentType === 'movie' 
                    ? new Date((content as Movie).release_date).getFullYear()
                    : new Date((content as TVShow).first_air_date).getFullYear()
                  }
                </span>
                {contentType === 'movie' && (content as Movie).runtime && (
                  <span className="text-lg">{formatRuntime((content as Movie).runtime)}</span>
                )}
                <span className="flex items-center text-yellow-400 text-lg">
                  ★ {content.vote_average?.toFixed(1)}
                </span>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {content.genres?.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 text-sm bg-gray-800 bg-opacity-60 rounded-full border border-gray-600"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Main Layout: Title Bar + Grid Layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Title Section - Full Width */}
              <div className="col-span-12 bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  {contentType === 'movie' ? (content as Movie).title : (content as TVShow).name}
                </h2>
              </div>

              {/* Left Column */}
              <div className="col-span-12 lg:col-span-8 space-y-4">
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
                  {getCurrentVideoUrl() ? (
                    <iframe
                      src={getCurrentVideoUrl()}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="no-referrer-when-downgrade"
                      loading="lazy"
                      sandbox={currentSource.requiresNoSandbox ? undefined : "allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"}
                      title={getTitle()}
                      style={{ 
                        border: 'none',
                        background: '#000'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-gray-400 text-lg">Video Loading...</p>
                        <p className="text-gray-500 text-sm mt-2">Please select a source below</p>
                        {currentSource && currentSource.requiresNoSandbox && (
                          <p className="text-yellow-400 text-xs mt-1">⚠️ This source requires full permissions</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Servers Section */}
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">🎯</span>
                    Servers
                  </h3>
                  
                  {/* Security Level */}
                  <div className="mb-4 p-3 bg-gray-800 bg-opacity-60 rounded-lg border border-gray-600">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSecurityLevel('secure')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          securityLevel === 'secure'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Secure
                      </button>
                      <button
                        onClick={() => setSecurityLevel('balanced')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          securityLevel === 'balanced'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Balanced
                      </button>
                      <button
                        onClick={() => setSecurityLevel('permissive')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          securityLevel === 'permissive'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        All Sources
                      </button>
                    </div>
                  </div>

                  {/* Source Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {getFilteredSources().map((source, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSource(source)}
                        className={`relative p-3 rounded-lg border transition-all ${
                          currentSource === source
                            ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                            : 'border-gray-600 bg-gray-800 bg-opacity-60 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">{source.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {source.isFrench ? 'French' : 'English'}
                        </div>
                        {source.requiresNoSandbox && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" title="Requires permissions" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                {/* Movie Poster - Small Size */}
                {content.poster_path && (
                  <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-3">Movie poster small size</h3>
                    <Image
                      src={`${TMDB_IMAGE_BASE_URL}${content.poster_path}`}
                      alt={contentType === 'movie' ? (content as Movie).title : (content as TVShow).name}
                      width={200}
                      height={300}
                      className="rounded-lg w-full shadow-lg border border-gray-600"
                    />
                  </div>
                )}

                {/* Seasons (TV Shows only) */}
                {contentType === 'tv' && (content as TVShow).seasons && (
                  <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-gray-300">SEASONS</h3>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {(content as TVShow).seasons
                        ?.filter(season => season.season_number > 0)
                        ?.map(season => (
                          <option key={season.id} value={season.season_number}>
                            Season {season.season_number}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Episodes (TV Shows only) */}
                {contentType === 'tv' && seasonData?.episodes && (
                  <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-3">Episodes</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {seasonData.episodes.map((episode) => (
                        <button
                          key={episode.id}
                          onClick={() => setSelectedEpisode(episode.episode_number)}
                          className={`w-full text-left p-2 rounded-lg border transition-colors ${
                            selectedEpisode === episode.episode_number
                              ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                              : 'border-gray-600 bg-gray-800 bg-opacity-60 hover:bg-gray-700'
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {episode.episode_number}. {episode.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Warnings</h3>
                  <div className="space-y-2">
                    {(content as any).adult && (
                      <div className="flex items-center text-orange-400">
                        <span className="mr-2">🔞</span>
                        <span className="text-sm">Adult Content</span>
                      </div>
                    )}
                    <div className="flex items-center text-yellow-400">
                      <span className="mr-2">⚠️</span>
                      <span className="text-sm">May contain violence</span>
                    </div>
                  </div>
                </div>

                {/* Info/Details */}
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Info/Details</h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400">Year:</span>
                      <span className="ml-2">
                        {new Date(
                          contentType === 'movie' 
                            ? (content as Movie).release_date 
                            : (content as TVShow).first_air_date
                        ).getFullYear()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Rating:</span>
                      <span className="ml-2 text-yellow-400">★ {content.vote_average?.toFixed(1)}</span>
                    </div>
                    {contentType === 'movie' && (content as Movie).runtime && (
                      <div className="text-sm">
                        <span className="text-gray-400">Runtime:</span>
                        <span className="ml-2">{formatRuntime((content as Movie).runtime)}</span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-gray-400">Genres:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {content.genres?.slice(0, 3).map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 py-1 text-xs bg-gray-800 rounded-full border border-gray-600"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                      <button
                        onClick={() => setSecurityLevel('permissive')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          securityLevel === 'permissive'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🔓 Permissive
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableSources
                      .filter(source => {
                        if (securityLevel === 'secure') return !source.requiresNoSandbox;
                        return true; // Show all sources for balanced/permissive
                      })
                      .map((source) => (
                      <button
                        key={source.id}
                        onClick={() => setCurrentSource(source)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 relative ${
                          currentSource.id === source.id
                            ? 'border-blue-500 bg-blue-500 bg-opacity-20 text-blue-300 shadow-lg'
                            : 'border-gray-600 bg-gray-800 bg-opacity-60 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                        }`}
                        title={source.requiresNoSandbox ? "This source requires unrestricted iframe access" : "This source runs with security restrictions"}
                      >
                        <span className="flex items-center space-x-1">
                          <span>{source.name}</span>
                          {source.requiresNoSandbox && (
                            <span className="text-xs text-yellow-400">⚠️</span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Security Level Info */}
                  <div className="mt-3 text-xs text-gray-400">
                    {securityLevel === 'secure' && (
                      <p>🛡️ Only showing secure sources. Some content may be unavailable.</p>
                    )}
                    {securityLevel === 'balanced' && (
                      <p>⚖️ Showing all sources with clear warnings for risky ones.</p>
                    )}
                    {securityLevel === 'permissive' && (
                      <p>🔓 Showing all sources. Use caution with ad-blockers recommended.</p>
                    )}
                  </div>
                  
                  {/* Security Information */}
                  {currentSource.requiresNoSandbox && (
                    <div className="bg-red-900 bg-opacity-40 border border-red-600 rounded-lg p-4 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="text-red-400 mt-0.5">🚨</span>
                        <div>
                          <p className="text-red-200 font-medium mb-2">Security Warning</p>
                          <p className="text-red-100 text-xs mb-2">
                            This source requires unrestricted access and may show ads, popups, or redirects.
                          </p>
                          <div className="text-red-100 text-xs space-y-1">
                            <div>• Third-party ads may appear</div>
                            <div>• Popups/redirects possible</div>
                            <div>• Enhanced tracking capabilities</div>
                          </div>
                          <p className="text-red-200 text-xs mt-2 font-medium">
                            Use ad-blocker recommended
                          </p>
                          {popupBlocked > 0 && (
                            <p className="text-green-200 text-xs mt-1">
                              🛡️ {popupBlocked} popup(s) blocked
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Episode Selection for TV Shows */}
                {contentType === 'tv' && (content as TVShow).seasons && (
                  <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <span className="mr-2">📺</span>
                      Episodes
                    </h3>
                    
                    {/* Season Selection */}
                    <div className="mb-4">
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                      >
                        {(content as TVShow).seasons
                          ?.filter(season => season.season_number > 0)
                          ?.map(season => (
                            <option key={season.id} value={season.season_number}>
                              Season {season.season_number}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Episodes List */}
                    {seasonData?.episodes && (
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {seasonData.episodes.map((episode) => (
                          <button
                            key={episode.id}
                            onClick={() => setSelectedEpisode(episode.episode_number)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedEpisode === episode.episode_number
                                ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                                : 'border-gray-600 bg-gray-800 bg-opacity-60 hover:bg-gray-700'
                            }`}
                          >
                            <div className="font-medium">
                              {episode.episode_number}. {episode.name}
                            </div>
                            {episode.overview && (
                              <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                                {episode.overview}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side: Details Panel */}
              <div className="space-y-6">
                {/* Overview Section */}
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">📖</span>
                    Overview
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{content.overview}</p>
                </div>

                {/* Details Section */}
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">ℹ️</span>
                    Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-2 text-green-400">Released</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Release Date:</span>
                      <span className="ml-2">
                        {new Date(
                          contentType === 'movie' 
                            ? (content as Movie).release_date 
                            : (content as TVShow).first_air_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <span className="ml-2 text-yellow-400">★ {content.vote_average?.toFixed(1)}/10</span>
                    </div>
                    {contentType === 'movie' && (content as Movie).runtime && (
                      <div>
                        <span className="text-gray-400">Runtime:</span>
                        <span className="ml-2">{formatRuntime((content as Movie).runtime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Warnings */}
                <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Content Warnings
                  </h3>
                  <div className="space-y-2">
                    {(content as any).adult && (
                      <div className="flex items-center text-orange-400">
                        <span className="mr-2">🔞</span>
                        <span>Adult Content</span>
                      </div>
                    )}
                    <div className="flex items-center text-yellow-400">
                      <span className="mr-2">🎬</span>
                      <span>Violence/Action</span>
                    </div>
                  </div>
                </div>

                {/* Poster */}
                {content.poster_path && (
                  <div className="hidden lg:block">
                    <Image
                      src={`${TMDB_IMAGE_BASE_URL}${content.poster_path}`}
                      alt={contentType === 'movie' ? (content as Movie).title : (content as TVShow).name}
                      width={300}
                      height={450}
                      className="rounded-lg w-full shadow-xl border border-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
  <Suspense fallback={<div className="min-h-screen bg-black" />}> 
      <WatchPageContent />
    </Suspense>
  );
}
