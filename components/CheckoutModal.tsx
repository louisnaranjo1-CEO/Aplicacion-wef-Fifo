import React, { useState, useMemo } from 'react';
import { X, MapPin, Store, Truck, ShoppingBag, CheckCircle, Wallet, Plus, Sparkles, Star, AlertCircle, ArrowLeft } from 'lucide-react';
import { CartItem, DeliveryMethod, Product, ProductVariant } from '../types';
import { Button } from './Button';
import { useSupabase } from '../contexts/SupabaseContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  onAdd: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onConfirmOrder: (data: any) => void;
}

const FIFO_WHATSAPP = "584124169283"; 

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  cart,
  products,
  onAdd,
  onConfirmOrder 
}) => {
  const [method, setMethod] = useState<DeliveryMethod>('delivery');
  const { user, profile, recordPurchase, createOrder } = useSupabase();
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    phone: '',
    address: '',
    notes: '',
    payment: 'pago_movil'
  });
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form data when user/profile loads
  React.useEffect(() => {
     if (profile) {
         setFormData(prev => ({
             ...prev, 
             name: profile.display_name || user?.user_metadata?.display_name || '',
             cedula: profile.cedula || '',
             phone: profile.phone || '',
             address: profile.address || ''
         }));
     } else if (user?.user_metadata?.display_name) {
         setFormData(prev => ({...prev, name: user.user_metadata.display_name}));
     }
  }, [user, profile]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const pointsToEarn = Math.floor(total);

  const suggestedProducts = useMemo(() => {
    const cartIds = new Set(cart.map(item => item.id));
    const available = products.filter(p => !cartIds.has(p.id));
    return available.sort(() => 0.5 - Math.random()).slice(0, 2);
  }, [cart, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'delivery' && !formData.address.trim()) {
        alert("Por favor ingresa tu dirección.");
        return;
    }

    // 1. Build WhatsApp Message
    const orderType = method === 'delivery' ? '🛵 DELIVERY' : '🏃 RETIRO SIN COLA';
    let message = `Hola *GRUPO FIFO*, quiero realizar el siguiente pedido:\n\n`;
    message += `*TIPO:* ${orderType}\n\n`;
    message += `*DATOS DEL CLIENTE:*\n`;
    message += `👤 *Nombre:* ${formData.name}\n`;
    message += `🆔 *Cédula:* ${formData.cedula}\n`;
    message += `📞 *Teléfono:* ${formData.phone}\n`;
    
    if (method === 'delivery') {
      message += `📍 *Dirección:* ${formData.address}\n`;
    } else {
      message += `🏬 *Sucursal:* Calabozo Carrera 12\n`;
    }
    
    let description = "";
    message += `\n*MI PEDIDO:*\n`;
    cart.forEach(item => {
      const variantText = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
      const line = `${item.quantity}x ${item.name}${variantText}`;
      message += `- ${line} - $${(item.price * item.quantity).toFixed(2)}\n`;
      description += line + ", ";
    });
    
    message += `\n💰 *TOTAL A PAGAR:* $${total.toFixed(2)}\n`;
    message += `💳 *MÉTODO DE PAGO:* ${formData.payment === 'pago_movil' ? 'Pago Móvil' : formData.payment === 'efectivo_bs' ? 'Efectivo Bs' : 'Efectivo Divisa'}\n`;
    
    if (user) {
        message += `\n⭐ *Usuario Fifo:* SOLICITUD DE PUNTOS (${pointsToEarn} pts)`;
    }

    // 2. Open WhatsApp
    const url = `https://wa.me/${FIFO_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // 3. Save to Supabase (Pending Order)
    if (user) {
        await createOrder(total, pointsToEarn, description.slice(0, -2));
    }
    
    // 4. Record Analytics
    cart.forEach(item => {
        recordPurchase(item.id, item.quantity).catch(err => console.error(err));
    });

    setIsSuccess(true);
    
    setTimeout(() => {
      onConfirmOrder({ ...formData, method, cart, total });
      setIsSuccess(false);
      onClose();
    }, 2500); // Longer delay to read success message
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-bounce-in">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">¡Redirigiendo a WhatsApp!</h2>
          <p className="text-gray-600 mb-6">Completa tu pago en el chat.</p>
          {user && pointsToEarn > 0 && (
             <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-left text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-fifo-darkRed">
                    <Star size={16} fill="currentColor" /> IMPORTANTE:
                </div>
                <p>
                    Tus <strong>{pointsToEarn} Puntos</strong> están reservados en estado <span className="bg-yellow-200 px-1 rounded font-bold">Pendiente</span>.
                </p>
                <p>
                    Al pagar, pídele al personal que <strong>valide tus puntos</strong> ingresando el código de seguridad en tu perfil.
                </p>
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm md:p-4 overflow-hidden">
      <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:rounded-2xl md:max-w-2xl shadow-2xl overflow-y-auto relative md:my-8 animate-in slide-in-from-bottom duration-300 md:animate-in md:zoom-in-95 flex flex-col">
        
        {/* Mobile Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <button onClick={onClose} className="md:hidden mr-2">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h3 className="font-black text-xl uppercase">Confirmar Pedido</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 hidden md:block">
                <X size={24} />
            </button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          {/* Cart Summary Column */}
          <div className="w-full md:w-2/5 bg-gray-50 p-6 border-r border-gray-100 flex flex-col shrink-0">
            <h3 className="font-bold text-sm text-gray-500 uppercase mb-4 flex items-center gap-2 hidden md:flex"><ShoppingBag size={16} /> Resumen</h3>
            <div className="space-y-3 mb-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.cartId} className="flex justify-between text-sm items-start">
                  <span className="text-gray-600 leading-tight">
                    <span className="font-bold text-gray-800">{item.quantity}x</span> {item.name}
                    {item.selectedVariant && <span className="text-xs text-gray-400 block">{item.selectedVariant.name}</span>}
                  </span>
                  <span className="font-bold whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {suggestedProducts.length > 0 && (
              <div className="mt-auto mb-4 bg-white p-3 rounded-xl border border-fifo-yellow/30 shadow-sm hidden md:block">
                <div className="flex items-center gap-1 mb-2 text-fifo-darkRed"><Sparkles size={14} /><span className="text-xs font-black uppercase">¿Un antojito extra?</span></div>
                <div className="space-y-2">
                  {suggestedProducts.map(prod => (
                    <div key={prod.id} className="flex items-center gap-2 group">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{prod.name}</p>
                        <p className="text-xs text-fifo-red font-bold">${prod.price}</p>
                      </div>
                      <button onClick={() => onAdd(prod)} className="bg-gray-100 hover:bg-fifo-red hover:text-white p-1.5 rounded-full transition-colors"><Plus size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg mb-2">
                <span className="font-bold text-gray-700">Total a Pagar</span>
                <span className="font-black text-2xl text-fifo-red">${total.toFixed(2)}</span>
              </div>
              {user && pointsToEarn > 0 && (
                 <div className="flex items-center justify-center gap-2 bg-yellow-50 text-yellow-800 text-xs font-bold py-2 rounded-lg border border-yellow-200">
                    <Star size={14} fill="currentColor" className="text-yellow-500" />
                    Ganarás +{pointsToEarn} Puntos (Al validar)
                 </div>
              )}
            </div>
          </div>

          {/* Form Column */}
          <div className="w-full md:w-3/5 p-6 bg-white flex-1 overflow-y-auto">
            <h3 className="font-black text-lg uppercase mb-4 md:mb-6 hidden md:block">Datos de Envío</h3>
            <form onSubmit={handleSubmit} className="space-y-5 pb-safe-bottom">
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                <button type="button" onClick={() => setMethod('delivery')} className={`py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'delivery' ? 'bg-white text-fifo-red shadow-md' : 'text-gray-500 hover:text-gray-700'}`}><Truck size={18} /> Delivery</button>
                <button type="button" onClick={() => setMethod('pickup')} className={`py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'pickup' ? 'bg-white text-fifo-red shadow-md' : 'text-gray-500 hover:text-gray-700'}`}><Store size={18} /> Retiro</button>
              </div>
              
              {profile ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded-lg text-xs font-medium flex items-center gap-2">
                      <CheckCircle size={12} />
                      Datos cargados desde tu perfil
                  </div>
              ) : null}

              {method === 'delivery' && <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm border border-blue-200 flex items-start gap-2"><MapPin size={16} className="mt-0.5 min-w-[16px]" /><span>El costo del delivery se indicará al confirmar.</span></div>}
              {method === 'pickup' && <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm border border-yellow-200 flex items-start gap-2"><CheckCircle size={16} className="mt-0.5 min-w-[16px]" /><span>Retiro Sin Cola: Atento al llamado para pagar.</span></div>}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-black placeholder:text-gray-400" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cédula</label>
                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-black placeholder:text-gray-400" value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                  <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-black placeholder:text-gray-400" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                {method === 'delivery' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección</label>
                    <textarea required rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-black placeholder:text-gray-400" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sucursal</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-black">
                      <option>Calabozo Carrera 12</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pago</label>
                  <div className="relative">
                    <select required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 appearance-none font-medium text-base text-black" value={formData.payment} onChange={e => setFormData({...formData, payment: e.target.value})}>
                      <option value="pago_movil">📱 Pago Móvil</option>
                      <option value="efectivo_bs">💵 Efectivo Bs</option>
                      <option value="efectivo_usd">💲 Efectivo Divisa $</option>
                    </select>
                    <Wallet size={16} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <Button type="submit" fullWidth className="bg-[#25D366] hover:bg-[#128C7E] text-white py-4 text-lg shadow-lg">CONFIRMAR VÍA WHATSAPP</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};