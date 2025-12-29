import { Product } from './types';

const PIZZA_VARIANTS = (p: number, m: number, f: number) => [
  { id: 'p', name: 'Pequeña (P)', price: p },
  { id: 'm', name: 'Mediana (M)', price: m },
  { id: 'f', name: 'Familiar (F)', price: f },
];

export const products: Product[] = [
  // Promocional
  {
    id: 'fifo-pizza-promo',
    name: 'Fifo Pizza',
    price: 1.99,
    description: '¡La favorita de todos! Masa rectangular crujiente, full salsa y queso gratinado.',
    items: ['1 Fifo Pizza Individual', 'Full Queso'],
    image: 'https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/fifoo%20pizza.png',
    category: 'pizza',
    promoLabel: '¡PROMOCIÓN!'
  },
  
  // --- NEW PIZZAS FROM IMAGE ---
  {
    id: 'pizza-margarita',
    name: 'Pizza Margarita',
    price: 4.00,
    description: 'La clásica e inigualable. Base de salsa de tomate y abundante queso mozzarella.',
    items: ['Salsa Nápoles', 'Queso Mozzarella', 'Orégano'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(4, 8, 10)
  },
  {
    id: 'pizza-napolitana',
    name: 'Pizza Napolitana',
    price: 5.00,
    description: 'Con el toque fresco del tomate y ajo.',
    items: ['Salsa', 'Mozzarella', 'Rodajas de Tomate', 'Ajo y Perejil'],
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee1043138?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(5, 9, 12)
  },
  {
    id: 'pizza-especial',
    name: 'Pizza Especial',
    price: 6.00,
    description: 'Una combinación deliciosa de jamón y pimientos.',
    items: ['Salsa', 'Mozzarella', 'Jamón', 'Pimentón'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 9, 13)
  },
  {
    id: 'pizza-esp-tocineta',
    name: 'Especial c/ Tocineta',
    price: 6.00,
    description: 'El sabor ahumado que te encanta.',
    items: ['Salsa', 'Mozzarella', 'Jamón', 'Tocineta Crujiente'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 10, 15)
  },
  {
    id: 'pizza-esp-salchicha',
    name: 'Especial c/ Salchicha',
    price: 7.00,
    description: 'Sabor intenso para los amantes de la carne.',
    items: ['Salsa', 'Mozzarella', 'Jamón', 'Salchicha'],
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(7, 11, 15)
  },
  {
    id: 'pizza-maiz',
    name: 'Pizza Maíz (May)',
    price: 6.00,
    description: 'El dulce contraste del maíz tierno.',
    items: ['Salsa', 'Mozzarella', 'Maíz Dulce', 'Jamón'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 10, 14)
  },
  {
    id: 'pizza-queso',
    name: 'Pizza Full Queso',
    price: 6.00,
    description: 'Para los verdaderos amantes del queso.',
    items: ['Salsa', 'Doble Mozzarella', 'Parmesano'],
    image: 'https://images.unsplash.com/photo-1571407970349-bc16b47365d9?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 11, 16)
  },
  {
    id: 'pizza-fifo-esp',
    name: 'Fifo (Especialidad)',
    price: 8.00,
    description: '¡La especialidad de la casa! Cargada de todo.',
    items: ['Salsa', 'Mozzarella', 'Jamón', 'Maíz', 'Tocineta', 'Pimentón'],
    image: 'https://gqdfbwdocqrkziacvzkb.supabase.co/storage/v1/object/public/Louis%20Marketing/Grupo%20Fifo/fifoo%20pizza.png',
    category: 'pizza',
    isPopular: true,
    promoLabel: 'ESPECIALIDAD',
    variants: PIZZA_VARIANTS(8, 13, 16)
  },
  {
    id: 'pizza-pepperoni',
    name: 'Pepperoni (Pepero)',
    price: 6.00,
    description: 'Un clásico americano.',
    items: ['Salsa', 'Mozzarella', 'Full Pepperoni'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 10, 14)
  },
  {
    id: 'pizza-champinon',
    name: 'Pizza Champiñón',
    price: 6.00,
    description: 'Elegante y deliciosa.',
    items: ['Salsa', 'Mozzarella', 'Champiñones Frescos'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 10, 15)
  },
  {
    id: 'pizza-4estaciones',
    name: '4 Estaciones',
    price: 6.00,
    description: 'Cuatro sabores en una sola pizza.',
    items: ['1/4 Jamón', '1/4 Pepperoni', '1/4 Maíz', '1/4 Pimentón'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 10, 14)
  },
  {
    id: 'pizza-roky-abierta',
    name: 'Roky Abierta',
    price: 7.00,
    description: 'Estilo único con bordes especiales.',
    items: ['Salsa', 'Mozzarella', 'Borde de Queso', 'Ingredientes Mixtos'],
    image: 'https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(7, 13, 17)
  },
  {
    id: 'pizza-roky-cerrada',
    name: 'Roky Cerrada',
    price: 10.00,
    description: 'Tipo Calzone gigante, rellena de sabor.',
    items: ['Doble Masa', 'Full Relleno', 'Salsa Superior'],
    image: 'https://images.unsplash.com/photo-1621070766841-6ac31823634b?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(10, 16, 20)
  },
  {
    id: 'pizza-3quesos-tocineta',
    name: '3 Quesos c/ Tocineta',
    price: 9.00,
    description: 'Explosión de quesos gratinados.',
    items: ['Mozzarella', 'Pecorino', 'Parmesano', 'Tocineta'],
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(9, 14, 18)
  },
  {
    id: 'pizza-vegetariana',
    name: 'Pizza Vegetariana',
    price: 6.00,
    description: 'Frescura natural.',
    items: ['Salsa', 'Mozzarella', 'Pimentón', 'Cebolla', 'Maíz', 'Champiñón'],
    image: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?q=80&w=500&auto=format&fit=crop',
    category: 'pizza',
    variants: PIZZA_VARIANTS(6, 11, 16)
  },

  // --- PANADERIA / BAKERY ---
  {
    id: 'pan-canilla',
    name: 'Pan Canilla',
    price: 0.50,
    description: 'La tradicional canilla venezolana, crujiente por fuera y suave por dentro.',
    items: ['Unidad de Pan', 'Recién horneado'],
    image: 'https://images.unsplash.com/photo-1591157839955-f623637e63b6?q=80&w=500&auto=format&fit=crop',
    category: 'bakery'
  },
  {
    id: 'pan-campesino',
    name: 'Pan Campesino',
    price: 1.20,
    description: 'Pan rústico grande con corteza gruesa y miga abundante.',
    items: ['Unidad de Pan', 'Miga suave'],
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=500&auto=format&fit=crop',
    category: 'bakery'
  },
  {
    id: 'pan-dulce',
    name: 'Pan Dulce (Piñita)',
    price: 2.00,
    description: 'Bolsa de panes dulces azucarados, perfectos para el café.',
    items: ['Bolsa x6 Unidades', 'Con Azúcar', 'Anís dulce'],
    image: 'https://images.unsplash.com/photo-1615486369061-0a37e1742442?q=80&w=500&auto=format&fit=crop',
    category: 'bakery',
    isPopular: true
  },
  {
    id: 'pan-hamburguesa-pq',
    name: 'Pan de Hamburguesa',
    price: 2.50,
    description: 'Paquete de panes para hamburguesa con ajonjolí.',
    items: ['Paquete x8 Unidades', 'Con Ajonjolí', 'Extra Suaves'],
    image: 'https://images.unsplash.com/photo-1568472487405-b044d0398642?q=80&w=500&auto=format&fit=crop',
    category: 'bakery'
  },

  // --- BEBIDAS / DRINKS ---
  {
    id: 'refresco-2l',
    name: 'Refresco 2L',
    price: 2.50,
    description: 'Refresco familiar para acompañar tus comidas.',
    items: ['Botella 2 Litros', 'Sabor a elección'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop',
    category: 'drinks'
  },
  {
    id: 'malta-15l',
    name: 'Maltin Polar 1.5L',
    price: 2.80,
    description: 'La bebida que nos da energía. Perfecta para el desayuno o la cena.',
    items: ['Botella 1.5 Litros', 'Bien fría'],
    image: 'https://pbs.twimg.com/media/FxtbS3FWwAIEJ74.jpg',
    category: 'drinks',
    isPopular: true
  },
  {
    id: 'agua-mineral-5l',
    name: 'Agua Mineral 5L',
    price: 3.00,
    description: 'Botellón de agua mineral potable.',
    items: ['Bidón 5 Litros', 'Agua pura'],
    image: 'https://images.unsplash.com/photo-1563456073-64478170c06a?q=80&w=500&auto=format&fit=crop',
    category: 'drinks'
  },
  {
    id: 'jugo-naranja',
    name: 'Jugo de Naranja 1L',
    price: 2.00,
    description: 'Jugo pasteurizado refrescante.',
    items: ['Envase 1 Litro', 'Rico en Vitamina C'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    category: 'drinks'
  },

  // --- HELADOS / ICE CREAM ---
  {
    id: 'barquilla-clasica',
    name: 'Barquilla Clásica',
    price: 1.00,
    description: 'Cremoso helado de máquina en barquilla crujiente.',
    items: ['Barquilla', 'Helado Cremoso', 'Sirope'],
    image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d1?q=80&w=500&auto=format&fit=crop',
    category: 'ice_cream',
    promoLabel: 'SOLO RETIRO'
  },
  {
    id: 'tina-helado',
    name: 'Tina Fifo',
    price: 2.50,
    description: 'Disfruta de más helado en presentación de tina.',
    items: ['Tina 8oz', 'Full Helado', 'Sirope', 'Topping'],
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=500&auto=format&fit=crop',
    category: 'ice_cream',
    promoLabel: 'SOLO RETIRO'
  },
  {
    id: 'barquillon',
    name: 'Barquillón Especial',
    price: 3.00,
    description: 'Para los que quieren más sabor y crocancia.',
    items: ['Barquillón', 'Doble porción', 'Lluvia de Chocolate'],
    image: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?q=80&w=500&auto=format&fit=crop',
    category: 'ice_cream',
    promoLabel: 'SOLO RETIRO'
  },

  // Existing Combos (keeping them as they were, mapped to 'pizza' or appropriate category)
  {
    id: 'combo-llanerito',
    name: 'Combo Llanerito',
    price: 8.99,
    description: 'Perfecto para compartir en pareja.',
    items: ['1 Pizza Mediana Especial', '1 Combo de Barquillas', '1 Refresco 1Lt', '2 Vasos'],
    image: 'https://picsum.photos/id/30/400/400',
    category: 'party',
    isPopular: true
  },
  {
    id: 'combo-llanero',
    name: 'Combo Llanero',
    price: 13.99,
    description: 'El gigante para la familia.',
    items: ['2 Pizzas Familiares Margarita', '1 Refresco de 2Lt'],
    image: 'https://picsum.photos/id/63/400/400',
    category: 'party'
  },
  {
    id: 'combo-ejecutivo',
    name: 'Combo Ejecutivo',
    price: 7.99,
    description: 'Desayuno o merienda completa.',
    items: ['2 Cachitos', '2 Nescafé', '2 Quesillos'],
    image: 'https://picsum.photos/id/225/400/400',
    category: 'breakfast'
  },
  {
    id: 'combo-perrero',
    name: 'Combo Perrero',
    price: 14.99,
    description: 'Haz tus propios perros calientes en casa.',
    items: ['Paquete de Pan (20)', '1/4 Papas Ralladas', '20 Salchichas', 'Combo salsas', 'Refresco 2Lt', '10 Vasos'],
    image: 'https://picsum.photos/id/355/400/400',
    category: 'party'
  },
  {
    id: 'combo-bala-fria',
    name: 'Combo Bala Fría',
    price: 7.99,
    description: 'Para matar el hambre rápido.',
    items: ['4 Fifo Pizzas', '1 Refresco de 1Lt', '1 Combo de Barquillas', '2 Vasos'],
    image: 'https://picsum.photos/id/431/400/400',
    category: 'party'
  },
  {
    id: 'combo-cumpleanero',
    name: 'Combo Cumpleañero',
    price: 7.99,
    description: 'Celebra tu día especial.',
    items: ['1 Torta', '1 Refresco de 2Lt', 'Vela de Cumple', 'Paquete cucharillas y platos', '10 Vasos'],
    image: 'https://picsum.photos/id/486/400/400',
    category: 'party'
  },
  {
    id: 'combo-estudiantil',
    name: 'Combo Estudiantil',
    price: 9.99,
    description: 'Resuelve la semana.',
    items: ['2 Bolsas Pan Salado x10', '600gr Mortadela', '300gr Queso Amarillo', '1 Refresco 2Lt', '10 Vasos'],
    image: 'https://picsum.photos/id/493/400/400',
    category: 'breakfast'
  },
  {
    id: 'combo-rumbero',
    name: 'Combo Rumbero',
    price: 23.99,
    description: 'La fiesta completa en un combo.',
    items: ['10 Hamburguesas Clásicas', '5 Combos de Barquillas', '1 Refresco (Gratis)'],
    image: 'https://picsum.photos/id/488/400/400',
    category: 'party',
    isPopular: true
  },
  {
    id: 'combo-mananero',
    name: 'Combo Mañanero',
    price: 6.99,
    description: 'Desayuno criollo.',
    items: ['4 Empanadas', '1 Refresco de 2Lt', '4 Vasos'],
    image: 'https://picsum.photos/id/1080/400/400',
    category: 'breakfast'
  },
  {
    id: 'arroz-chino',
    name: 'Arroz Chino',
    price: 2.50,
    description: 'El clásico sabor asiático.',
    items: ['Arroz Chino', 'Salsa Agridulce', '2 Panes de Mantequilla'],
    image: 'https://picsum.photos/id/488/400/400',
    category: 'other'
  },
  {
    id: 'combo-broaster-3',
    name: 'Combo Broaster #3',
    price: 4.99,
    description: 'Pollo crujiente individual.',
    items: ['3 Piezas de Pollo', 'Papas Fritas', 'Ensalada'],
    image: 'https://picsum.photos/id/835/400/400',
    category: 'chicken'
  },
  {
    id: 'combo-broaster-4',
    name: 'Combo Broaster #4',
    price: 5.99,
    description: 'Un poco más de sabor.',
    items: ['4 Piezas de Pollo', 'Papas Fritas', 'Ensalada'],
    image: 'https://picsum.photos/id/82/400/400',
    category: 'chicken'
  },
  {
    id: 'combo-broaster-5',
    name: 'Combo Broaster #5',
    price: 6.99,
    description: 'Para los que tienen mucha hambre.',
    items: ['5 Piezas de Pollo', 'Papas Fritas', 'Ensalada'],
    image: 'https://picsum.photos/id/312/400/400',
    category: 'chicken',
    isPopular: true
  }
];