import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Star, Clock, X, ShoppingBag, MapPin, PartyPopper } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { NewsEvent } from '../types';

interface NewsSectionProps {
  onOrderNow?: () => void;
}

// Fallback data in case the database table doesn't exist yet
const FALLBACK_NEWS: NewsEvent[] = [
  {
    id: 'fallback-1',
    title: '¡Llegó la Taquilla Express!',
    description: 'Ahora tus compras serán aún más rápidas mientras vas caminando por el bulevar de la carrera 12 en calabozo!',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800',
    tag: 'NUEVO',
    created_at: new Date().toISOString(),
    is_active: true,
    display_order: 1
  }
];

export const NewsSection: React.FC<NewsSectionProps> = ({ onOrderNow }) => {
  const [selectedNews, setSelectedNews] = useState<NewsEvent | null>(null);
  const [newsItems, setNewsItems] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch news from Supabase
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('news_events')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setNewsItems(data);
        } else {
          // If table exists but is empty, use fallback
          setNewsItems(FALLBACK_NEWS);
        }
      } catch (error: any) {
        const errorMessage = error.message || JSON.stringify(error);
        
        // Check if it's a missing table error (common during setup)
        if (
             errorMessage.includes('Could not find the table') || 
             errorMessage.includes('relation "public.news_events" does not exist')
           ) {
           console.warn('News table not found in Supabase. Using fallback data. (Run populate_news.sql to fix)');
        } else {
           console.error('Error fetching news:', errorMessage);
        }
        
        // Use fallback data so the UI doesn't break
        setNewsItems(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleCtaClick = () => {
    setSelectedNews(null);
    if (onOrderNow) {
        onOrderNow();
    }
  };

  // Helper to determine style based on Tag from DB
  const getTagStyle = (tag: string) => {
    const normalizedTag = tag ? tag.toUpperCase() : 'INFO';
    switch (normalizedTag) {
      case 'NUEVO':
        return { bg: 'bg-fifo-red', icon: <Star size={14} />, text: 'text-white' };
      case 'EVENTO':
        return { bg: 'bg-purple-600', icon: <PartyPopper size={14} />, text: 'text-white' };
      case 'PROMO':
        return { bg: 'bg-fifo-yellow', icon: <ShoppingBag size={14} />, text: 'text-fifo-darkRed' };
      case 'AVISO':
        return { bg: 'bg-blue-600', icon: <MapPin size={14} />, text: 'text-white' };
      default:
        return { bg: 'bg-gray-800', icon: <Clock size={14} />, text: 'text-white' };
    }
  };

  if (loading) {
     return (
        <section className="py-12 bg-white border-t border-gray-100">
             <div className="container mx-auto px-4">
                 <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex gap-4 overflow-hidden mt-6">
                            <div className="min-w-[300px] h-64 bg-gray-200 rounded-2xl"></div>
                            <div className="min-w-[300px] h-64 bg-gray-200 rounded-2xl hidden md:block"></div>
                        </div>
                    </div>
                 </div>
             </div>
        </section>
     );
  }

  // Si no hay noticias, no renderizar la sección
  if (newsItems.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-fifo-red font-black tracking-widest text-sm uppercase mb-2 block">Actualidad</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-gray-800 italic">
              Novedades <span className="text-fifo-red">Fifo</span>
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 font-bold text-gray-500 hover:text-fifo-red transition-colors">
            Ver todo <ArrowRight size={20} />
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {newsItems.map((item) => {
            const style = getTagStyle(item.tag);
            return (
                <div 
                key={item.id} 
                onClick={() => setSelectedNews(item)}
                className="min-w-[300px] md:min-w-[350px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 snap-center group hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col h-full"
                >
                <div className="h-48 overflow-hidden relative shrink-0">
                    <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute top-4 left-4 ${style.bg} ${style.text} text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-md`}>
                    {style.icon} {item.tag}
                    </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-3 uppercase">
                    <Calendar size={14} />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2 leading-tight group-hover:text-fifo-red transition-colors line-clamp-2">
                    {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {item.description}
                    </p>
                    <button className="text-fifo-red font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                    Leer más <ArrowRight size={16} strokeWidth={3} />
                    </button>
                </div>
                </div>
            );
          })}
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-fifo-red text-white p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={24} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative shrink-0">
              <img 
                src={selectedNews.image_url} 
                alt={selectedNews.title} 
                className="w-full h-full object-cover"
              />
               {(() => {
                  const style = getTagStyle(selectedNews.tag);
                  return (
                    <div className={`absolute top-6 left-6 ${style.bg} ${style.text} text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-md`}>
                        {style.icon} {selectedNews.tag}
                    </div>
                  );
               })()}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-bold mb-4 uppercase">
                <Calendar size={16} />
                <span>Publicado el {new Date(selectedNews.created_at).toLocaleDateString()}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight uppercase italic">
                {selectedNews.title}
              </h2>
              
              <div className="prose prose-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                <p>{selectedNews.description}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <button 
                  onClick={handleCtaClick}
                  className="w-full bg-fifo-red hover:bg-fifo-darkRed text-white font-black py-4 rounded-xl transition-colors uppercase tracking-wide shadow-lg flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                  {selectedNews.tag === 'EVENTO' ? 'RESERVAR MESA' : 'PEDIR AHORA'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};