import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Store, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { Button } from './Button';
import { useSupabase } from '../contexts/SupabaseContext';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAdd: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  product,
  onAdd 
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const { recordView } = useSupabase();

  // Reset variant and quantity when product changes
  useEffect(() => {
    if (product) {
      if (product.variants) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setQuantity(1);
      
      // Track View
      recordView(product.id).catch(err => console.error("Error tracking view", err));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentPrice = (selectedVariant ? selectedVariant.price : product.price) || 0;

  const handleAdd = () => {
    onAdd(product, selectedVariant, quantity);
    onClose();
  };

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

  // Logic for Breakfast Combo Time Restriction
  const isBreakfastCombo = product.id === 'combo-mananero';
  const currentHour = new Date().getHours();
  const isBreakfastTime = currentHour >= 7 && currentHour < 10; 

  const consultAvailability = () => {
    const message = `Hola *Grupo Fifo* 👋, estoy interesado en el *${product.name}* pero veo que es fuera del horario de desayuno. ¿Tienen disponibilidad?`;
    const url = `https://wa.me/584124169283?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"></div>

      {/* Modal Content - Floating Card Style on Mobile */}
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Image Area - Reduced height for mobile visibility */}
        <div className="relative h-48 md:h-64 bg-gray-100 flex items-center justify-center p-4 group shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-gray-200 opacity-50"></div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain drop-shadow-xl transform transition-transform duration-500 group-hover:scale-105"
          />
          {product.promoLabel && (
            <div className="absolute bottom-2 left-2 bg-fifo-yellow text-fifo-red font-black px-2 py-1 rounded-lg text-xs shadow-lg animate-bounce">
              {product.promoLabel}
            </div>
          )}
        </div>

        {/* Content Area - Scrollable */}
        <div className="p-5 overflow-y-auto bg-white flex-1 custom-scrollbar">
          
          {/* WARNING NOTIFICATION FOR ICE CREAM */}
          {product.category === 'ice_cream' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <Store className="text-yellow-500 mr-2 mt-0.5" size={16} />
                <div>
                   <p className="font-bold text-yellow-700 uppercase text-[10px] tracking-wider mb-0.5">Nota Importante</p>
                   <p className="text-xs text-yellow-800 leading-tight">
                     Este producto es <span className="font-bold bg-yellow-200 px-1 rounded">solo para retiro</span>.
                   </p>
                </div>
              </div>
            </div>
          )}

          {/* WARNING NOTIFICATION FOR BREAKFAST COMBO */}
          {isBreakfastCombo && (
            <div className={`border-l-4 p-3 mb-4 rounded-r-lg shadow-sm ${!isBreakfastTime ? 'bg-orange-50 border-orange-500' : 'bg-blue-50 border-blue-500'}`}>
              <div className="flex items-start gap-2">
                {!isBreakfastTime ? <AlertCircle className="text-orange-500 mt-1" size={16} /> : <Clock className="text-blue-500 mt-1" size={16} />}
                <div className="flex-1">
                   <p className={`font-bold uppercase text-[10px] tracking-wider mb-0.5 ${!isBreakfastTime ? 'text-orange-700' : 'text-blue-700'}`}>
                     {!isBreakfastTime ? 'Fuera de Horario' : 'Horario Desayuno'}
                   </p>
                   <p className={`text-xs leading-tight mb-2 ${!isBreakfastTime ? 'text-orange-800' : 'text-blue-800'}`}>
                     Disponible 7am - 10am.
                   </p>
                   
                   {!isBreakfastTime && (
                     <button 
                       onClick={consultAvailability}
                       className="text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800 font-bold py-1.5 px-2 rounded-lg transition-colors flex items-center gap-1 border border-orange-200"
                     >
                       <MessageCircle size={12} />
                       Consultar
                     </button>
                   )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col mb-2">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase leading-tight mb-1">
              {product.name}
            </h2>
            <div className="self-start text-xl font-black text-fifo-red bg-red-50 px-3 py-0.5 rounded-lg shadow-sm">
              ${currentPrice.toFixed(2)}
            </div>
          </div>

          <p className="text-gray-600 font-medium italic mb-4 text-sm md:text-base leading-snug">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && (
            <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-wider">Selecciona Tamaño:</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex-1 min-w-[70px] py-2 px-2 text-xs font-bold rounded-lg border transition-all shadow-sm ${
                      selectedVariant?.id === v.id
                        ? 'bg-fifo-red border-fifo-red text-white scale-105 shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-fifo-red hover:text-fifo-red'
                    }`}
                  >
                    <div className="leading-tight">{v.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-80 font-normal mt-0.5">${v.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients/Items List */}
          <div className="mb-2">
            <h3 className="text-xs font-black text-gray-800 uppercase mb-2 border-b border-gray-100 pb-1">Incluye:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              {product.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-fifo-red mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-1">
            <button 
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-fifo-red disabled:opacity-50 touch-manipulation active:scale-90 transition-transform"
              disabled={quantity <= 1}
            >
              <Minus size={18} />
            </button>
            <span className="w-6 text-center font-black text-lg text-gray-800">{quantity}</span>
            <button 
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-500 touch-manipulation active:scale-90 transition-transform"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <Button onClick={handleAdd} fullWidth className="text-base py-3 shadow-lg flex-1 touch-manipulation">
            <ShoppingCart className="mr-1" size={18} />
            <span className="font-black">AGREGAR • ${(currentPrice * quantity).toFixed(2)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};