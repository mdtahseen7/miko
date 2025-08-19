'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchContentDetails, 
  fetchSeasonDetails, 
  getVideoUrl, 
  TMDB_IMAGE_BASE_URL,
  formatRuntime,
  getLocalStorage
} from '@/lib/utils';
import { availableSources } from '@/lib/sources';
import type { Movie, TVShow, Season } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<Movie | TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSource, setCurrentSource] = useState(availableSources[0]);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [securityLevel, setSecurityLevel] = useState<'secure' | 'balanced' | 'permissive'>('balanced');
  const [showSearch, setShowSearch] = useState(false);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const contentId = searchParams.get('id');
  const contentType = searchParams.get('type') as 'movie' | 'tv';

  useEffect(() => {
    if (contentId && contentType) loadContent();
  }, [contentId, contentType]);

  useEffect(() => {
    if (content && contentType === 'tv' && selectedSeason) loadSeasonData();
  }, [content, selectedSeason]);

  useEffect(() => {
    const watchLater = getLocalStorage('watchLater', []);
    setWatchLaterCount(watchLater.length);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadContent = async () => {
    if (!contentId || !contentType) return;
    setLoading(true);
    try {
      const data = await fetchContentDetails(contentId, contentType);
      setContent(data);

      // grab recommendations too
      const rec = await fetch(
        `https://api.themoviedb.org/3/${contentType}/${contentId}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const recData = await rec.json();
      setRecommendations(recData.results || []);

      if (contentType === 'tv' && data?.seasons) {
        const firstSeason = data.seasons.find((s: Season) => s.season_number > 0);
        if (firstSeason) setSelectedSeason(firstSeason.season_number);
      }
    } catch (err) {
      console.error(err);
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
    } catch (err) { console.error(err); }
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

  const getBackdropUrl = () =>
    content?.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL.replace('w500', 'w1280')}${content.backdrop_path}`
      : '';

  if (loading) return <div className="min-h-screen bg-black" />;

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
          <Link href="/" className="text-red-500 hover:text-red-400">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar
        currentView="watch"
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={(view) => router.push(view === 'home' ? '/' : `/${view}`)}
        onSearchToggle={() => setShowSearch(!showSearch)}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Netflix Hero */}
      <motion.div 
        className="relative w-full h-[70vh]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {getBackdropUrl() && (
          <Image src={getBackdropUrl()} alt="backdrop" fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <motion.div 
          className="relative z-10 h-full flex items-center px-8 lg:px-20 gap-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {content.poster_path && (
            <motion.div 
              className="hidden lg:block flex-shrink-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Image
                src={`${TMDB_IMAGE_BASE_URL}${content.poster_path}`}
                alt={contentType === 'movie' ? (content as Movie).title : (content as TVShow).name}
                width={260}
                height={390}
                className="rounded-lg shadow-2xl object-cover"
              />
            </motion.div>
          )}
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.h1 
              className="text-4xl lg:text-5xl font-extrabold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {contentType === 'movie' ? (content as Movie).title : (content as TVShow).name}
            </motion.h1>
            <motion.div 
              className="flex items-center gap-4 text-gray-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <span>
                {new Date(contentType === 'movie' ? (content as Movie).release_date : (content as TVShow).first_air_date).getFullYear()}
              </span>
              {contentType === 'movie' && (content as Movie).runtime && (
                <span>{formatRuntime((content as Movie).runtime)}</span>
              )}
              <span>★ {content.vote_average?.toFixed(1)}</span>
            </motion.div>
            <motion.p 
              className="text-gray-200 leading-relaxed line-clamp-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              {content.overview}
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Player + Sources beside each other */}
      <motion.div 
        className="relative z-20 container mx-auto px-4 py-10 space-y-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div 
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* Player */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div 
              className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-gray-700"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {getCurrentVideoUrl() ? (
                <iframe
                  src={getCurrentVideoUrl()}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="lazy"
                  sandbox={currentSource.requiresNoSandbox ? undefined : "allow-scripts allow-same-origin allow-presentation allow-forms allow-popups"}
                  title="Player"
                  style={{ border: 'none', background: '#000' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">🎬 Video Loading...</div>
              )}
            </motion.div>
          </motion.div>

          {/* Sources */}
          <motion.div 
            className={`backdrop-blur-sm rounded-lg overflow-hidden ${
              sourcesExpanded ? 'bg-gray-900 bg-opacity-60 border border-gray-700' : ''
            }`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {/* Sources Header with Arrow */}
            <button
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-gray-800 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <h3 className="text-base sm:text-lg font-semibold">🎯 Sources</h3>
                {!sourcesExpanded && (
                  <span className="text-xs sm:text-sm text-blue-300 bg-blue-500 bg-opacity-20 px-2 py-1 rounded-full border border-blue-500">
                    {currentSource.name}
                  </span>
                )}
              </div>
              <motion.svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: sourcesExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            {/* Collapsible Sources Content */}
            <AnimatePresence>
              {sourcesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-gray-700"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-2">
                      {availableSources
                        .filter(source => securityLevel !== 'secure' || !source.requiresNoSandbox)
                        .map((source) => (
                          <button
                            key={source.id}
                            onClick={() => setCurrentSource(source)}
                            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm border transition-all duration-200 ${
                              currentSource.id === source.id
                                ? 'border-blue-500 bg-blue-500 bg-opacity-20 text-blue-300'
                                : 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {source.name}
                            {source.requiresNoSandbox && (
                              <span className="ml-1 text-orange-400" title="May show ads">⚠️</span>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Episodes (if TV) */}
        <AnimatePresence>
          {contentType === 'tv' && seasonData?.episodes && (
            <motion.div 
              className="rounded-lg py-4 pt-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-6">📺 Episodes</h3>
              
              {/* Season Selector */}
              {(content as TVShow).seasons && (content as TVShow).seasons.filter(s => s.season_number > 0).length > 1 && (
                <div className="mb-6">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    {(content as TVShow).seasons?.filter(s => s.season_number > 0).map(season => (
                      <option key={season.id} value={season.season_number}>Season {season.season_number}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Horizontal Scrollable Episodes */}
              <div className="overflow-x-auto scrollbar-hide pt-2">
                <div className="flex space-x-6 pb-4 pl-4" style={{ width: 'max-content' }}>
                  {seasonData.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className={`group cursor-pointer bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 w-56 ${
                        selectedEpisode === episode.episode_number
                          ? 'ring-2 ring-blue-500'
                          : 'hover:bg-gray-700 hover:scale-105'
                      }`}
                      onClick={() => setSelectedEpisode(episode.episode_number)}
                    >
                      {/* Episode Thumbnail */}
                      <div className="relative aspect-video bg-gray-700">
                        {episode.still_path ? (
                          <img
                            src={`${TMDB_IMAGE_BASE_URL}${episode.still_path}`}
                            alt={episode.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Play Overlay */}
                        {selectedEpisode === episode.episode_number && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-blue-600 rounded-full p-2">
                              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l7-5z"/>
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* Episode Number Badge */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-80 backdrop-blur-sm rounded px-2 py-1 text-xs font-semibold">
                          S{selectedSeason}E{episode.episode_number}
                        </div>
                      </div>

                      {/* Episode Info */}
                      <div className="p-3">
                        <h4 className="font-medium text-sm line-clamp-1 mb-1">
                          {episode.episode_number}. {episode.name}
                        </h4>
                        {episode.runtime && (
                          <p className="text-xs text-gray-400">{episode.runtime}min</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              More Like This
            </motion.h3>
            <motion.div 
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {recommendations.slice(0, 12).map((rec, index) => (
                <motion.div 
                  key={rec.id} 
                  className="flex-shrink-0 w-40 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.3 } }}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                    alt={rec.title || rec.name}
                    width={160}
                    height={240}
                    className="rounded-md object-cover"
                  />
                  <p className="mt-2 text-sm line-clamp-1">{rec.title || rec.name}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <WatchPageContent />
    </Suspense>
  );
}
