import React, { useState } from 'react';
import { Plus, Flame, Eye, Minus, Heart } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useSupabase } from '../contexts/SupabaseContext';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onViewDetail?: (product: Product) => void;
  isHighlighted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAdd, 
  onViewDetail,
  isHighlighted = false 
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  
  const { favorites, toggleFavorite, user } = useSupabase();
  const isFavorite = favorites.includes(product.id);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const isPromo = Boolean(product.isPopular || product.promoLabel);

  const handleImageClick = () => {
    if (onViewDetail) {
      onViewDetail(product);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(q => q + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(q => Math.max(1, q - 1));
  };
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
        alert('Debes iniciar sesión para agregar a favoritos');
        return;
    }
    await toggleFavorite(product.id);
  };

  return (
    <div className={`group bg-white rounded-xl md:rounded-2xl overflow-hidden flex flex-col h-full relative transition-all duration-300 ${
      isHighlighted
        ? 'ring-4 ring-green-500 shadow-[0_0_40px_rgba(34,197,94,0.6)] scale-[1.03] z-30 transform'
        : isPromo 
          ? 'border-2 border-fifo-yellow shadow-[0_0_10px_rgba(255,221,0,0.2)] md:shadow-[0_0_20px_rgba(255,221,0,0.3)] md:scale-[1.02] z-10' 
          : 'border border-gray-100 hover:border-fifo-yellow shadow-sm hover:shadow-xl'
    }`}>
      
      {/* Promo Badge */}
      {isPromo && (
        <div className="absolute top-0 right-0 z-20 pointer-events-none">
          <div className="bg-gradient-to-l from-fifo-red to-fifo-darkRed text-white text-[9px] md:text-xs font-black uppercase py-1 px-1.5 md:py-2 md:px-4 rounded-bl-lg md:rounded-bl-2xl shadow-lg flex items-center gap-1">
            <Flame size={10} className="text-fifo-yellow md:hidden" fill="currentColor" />
            <span className="hidden md:inline">{product.promoLabel || 'Top'}</span>
            <span className="md:hidden">{product.promoLabel ? product.promoLabel.split(' ')[0] : 'PROMO'}</span>
          </div>
        </div>
      )}
      
      {/* Favorite Button (Absolute Left) */}
      <button 
        onClick={handleToggleFavorite}
        className="absolute top-2 left-2 z-20 p-1.5 md:p-2 rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform active:scale-90"
      >
        <Heart 
          size={14} 
          className={`md:w-[18px] md:h-[18px] transition-colors ${isFavorite ? 'fill-fifo-red text-fifo-red' : 'text-gray-400'}`} 
        />
      </button>

      {/* Image Area - Height reduced on mobile */}
      <div 
        onClick={handleImageClick}
        className="relative h-32 md:h-48 overflow-hidden p-2 md:p-4 bg-gray-50 flex items-center justify-center cursor-pointer active:scale-95 transition-transform duration-200"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors z-10">
            <Eye className="text-gray-800 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden md:block" />
        </div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transform md:group-hover:scale-110 transition-transform duration-500 drop-shadow-md md:drop-shadow-xl"
        />
        
        {/* Price Tag Mobile Optimized (Smaller) */}
        <div className={`absolute bottom-0 right-0 font-black text-xs md:text-xl py-1 px-1.5 md:py-2 md:px-4 rounded-tl-lg md:rounded-tl-2xl border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-white shadow-sm z-20 ${
          isPromo ? 'bg-fifo-yellow text-fifo-red' : 'bg-fifo-red text-white'
        }`}>
          ${currentPrice.toFixed(2)}
        </div>
      </div>
      
      {/* Content Area - Padding Reduced on mobile */}
      <div className="p-2 md:p-5 flex-1 flex flex-col">
        <h3 
          onClick={handleImageClick}
          className="text-xs font-bold md:text-xl md:font-black text-gray-800 uppercase mb-1 md:mb-2 leading-tight cursor-pointer hover:text-fifo-red line-clamp-2 min-h-[2.5em] md:min-h-0"
        >
          {product.name}
        </h3>
        
        <p className="text-gray-500 text-sm italic mb-3 font-medium hidden md:block">
          {product.description}
        </p>

        {/* Variants Selector */}
        {product.variants && (
          <div className="mb-2 md:mb-4">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1 block hidden md:block">Tamaño:</span>
            <div className="flex flex-wrap gap-1 md:gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariant(v); }}
                  className={`flex-1 min-w-[50px] md:min-w-[60px] py-1 px-1 text-[9px] md:text-xs font-bold rounded-md md:rounded-lg border transition-all leading-tight ${
                    selectedVariant?.id === v.id
                      ? 'bg-fifo-red border-fifo-red text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-fifo-red hover:text-fifo-red'
                  }`}
                >
                  {v.name.split(' ')[0]} <span className="opacity-90 block">${v.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items list (Desktop Only) */}
        <ul className="text-sm text-gray-600 space-y-1 mb-4 flex-1 hidden md:block">
          {product.items.slice(0, 4).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className={`font-bold ${isPromo ? 'text-fifo-yellow' : 'text-fifo-red'}`}>•</span> {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-1 md:pt-2">
            {/* Quantity Controls - Compact on mobile */}
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-1.5 md:mb-2 bg-gray-50 rounded-lg p-0.5 md:p-1 border border-gray-100">
                <button 
                  onClick={handleDecrement}
                  className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-fifo-red transition-colors disabled:opacity-50 active:scale-95 touch-manipulation"
                  disabled={quantity <= 1}
                >
                  <Minus size={12} className="md:w-4 md:h-4" />
                </button>
                <span className="font-bold text-gray-800 text-xs md:text-base w-4 md:w-6 text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-green-600 transition-colors active:scale-95 touch-manipulation"
                >
                  <Plus size={12} className="md:w-4 md:h-4" />
                </button>
            </div>

            <button 
            onClick={(e) => {
                e.stopPropagation();
                onAdd(product, selectedVariant, quantity);
                setQuantity(1); // Reset counter after add
            }}
            className={`w-full font-bold py-1.5 md:py-3 rounded-lg md:rounded-xl transition-colors flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-base group-active:scale-95 shadow-sm active:shadow-inner touch-manipulation ${
                isPromo 
                ? 'bg-fifo-red text-white hover:bg-fifo-darkRed shadow-md hover:shadow-lg' 
                : 'bg-gray-100 text-gray-800 hover:bg-fifo-red hover:text-white'
            }`}
            >
            <Plus size={12} className="md:w-[18px] md:h-[18px]" strokeWidth={3} />
            <span className="md:hidden font-black tracking-wide">AGREGAR</span>
            <span className="hidden md:inline">AGREGAR {selectedVariant ? selectedVariant.name.match(/\((.*?)\)/)?.[1] : ''}</span>
            </button>
        </div>
      </div>
    </div>
  );
};