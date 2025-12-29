import React, { useState } from 'react';
import { CheckCircle2, ShoppingCart, MessageCircle, Home, X, Play } from 'lucide-react';
import { Button } from './Button';

interface InfoSectionsProps {
  onOrderNow?: () => void;
}

export const InfoSections: React.FC<InfoSectionsProps> = ({ onOrderNow }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="flex flex-col gap-8 py-12 container mx-auto px-4">
      
      {/* Section 1: Haz Mercado desde Casa */}
      <div className="relative rounded-3xl overflow-hidden bg-fifo-red min-h-[400px] flex items-center shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60 mix-blend-multiply"
          >
            <source src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/13%20(1).mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-fifo-red via-fifo-red/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-16 max-w-3xl text-white">
          <div className="flex items-center gap-3 mb-4 text-fifo-yellow animate-bounce">
            <Home size={32} />
            <span className="font-bold tracking-widest uppercase">Tu Hogar, Tu Comodidad</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6 drop-shadow-lg">
            Haz mercado desde <br/>
            <span className="text-fifo-yellow bg-fifo-darkRed/30 px-2 rounded-lg">la comodidad</span> <br/>
            de tu casa
          </h2>
          <p className="text-xl md:text-2xl font-handwriting italic mb-8 -rotate-1">
            Te enseñamos como en Grupo Fifo descomplicamos tu vida.
          </p>
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              className="text-lg px-8 group" 
              onClick={() => setShowVideo(true)}
            >
              VER CÓMO FUNCIONA <Play size={20} className="group-hover:scale-110 transition-transform" fill="currentColor" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: WhatsApp Delivery */}
      <div className="bg-gradient-to-br from-fifo-darkRed to-fifo-red rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden border-4 border-fifo-yellow/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fifo-yellow rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full font-bold text-sm mb-4 shadow-lg animate-pulse">
              <span className="flex items-center gap-2"><MessageCircle size={16} fill="currentColor" /> ONLINE AHORA</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 leading-tight">
              Con un <span className="text-green-400">WhatsApp</span> <br/>
              tienes tu mercado <br/>
              en <span className="text-fifo-yellow italic">camino 🛵</span>
            </h2>
            
            <div className="bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/10 mb-8">
              <h3 className="font-bold text-xl mb-4 border-b border-white/20 pb-2">Todo lo que necesitas en un solo lugar:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm md:text-base font-medium">
                {['Supermercado', 'Charcutería', 'Confitería', 'Panadería', 'Pizzería'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="text-fifo-yellow min-w-[20px]" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white border-none shadow-xl transform hover:-translate-y-1 text-lg"
              onClick={onOrderNow}
            >
              <MessageCircle className="mr-2" size={24} fill="currentColor" />
              PEDIR AHORA
            </Button>
          </div>

          <div className="relative hidden md:flex justify-center">
            {/* Phone Mockup Styling */}
            <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
               <div className="h-full w-full bg-gray-800 flex flex-col">
                  {/* Chat Header */}
                  <div className="bg-[#075E54] p-4 pt-8 text-white flex items-center gap-3">
                    <img 
                      src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/logo%20nuevo2.png"
                      alt="Grupo Fifo Logo"
                      className="w-8 h-8 rounded-full bg-white object-contain"
                    />
                    <div>
                      <div className="font-bold text-sm">Grupo Fifo Delivery</div>
                      <div className="text-[10px] text-green-100">En línea</div>
                    </div>
                  </div>
                  {/* Chat Body */}
                  <div className="flex-1 bg-[#ece5dd] p-4 space-y-4 overflow-hidden relative">
                    <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-xs text-gray-800 max-w-[80%]">
                      Hola 👋 Quiero hacer un pedido del Combo Llanero.
                    </div>
                    <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm text-xs text-gray-800 max-w-[80%] ml-auto">
                      ¡Claro que sí! 🍕 Tu pedido ya fue enviado. Gracias por preferirnos ✨
                      <div className="text-[9px] text-gray-500 text-right mt-1">2:30 p.m. ✓✓</div>
                    </div>
                     <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-xs text-gray-800 max-w-[80%]">
                      <img src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/fifoo%20pizza.png" className="w-full h-24 object-contain mb-2 rounded bg-gray-50" />
                      ¡Qué rápido! Se ve delicioso.
                    </div>
                  </div>
                  {/* Chat Footer */}
                  <div className="bg-gray-100 p-3 flex items-center gap-2">
                    <div className="h-8 flex-1 bg-white rounded-full border border-gray-300"></div>
                    <div className="h-8 w-8 bg-[#128C7E] rounded-full flex items-center justify-center text-white">
                      <MessageCircle size={16} />
                    </div>
                  </div>
               </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 bg-fifo-yellow text-fifo-red font-black px-4 py-2 rounded-lg shadow-lg transform rotate-12 z-30">
              ¡Súper Rápido!
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {showVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300" 
          onClick={() => setShowVideo(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 animate-in zoom-in-95 duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-fifo-red text-white p-2 rounded-full transition-all backdrop-blur-sm group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
            <video 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            >
              <source src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/13%20(1).mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de videos.
            </video>
          </div>
        </div>
      )}

    </div>
  );
};