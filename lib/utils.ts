// TMDB API configuration
export const TMDB_API_KEY = '1070730380f5fee0d87cf0382670b255';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Movie/TV API functions
export const fetchMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
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
    // Try to fetch both movies and TV shows from Netflix
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_watch_providers=8&watch_region=US&sort_by=popularity.desc`),
      fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_watch_providers=8&watch_region=US&sort_by=popularity.desc`)
    ]);
    
    const [moviesData, tvData] = await Promise.all([
      moviesResponse.json(),
      tvResponse.json()
    ]);
    
    // Combine movies and TV shows, prioritizing movies
    let combinedResults = [
      ...(moviesData.results || []),
      ...(tvData.results || [])
    ];
    
    // If no results from watch providers, fallback to popular content with Netflix-related keywords
    if (combinedResults.length === 0) {
      console.log('No Netflix watch provider results, trying fallback...');
      const fallbackResponse = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&sort_by=popularity.desc&with_companies=2452` // Netflix company ID
      );
      const fallbackData = await fallbackResponse.json();
      combinedResults = fallbackData.results || [];
    }
    
    return { results: combinedResults.slice(0, 20) }; // Limit to 20 results per page
  } catch (error) {
    console.error('Error fetching Netflix content:', error);
    return { results: [] };
  }
};

// Amazon Prime content (using watch provider ID 119 for Amazon Prime Video)
export const fetchAmazonPrimeContent = async (page = 1) => {
  try {
    // First try Amazon Prime watch provider
    let results: any[] = [];
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_watch_providers=119&watch_region=US&sort_by=popularity.desc`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        results = data.results;
      }
    } catch (error) {
      console.log('Amazon Prime watch provider failed, trying fallback');
    }
    
    // If no results from watch provider, use Amazon Studios company
    if (results.length === 0) {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&sort_by=popularity.desc&with_companies=1024` // Amazon Studios
        );
        const data = await response.json();
        results = data.results || [];
      } catch (error) {
        console.error('Amazon Studios fallback failed:', error);
      }
    }
    
    // If still no results, get some popular action/drama movies as Amazon-style content
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

export const fetchContentDetails = async (id: string, type: 'movie' | 'tv') => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=images,videos,credits,similar,keywords&language=en-US&include_image_language=en,null`
    );
    return await response.json();
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

export const fetchSeasonDetails = async (id: string, seasonNumber: number) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching season details:', error);
    return { episodes: [] };
  }
};

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
  } catch (error) {
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

// Content moderation - Adult content genre IDs and keywords
export const adultGenreIds = [
  // No specific adult genre IDs in TMDB, but we'll filter by keywords and titles
];

export const adultContentKeywords = [
  'xxx', 'porn', 'erotic', 'explicit', 'adult', 'sex', 'nude', 'naked', 
  'sensual', 'intimate', 'seductive', 'temptation', 'desire', 'passion',
  'lust', 'sexual', 'sexuality', 'arousal', 'provocative', 'steamy',
  'sensuous', 'sultry', 'kinky', 'fetish', 'escort', 'stripper',
  'brothel', 'prostitute', 'call girl', 'gigolo', 'swinger'
];

// Function to check if content contains adult material
export const isAdultContent = (item: any): boolean => {
  if (!item) return false;
  
  const title = (item.title || item.name || '').toLowerCase();
  const overview = (item.overview || '').toLowerCase();
  
  // Check for adult keywords in title or overview
  const hasAdultKeywords = adultContentKeywords.some(keyword => 
    title.includes(keyword) || overview.includes(keyword)
  );
  
  // Check for adult certification (R rating for very explicit content)
  const isExplicitRating = item.adult === true;
  
  // Additional check for genre combinations that might indicate adult content
  const genreIds = item.genre_ids || [];
  const hasAdultGenreCombination = genreIds.includes(18) && // Drama
    (genreIds.includes(10749) || // Romance  
     genreIds.includes(53)); // Thriller - sometimes combined for adult content
  
  return hasAdultKeywords || isExplicitRating || (hasAdultGenreCombination && hasAdultKeywords);
};

// Filter function that can be toggled
export const filterAdultContent = (items: any[], allowAdultContent: boolean = false): any[] => {
  if (allowAdultContent) {
    return items;
  }
  
  return items.filter(item => !isAdultContent(item));
};
