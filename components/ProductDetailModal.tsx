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

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

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
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:p-4" onClick={onClose}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"></div>

      {/* Modal Content - Full screen on mobile, modal on desktop */}
      <div 
        className="bg-white w-full h-full md:h-auto md:max-w-lg md:rounded-3xl shadow-2xl relative flex flex-col md:max-h-[90vh] animate-in slide-in-from-bottom duration-300 md:animate-in md:zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-md"
        >
          <X size={24} />
        </button>

        {/* Image Area */}
        <div className="relative h-64 md:h-72 bg-gray-100 flex items-center justify-center p-6 group shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-gray-200 opacity-50"></div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110"
          />
          {product.promoLabel && (
            <div className="absolute bottom-4 left-4 bg-fifo-yellow text-fifo-red font-black px-3 py-1 rounded-full text-sm shadow-lg animate-bounce">
              {product.promoLabel}
            </div>
          )}
        </div>

        {/* Content Area - Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto bg-white flex-1 custom-scrollbar pb-24 md:pb-8">
          
          {/* WARNING NOTIFICATION FOR ICE CREAM */}
          {product.category === 'ice_cream' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm animate-pulse">
              <div className="flex items-start">
                <Store className="text-yellow-500 mr-3 mt-0.5" size={20} />
                <div>
                   <p className="font-bold text-yellow-700 uppercase text-xs tracking-wider mb-1">Nota Importante</p>
                   <p className="text-sm text-yellow-800 leading-tight">
                     Este producto es <span className="font-bold bg-yellow-200 px-1 rounded">solo para retiro</span> dentro de Grupo Fifo.
                   </p>
                </div>
              </div>
            </div>
          )}

          {/* WARNING NOTIFICATION FOR BREAKFAST COMBO */}
          {isBreakfastCombo && (
            <div className={`border-l-4 p-4 mb-6 rounded-r-lg shadow-sm ${!isBreakfastTime ? 'bg-orange-50 border-orange-500' : 'bg-blue-50 border-blue-500'}`}>
              <div className="flex items-start gap-3">
                {!isBreakfastTime ? <AlertCircle className="text-orange-500 mt-1" size={20} /> : <Clock className="text-blue-500 mt-1" size={20} />}
                <div className="flex-1">
                   <p className={`font-bold uppercase text-xs tracking-wider mb-1 ${!isBreakfastTime ? 'text-orange-700' : 'text-blue-700'}`}>
                     {!isBreakfastTime ? 'Fuera de Horario Sugerido' : 'Horario de Desayuno'}
                   </p>
                   <p className={`text-sm leading-tight mb-3 ${!isBreakfastTime ? 'text-orange-800' : 'text-blue-800'}`}>
                     Disponible desde las <strong>7:00am hasta las 10:00am</strong>.
                     {!isBreakfastTime && " Si deseas pedirlo ahora, por favor consulta disponibilidad."}
                   </p>
                   
                   {!isBreakfastTime && (
                     <button 
                       onClick={consultAvailability}
                       className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800 font-bold py-2 px-3 rounded-lg transition-colors flex items-center gap-2 border border-orange-200"
                     >
                       <MessageCircle size={14} />
                       Consultar por WhatsApp
                     </button>
                   )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase leading-tight">
              {product.name}
            </h2>
            <div className="self-start text-2xl font-black text-fifo-red bg-red-50 px-3 py-1 rounded-lg shadow-sm">
              ${currentPrice.toFixed(2)}
            </div>
          </div>

          <p className="text-gray-600 font-medium italic mb-6 text-base md:text-lg">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && (
            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase mb-3 block tracking-wider">Selecciona Tamaño:</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex-1 min-w-[80px] py-3 px-2 text-sm font-bold rounded-xl border-2 transition-all shadow-sm ${
                      selectedVariant?.id === v.id
                        ? 'bg-fifo-red border-fifo-red text-white scale-105 shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-fifo-red hover:text-fifo-red'
                    }`}
                  >
                    <div className="leading-tight">{v.name.split(' ')[0]}</div>
                    <div className="text-xs opacity-80 font-normal mt-0.5">${v.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients/Items List */}
          <div className="mb-8">
            <h3 className="text-sm font-black text-gray-800 uppercase mb-3 border-b border-gray-100 pb-2">Incluye:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {product.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-fifo-red mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions - Sticky on Mobile */}
        <div className="p-4 border-t border-gray-100 bg-white md:bg-gray-50 flex gap-4 absolute md:static bottom-0 left-0 w-full z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:shadow-none pb-safe">
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl shadow-sm px-2">
            <button 
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-fifo-red disabled:opacity-50 touch-manipulation"
              disabled={quantity <= 1}
            >
              <Minus size={20} />
            </button>
            <span className="w-8 text-center font-black text-lg text-gray-800">{quantity}</span>
            <button 
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-500 touch-manipulation"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <Button onClick={handleAdd} fullWidth className="text-lg py-4 shadow-xl flex-1 touch-manipulation">
            <ShoppingCart className="mr-2" />
            <span className="hidden sm:inline">AGREGAR AL PEDIDO</span>
            <span className="sm:hidden">AGREGAR • ${(currentPrice * quantity).toFixed(2)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};