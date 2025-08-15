"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { searchContent, TMDB_IMAGE_BASE_URL, filterAdultContent, blockedMovieIds, getLocalStorage, fetchContentDetails } from '@/lib/utils';
import type { ContentItem } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'popularity' | 'rating' | 'year' | 'title'>('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const saved = getLocalStorage('watchLater', []);
    setWatchLaterCount(saved.length);
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cache for detail runtimes to avoid repeated fetches between queries
  const runtimeCache = useRef<Record<string, number>>({});
  const lastBasicResults = useRef<string>(''); // store last query we enriched

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await searchContent(q);
      const qLower = q.toLowerCase();
      const allowAdult = ['adult','sex','erotic','xxx','porn','explicit','nude'].some(t=>qLower.includes(t));
      let filtered = filterAdultContent(
        data.results?.filter((item:any)=>!blockedMovieIds.includes(item.id.toString())) || [],
        allowAdult
      );

      // Year filtering: hide very old content (before 2004) unless user explicitly searched an old year
      const MIN_YEAR = 2004;
      const explicitOlderYearMatch = q.match(/\b(19\d{2}|200[0-3])\b/); // user typed an older year
      if (!explicitOlderYearMatch) {
        filtered = filtered.filter((item: any) => {
          const date = item.release_date || item.first_air_date;
          if (!date) return true; // keep if unknown
          const year = parseInt(date.slice(0,4));
          if (!year) return true;
          return year >= MIN_YEAR;
        });
      }

      // Exclude reality shows unless user explicitly searches for them
      const wantsReality = /\breality\b/i.test(qLower);
      if (!wantsReality) {
        filtered = filtered.filter((item:any) => {
          if (item.genre_ids?.includes(10764)) return false; // 10764 = Reality
          const t = (item.title || item.name || '').toLowerCase();
          if (t.includes('reality')) return false;
          return true;
        });
      }

  // Runtime filtering moved to deferred enrichment to reduce initial latency

      const normalize = (s:string) => s.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
      const queryNorm = normalize(qLower);
      const score = (title:string): number => {
        const t = normalize(title);
        if (!t) return 0;
        if (t === queryNorm) return 1.0;
        if (t.startsWith(queryNorm)) return 0.92;
        if (t.split(' ').some(w=>w.startsWith(queryNorm))) return 0.86;
        if (t.includes(queryNorm)) return 0.72;
        let qi=0; for (let i=0;i<t.length && qi<queryNorm.length;i++){ if(t[i]===queryNorm[qi]) qi++; }
        const seqRatio = qi / queryNorm.length;
        if (seqRatio >= 0.8) return 0.6 + (seqRatio-0.8)*0.2;
        return seqRatio >= 0.5 ? 0.4 + (seqRatio-0.5)*0.2 : 0;
      };
      filtered = filtered.map((item:any)=>({ ...item, __rel: score(item.title || item.name || '') }));
      const minScore = queryNorm.length <= 4 ? 0.86 : queryNorm.length <= 6 ? 0.6 : 0.5;
      filtered = filtered.filter((i:any)=> i.__rel >= minScore);
      filtered.sort((a:any,b:any)=> (b.__rel - a.__rel) || ((b.popularity||0)-(a.popularity||0)) );
      filtered = filtered.map((i:any)=>{ delete i.__rel; return i; });
      const base = filtered.slice(0,60); // keep extra for later filtering
      setResults(base.slice(0,40));

      // Defer runtime filtering enrichment (non-blocking)
      const allowShort = /\b(short|clip|mini|reel)\b/i.test(qLower);
      const MIN_DURATION_MIN = 40;
      if (!allowShort && base.length && lastBasicResults.current !== q) {
        lastBasicResults.current = q;
        (async () => {
          const enriched: any[] = [];
            for (const item of base.slice(0, 30)) {
              const key = item.id.toString();
              if (!(key in runtimeCache.current)) {
                try {
                  const type = item.media_type === 'tv' ? 'tv' : 'movie';
                  const details = await fetchContentDetails(key, type as any);
                  const dur = details?.runtime || (Array.isArray(details?.episode_run_time) ? details?.episode_run_time[0] : undefined);
                  if (dur) runtimeCache.current[key] = dur;
                } catch {}
              }
            }
          const filteredRuntime = base.filter(it => {
            const dur = runtimeCache.current[it.id];
            if (!dur) return true;
            return dur >= MIN_DURATION_MIN;
          }).slice(0,40);
          // Only update if user hasn't changed query meanwhile
          setResults(prev => q === query ? filteredRuntime : prev);
        })();
      }
    } catch (e) {
      console.error('Search error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(()=>{
  const h = setTimeout(()=>performSearch(query), 550); // slightly longer debounce to reduce API spam
    return ()=>clearTimeout(h);
  }, [query, performSearch]);

  const sortedResults = useMemo(()=>{
    const list = [...results];
    switch (sortBy) {
      case 'popularity': return list.sort((a:any,b:any)=>(b.popularity||0)-(a.popularity||0));
      case 'rating': return list.sort((a:any,b:any)=>(b.vote_average||0)-(a.vote_average||0));
      case 'year': return list.sort((a:any,b:any)=>{
        const ay = parseInt((a.release_date||a.first_air_date||'').slice(0,4))||0;
        const by = parseInt((b.release_date||b.first_air_date||'').slice(0,4))||0;
        return by - ay;
      });
      case 'title': return list.sort((a:any,b:any)=> (a.title||a.name||'').localeCompare(b.title||b.name||''));
      default: return list; // relevance already applied
    }
  }, [results, sortBy]);

  const ContentCard = ({ item }: { item: any }) => {
    const title = item.title || item.name || '';
    const poster = item.poster_path;
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    return (
      <Link href={`/details?id=${item.id}&type=${type}`} className="group relative rounded-lg overflow-hidden bg-gray-900/60 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all">
        <div className="relative aspect-[2/3] w-full">
          {poster ? (
            <Image src={`${TMDB_IMAGE_BASE_URL}${poster}`} alt={title} fill className="object-cover group-hover:scale-105 transition-all duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 p-3">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2">{title}</h3>
          </div>
        </div>
      </Link>
    );
  };

  const SkeletonCard = () => (
    <div className="relative rounded-lg overflow-hidden bg-white/5 animate-pulse aspect-[2/3]" />
  );

  return (
  <div className="min-h-screen text-white">
      <Navbar
        currentView="search"
        showSearch={false}
        searchQuery={query}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={()=>{}}
        onSearchToggle={()=>{}}
        onSearchChange={()=>{}}
      />

      <main className="pt-28 pb-20 px-4 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-12">
          {query.length === 0 ? (
            <>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-400 to-purple-300 bg-clip-text text-transparent">Find something to watch</h1>
              <p className="text-sm text-gray-400 mb-6">Search movies, TV shows, anime and more.</p>
            </>
          ) : (
            <h1 className="sr-only">Search</h1>
          )}
          <div className="w-full max-w-2xl relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Have something in mind? (try: any genre / name)"
              className="w-full pl-12 pr-4 py-4 rounded-full miko-search-input outline-none text-sm placeholder-purple-200/40 transition-all"
              autoFocus
            />
          </div>
        </div>

        {query.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-center gap-6 mb-8">
              <span className="h-px w-32 bg-gradient-to-r from-fuchsia-400/60 to-transparent" />
              <h2 className="text-3xl font-semibold tracking-wide text-fuchsia-200">Search results</h2>
              <span className="h-px w-32 bg-gradient-to-l from-fuchsia-400/60 to-transparent" />
            </div>
            <div className="flex justify-center">
              <div className="relative" onMouseLeave={()=>setShowSortMenu(false)}>
                <button
                  onClick={()=>setShowSortMenu(s=>!s)}
                  className="px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-sm text-xs tracking-wide uppercase flex items-center gap-2 transition-colors backdrop-blur-sm">
                  {sortBy === 'relevance' && 'search by relevance'}
                  {sortBy === 'popularity' && 'sort: popularity'}
                  {sortBy === 'rating' && 'sort: rating'}
                  {sortBy === 'year' && 'sort: year'}
                  {sortBy === 'title' && 'sort: title'}
                  <svg className={`w-3 h-3 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSortMenu && (
                  <div className="absolute left-0 mt-2 w-40 bg-black/90 border border-white/10 rounded-sm shadow-xl backdrop-blur-xl z-10 py-1 text-xs">
                    {(['relevance','popularity','rating','year','title'] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={()=>{ setSortBy(opt); setShowSortMenu(false); }}
                        className={`w-full text-left px-3 py-2 hover:bg-white/10 capitalize ${sortBy===opt ? 'text-fuchsia-300' : 'text-gray-300'}`}
                      >
                        {opt === 'relevance' ? 'Search by relevance' : `Sort: ${opt}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({length:10}).map((_,i)=>(<SkeletonCard key={i}/>))}
          </div>
        )}

        {!loading && query.length > 0 && results.length === 0 && (
          <p className="text-center text-gray-500">No results for "{query}"</p>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {sortedResults.map(item => <ContentCard key={`${item.id}-${item.media_type || 'x'}`} item={item} />)}
          </div>
        )}
      </main>
    </div>
  );
}
