// TMDB API configuration
export const TMDB_API_KEY = '1070730380f5fee0d87cf0382670b255';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// AniList API configuration
const ANILIST_API_URL = 'https://graphql.anilist.co';

// AniList GraphQL queries
const ANILIST_SEARCH_QUERY = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      episodes
      format
      status
      seasonYear
      studios {
        nodes {
          name
        }
      }
    }
  }
`;

const ANILIST_EPISODES_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      episodes
      title {
        romaji
        english
      }
      streamingEpisodes {
        title
        url
      }
      nextAiringEpisode {
        episode
      }
    }
  }
`;

// Check if content is anime based on genres/keywords
export const isAnimeContent = (item: any): boolean => {
  if (!item) return false;
  
  const genres = item.genres || [];
  const keywords = item.keywords?.results || [];
  const originCountry = item.origin_country || [];
  
  // Check for anime indicators
  const hasAnimeGenre = genres.some((genre: any) => 
    genre.name?.toLowerCase().includes('animation')
  );
  
  const hasAnimeKeyword = keywords.some((keyword: any) => 
    keyword.name?.toLowerCase().includes('anime') ||
    keyword.name?.toLowerCase().includes('manga')
  );
  
  const isJapanese = originCountry.includes('JP');
  
  return hasAnimeGenre && (hasAnimeKeyword || isJapanese);
};

// Search for anime on AniList
const searchAniListAnime = async (title: string) => {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_SEARCH_QUERY,
        variables: { search: title }
      })
    });
    
    const data = await response.json();
    return data.data?.Media || null;
  } catch (error) {
    console.warn('AniList search failed:', error);
    return null;
  }
};

// Get AniList episode data
const getAniListEpisodes = async (aniListId: number) => {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_EPISODES_QUERY,
        variables: { id: aniListId }
      })
    });
    
    const data = await response.json();
    return data.data?.Media || null;
  } catch (error) {
    console.warn('AniList episodes fetch failed:', error);
    return null;
  }
};

// Movie/TV API functions
export const fetchMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [] };
  }
};

export const fetchTVShows = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { results: [] };
  }
};

// Hollywood content (US/UK region)
export const fetchHollywoodMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&region=US&sort_by=popularity.desc&with_original_language=en`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching Hollywood movies:', error);
    return { results: [] };
  }
};

// Bollywood content (Indian region, Hindi language)
export const fetchBollywoodMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=hi-IN&region=IN&sort_by=popularity.desc&with_original_language=hi`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching Bollywood movies:', error);
    return { results: [] };
  }
};

// Anime content (Japanese animation)
export const fetchAnimeContent = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_genres=16&with_origin_country=JP&sort_by=popularity.desc`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching anime content:', error);
    return { results: [] };
  }
};

export const searchContent = async (query: string, type = 'multi') => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    );
    return await response.json();
  } catch (error) {
    console.error('Error searching content:', error);
    return { results: [] };
  }
};

// Netflix content (using watch provider ID 8 for Netflix)
export const fetchNetflixContent = async (page = 1) => {
  try {
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_watch_providers=8&watch_region=US&sort_by=popularity.desc`),
      fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_watch_providers=8&watch_region=US&sort_by=popularity.desc`)
    ]);
    
    const [moviesData, tvData] = await Promise.all([
      moviesResponse.json(),
      tvResponse.json()
    ]);
    
    let combinedResults = [
      ...(moviesData.results || []),
      ...(tvData.results || [])
    ];
    
    if (combinedResults.length === 0) {
      console.log('No Netflix watch provider results, trying fallback...');
      const fallbackResponse = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&sort_by=popularity.desc&with_companies=2452`
      );
      const fallbackData = await fallbackResponse.json();
      combinedResults = fallbackData.results || [];
    }
    
    return { results: combinedResults.slice(0, 20) };
  } catch (error) {
    console.error('Error fetching Netflix content:', error);
    return { results: [] };
  }
};

// Amazon Prime content (using watch provider ID 119 for Amazon Prime Video)
export const fetchAmazonPrimeContent = async (page = 1) => {
  try {
    let results: any[] = [];
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_watch_providers=119&watch_region=US&sort_by=popularity.desc`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        results = data.results;
      }
    } catch {
      console.log('Amazon Prime watch provider failed, trying fallback');
    }
    
    if (results.length === 0) {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&sort_by=popularity.desc&with_companies=1024`
        );
        const data = await response.json();
        results = data.results || [];
      } catch (error) {
        console.error('Amazon Studios fallback failed:', error);
      }
    }
    
    if (results.length === 0) {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&sort_by=popularity.desc&with_genres=28,18&vote_average.gte=7.0`
        );
        const data = await response.json();
        results = data.results?.slice(0, 10) || [];
      } catch (error) {
        console.error('Final fallback failed:', error);
        results = [];
      }
    }
    
    return { results: results.slice(0, 20) };
  } catch (error) {
    console.error('Error fetching Amazon Prime content:', error);
    return { results: [] };
  }
};

// 🔥 DETAILS FETCH WITH ANIME PATCH
export const fetchContentDetails = async (id: string, type: 'movie' | 'tv') => {
  try {
    const extra = type === 'movie' ? 'release_dates' : 'content_ratings';
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=images,videos,credits,similar,keywords,${extra}&language=en-US&include_image_language=en,null`
    );
    const data = await response.json();

    // ✅ Anime patch: fix season structure using AniList data
    if (type === 'tv' && isAnimeContent(data)) {
      console.log(`[AniList] Enhancing season structure for anime: ${data.name}`);
      
      // Search for the anime on AniList to get correct episode count
      const aniListData = await searchAniListAnime(data.name || data.original_name);
      
      if (aniListData && aniListData.episodes) {
        const totalEpisodes = aniListData.episodes;
        console.log(`[AniList] Found ${totalEpisodes} total episodes for ${data.name}`);
        
        // Determine number of seasons based on episode count and existing TMDB seasons
        let estimatedSeasons = Math.max(
          Math.ceil(totalEpisodes / 12), // Assume ~12 episodes per season
          data.number_of_seasons || 1,   // Use TMDB if higher
          2 // Minimum 2 seasons if we have enough episodes
        );
        
        // For very long series, cap at reasonable number
        if (totalEpisodes > 100) {
          estimatedSeasons = Math.min(estimatedSeasons, Math.ceil(totalEpisodes / 24));
        }
        
        // Create proper season structure
        const episodesPerSeason = Math.ceil(totalEpisodes / estimatedSeasons);
        const seasons = [];
        
        for (let i = 1; i <= estimatedSeasons; i++) {
          const seasonStartEp = (i - 1) * episodesPerSeason + 1;
          const seasonEndEp = Math.min(i * episodesPerSeason, totalEpisodes);
          const episodeCount = seasonEndEp - seasonStartEp + 1;
          
          // Only add season if it has episodes
          if (episodeCount > 0) {
            seasons.push({
              id: `${data.id}-season-${i}`,
              season_number: i,
              episode_count: episodeCount,
              air_date: data.first_air_date || null,
              name: `Season ${i}`,
              overview: `Episodes ${seasonStartEp}-${seasonEndEp}`,
              poster_path: data.poster_path,
            });
          }
        }
        
        console.log(`[AniList] Created ${seasons.length} seasons with proper episode distribution`);
        
        // Update the data with corrected season structure
        data.seasons = seasons;
        data.number_of_seasons = seasons.length;
        data.total_episodes = totalEpisodes;
        data._anilist_enhanced = true; // Flag for debugging
      } else {
        // Fallback: clean up existing TMDB seasons
        data.seasons = (data.seasons || [])
          .filter((s: any) => s.season_number > 0) // remove specials
          .map((s: any) => ({
            id: s.id,
            season_number: s.season_number,
            episode_count: s.episode_count,
            air_date: s.air_date,
            name: s.name,
            overview: s.overview,
            poster_path: s.poster_path,
          }));

        data.total_episodes = data.seasons.reduce(
          (sum: number, s: any) => sum + (s.episode_count || 0),
          0
        );
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching content details:', error);
    return null;
  }
};

export const fetchGenres = async (type: 'movie' | 'tv') => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/${type}/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching genres:', error);
    return { genres: [] };
  }
};

// 📺 Season details with AniList episode numbering for anime
export const fetchSeasonDetails = async (id: string, seasonNumber: number) => {
  try {
    if (seasonNumber === 0) return null;
    
    console.log(`[Debug] Fetching season ${seasonNumber} for content ID: ${id}`);
    
    // Get TMDB show details to check if it's anime
    const showResponse = await fetch(
      `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=keywords`
    );
    const showData = await showResponse.json();
    
    console.log(`[Debug] Show data:`, {
      name: showData.name,
      origin_country: showData.origin_country,
      genres: showData.genres?.map((g: any) => g.name),
      isAnime: isAnimeContent(showData)
    });
    
    // Check if this is anime content
    if (isAnimeContent(showData)) {
      console.log(`[AniList] Detected anime: ${showData.name}, fetching episode data for season ${seasonNumber}`);
      
      // Search for the anime on AniList to get correct episode count
      const aniListData = await searchAniListAnime(showData.name || showData.original_name);
      
      // Get all episodes from TMDB - check multiple seasons for anime
      try {
        let allEpisodes: any[] = [];
        let totalTmdbEpisodes = 0;
        
        // Try to get episodes from multiple TMDB seasons
        for (let tmdbSeason = 1; tmdbSeason <= 3; tmdbSeason++) {
          try {
            const seasonResponse = await fetch(
              `${TMDB_BASE_URL}/tv/${id}/season/${tmdbSeason}?api_key=${TMDB_API_KEY}&language=en-US`
            );
            const seasonData = await seasonResponse.json();
            
            if (seasonData.episodes && seasonData.episodes.length > 0) {
              allEpisodes = [...allEpisodes, ...seasonData.episodes];
              totalTmdbEpisodes += seasonData.episodes.length;
              console.log(`[Debug] TMDB Season ${tmdbSeason}: ${seasonData.episodes.length} episodes`);
            } else {
              break; // No more seasons
            }
          } catch (error) {
            break; // Season doesn't exist
          }
        }
        
        console.log(`[Debug] Total TMDB episodes across all seasons: ${totalTmdbEpisodes}`);
        
        if (allEpisodes.length > 0) {
          // Use the larger episode count (TMDB vs AniList)
          let totalEpisodes = totalTmdbEpisodes;
          let episodeSource = 'TMDB';
          
          if (aniListData && aniListData.episodes && aniListData.episodes > totalTmdbEpisodes) {
            totalEpisodes = aniListData.episodes;
            episodeSource = 'AniList';
          }
          
          console.log(`[Debug] Using ${episodeSource} episode count: ${totalEpisodes}`);
          
          // Calculate episodes per season based on actual episode count
          let episodesPerSeason;
          let totalSeasons;
          
          if (totalEpisodes <= 12) {
            // Single season anime
            episodesPerSeason = totalEpisodes;
            totalSeasons = 1;
          } else if (totalEpisodes <= 26) {
            // 2 season anime (like Dan Da Dan)
            episodesPerSeason = Math.ceil(totalEpisodes / 2);
            totalSeasons = 2;
          } else if (totalEpisodes <= 50) {
            // Multi-season anime (like Jujutsu Kaisen) - use 24 episodes per season
            episodesPerSeason = 24;
            totalSeasons = Math.ceil(totalEpisodes / 24);
          } else {
            // Very long anime - use 12-episode seasons
            episodesPerSeason = 12;
            totalSeasons = Math.ceil(totalEpisodes / 12);
          }
          
          console.log(`[Debug] Smart episode distribution:`, {
            totalEpisodes,
            totalSeasons,
            episodesPerSeason,
            source: episodeSource
          });
          
          const seasonStartIndex = (seasonNumber - 1) * episodesPerSeason;
          const seasonEndIndex = Math.min(seasonStartIndex + episodesPerSeason, totalEpisodes);
          
          // Only return episodes if this season should exist
          if (seasonStartIndex < totalEpisodes) {
            // Get episodes for this season
            const seasonEpisodes = allEpisodes.slice(seasonStartIndex, seasonEndIndex);
            
            console.log(`[Debug] Season ${seasonNumber} episodes:`, {
              startIndex: seasonStartIndex,
              endIndex: seasonEndIndex,
              episodeCount: seasonEpisodes.length
            });
            
            if (seasonEpisodes.length > 0) {
              // Renumber episodes for this season
              const episodes = seasonEpisodes.map((episode: any, index: number) => ({
                ...episode,
                episode_number: index + 1, // Per-season numbering (1, 2, 3...)
                season_number: seasonNumber,
                original_episode_number: episode.episode_number // Keep original for reference
              }));
              
              console.log(`[Debug] Generated ${episodes.length} episodes for season ${seasonNumber}`);
              
              return {
                id: `season-${seasonNumber}`,
                season_number: seasonNumber,
                name: `Season ${seasonNumber}`,
                episodes,
                _anime_enhanced: true
              };
            }
          } else {
            console.log(`[Debug] Season ${seasonNumber} does not exist (only ${totalSeasons} seasons)`);
            return { episodes: [] };
          }
        }
      } catch (error) {
        console.error(`[Debug] Error fetching TMDB season 1:`, error);
      }
    } else {
      console.log(`[Debug] Not anime content, using regular TMDB fetch`);
    }
    
    // For non-anime content or if anime logic fails, get regular TMDB season data
    console.log(`[Debug] Falling back to regular TMDB season ${seasonNumber}`);
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching season details:', error);
    return { episodes: [] };
  }
};

// Sports
export const fetchSportsMatches = async () => {
  try {
    const response = await fetch('https://streamed.su/api/matches');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sports matches:', error);
    return [];
  }
};

// Utility functions
export const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const getVideoUrl = (sourceId: string, contentId: string, type: 'movie' | 'tv', season?: number, episode?: number) => {
  const sources = require('./sources').availableSources;
  const source = sources.find((s: any) => s.id === sourceId);
  
  if (!source) return '';
  
  let url = source.urls[type];
  if (!url) return '';
  
  url = url.replace('{id}', contentId);
  
  if (type === 'tv' && season && episode) {
    url = url.replace('{season}', season.toString());
    url = url.replace('{episode}', episode.toString());
  }
  
  return url;
};

// Local storage helpers
export const getLocalStorage = (key: string, defaultValue: any = null) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

// Blocked movie IDs
export const blockedMovieIds = [
  "106862", "15774", "570341", "160242", "363343", "464515", "272668", 
  "216969", "307609", "33081", "132744", "160243", "8079", "170991", 
  "566319", "520517", "441906", "872906", "598859", "421097", "14134", 
  "15419", "107800", "160255", "277432", "15772", "503577", "376371", 
  "304246", "413543", "45002", "801526", "370665", "205022", "21210", 
  "138934", "114436", "581361", "102353", "16345", "96112", "4252", 
  "4435", "205077", "304157", "474084", "14478", "421701", "960876"
];

// Adult filter
export const adultGenreIds: number[] = [];

export const adultContentKeywords = [
  'xxx', 'porn', 'erotic', 'explicit', 'adult', 'sex', 'nude', 'naked', 
  'sensual', 'intimate', 'seductive', 'temptation', 'desire', 'passion',
  'lust', 'sexual', 'sexuality', 'arousal', 'provocative', 'steamy',
  'sensuous', 'sultry', 'kinky', 'fetish', 'escort', 'stripper',
  'brothel', 'prostitute', 'call girl', 'gigolo', 'swinger'
];

export const isAdultContent = (item: any): boolean => {
  if (!item) return false;
  
  const title = (item.title || item.name || '').toLowerCase();
  const overview = (item.overview || '').toLowerCase();
  
  const hasAdultKeywords = adultContentKeywords.some(keyword => 
    title.includes(keyword) || overview.includes(keyword)
  );
  
  const isExplicitRating = item.adult === true;
  
  const genreIds = item.genre_ids || [];
  const hasAdultGenreCombination = genreIds.includes(18) && 
    (genreIds.includes(10749) || genreIds.includes(53));
  
  return hasAdultKeywords || isExplicitRating || (hasAdultGenreCombination && hasAdultKeywords);
};

export const filterAdultContent = (items: any[], allowAdultContent: boolean = false): any[] => {
  if (allowAdultContent) return items;
  return items.filter(item => !isAdultContent(item));
};
