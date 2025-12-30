import React from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import { Product } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  products?: Product[]; // Added prop to receive current products from Supabase
}

const FALLBACK_IMAGE = "https://kczgnxjubrmoucgvpvxf.supabase.co/storage/v1/object/public/order_proofs/logo%20nuevo1.png";

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddToCart,
  products = [] // Default to empty array if not passed
}) => {
  const { favorites } = useSupabase();

  if (!isOpen) return null;

  // Filter the passed products (which come from Supabase) based on favorite IDs
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 bg-fifo-red text-white flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="fill-white" size={24} />
            <h2 className="text-xl font-black uppercase">Mis Favoritos</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
          {favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <Heart size={64} opacity={0.2} />
              <p className="font-medium text-center">Aún no tienes favoritos.<br/>¡Dale amor a los combos que te gusten!</p>
            </div>
          ) : (
            favoriteProducts.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center border border-gray-100 p-1">
                    <img 
                        src={item.image || FALLBACK_IMAGE} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                    />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <span className="font-black text-fifo-red text-lg">${(item.price || 0).toFixed(2)}</span>
                    <button 
                      onClick={() => onAddToCart(item)}
                      className="bg-fifo-yellow text-fifo-darkRed px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-yellow-400 transition-colors shadow-sm"
                    >
                      <ShoppingBag size={14} /> AGREGAR
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};