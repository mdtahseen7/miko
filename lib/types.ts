export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
  imdb_id: string;
  videos: {
    results: Video[];
  };
  similar: {
    results: Movie[];
  };
  images: {
    backdrops: Image[];
    posters: Image[];
  };
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Genre[];
  seasons: Season[];
  videos: {
    results: Video[];
  };
  similar: {
    results: TVShow[];
  };
  images: {
    backdrops: Image[];
    posters: Image[];
  };
}

// User and Authentication Types
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  watchLater: any[];
  preferences: any;
  createdAt: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Image {
  file_path: string;
  width: number;
  height: number;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string;
  episode_count: number;
  air_date: string;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  runtime: number;
  vote_average: number;
}

export interface StreamingSource {
  id: string;
  name: string;
  description?: string;
  isFrench?: boolean;
  requiresNoSandbox?: boolean;
  urls: {
    movie?: string;
    tv?: string;
  };
}

export interface SportsMatch {
  id: string;
  title: string;
  category: string;
  time: string;
  date: string;
  url: string;
}

export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  overview: string;
  genre_ids?: number[];
}

export interface WatchLaterItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  addedAt: string;
}
