
export interface ProductVariant {
  id: string;
  name: string; // e.g., "Pequeña (P)", "Mediana (M)"
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Base price or display price
  description: string;
  items: string[];
  image: string;
  category: 'pizza' | 'chicken' | 'breakfast' | 'party' | 'ice_cream' | 'drinks' | 'bakery' | 'refrigerated' | 'sausages' | 'butchery' | 'burgers' | 'hot_dogs' | 'self_service' | 'other';
  isPopular?: boolean;
  promoLabel?: string;
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  cartId: string; // Unique ID combining product.id + variant.id
  quantity: number;
  selectedVariant?: ProductVariant;
}

export type DeliveryMethod = 'delivery' | 'pickup';

export interface OrderDetails {
  method: DeliveryMethod;
  name: string;
  phone: string;
  address?: string; // Only for delivery
  branch?: string; // Only for pickup
  paymentMethod: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tag: string;
  created_at: string;
  is_active: boolean;
  display_order?: number;
}
