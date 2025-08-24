// AniList + TMDB anime mapping utilities

// AniList GraphQL queries
const ANILIST_API_URL = 'https://graphql.anilist.co';

const ANILIST_ANIME_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      episodes
      season
      seasonYear
      nextAiringEpisode {
        episode
        airingAt
      }
      relations {
        edges {
          relationType
          node {
            id
            type
            format
            episodes
            season
            seasonYear
            title {
              romaji
              english
              native
            }
          }
        }
      }
    }
  }
`;

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
      season
      seasonYear
      relations {
        edges {
          relationType
          node {
            id
            type
            format
            episodes
            season
            seasonYear
            title {
              romaji
              english
              native
            }
          }
        }
      }
    }
  }
`;

// Interface for AniList season data
interface AniListSeason {
  seasonNumber: number;
  episodeCount: number;
  title: string;
  year?: number;
}

// Search for anime on AniList by title
export const searchAniListAnime = async (title: string) => {
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

// Get detailed anime data from AniList by ID
export const getAniListAnimeDetails = async (aniListId: number) => {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_ANIME_QUERY,
        variables: { id: aniListId }
      })
    });
    
    const data = await response.json();
    return data.data?.Media || null;
  } catch (error) {
    console.warn('AniList details fetch failed:', error);
    return null;
  }
};

// Extract season breakdown from AniList data
export const extractAniListSeasons = (aniListData: any): AniListSeason[] => {
  if (!aniListData) return [];
  
  const seasons: AniListSeason[] = [];
  
  // Main entry (first season)
  if (aniListData.episodes && aniListData.episodes > 0) {
    seasons.push({
      seasonNumber: 1,
      episodeCount: aniListData.episodes,
      title: aniListData.title?.english || aniListData.title?.romaji || 'Season 1',
      year: aniListData.seasonYear
    });
  }
  
  // Related entries (sequels, prequels, etc.)
  if (aniListData.relations?.edges) {
    const sequels = aniListData.relations.edges
      .filter((edge: any) => 
        edge.relationType === 'SEQUEL' && 
        edge.node?.type === 'ANIME' && 
        edge.node?.episodes > 0
      )
      .map((edge: any) => edge.node)
      .sort((a: any, b: any) => (a.seasonYear || 0) - (b.seasonYear || 0)); // Sort by year
    
    sequels.forEach((sequel: any, index: number) => {
      seasons.push({
        seasonNumber: seasons.length + 1,
        episodeCount: sequel.episodes,
        title: sequel.title?.english || sequel.title?.romaji || `Season ${seasons.length + 1}`,
        year: sequel.seasonYear
      });
    });
  }
  
  return seasons;
};

// Update episode name to match new numbering
const updateEpisodeName = (originalName: string, newEpisodeNumber: number): string => {
  if (!originalName) return `Episode ${newEpisodeNumber}`;
  
  // Pattern to match episode numbers in various formats
  const patterns = [
    /Episode\s+(\d+)/i,
    /Ep\.?\s*(\d+)/i,
    /第(\d+)話/,  // Japanese format
    /^\d+\./,     // Starting with number and dot
    /^(\d+)\s*-/  // Starting with number and dash
  ];
  
  let updatedName = originalName;
  
  for (const pattern of patterns) {
    if (pattern.test(updatedName)) {
      if (pattern.source.includes('Episode')) {
        updatedName = updatedName.replace(pattern, `Episode ${newEpisodeNumber}`);
      } else if (pattern.source.includes('Ep')) {
        updatedName = updatedName.replace(pattern, `Ep. ${newEpisodeNumber}`);
      } else if (pattern.source.includes('第')) {
        updatedName = updatedName.replace(pattern, `第${newEpisodeNumber}話`);
      } else if (pattern.source.includes('^\\d+\\.')) {
        updatedName = updatedName.replace(pattern, `${newEpisodeNumber}.`);
      } else if (pattern.source.includes('^(\\d+)\\s*-')) {
        updatedName = updatedName.replace(pattern, `${newEpisodeNumber} -`);
      }
      break;
    }
  }
  
  // If no pattern matched, prepend episode number
  if (updatedName === originalName && !updatedName.toLowerCase().includes('episode')) {
    updatedName = `Episode ${newEpisodeNumber}: ${originalName}`;
  }
  
  return updatedName;
};

// Main mapper function: Merge AniList season structure with TMDB episode details
export const mapAniListToTmdb = (aniListSeasons: AniListSeason[], tmdbEpisodes: any[], tmdbData: any) => {
  if (!aniListSeasons.length || !tmdbEpisodes.length) {
    return null;
  }
  
  console.log('[AniList Mapper] Mapping', {
    seasons: aniListSeasons.length,
    tmdbEpisodes: tmdbEpisodes.length,
    seasonBreakdown: aniListSeasons.map(s => `S${s.seasonNumber}: ${s.episodeCount} eps`)
  });
  
  const mappedSeasons: any[] = [];
  let episodeIndex = 0;
  
  for (const aniListSeason of aniListSeasons) {
    const seasonEpisodes: any[] = [];
    
    // Get episodes for this season
    for (let ep = 1; ep <= aniListSeason.episodeCount; ep++) {
      const tmdbEpisode = tmdbEpisodes[episodeIndex] || {};
      
      // Create new episode with updated numbering but preserve all TMDB data
      const mappedEpisode = {
        ...tmdbEpisode, // Preserve all TMDB fields
        season_number: aniListSeason.seasonNumber,
        episode_number: ep,
        name: updateEpisodeName(tmdbEpisode.name, ep),
        // Preserve original data for reference
        _original_episode_number: tmdbEpisode.episode_number,
        _original_name: tmdbEpisode.name,
        _original_season: tmdbEpisode.season_number
      };
      
      seasonEpisodes.push(mappedEpisode);
      episodeIndex++;
    }
    
    // Create season object matching TMDB structure
    const mappedSeason = {
      id: `${tmdbData.id}-season-${aniListSeason.seasonNumber}`,
      air_date: seasonEpisodes[0]?.air_date || null,
      episodes: seasonEpisodes,
      name: aniListSeason.title || `Season ${aniListSeason.seasonNumber}`,
      overview: `${aniListSeason.title} - ${aniListSeason.episodeCount} episodes`,
      poster_path: tmdbData.poster_path || null,
      season_number: aniListSeason.seasonNumber,
      episode_count: aniListSeason.episodeCount,
      vote_average: tmdbData.vote_average || 0
    };
    
    mappedSeasons.push(mappedSeason);
  }
  
  // Return data in exact TMDB structure with merged content
  const mergedData = {
    ...tmdbData, // Preserve all original TMDB data
    seasons: mappedSeasons,
    number_of_seasons: mappedSeasons.length,
    number_of_episodes: aniListSeasons.reduce((total, season) => total + season.episodeCount, 0),
    _source: "AniList+TMDB",
    _anilist_enhanced: true,
    _season_breakdown: aniListSeasons.map(s => `S${s.seasonNumber}: ${s.episodeCount} eps`).join(', ')
  };
  
  console.log('[AniList Mapper] Mapping complete:', {
    originalSeasons: tmdbData.seasons?.length || 0,
    mappedSeasons: mappedSeasons.length,
    totalEpisodes: mergedData.number_of_episodes
  });
  
  return mergedData;
};

// Helper function to get season breakdown for an anime
export const getAnimeSeasonBreakdown = async (title: string): Promise<AniListSeason[]> => {
  try {
    // Search for anime on AniList
    const searchResult = await searchAniListAnime(title);
    if (!searchResult) {
      console.warn('[AniList] No search results for:', title);
      return [];
    }
    
    // Get detailed data including relations
    const detailedData = await getAniListAnimeDetails(searchResult.id);
    if (!detailedData) {
      console.warn('[AniList] No detailed data for ID:', searchResult.id);
      return [];
    }
    
    // Extract season breakdown
    const seasons = extractAniListSeasons(detailedData);
    console.log('[AniList] Season breakdown for', title, ':', seasons);
    
    return seasons;
  } catch (error) {
    console.error('[AniList] Error getting season breakdown:', error);
    return [];
  }
};
