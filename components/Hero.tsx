import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Timer } from 'lucide-react';

interface HeroProps {
  onOrderNow?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const closeTime = new Date();
      closeTime.setHours(22, 0, 0, 0); // 10:00 PM

      const hour = now.getHours();

      // If it's already past 10 PM or before 7 AM
      // Assuming business hours 7am - 10pm
      if (hour >= 22 || hour < 7) {
         setIsClosed(true);
         setTimeLeft("");
      } else {
         setIsClosed(false);
         const diff = closeTime.getTime() - now.getTime();
         
         // Fallback if diff is negative but hour check didn't catch it
         if (diff <= 0) {
            setIsClosed(true);
            setTimeLeft("");
         } else {
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
         }
      }
    };

    calculateTime(); // Initial call
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative text-white overflow-hidden min-h-[450px] md:min-h-[500px] flex items-center">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/13%20%281%29.mp4" type="video/mp4" />
        </video>
        {/* Overlays for brand color and text readability */}
        <div className="absolute inset-0 bg-fifo-red/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-24 relative z-10 text-center">
        
        {/* Animated Text Group */}
        <div 
          onClick={onOrderNow}
          className="group cursor-pointer inline-block relative transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Ambient Glow behind */}
          <div className="absolute inset-0 bg-fifo-yellow/0 group-hover:bg-fifo-yellow/10 blur-3xl rounded-full transition-all duration-500"></div>

          <h2 className="text-xl md:text-4xl font-black italic transform -rotate-2 mb-2 drop-shadow-lg transition-all duration-300 group-hover:text-fifo-yellow group-hover:drop-shadow-[0_0_15px_rgba(255,221,0,0.9)]">
            ¿HAMBRE?
          </h2>
          
          <div className="inline-block bg-fifo-yellow text-fifo-red px-4 py-1.5 md:px-6 md:py-2 transform rotate-1 mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-white group-hover:text-fifo-red group-hover:shadow-[0_0_40px_rgba(255,221,0,0.8)] group-hover:scale-105 group-hover:rotate-0">
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              PIDE TU COMBO
            </h1>
          </div>
          
          <p className="text-base md:text-2xl font-medium max-w-2xl mx-auto mb-6 md:mb-8 drop-shadow-md text-white transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
            Las mejores promociones para compartir en familia o con amigos.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3 md:gap-4 w-full max-w-sm md:max-w-none mx-auto">
          
          {/* Open Hours Button - Interactive */}
          <button 
            onClick={() => setShowHoursModal(true)}
            className="flex flex-row items-center justify-center gap-3 bg-black/40 backdrop-blur-md px-4 py-3 md:py-2 rounded-2xl md:rounded-full border border-white/20 shadow-lg cursor-pointer transition-transform hover:scale-105 hover:bg-black/60 group w-full md:w-auto"
          >
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] ${isClosed ? 'bg-red-500 text-red-500' : 'bg-green-500 animate-pulse text-green-500'}`}></span>
                <span className={`font-bold text-sm uppercase tracking-wide group-hover:text-opacity-80 ${isClosed ? 'text-red-400' : 'text-green-400'}`}>
                    {isClosed ? 'Cerrado Ahora' : 'Abierto Ahora'}
                </span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="text-xs font-bold text-white/90 group-hover:text-white truncate">
              7:00am a 10:00pm
            </span>
          </button>

          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowDeliveryModal(true)}
              className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-3 md:py-2 rounded-2xl md:rounded-full border border-white/20 shadow-lg transition-transform hover:scale-105 cursor-pointer hover:bg-black/60 group"
            >
              <span className="font-bold text-xs md:text-sm group-hover:text-fifo-yellow transition-colors whitespace-nowrap">Delivery Express 🛵</span>
            </button>
            <button 
              onClick={() => setShowInfoModal(true)}
              className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-3 md:py-2 rounded-2xl md:rounded-full border border-white/20 shadow-lg transition-transform hover:scale-105 cursor-pointer hover:bg-black/60 group"
            >
              <span className="font-bold text-xs md:text-sm group-hover:text-fifo-yellow transition-colors whitespace-nowrap">Retiro sin Cola 🏃</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[30px] md:h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#f8f8f8]"></path>
        </svg>
      </div>

      {/* Info Modal (Retiro sin Colas) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setShowInfoModal(false)}>
          <div className="bg-white text-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative transform transition-all animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-block bg-fifo-yellow text-fifo-red px-4 py-1 rounded-full font-black text-xs uppercase mb-3 shadow-sm transform -rotate-2">
                ¡NUEVA FUNCIONALIDAD!
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-fifo-red uppercase leading-none italic">
                ¡Ahora sin colas!
              </h3>
            </div>
            
            <div className="space-y-5 text-left">
              <p className="font-medium text-lg leading-relaxed text-gray-700 text-center">
                Adquiere tus combos preferidos y retíralos de forma rápida en tu sucursal más cercana.
              </p>
              
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 shadow-inner">
                <h4 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b border-gray-200 pb-2">Sigue los pasos:</h4>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start">
                    <span className="bg-fifo-red text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">1</span>
                    <span className="text-gray-600 font-medium pt-1">Llena tu carrito con tus productos favoritos.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-fifo-red text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">2</span>
                    <span className="text-gray-600 font-medium pt-1">
                      Elige <strong className="text-fifo-red">Retiro sin colas</strong> e ingresa tu Cédula y Método de pago.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-fifo-red text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">3</span>
                    <span className="text-gray-600 font-medium pt-1">Envía tu pedido a WhatsApp.</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-2 text-center">
                <p className="text-fifo-red font-black text-xl italic transform rotate-1 drop-shadow-sm">
                  ¡Que Fifo-Increíble es esto!
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="w-full bg-fifo-red text-white font-black uppercase tracking-wider py-4 rounded-2xl hover:bg-fifo-darkRed transition-colors shadow-xl active:scale-95 text-lg"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setShowDeliveryModal(false)}>
          <div className="bg-white text-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative transform transition-all animate-in zoom-in-95 duration-200 border-4 border-fifo-red" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowDeliveryModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-block bg-fifo-red text-white px-4 py-1 rounded-full font-black text-xs uppercase mb-3 shadow-sm transform rotate-1">
                ¡HASTA LA PUERTA DE TU CASA!
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase leading-none italic">
                Delivery <span className="text-fifo-red">Express</span>
              </h3>
            </div>
            
            <div className="space-y-5 text-left">
              <p className="font-medium text-lg leading-relaxed text-gray-700 text-center">
                Disfruta de todo nuestro menú sin moverte de donde estás. Nosotros nos encargamos del resto.
              </p>
              
              <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 shadow-sm relative overflow-hidden">
                <MapPin className="absolute -right-4 -bottom-4 text-yellow-100 w-32 h-32 transform rotate-12" />
                <h4 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b border-yellow-200 pb-2 relative z-10">Es muy fácil:</h4>
                <ul className="space-y-4 relative z-10">
                  <li className="flex gap-4 items-start">
                    <span className="bg-fifo-red text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">1</span>
                    <span className="text-gray-700 font-medium pt-1">Arma tu carrito con lo que más te provoque.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-fifo-red text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">2</span>
                    <span className="text-gray-700 font-medium pt-1">
                      Selecciona <strong className="text-fifo-red">Delivery Express</strong> al finalizar.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-fifo-red text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">3</span>
                    <span className="text-gray-700 font-medium pt-1">
                      Indica tu <span className="underline decoration-fifo-red decoration-2 underline-offset-2">dirección exacta</span>, cédula y método de pago en el formulario.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-500 text-center font-medium">
                * El costo del delivery varía según la zona de entrega.
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => setShowDeliveryModal(false)}
                className="w-full bg-fifo-red text-white font-black uppercase tracking-wider py-4 rounded-2xl hover:bg-fifo-darkRed transition-colors shadow-xl active:scale-95 text-lg"
              >
                ¡Quiero Pedir Ya!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hours/Countdown Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setShowHoursModal(false)}>
          <div className={`bg-white text-gray-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl relative transform transition-all animate-in zoom-in-95 duration-200 border-4 ${isClosed ? 'border-gray-300' : 'border-green-500'}`} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowHoursModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isClosed ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-500 animate-pulse'}`}>
                <Clock size={32} strokeWidth={3} />
              </div>
              
              <h3 className="text-2xl font-black text-gray-800 uppercase leading-none mb-2">
                Horario de Atención
              </h3>
              <p className="font-medium text-gray-500 mb-6">
                Lunes a Domingo <br/> 
                <span className="text-gray-800 font-bold">7:00am a 10:00pm</span>
              </p>

              <div className="bg-gray-900 rounded-2xl p-4 mb-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[120px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-fifo-red rounded-full filter blur-xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-fifo-yellow rounded-full filter blur-xl opacity-20"></div>
                
                {isClosed ? (
                    <div className="relative z-10">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Actualmente Cerrado</p>
                        <p className="text-xl font-bold text-white leading-snug">
                        Nos vemos mañana <br/> a partir de las <span className="text-fifo-yellow">7:00am</span>
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Cerramos en:</p>
                        <div className="text-4xl font-black text-white font-mono tracking-wider relative z-10">
                        {timeLeft}
                        </div>
                    </>
                )}
              </div>

              {!isClosed && (
                <div className="animate-bounce">
                    <p className="text-fifo-red font-black text-xl uppercase italic transform -rotate-1">
                    ¡Corre y pide ahora!
                    </p>
                </div>
              )}

              <button 
                onClick={() => {
                  setShowHoursModal(false);
                  if (onOrderNow) onOrderNow();
                }}
                className={`w-full text-white font-black uppercase tracking-wider py-3 rounded-xl transition-colors shadow-lg active:scale-95 mt-6 flex items-center justify-center gap-2 ${isClosed ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
              >
                <Timer size={20} /> Ir al Menú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};