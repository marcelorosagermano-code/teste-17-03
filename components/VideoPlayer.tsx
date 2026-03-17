import React, { useState } from 'react';
import { Loader2, AlertCircle, ExternalLink, Play } from 'lucide-react';

interface VideoPlayerProps {
  videoId?: string; // Google Drive ID
  videoUrl?: string; // Direct MP4 URL
  youtubeId?: string; // YouTube ID
  title: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, videoUrl, youtubeId, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset state when video changes
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [videoId, videoUrl, youtubeId]);

  // CASE 1: YouTube (Recomendado para performance)
  if (youtubeId) {
    return (
      <div className="relative w-full overflow-hidden bg-black rounded-xl shadow-2xl border border-zinc-800 aspect-video group">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 z-10 bg-zinc-900">
            <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-2" />
          </div>
        )}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&controls=1&showinfo=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  // CASE 2: Direct MP4 URL
  if (videoUrl) {
    return (
      <div className="relative w-full overflow-hidden bg-black rounded-xl shadow-2xl border border-zinc-800 aspect-video group">
        <video 
          key={videoUrl}
          className="w-full h-full object-contain"
          controls
          playsInline
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 z-10 bg-zinc-900">
             <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-2" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 z-20 bg-zinc-900 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-white font-semibold text-lg">Erro ao carregar MP4</h3>
            <p className="text-sm mt-2">Verifique se o link está correto e acessível.</p>
          </div>
        )}
      </div>
    );
  }

  // CASE 3: Google Drive Embed
  if (videoId) {
    const embedUrl = `https://drive.google.com/file/d/${videoId}/preview`;

    return (
      <div className="relative w-full overflow-hidden bg-black rounded-xl shadow-2xl border border-zinc-800 aspect-video group">
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 z-10 bg-zinc-900">
            <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-2" />
            <p className="text-sm font-medium">Carregando aula...</p>
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 z-20 bg-zinc-900 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-white font-semibold text-lg">Não foi possível carregar o vídeo</h3>
            <p className="text-sm max-w-md mt-2 mb-6">
              Isso pode ocorrer devido às configurações de privacidade do Google Drive.
            </p>
            <a 
              href={embedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors"
            >
              <ExternalLink size={16} />
              Assistir no Drive
            </a>
          </div>
        )}

        {/* The Iframe */}
        <iframe
          src={embedUrl}
          title={title}
          className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
              setIsLoading(false);
              setHasError(true);
          }}
        />
      </div>
    );
  }

  // CASE 4: No Video Source
  return null;
};