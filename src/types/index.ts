export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  isRecent?: boolean;
  isPromo?: boolean;
  isFeaturedInHero?: boolean; // Admin can toggle whether this item is in the hero carousel
  promoBadgeText?: string;
  image: string;
  description: string;
  fullDescription?: string;
  features?: string[];
  specs?: Record<string, string>;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface SavedCard {
  cardNumber: string;
  cardHolder: string;
  cardExp: string;
  cardBrand: string;
  last4: string;
}

export interface SavedMobileMoney {
  operator: 'MTN' | 'Moov' | 'Celtiis';
  phoneNumber: string;
  accountName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  avatarUrl?: string;
  savedCard?: SavedCard | null;
  savedMobileMoney?: SavedMobileMoney | null;
  role?: 'guest' | 'customer' | 'admin';
  isAdmin?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  clientId: string;
  date: string;
  createdAt: number; // millisecond timestamp
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'Confirmée' | 'En préparation' | 'Expédiée' | 'Livrée';
  shippingAddress: string;
  paymentMethod: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
}

export interface ChatMessage {
  id: string;
  clientId?: string;
  sender: 'user' | 'admin' | 'concierge';
  senderName: string;
  text: string;
  timestamp: string;
  isAdminReply?: boolean;
}

export interface ClientAccount {
  clientId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  orders: Order[];
  totalSpent: number;
  supportExpiresAt?: number;
  supportDurationHours?: number; // default 24h
}
