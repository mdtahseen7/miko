export const availableSources = [
    {
        id: 'multiembed',
        name: 'MultiEmbed',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://multiembed.mov/?video_id={id}&tmdb=1',
            tv: 'https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}'
        }
    },
    {
        id: 'moviesapi',
        name: 'MoviesAPI',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://moviesapi.club/movie/{id}',
            tv: 'https://moviesapi.club/tv/{id}-{season}-{episode}'
        }
    },
        {
        id: 'rive',
        name: 'RiveStream',
        isFrench: false,
        urls: {
            movie: 'https://rivestream.org/embed?type=movie&id={id}',
            tv: 'https://rivestream.org/embed?type=tv&id={id}&season={season}&episode={episode}'
        }
    },
    {
        id: 'pstream',
        name: 'P-Stream',
        isFrench: false,
        requiresNoSandbox: false,
        urls: {
            movie: 'https://iframe.pstream.mov/media/tmdb-movie-{id}',
            tv: 'https://iframe.pstream.mov/media/tmdb-tv-{id}/{season}/{episode}'
        }
    },
    
    {
        id: 'embedsu',
        name: 'EmbedSU',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://embed.su/embed/movie/{id}',
            tv: 'https://embed.su/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'hexa',
        name: 'Hexa',
        isFrench: false,
        urls: {
            movie: 'https://hexa.watch/watch/movie/{id}',
            tv: 'https://hexa.watch/watch/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidlink',
        name: 'VidLink',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidlink.pro/movie/{id}',
            tv: 'https://vidlink.pro/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcXyz',
        name: 'VidSrcXyz',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidsrc.xyz/embed/movie/{id}',
            tv: 'https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcrip',
        name: 'VidSrcRIP',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidsrc.rip/embed/movie/{id}',
            tv: 'https://vidsrc.rip/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcsu',
        name: 'VidSrcSU',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidsrc.su/embed/movie/{id}',
            tv: 'https://vidsrc.su/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcvip',
        name: 'VidSrcVIP',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidsrc.vip/embed/movie/{id}',
            tv: 'https://vidsrc.vip/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: '2embed',
        name: '2Embed',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://www.2embed.cc/embed/{id}',
            tv: 'https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}'
        }
    },
    {
        id: '123embed',
        name: '123Embed',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://play2.123embed.net/movie/{id}',
            tv: 'https://play2.123embed.net/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: '111movies',
        name: '111Movies',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://111movies.com/movie/{id}',
            tv: 'https://111movies.com/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'smashystream',
        name: 'SmashyStream',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://player.smashy.stream/movie/{id}',
            tv: 'https://player.smashy.stream/tv/{id}?s={season}&e={episode}'
        }
    },
    {
        id: 'autoembed',
        name: 'AutoEmbed',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://player.autoembed.cc/embed/movie/{id}',
            tv: 'https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'videasy',
        name: 'VidEasy (4K)',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://player.videasy.net/movie/{id}?color=8834ec',
            tv: 'https://player.videasy.net/tv/{id}/{season}/{episode}?color=8834ec'
        }
    },
    {
        id: 'vidfast',
        name: 'VidFast (4K)',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidfast.pro/movie/{id}',
            tv: 'https://vidfast.pro/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidify',
        name: 'Vidify',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidify.top/embed/movie/{id}',
            tv: 'https://vidify.top/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'flicky',
        name: 'Flicky',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://letsembed.cc/embed/movie/?id={id}',
            tv: 'https://letsembed.cc/embed/tv/?id={id}/{season}/{episode}'
        }
    },
    {
        id: 'vidora',
        name: 'Vidora',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidora.su/movie/{id}',
            tv: 'https://vidora.su/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrccc',
        name: 'VidSrcCC',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false',
            tv: 'https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}?autoPlay=false'
        }
    },
    {
        id: 'streamflix',
        name: 'StreamFlix',
        isFrench: false,
        urls: {
            movie: 'https://watch.streamflix.one/movie/{id}}/watch?server=1',
            tv: 'https://watch.streamflix.one/tv/{id}}/watch?server=1&season={season}}&episode={episode}}'
        }
    },
    {
        id: 'nebula',
        name: 'NebulaFlix',
        isFrench: false,
        urls: {
            movie: 'https://nebulaflix.stream/movie?mt={id}&server=1',
            tv: 'https://nebulaflix.stream/show?st={id}&season={season}&episode={episode}&server=1'
        }
    },
    {
        id: 'vidjoy',
        name: 'VidJoy',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://vidjoy.pro/embed/movie/{id}',
            tv: 'https://vidjoy.pro/embed/tv/{id}}/{season}/{episode}'
        }
    },
    {
        id: 'vidzee',
        name: 'VidZee',
        isFrench: false,
        requiresNoSandbox: true,
        urls: {
            movie: 'https://player.vidzee.wtf/embed/movie/{id}',
            tv: 'https://player.vidzee.wtf/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'spenflix',
        name: 'Spenflix',
        isFrench: false,
        urls: {
            movie: 'https://spencerdevs.xyz/movie/{id}',
            tv: 'https://spencerdevs.xyz/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'frembed',
        name: 'Frembed',
        isFrench: true,
        urls: {
            movie: 'https://frembed.cc/api/film.php?id={id}',
            tv: 'https://frembed.cc/api/serie.php?id={id}&sa={season}&epi={episode}'
        }
    },
    {
        id: 'uembed',
        name: 'UEmbed (premium)',
        isFrench: false,
        urls: {
            movie: 'https://uembed.site/?id={id}&apikey=thisisforsurenotapremiumkey_right?',
            tv: 'https://uembed.site/?id={id}&season={season}&episode={episode}&apikey=thisisforsurenotapremiumkey_right?'
        }
    }
];
