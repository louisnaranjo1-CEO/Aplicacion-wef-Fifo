import React, { useState, useMemo, useEffect } from 'react';
import { products as initialProducts } from './data';
import { Product, CartItem, ProductVariant } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InfoSections } from './components/InfoSections';
import { NewsSection } from './components/NewsSection';
import { FavoritesModal } from './components/FavoritesModal';
import { Filter, RefreshCw, CheckCircle, PartyPopper, ShoppingBag, Clock, Utensils, X, MessageCircle, Drumstick, Sandwich, IceCream, Info } from 'lucide-react';
import { useSupabase } from './contexts/SupabaseContext';

// --- CONFIGURACIÓN DE GOOGLE SHEETS ---
// 1. Crea un Google Sheet con las columnas: id, name, price, description
// 2. Ve a Archivo > Compartir > Publicar en la web > Formato CSV
// 3. Pega el enlace aquí abajo:
const GOOGLE_SHEET_URL = ""; 

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  
  // States for UX Interactions
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [showReadyToast, setShowReadyToast] = useState(false);
  const [addedNotification, setAddedNotification] = useState<{name: string, quantity: number} | null>(null);
  
  // BCV Flash Notification State
  const [showBCVToast, setShowBCVToast] = useState(false);
  
  // New State for Modals
  const [showSelfServiceModal, setShowSelfServiceModal] = useState(false);
  const [showChickenModal, setShowChickenModal] = useState(false);
  const [showIceCreamModal, setShowIceCreamModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  
  // State for Evening Menu (Burgers & Hot Dogs)
  const [showEveningModal, setShowEveningModal] = useState(false);
  const [eveningCategory, setEveningCategory] = useState<'burgers' | 'hot_dogs'>('burgers');

  // Initial Effect: BCV Notification
  useEffect(() => {
    // Show immediately
    setShowBCVToast(true);
    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setShowBCVToast(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Logic to fetch prices from Google Sheets
  useEffect(() => {
    if (!GOOGLE_SHEET_URL) return;

    const fetchPrices = async () => {
      setIsLoadingUpdates(true);
      try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const text = await response.text();
        
        // Simple CSV Parser
        const rows = text.split('\n').slice(1); // Skip header
        const updates = new Map();

        rows.forEach(row => {
          // Handle commas inside quotes if necessary, but for simplicity basic split:
          // This regex handles basic CSV splitting respecting quotes
          const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!cols) return;
          
          const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());
          const [id, name, priceStr, description] = cleanCols;

          if (id) {
            updates.set(id, {
              name: name,
              price: priceStr ? parseFloat(priceStr) : undefined,
              description: description
            });
          }
        });

        // Merge updates with local data
        setProducts(currentProducts => 
          currentProducts.map(p => {
            const update = updates.get(p.id);
            if (update) {
              return {
                ...p,
                name: update.name || p.name,
                price: update.price !== undefined && !isNaN(update.price) ? update.price : p.price,
                description: update.description || p.description,
              };
            }
            return p;
          })
        );
        console.log("Precios actualizados desde la hoja de cálculo");

      } catch (error) {
        console.error("Error al cargar precios de Google Sheets:", error);
      } finally {
        setIsLoadingUpdates(false);
      }
    };

    fetchPrices();
  }, []);

  // Cart Logic
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      // Create a unique ID for the cart item based on product ID AND variant ID
      const cartId = variant ? `${product.id}-${variant.id}` : product.id;
      
      const existing = prev.find(item => item.cartId === cartId);
      
      if (existing) {
        return prev.map(item => 
          item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      // If it's a new item, construct the CartItem object
      const newItem: CartItem = {
        ...product,
        cartId: cartId,
        quantity: quantity,
        selectedVariant: variant,
        price: variant ? variant.price : product.price // Override base price with variant price
      };
      
      return [...prev, newItem];
    });

    // Show Notification instead of opening cart
    setAddedNotification({ name: product.name, quantity });
    setTimeout(() => setAddedNotification(null), 2500);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  // Scroll and Highlight Logic
  const handleOrderNow = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Trigger effects
    setIsHighlighting(true);
    setShowReadyToast(true);

    // Turn off highlight after animation
    setTimeout(() => setIsHighlighting(false), 2500);
    // Hide toast a bit later
    setTimeout(() => setShowReadyToast(false), 3500);
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'pizza', label: 'Pizzas' },
    { id: 'chicken', label: 'Pollo a la Broaster 🍗' },
    { id: 'burgers', label: 'Hamburguesas 🍔' },
    { id: 'hot_dogs', label: 'Perros 🌭' },
    { id: 'self_service', label: 'Self Service 🥘' },
    { id: 'breakfast', label: 'Desayunos' },
    { id: 'bakery', label: 'Panadería 🥖' },
    { id: 'drinks', label: 'Bebidas 🥤' },
    { id: 'party', label: 'Combos Fiesta' },
    { id: 'ice_cream', label: 'Helados 🍦' },
  ];

  const openSelfServiceWhatsApp = () => {
     const message = "Hola *GRUPO FIFO* 👋! Estoy interesado en conocer el *Menú del Día* del Self Service.";
     const url = `https://wa.me/584124169283?text=${encodeURIComponent(message)}`;
     window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] pb-20">
      <Header 
        cartItemCount={cartItemCount} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setShowFavoritesModal(true)}
      />
      
      <Hero onOrderNow={handleOrderNow} />

      <main className="container mx-auto px-4 -mt-8 relative z-20" id="menu">
        
        {/* Filter Scrollbar - FIXED FOR HORIZONTAL SCROLLING */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide w-full max-w-full">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'self_service') {
                    setShowSelfServiceModal(true);
                  } else if (cat.id === 'chicken') {
                    setShowChickenModal(true);
                  } else if (cat.id === 'burgers') {
                    setEveningCategory('burgers');
                    setShowEveningModal(true);
                  } else if (cat.id === 'hot_dogs') {
                    setEveningCategory('hot_dogs');
                    setShowEveningModal(true);
                  } else if (cat.id === 'ice_cream') {
                    setShowIceCreamModal(true);
                  } else {
                    setSelectedCategory(cat.id);
                  }
                }}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-bold shadow-md transition-all ${
                  selectedCategory === cat.id && !['self_service', 'chicken', 'burgers', 'hot_dogs', 'ice_cream'].includes(cat.id)
                    ? 'bg-fifo-red text-white scale-105 ring-2 ring-fifo-yellow ring-offset-2' 
                    : ['self_service', 'chicken', 'burgers', 'hot_dogs', 'ice_cream'].includes(cat.id)
                      ? 'bg-fifo-yellow text-fifo-darkRed hover:bg-yellow-400 ring-2 ring-transparent hover:ring-fifo-red'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          {isLoadingUpdates && (
            <div className="text-xs text-gray-400 flex items-center gap-2 animate-pulse whitespace-nowrap">
              <RefreshCw size={12} className="animate-spin" /> Actualizando precios...
            </div>
          )}
        </div>

        {/* Product Grid - Updated to 2 columns on mobile (grid-cols-2) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={addToCart}
              onViewDetail={setSelectedProduct} 
              isHighlighted={isHighlighting}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl font-medium">No hay productos en esta categoría.</p>
          </div>
        )}
      </main>

      {/* Promotional Info Sections */}
      <InfoSections onOrderNow={handleOrderNow} />

      {/* News Section */}
      <NewsSection onOrderNow={handleOrderNow} />

      {/* BCV Flash Notification */}
      {showBCVToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[110] w-[95%] max-w-md animate-[slide-down_0.5s_ease-out_forwards]">
          <div className="bg-blue-600/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-start gap-4 border-2 border-white/20 relative overflow-hidden">
            {/* Background element */}
            <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
            
            <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg relative z-10">
              <img 
                src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/bcv.png" 
                alt="BCV" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-1 relative z-10">
              <h4 className="font-black text-white text-sm uppercase mb-1 flex items-center gap-2">
                Tasa del Día <Info size={14} />
              </h4>
              <p className="text-xs text-blue-50 font-medium leading-relaxed">
                 Todos los precios están en <strong>($)</strong>. Pagos en Bolívares se reciben a la <strong>Tasa BCV</strong> vigente.
              </p>
            </div>
            <button onClick={() => setShowBCVToast(false)} className="text-white/60 hover:text-white relative z-10 p-1">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Added to Cart Notification Toast */}
      {addedNotification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-[slide-up_0.3s_ease-out_forwards] w-[90%] max-w-sm">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border border-gray-700">
             <div className="flex items-center gap-3">
               <div className="bg-green-500 rounded-full p-1 text-black">
                 <CheckCircle size={16} strokeWidth={3} />
               </div>
               <div className="flex flex-col">
                 <span className="font-bold text-sm leading-tight">Agregado al carrito</span>
                 <span className="text-xs text-gray-400 truncate max-w-[150px]">{addedNotification.quantity}x {addedNotification.name}</span>
               </div>
             </div>
             <button 
               onClick={() => setIsCartOpen(true)}
               className="text-fifo-yellow text-xs font-black uppercase tracking-wide hover:underline"
             >
               Ver Carrito
             </button>
          </div>
        </div>
      )}

      {/* Ready Notification Toast (from Hero/News CTA) */}
      {showReadyToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] animate-[bounce-in_0.5s_ease-out_forwards]">
          <div className="bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border-4 border-white/20">
            <div className="bg-white text-green-500 p-1.5 rounded-full">
               <CheckCircle size={20} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="font-black uppercase text-lg leading-none tracking-wide">¡Ya estás listo para pedir!</span>
              <span className="text-xs font-medium text-green-100">Selecciona tus favoritos 👇</span>
            </div>
            <PartyPopper size={24} className="animate-bounce" />
          </div>
        </div>
      )}

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        products={products}
        onAdd={addToCart}
        onConfirmOrder={(data) => {
          console.log("Order confirmed", data);
          setCart([]);
        }}
      />

      {/* Detail Modal */}
      <ProductDetailModal 
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={addToCart}
      />
      
      {/* Self Service Modal */}
      {showSelfServiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowSelfServiceModal(false)}>
           <div 
             className="bg-white rounded-3xl w-full max-w-md p-0 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
             onClick={e => e.stopPropagation()}
           >
              {/* Header with Pattern */}
              <div className="bg-fifo-yellow h-32 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                      <Utensils size={32} className="text-fifo-red" />
                    </div>
                    <h3 className="text-2xl font-black text-fifo-darkRed uppercase tracking-wide">Self Service</h3>
                </div>
                <button 
                  onClick={() => setShowSelfServiceModal(false)}
                  className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-fifo-darkRed p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 text-center">
                 <div className="mb-6 flex items-center justify-center gap-2 text-gray-500 font-bold bg-gray-100 py-2 rounded-lg">
                    <Clock size={20} />
                    <span>12:00 PM - 4:00 PM</span>
                 </div>
                 
                 <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
                   ¡Hola! 👋 Te recordamos que nuestro <span className="text-fifo-red font-bold">Self Service</span> y los deliciosos combos de <span className="text-fifo-red font-bold">Pollo a la Broaster</span> solo están disponibles en el horario del almuerzo.
                 </p>

                 <div className="bg-yellow-50 border-l-4 border-fifo-yellow p-4 mb-8 text-left text-sm text-yellow-800">
                    <p>Acércate a nuestra sección de Self Service o escríbenos para saber qué preparamos hoy para ti. 🍲</p>
                 </div>

                 <button 
                   onClick={openSelfServiceWhatsApp}
                   className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wide"
                 >
                   <MessageCircle size={24} fill="white" />
                   Consultar Menú del Día
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Pollo a la Broaster Modal */}
      {showChickenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowChickenModal(false)}>
           <div 
             className="bg-white rounded-3xl w-full max-w-md p-0 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
             onClick={e => e.stopPropagation()}
           >
              {/* Header with Pattern - SAME STYLE AS SELF SERVICE */}
              <div className="bg-fifo-yellow h-32 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                      <Drumstick size={32} className="text-fifo-red" />
                    </div>
                    <h3 className="text-2xl font-black text-fifo-darkRed uppercase tracking-wide text-center leading-none">Pollo a la<br/>Broaster</h3>
                </div>
                <button 
                  onClick={() => setShowChickenModal(false)}
                  className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-fifo-darkRed p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 text-center">
                 <div className="mb-6 flex items-center justify-center gap-2 text-gray-500 font-bold bg-gray-100 py-2 rounded-lg">
                    <Clock size={20} />
                    <span>12:00 PM - 4:00 PM</span>
                 </div>
                 
                 <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
                   ¡Hola! 👋 Te recordamos que nuestros crujientes combos de <span className="text-fifo-red font-bold">Pollo a la Broaster</span> solo están disponibles en el horario del almuerzo.
                 </p>

                 <div className="bg-yellow-50 border-l-4 border-fifo-yellow p-4 mb-8 text-left text-sm text-yellow-800">
                    <p>Escríbenos directamente para confirmar disponibilidad y pedir tu combo favorito. 🍗</p>
                 </div>

                 <button 
                   onClick={() => {
                     setShowChickenModal(false);
                     setSelectedCategory('chicken');
                     handleOrderNow();
                   }}
                   className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wide"
                 >
                   <MessageCircle size={24} fill="white" />
                   ¡Pídelo Ya!
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Evening Menu Modal (Burgers & Hot Dogs) */}
      {showEveningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowEveningModal(false)}>
           <div 
             className="bg-white rounded-3xl w-full max-w-md p-0 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
             onClick={e => e.stopPropagation()}
           >
              {/* Header with Pattern */}
              <div className="bg-fifo-yellow h-32 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                      {eveningCategory === 'burgers' ? (
                        <Sandwich size={32} className="text-fifo-red" />
                      ) : (
                        <Utensils size={32} className="text-fifo-red" />
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-fifo-darkRed uppercase tracking-wide text-center leading-none">
                      {eveningCategory === 'burgers' ? 'Hamburguesas' : 'Perros Calientes'}
                    </h3>
                </div>
                <button 
                  onClick={() => setShowEveningModal(false)}
                  className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-fifo-darkRed p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 text-center">
                 <div className="mb-6 flex items-center justify-center gap-2 text-gray-500 font-bold bg-gray-100 py-2 rounded-lg">
                    <Clock size={20} />
                    <span>4:00 PM - 10:00 PM</span>
                 </div>
                 
                 <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
                   ¡Ey! 👋 Te recordamos que nuestras {eveningCategory === 'burgers' ? 'deliciosas hamburguesas 🍔' : 'increíbles perros calientes 🌭'} están disponibles todos los días en el horario de la tarde-noche.
                 </p>

                 <div className="bg-yellow-50 border-l-4 border-fifo-yellow p-4 mb-8 text-left text-sm text-yellow-800">
                    <p>Si ya son más de las 4:00pm, ¡Escríbenos para pedir tu favorito!</p>
                 </div>

                 <button 
                   onClick={() => {
                     setShowEveningModal(false);
                     setSelectedCategory(eveningCategory);
                     handleOrderNow();
                   }}
                   className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wide"
                 >
                   <MessageCircle size={24} fill="white" />
                   ¡Pídelo Ya!
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Ice Cream Modal */}
      {showIceCreamModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowIceCreamModal(false)}>
           <div 
             className="bg-white rounded-3xl w-full max-w-md p-0 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
             onClick={e => e.stopPropagation()}
           >
              {/* Header with Pattern */}
              <div className="bg-fifo-yellow h-32 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                      <IceCream size={32} className="text-fifo-red" />
                    </div>
                    <h3 className="text-2xl font-black text-fifo-darkRed uppercase tracking-wide text-center leading-none">
                      Helados 🍦
                    </h3>
                </div>
                <button 
                  onClick={() => setShowIceCreamModal(false)}
                  className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-fifo-darkRed p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 text-center">
                 <div className="mb-6 flex items-center justify-center gap-2 text-gray-500 font-bold bg-gray-100 py-2 rounded-lg">
                    <PartyPopper size={20} className="text-fifo-red" />
                    <span>Lugar de Encuentro</span>
                 </div>
                 
                 <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
                   ¡Recuerda que para realizar un pedido de helados debes estar en tu lugar de encuentro <span className="text-fifo-red font-black">Grupo Fifo</span>! 🎉
                 </p>

                 <div className="bg-yellow-50 border-l-4 border-fifo-yellow p-4 mb-8 text-left text-sm text-yellow-800">
                    <p>Nuestros helados son para consumo inmediato o retiro en tienda.</p>
                 </div>

                 <button 
                   onClick={() => {
                     setShowIceCreamModal(false);
                     setSelectedCategory('ice_cream');
                     handleOrderNow();
                   }}
                   className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wide mb-3"
                 >
                   <MessageCircle size={24} fill="white" />
                   ¡Pídelo Ya!
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Favorites Modal */}
      <FavoritesModal 
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        onAddToCart={(product) => {
          addToCart(product);
          setShowFavoritesModal(false);
        }}
      />

      <footer className="bg-gray-900 text-white py-12 mt-0 border-t-8 border-fifo-yellow">
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <img 
            src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/logo%20nuevo2.png" 
            alt="Grupo Fifo Logo" 
            className="h-24 mb-6 object-contain hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-3xl font-black italic mb-4 text-fifo-red">GRUPO FIFO</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Tu lugar de encuentro. Somos tu lugar de encuentro con la mejor calidad y los mejores precios.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 text-sm font-bold text-gray-500 mb-8">
            <span>© 2024 Grupo Fifo - Todos los derechos reservados</span>
            <span className="hidden md:inline">•</span>
            <span>Precios sujetos a cambio sin previo aviso</span>
          </div>

          {/* Developer Credits Section */}
          <div className="w-full border-t border-gray-800 pt-10 mt-4 flex justify-center pb-6">
            <a 
              href="https://louismarketingve.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-4 p-4 rounded-2xl transition-all duration-500 hover:bg-white/5"
            >
              {/* Background ambient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-fifo-red/0 via-fifo-red/10 to-fifo-yellow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-xl"></div>
              
              <span className="relative z-10 text-xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-400 group-hover:from-white group-hover:to-fifo-yellow transition-all duration-500 tracking-tight">
                Página desarrollada por
              </span>
              
              <div className="relative z-10 transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500 ease-out">
                {/* Logo Glow */}
                <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%2019.png" 
                  alt="Louis Marketing" 
                  className="h-12 md:h-16 object-contain relative drop-shadow-lg filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-500"
                />
              </div>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;