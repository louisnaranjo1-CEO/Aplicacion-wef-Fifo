import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { Button } from './Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout
}) => {
  const total = cart.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar - Full width on mobile, max-w-md on desktop */}
      <div className="fixed inset-y-0 right-0 w-full md:max-w-md bg-white z-[90] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out h-full">
        
        {/* Header */}
        <div className="p-4 bg-fifo-red text-white flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase">Tu Pedido</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors active:scale-90">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-safe-bottom">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingBag size={64} opacity={0.2} />
              <p className="font-medium">Tu carrito está vacío</p>
              <button onClick={onClose} className="text-fifo-red font-bold hover:underline">
                Volver al menú
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100 shrink-0" />
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <h3 className="font-bold text-gray-800 leading-tight truncate w-full">{item.name}</h3>
                      {item.selectedVariant && (
                        <span className="text-xs font-bold text-fifo-red bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">
                          {item.selectedVariant.name}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onRemove(item.cartId)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-fifo-red disabled:opacity-50 active:scale-95 transition-transform touch-manipulation"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-600 active:scale-95 transition-transform touch-manipulation"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-black text-lg text-fifo-red whitespace-nowrap ml-2">
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-20 pb-safe">
            
            {/* BCV Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mb-4 flex items-center gap-3 shadow-sm">
                <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 shrink-0">
                    <img 
                        src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/bcv.png" 
                        alt="BCV" 
                        className="w-8 h-8 object-contain"
                    />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] md:text-xs leading-tight text-blue-900 font-medium">
                      Pagos en Bs a la <strong>Tasa BCV</strong> del día. Precios referenciales en ($).
                  </p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 text-xl">
              <span className="font-bold text-gray-600">Total</span>
              <span className="font-black text-3xl text-fifo-red">${total.toFixed(2)}</span>
            </div>
            <Button fullWidth onClick={onCheckout} className="py-4 text-lg shadow-xl uppercase tracking-wider">
              Confirmar Pedido
            </Button>
          </div>
        )}
      </div>
    </>
  );
};