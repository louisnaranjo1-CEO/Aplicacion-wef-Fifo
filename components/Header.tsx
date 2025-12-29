import React, { useState } from 'react';
import { ShoppingCart, X, Heart, Store, ShieldCheck, Menu, Home, Utensils, User, LogIn, Star, MapPin } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import { AuthModal } from './AuthModal';
import { ProfileModal } from './ProfileModal';
import { FavoritesModal } from './FavoritesModal';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, onOpenCart, onOpenFavorites }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const { user, points } = useSupabase();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleScrollToMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-fifo-red text-white shadow-lg border-b-4 border-fifo-yellow">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center relative h-14 md:h-20">
          
          {/* Left: Nav */}
          <div className="flex-1 flex justify-start items-center z-20 gap-4">
            <button onClick={toggleMobileMenu} className="md:hidden p-2 -ml-2 rounded-full active:scale-95" aria-label="Abrir menú">
              <Menu size={24} strokeWidth={2.5} />
            </button>
            <nav className="hidden md:flex gap-6 font-bold text-sm items-center">
              <a href="#" onClick={handleScrollTop} className="hover:text-fifo-yellow transition-colors whitespace-nowrap p-1">INICIO</a>
              <a href="#menu" onClick={handleScrollToMenu} className="hover:text-fifo-yellow transition-colors whitespace-nowrap p-1">COMBOS</a>
              <button onClick={() => setShowAbout(true)} className="hover:text-fifo-yellow transition-colors uppercase font-bold whitespace-nowrap p-1">NOSOTROS</button>
            </nav>
          </div>

          {/* Center: Brand */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-fifo-yellow/20 rounded-full blur-xl transition-all duration-300"></div>
            <img 
              src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/logo%20nuevo2.png" 
              alt="Grupo Fifo" 
              className="h-10 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md relative z-10" 
            />
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-2 md:gap-4 z-20">
            {user ? (
              <>
                 {/* Points Badge - Highly Visible */}
                 <div 
                   onClick={() => setShowProfileModal(true)}
                   className="hidden md:flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full cursor-pointer hover:bg-black/50 transition-all border border-fifo-yellow/50 shadow-sm group"
                 >
                   <div className="bg-fifo-yellow text-fifo-darkRed rounded-full p-1 animate-[pulse_3s_ease-in-out_infinite]">
                      <Star size={14} fill="currentColor" />
                   </div>
                   <div className="flex flex-col leading-none">
                      <span className="text-[10px] font-medium text-gray-200 uppercase tracking-wider group-hover:text-white">Mis Puntos</span>
                      <span className="text-sm font-black text-fifo-yellow tabular-nums">{points}</span>
                   </div>
                 </div>

                 {/* Mobile Points (Smaller) */}
                 <div onClick={() => setShowProfileModal(true)} className="md:hidden flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                    <Star size={12} className="text-fifo-yellow" fill="currentColor" />
                    <span className="text-xs font-black">{points}</span>
                 </div>

                 <button onClick={onOpenFavorites} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block">
                  <Heart size={20} className="md:w-6 md:h-6" />
                </button>

                <button onClick={() => setShowProfileModal(true)} className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 p-1 pr-3 rounded-full transition-colors">
                  <div className="w-8 h-8 bg-fifo-yellow rounded-full flex items-center justify-center text-fifo-red font-bold">
                    <User size={16} />
                  </div>
                  <span className="text-xs font-bold truncate max-w-[80px]">{user.user_metadata?.display_name || 'Perfil'}</span>
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2 bg-black/20 hover:bg-black/30 px-3 py-2 rounded-xl transition-colors text-xs md:text-sm font-bold">
                <LogIn size={18} />
                <span className="hidden md:inline">Entrar</span>
              </button>
            )}

            <button onClick={onOpenCart} className="relative bg-fifo-yellow text-fifo-red p-1.5 md:p-2 rounded-lg hover:bg-yellow-300 transition-colors shadow-md active:scale-95">
              <ShoppingCart size={18} className="md:w-6 md:h-6" strokeWidth={2.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-white text-fifo-red text-[9px] md:text-[10px] font-black h-3.5 w-3.5 md:h-5 md:w-5 flex items-center justify-center rounded-full border-2 border-fifo-red">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
        <div className="relative bg-white w-3/4 max-w-xs h-full shadow-2xl flex flex-col">
          <div className="p-4 bg-fifo-red flex justify-between items-center shadow-md">
            <span className="text-white font-black uppercase text-lg italic">Menú Fifo</span>
            <button onClick={toggleMobileMenu} className="text-white p-1 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-6">
             <div className="px-4 mb-6">
                {user ? (
                   <div className="bg-gradient-to-br from-fifo-red to-fifo-darkRed p-4 rounded-xl shadow-lg text-white" onClick={() => { setShowProfileModal(true); toggleMobileMenu(); }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"><User size={20} /></div>
                        <div>
                           <p className="font-bold text-sm leading-tight">{user.user_metadata?.display_name}</p>
                           <p className="text-xs opacity-80">Ver perfil</p>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-fifo-yellow uppercase">Mis Puntos</span>
                        <div className="flex items-center gap-1 font-black text-lg">
                           <Star size={16} fill="currentColor" className="text-fifo-yellow" /> {points}
                        </div>
                      </div>
                   </div>
                ) : (
                   <button onClick={() => { setShowAuthModal(true); toggleMobileMenu(); }} className="w-full bg-gray-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                     <LogIn size={20} /> Iniciar Sesión / Registrarse
                   </button>
                )}
             </div>
             <nav className="space-y-2 px-4">
               {user && (
                 <button onClick={() => { onOpenFavorites(); toggleMobileMenu(); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-gray-700 hover:text-fifo-red font-bold transition-colors text-left">
                   <Heart size={22} className="text-fifo-red" /> MIS FAVORITOS
                 </button>
               )}
               <a href="#" onClick={handleScrollTop} className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-gray-700 hover:text-fifo-red font-bold transition-colors"><Home size={22} className="text-fifo-red" /> INICIO</a>
               <a href="#menu" onClick={handleScrollToMenu} className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-gray-700 hover:text-fifo-red font-bold transition-colors"><Utensils size={22} className="text-fifo-red" /> VER COMBOS</a>
               <button onClick={() => { toggleMobileMenu(); setShowAbout(true); }} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-gray-700 hover:text-fifo-red font-bold transition-colors text-left"><Store size={22} className="text-fifo-red" /> NOSOTROS</button>
             </nav>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ProfileModal 
         isOpen={showProfileModal} 
         onClose={() => setShowProfileModal(false)} 
         onOpenFavorites={() => {
            setShowProfileModal(false);
            onOpenFavorites();
         }}
      />
      
      {/* Detailed About Us Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowAbout(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-fifo-red transition-colors">
              <X size={24} />
            </button>
            
            <img 
              src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/logo%20nuevo2.png" 
              alt="Grupo Fifo" 
              className="h-20 mx-auto mb-4 object-contain"
            />
            
            <h2 className="text-3xl font-black text-fifo-red uppercase mb-2">Grupo Fifo</h2>
            <p className="text-gray-500 font-bold italic mb-6">"Tu lugar de encuentro"</p>
            
            <div className="text-gray-700 space-y-4 text-sm md:text-base leading-relaxed text-justify px-2">
              <p>
                Más que un restaurante, somos el escenario de tus mejores recuerdos en Calabozo. Aquí venimos a celebrar la vida, a compartir risas interminables y a disfrutar de la magia de estar juntos. Porque la verdadera felicidad está en compartir con quienes amamos, ¡y nos encanta ser parte de esos momentos únicos!
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-start gap-3 text-left">
                <ShieldCheck className="text-fifo-darkRed min-w-[20px] mt-1" size={20} />
                <p className="text-sm">
                  Nuestro compromiso es brindarte la mejor calidad al mejor precio. Por eso, siempre respetamos la <strong className="text-fifo-darkRed uppercase">Tasa BCV</strong> en todos tus pagos, garantizando transparencia y economía para ti y tu familia.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500 font-medium pt-2">
                <MapPin size={16} /> Carrera 12, Calabozo.
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
               <button 
                 onClick={() => setShowAbout(false)} 
                 className="w-full bg-fifo-red text-white font-black uppercase tracking-wider py-3 rounded-xl hover:bg-fifo-darkRed transition-colors shadow-lg active:scale-95"
               >
                  ¡Entendido!
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};