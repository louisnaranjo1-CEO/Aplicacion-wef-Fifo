import React, { useState, useRef, useEffect } from 'react';
import { X, User, Save, LogOut, Star, ScanLine, Smartphone, Zap, Clock, Heart, Camera, CheckCircle, CreditCard, MapPin, Calendar } from 'lucide-react';
import { Order, useSupabase } from '../contexts/SupabaseContext';
import { Button } from './Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFavorites: () => void;
}

type ScanStep = 'idle' | 'uploading' | 'analyzing' | 'verifying' | 'approved' | 'error';

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onOpenFavorites }) => {
  const { user, profile, points, orders, updateProfileData, signOut, uploadOrderProof, approveOrderWithProof } = useSupabase();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    display_name: '',
    cedula: '',
    phone: '',
    address: '',
    gender: '',
    birth_date: ''
  });
  
  // Validation States
  const [validatingOrder, setValidatingOrder] = useState<Order | null>(null);
  
  // Scanner States
  const [scanStep, setScanStep] = useState<ScanStep>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || user?.user_metadata?.display_name || '',
        cedula: profile.cedula || '',
        phone: profile.phone || '',
        address: profile.address || '',
        gender: profile.gender || '',
        birth_date: profile.birth_date || ''
      });
    }
  }, [profile, user]);

  if (!isOpen || !user) return null;

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileData(formData);
      alert("Datos actualizados correctamente. Se usarán para agilizar tus pedidos.");
    } catch (error) {
      console.error(error);
      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const startValidation = (order: Order) => {
    triggerHaptic(50);
    setValidatingOrder(order);
    setScanStep('idle');
    setPreviewUrl(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && validatingOrder) {
      const file = e.target.files[0];
      
      triggerHaptic(50);

      // Create local preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setScanStep('uploading');

      // 1. Upload
      const publicUrl = await uploadOrderProof(validatingOrder.id, file);
      
      if (!publicUrl) {
        setScanStep('error');
        triggerHaptic([200, 100, 200]);
        return;
      }

      // 2. Start "AI Simulation"
      setScanStep('analyzing');
      
      // Simulate detection phases
      setTimeout(() => {
        setScanStep('verifying'); // "Matching products..."
        triggerHaptic(20);
      }, 3000);

      setTimeout(async () => {
        // 3. Finalize
        const success = await approveOrderWithProof(validatingOrder.id, publicUrl);
        if (success) {
           setScanStep('approved');
           triggerHaptic([100, 50, 100]);
           // Auto close after success animation
           setTimeout(() => {
             setValidatingOrder(null);
           }, 2000);
        } else {
           setScanStep('error');
           triggerHaptic([200, 100, 200]);
        }
      }, 5500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 bg-fifo-red relative shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X size={20} />
            </button>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-fifo-red border-4 border-fifo-yellow shadow-lg">
                    <User size={32} strokeWidth={2.5} />
                </div>
                <div className="text-white">
                    <h2 className="text-xl font-black uppercase leading-none mb-1">{formData.display_name || 'Usuario'}</h2>
                    <p className="text-white/80 text-xs">{user.email}</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* Left Column: Stats & Actions */}
                <div className="space-y-4">
                    {/* Points Card */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-fifo-yellow/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-fifo-yellow mb-1 block tracking-wider">Balance Actual</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{points}</span>
                                    <span className="text-sm font-bold">Pts</span>
                                </div>
                            </div>
                            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                                <Star size={24} fill="currentColor" className="text-fifo-yellow animate-pulse" />
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-400">
                            <span>Nivel: Fifo Lover ❤️</span>
                            <span>1$ = 1 Punto</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={onOpenFavorites}
                            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-fifo-red hover:shadow-md transition-all group"
                        >
                            <div className="bg-red-50 text-fifo-red p-2 rounded-full group-hover:bg-fifo-red group-hover:text-white transition-colors">
                                <Heart size={20} fill="currentColor" />
                            </div>
                            <span className="font-bold text-gray-700 text-[10px] uppercase">Favoritos</span>
                        </button>
                        <button 
                            onClick={() => document.getElementById('edit-profile')?.scrollIntoView({ behavior: 'smooth'})}
                            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:shadow-md transition-all group"
                        >
                            <div className="bg-gray-100 text-gray-600 p-2 rounded-full group-hover:bg-gray-800 group-hover:text-white transition-colors">
                                <CreditCard size={20} />
                            </div>
                            <span className="font-bold text-gray-700 text-[10px] uppercase">Mis Datos</span>
                        </button>
                    </div>

                    {/* Orders History Preview */}
                    <div>
                         <h3 className="font-bold text-gray-800 uppercase text-sm mb-2 flex items-center gap-2">
                            <Clock size={16} className="text-fifo-red" /> Últimos Pedidos
                        </h3>
                        <div className="space-y-2">
                            {orders.slice(0, 2).map(order => (
                                <div key={order.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                                            <p className="font-bold text-gray-800 text-xs truncate max-w-[120px]">{order.description || 'Pedido Fifo'}</p>
                                        </div>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${order.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                        </span>
                                    </div>
                                    {order.status === 'pending' && (
                                        <button 
                                            onClick={() => startValidation(order)}
                                            className="w-full text-[10px] bg-gray-900 text-white px-2 py-1.5 rounded-md font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 mt-1"
                                        >
                                            <Zap size={10} className="text-fifo-yellow" /> VALIDAR PUNTOS
                                        </button>
                                    )}
                                </div>
                            ))}
                            {orders.length === 0 && <p className="text-gray-400 text-xs italic">Sin historial reciente.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Data Form */}
                <div id="edit-profile" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 uppercase text-sm mb-1 flex items-center gap-2">
                        <User size={16} className="text-fifo-red" /> Datos Personales
                    </h3>
                    <p className="text-[10px] text-gray-500 mb-4">Completa tu información para agilizar tus compras.</p>
                    
                    <form onSubmit={handleUpdate} className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Nombre Completo</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-3 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={formData.display_name}
                                    onChange={e => setFormData({...formData, display_name: e.target.value})}
                                    className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-800 focus:border-fifo-red outline-none text-xs transition-all focus:bg-white"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Cédula</label>
                                <div className="relative">
                                    <CreditCard size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={formData.cedula}
                                        onChange={e => setFormData({...formData, cedula: e.target.value})}
                                        className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-800 focus:border-fifo-red outline-none text-xs transition-all focus:bg-white"
                                        placeholder="V-12345678"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Teléfono</label>
                                <div className="relative">
                                    <Smartphone size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-800 focus:border-fifo-red outline-none text-xs transition-all focus:bg-white"
                                        placeholder="0412..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Dirección de Envío</label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
                                <textarea 
                                    rows={2}
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-800 focus:border-fifo-red outline-none text-xs transition-all focus:bg-white resize-none"
                                    placeholder="Ej: Carrera 12 entre calles 4 y 5..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Sexo</label>
                                <select 
                                    value={formData.gender}
                                    onChange={e => setFormData({...formData, gender: e.target.value})}
                                    className="w-full px-2 py-2 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-800 focus:border-fifo-red outline-none text-xs transition-all focus:bg-white appearance-none"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Femenino</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">F. Nacimiento</label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="date" 
                                        value={formData.birth_date}
                                        onChange={e => setFormData({...formData, birth_date: e.target.value})}
                                        className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-800 focus:border-fifo-red outline-none text-xs transition-all focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button disabled={loading} className="w-full mt-2 py-2.5 shadow-lg text-sm" type="submit">
                            <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Datos'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>

        <div className="p-3 border-t border-gray-200 bg-white">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 font-bold py-1 transition-colors text-xs"
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>

        {/* --- VALIDATION OVERLAYS (Scanner) --- */}
        {validatingOrder && (
            <div className="absolute inset-0 bg-gray-900 flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
                {/* Scanner Header */}
                <div className="p-4 flex justify-between items-center text-white bg-black/50 backdrop-blur-md absolute top-0 w-full z-20">
                   <div className="flex items-center gap-2">
                      <ScanLine className="text-fifo-yellow animate-pulse" />
                      <span className="font-black uppercase tracking-wider text-sm">Fifo Scanner AI</span>
                   </div>
                   <button onClick={() => setValidatingOrder(null)} className="p-2 hover:bg-white/20 rounded-full"><X size={20} /></button>
                </div>

                {/* Camera Viewport / Preview */}
                <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
                    {previewUrl ? (
                       <div className="relative w-full h-full flex items-center justify-center">
                          <img src={previewUrl} className="w-full h-full object-cover opacity-80" alt="Preview" />
                          
                          {/* Scanning Overlay Animation */}
                          {(scanStep === 'analyzing' || scanStep === 'verifying') && (
                             <>
                                <div className="absolute inset-0 bg-fifo-red/10 z-10"></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-fifo-yellow shadow-[0_0_20px_rgba(255,221,0,0.8)] z-20 animate-[scan_2s_linear_infinite]"></div>
                                <div className="absolute inset-0 border-2 border-fifo-yellow/30 m-8 rounded-lg z-10">
                                   <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fifo-yellow"></div>
                                   <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-fifo-yellow"></div>
                                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fifo-yellow"></div>
                                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fifo-yellow"></div>
                                </div>
                             </>
                          )}

                          {scanStep === 'approved' && (
                             <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center animate-in zoom-in duration-300 z-30">
                                <div className="bg-white rounded-full p-4 mb-4 shadow-[0_0_50px_rgba(34,197,94,0.6)]">
                                   <CheckCircle size={64} className="text-green-500" fill="currentColor" stroke="white" />
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase drop-shadow-lg">¡Aprobado!</h2>
                             </div>
                          )}
                       </div>
                    ) : (
                       <div className="text-center p-8">
                          <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-600 flex items-center justify-center mx-auto mb-6 animate-[spin_10s_linear_infinite]">
                             <Camera size={32} className="text-gray-500" />
                          </div>
                          <p className="text-gray-400 font-medium mb-8 max-w-xs mx-auto">Toma una foto clara de tus productos o del recibo de compra.</p>
                       </div>
                    )}
                </div>

                {/* Control Panel */}
                <div className="bg-white p-6 rounded-t-3xl relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
                    {scanStep === 'idle' && (
                       <>
                          <input 
                             type="file" 
                             accept="image/*" 
                             capture="environment" 
                             ref={fileInputRef} 
                             className="hidden" 
                             onChange={handleFileSelect}
                          />
                          <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="w-full bg-fifo-red text-white font-black py-4 rounded-xl text-lg hover:bg-fifo-darkRed transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                             <Camera size={24} /> TOMAR FOTO
                          </button>
                          <p className="text-center text-xs text-gray-400 mt-3 font-medium flex items-center justify-center gap-1">
                             <Clock size={12} /> La imagen se elimina en 24h
                          </p>
                       </>
                    )}

                    {scanStep === 'uploading' && (
                        <div className="text-center py-2">
                           <p className="font-bold text-gray-600 animate-pulse">Subiendo imagen...</p>
                        </div>
                    )}

                    {scanStep === 'analyzing' && (
                        <div className="text-center py-2">
                           <p className="font-black text-fifo-red text-lg uppercase mb-1">Analizando Productos...</p>
                           <p className="text-xs text-gray-400">Nuestra IA está revisando tu compra</p>
                        </div>
                    )}

                    {scanStep === 'verifying' && (
                        <div className="text-center py-2">
                           <p className="font-black text-blue-600 text-lg uppercase mb-1">Verificando Total...</p>
                           <p className="text-xs text-gray-400">Confirmando datos de la orden</p>
                        </div>
                    )}

                    {scanStep === 'approved' && (
                        <div className="text-center py-2">
                           <p className="font-black text-green-600 text-lg uppercase">¡Puntos Acreditados!</p>
                        </div>
                    )}
                     
                    {scanStep === 'error' && (
                        <div className="text-center">
                           <p className="font-bold text-red-500 mb-4">No pudimos validar la foto.</p>
                           <button onClick={() => setScanStep('idle')} className="text-gray-600 font-bold underline">Intentar de nuevo</button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};