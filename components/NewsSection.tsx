import React, { useState } from 'react';
import { ArrowRight, Calendar, Star, Tag, Clock, X, ShoppingBag } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: "¡Llegó la Taquilla Express!",
    description: "Ahora tus compras serán aún más rápidas mientras vas caminando por el bulevar de la carrera 12 en calabozo!",
    image: "https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/IMG_7391.JPEG",
    tag: "NUEVO",
    color: "bg-fifo-red",
    icon: <Star size={16} />
  }
];

interface NewsSectionProps {
  onOrderNow?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onOrderNow }) => {
  const [selectedNews, setSelectedNews] = useState<typeof newsItems[0] | null>(null);

  const handleCtaClick = () => {
    setSelectedNews(null);
    if (onOrderNow) {
        onOrderNow();
    }
  };

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
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedNews(item)}
              className="min-w-[300px] md:min-w-[350px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 snap-center group hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute top-4 left-4 ${item.color} ${item.tag === 'PROMO' ? '' : 'text-white'} text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-md`}>
                  {item.icon} {item.tag}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-3 uppercase">
                  <Calendar size={14} />
                  <span>Novedad Reciente</span>
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2 leading-tight group-hover:text-fifo-red transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>
                <button className="text-fifo-red font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Leer más <ArrowRight size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
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
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title} 
                className="w-full h-full object-cover"
              />
               <div className={`absolute top-6 left-6 ${selectedNews.color} text-white text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-md`}>
                  {selectedNews.icon} {selectedNews.tag}
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-bold mb-4 uppercase">
                <Calendar size={16} />
                <span>Novedad Reciente</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight uppercase italic">
                {selectedNews.title}
              </h2>
              
              <div className="prose prose-lg text-gray-600 mb-8 leading-relaxed">
                <p>{selectedNews.description}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <button 
                  onClick={handleCtaClick}
                  className="w-full bg-fifo-red hover:bg-fifo-darkRed text-white font-black py-4 rounded-xl transition-colors uppercase tracking-wide shadow-lg flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                  PEDIR AHORA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};