/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CheckoutPage } from './components/CheckoutPage';
import { ProfileDrawer } from './components/ProfileDrawer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Toast } from './components/Toast';
import { PRODUCTS } from './data/products';
import { Product, CartItem, UserProfile, Order, SavedCard, SavedMobileMoney, ChatMessage } from './types';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { WifiOff, Eye, ArrowLeft } from 'lucide-react';

const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'Invité',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  role: 'guest',
  isAdmin: false
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'concierge',
    senderName: 'Conciergerie OrA',
    text: 'Bonjour et bienvenue. Notre assistance est à votre écoute pour vous accompagner lors de votre règlement ou de votre commande.',
    timestamp: '10:00'
  }
];

export default function App() {
  const isOnline = useOnlineStatus();

  // Navigation / View state: 'catalog' | 'checkout' | 'admin'
  const [currentView, setCurrentView] = useState<'catalog' | 'checkout' | 'admin'>('catalog');
  const [selectedCheckoutProduct, setSelectedCheckoutProduct] = useState<Product | null>(null);

  // Modals & Drawers
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<'checkout' | 'manual' | null>(null);
  const [pendingCheckoutAction, setPendingCheckoutAction] = useState<Product | 'cart' | null>(null);
  const [isClientPreviewMode, setIsClientPreviewMode] = useState(false);
  const [detailModalProduct, setDetailModalProduct] = useState<Product | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dynamic products list (Admin can add/edit/delete/toggle hero in real-time)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ora_products');
      if (saved) return JSON.parse(saved);
      // Initialize first 3 as featured in hero
      return PRODUCTS.map((p, idx) => ({
        ...p,
        isFeaturedInHero: idx < 3
      }));
    } catch {
      return PRODUCTS;
    }
  });

  // Cart state persisted
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Profile: Default is GUEST as requested ("Au tout abord, si on monte dessus on est un invité")
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ora_user_session');
      if (saved) {
        return JSON.parse(saved);
      }
      return GUEST_PROFILE;
    } catch {
      return GUEST_PROFILE;
    }
  });

  // Orders persisted (Starts strictly with 0 orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ora_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.filter((o) => o.id !== 'ORA-829104');
      }
      return [];
    } catch {
      return [];
    }
  });

  // Support duration hours (Default: 24h, can be customized by Admin per conversation)
  const [supportDurationHours, setSupportDurationHours] = useState<number>(24);

  // Chat messages persisted
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('ora_chat_messages');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem('ora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('ora_user_session', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ora_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`« ${product.name} » ajouté au panier`);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Requirement: "pour payer il faut s'authentifier"
  const isGuest = userProfile.role === 'guest' || userProfile.name === 'Invité';

  const handleDirectCheckout = (product: Product) => {
    if (isGuest) {
      setPendingCheckoutAction(product);
      setAuthReason('checkout');
      setIsAuthOpen(true);
      return;
    }
    setSelectedCheckoutProduct(product);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedCartCheckout = () => {
    if (isGuest) {
      setPendingCheckoutAction('cart');
      setAuthReason('checkout');
      setIsAuthOpen(true);
      return;
    }
    setSelectedCheckoutProduct(null);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Success Handler:
  // "pour le compte admin, apres authentifaication, on doit directement tomber sur la fenetre de la console administrateur"
  // "la console admin ne doit pas etre un onglet sur lacceuil mais une page entiere"
  const handleLoginSuccess = (user: UserProfile, isAdminLogin?: boolean) => {
    setUserProfile(user);

    if (isAdminLogin || user.isAdmin) {
      setCurrentView('admin');
      setIsClientPreviewMode(false);
      showToast(`Connexion Administrateur ${user.id || ''} validée`);
      return;
    }

    showToast(`Bienvenue, ${user.name} !`);

    // If there was a pending checkout action, fulfill it immediately
    if (pendingCheckoutAction) {
      if (pendingCheckoutAction === 'cart') {
        setSelectedCheckoutProduct(null);
      } else {
        setSelectedCheckoutProduct(pendingCheckoutAction);
      }
      setPendingCheckoutAction(null);
      setCurrentView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setUserProfile(GUEST_PROFILE);
    localStorage.removeItem('ora_user_session');
    setCurrentView('catalog');
    setIsClientPreviewMode(false);
    showToast('Vous êtes désormais en mode Invité');
  };

  const handleSaveCard = (newCard: SavedCard) => {
    setUserProfile((prev) => ({
      ...prev,
      savedCard: newCard
    }));
    showToast('Carte bancaire enregistrée');
  };

  const handleSaveMobileMoney = (newMM: SavedMobileMoney) => {
    setUserProfile((prev) => ({
      ...prev,
      savedMobileMoney: newMM
    }));
    showToast(`Numéro ${newMM.operator} enregistré`);
  };

  const handleOrderComplete = (newOrder: Order) => {
    // Enrich order with client ID and current timestamp
    const enrichedOrder: Order = {
      ...newOrder,
      clientId: userProfile.id || `client-${userProfile.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'anonyme'}`,
      createdAt: Date.now(),
      buyerName: userProfile.name,
      buyerEmail: userProfile.email,
      buyerPhone: userProfile.phone
    };

    setOrders((prev) => [enrichedOrder, ...prev]);
    if (!selectedCheckoutProduct) {
      setCartItems([]);
    }
    showToast(`Commande #${newOrder.id} validée. Assistance active pendant 24h.`);
  };

  // Find latest order for current user to activate post-purchase 24h assistance
  const latestOrderForCurrentClient = useMemo(() => {
    if (!userProfile.id || userProfile.id === 'guest') return null;
    return (
      orders.find(
        (o) => o.clientId === userProfile.id || (userProfile.email && o.buyerEmail === userProfile.email)
      ) || null
    );
  }, [orders, userProfile]);

  // Admin Actions for Products & Hero Carousel
  const handleAdminAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Nouvel article « ${newProd.name} » publié`);
  };

  const handleAdminUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Article « ${updated.name} » mis à jour`);
  };

  const handleAdminDeleteProduct = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    showToast('Article retiré du catalogue');
  };

  // Toggle whether product is featured in Hero Carousel
  const handleToggleHeroFeature = (prodId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const nextVal = !p.isFeaturedInHero;
          showToast(
            nextVal
              ? `« ${p.name} » ajouté à la bannière défilante`
              : `« ${p.name} » retiré de la bannière défilante`
          );
          return { ...p, isFeaturedInHero: nextVal };
        }
        return p;
      })
    );
  };

  const handleAdminUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Statut commande #${orderId} : ${status}`);
  };

  // Chat Actions with Client Segregation
  const handleSendMessage = (text: string) => {
    const timeNow = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      clientId: userProfile.id,
      sender: userProfile.isAdmin ? 'admin' : 'user',
      senderName: userProfile.name || 'Client',
      text,
      timestamp: timeNow,
      isAdminReply: userProfile.isAdmin
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Helpful instant concierge response if admin isn't responding immediately
    if (!userProfile.isAdmin) {
      setTimeout(() => {
        const lower = text.toLowerCase();
        let reply = "Votre conseiller OrA a bien reçu votre demande et vous répondra dans les plus brefs délais.";
        if (lower.includes('momo') || lower.includes('mtn') || lower.includes('moov') || lower.includes('celtiis')) {
          reply = "Pour régler par MoMo (MTN, Moov ou Celtiis), sélectionnez votre opérateur et confirmez le numéro. Vous recevrez le prompt de validation instantanément.";
        } else if (lower.includes('livraison') || lower.includes('délai')) {
          reply = "Votre commande est préparée immédiatement dès validation et livrée sous 24 à 48 heures.";
        }

        const autoMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          clientId: userProfile.id,
          sender: 'concierge',
          senderName: 'Conciergerie OrA',
          text: reply,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, autoMsg]);
      }, 800);
    }
  };

  const handleSendAdminReplyToClient = (clientId: string, text: string) => {
    const timeNow = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const adminMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      clientId: clientId,
      sender: 'admin',
      senderName: '👑 Administrateur OrA',
      text,
      timestamp: timeNow,
      isAdminReply: true
    };
    setChatMessages((prev) => [...prev, adminMsg]);
    showToast('Réponse envoyée au client');
  };

  const handleSetClientSupportDuration = (clientId: string, hours: number) => {
    setSupportDurationHours(hours);
    showToast(`Durée d'assistance fixée à ${hours} heures pour ce client`);
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory === 'promo' && !product.isPromo) {
        return false;
      }
      if (
        selectedCategory !== 'all' &&
        selectedCategory !== 'promo' &&
        product.categorySlug !== selectedCategory
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Product counts
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: products.length,
      promo: products.filter((p) => p.isPromo).length
    };
    products.forEach((p) => {
      counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
    });
    return counts;
  }, [products]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If current view is 'admin', render the FULL PAGE Admin Dashboard:
  // "la console admin ne doit pas etre un onglet sur lacceuil mais une page entiere"
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col antialiased selection:bg-[#292524] selection:text-[#FAF7F2]">
        <AdminDashboard
          products={products}
          onAddProduct={handleAdminAddProduct}
          onUpdateProduct={handleAdminUpdateProduct}
          onDeleteProduct={handleAdminDeleteProduct}
          onToggleHeroFeature={handleToggleHeroFeature}
          orders={orders}
          onUpdateOrderStatus={handleAdminUpdateOrderStatus}
          chatMessages={chatMessages}
          onSendAdminReplyToClient={handleSendAdminReplyToClient}
          onSetClientSupportDuration={handleSetClientSupportDuration}
          adminUser={userProfile}
          onSwitchToClientView={() => {
            setIsClientPreviewMode(true);
            setCurrentView('catalog');
          }}
          onLogout={handleLogout}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    );
  }

  // Regular Store Views (Catalog & Checkout)
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col antialiased selection:bg-[#292524] selection:text-[#FAF7F2]">
      
      {/* Offline Status Badge */}
      {!isOnline && (
        <div className="bg-[#1C1917] text-[#FAF7F2] py-1 px-3 text-center text-[10px] font-medium flex items-center justify-center gap-1.5 border-b border-[#3E3832]">
          <WifiOff className="w-3 h-3 text-[#E6C694]" />
          <span>Mode Hors-connexion actif — Les images et articles restent consultables.</span>
        </div>
      )}

      {/* Client Preview Mode Banner for Admin */}
      {isClientPreviewMode && (
        <div className="bg-[#1C1917] text-[#FAF7F2] py-2.5 px-4 border-b border-[#D4AF37]/50 shadow-md sticky top-0 z-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E6C694] animate-ping" />
            <span className="font-semibold text-[#E6C694]">Mode Aperçu Vue Client Actif</span>
            <span className="hidden sm:inline text-[#A89887]">
              — Vous visualisez la boutique telle que vos visiteurs la découvrent.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsClientPreviewMode(false);
              setCurrentView('admin');
            }}
            className="py-1 px-3.5 bg-[#E6C694] text-[#1C1917] hover:bg-[#F3DDBA] rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Revenir à la Console Admin (Plein Écran)</span>
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => {
          setAuthReason('manual');
          setIsAuthOpen(true);
        }}
        onOpenAdmin={() => setCurrentView('admin')}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userProfile={userProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-10">
        {currentView === 'checkout' ? (
          <CheckoutPage
            primaryProduct={selectedCheckoutProduct}
            cartItems={cartItems}
            userProfile={userProfile}
            onBack={() => {
              setCurrentView('catalog');
              setSelectedCheckoutProduct(null);
            }}
            onOrderComplete={handleOrderComplete}
            onSaveCard={handleSaveCard}
            onSaveMobileMoney={handleSaveMobileMoney}
          />
        ) : (
          <div className="space-y-1">
            {/* Sliding Hero Covers: Compact & customizable by Admin */}
            {searchQuery === '' && (
              <HeroCarousel
                products={products}
                onSelectProductForCheckout={handleDirectCheckout}
              />
            )}

            {/* Category Filter */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              productCounts={productCounts}
            />

            {/* Product Catalog Grid: 2 items per row on all smartphones (grid-cols-2) */}
            <section className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-1">
              {filteredProducts.length === 0 ? (
                <div className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-8 text-center max-w-sm mx-auto my-6 space-y-2">
                  <p className="font-serif-luxury text-sm font-medium text-[#1C1917]">
                    Aucun article trouvé
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-medium uppercase tracking-wider"
                  >
                    Voir tous les articles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectForCheckout={handleDirectCheckout}
                      onQuickAddToCart={handleAddToCart}
                      onOpenDetails={(p) => setDetailModalProduct(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Auth Modal (Standard luxury design without disclosing AD- credentials) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthReason(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        reason={authReason}
      />

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        orders={orders.filter((o) => o.clientId === userProfile.id || o.buyerEmail === userProfile.email)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedCartCheckout}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailModalProduct}
        onClose={() => setDetailModalProduct(null)}
        onSelectForCheckout={handleDirectCheckout}
        onAddToCart={handleAddToCart}
      />

      {/* Live Chat Widget:
          Available strictly when client enters payment process OR has an active order (24h rule) */}
      <LiveChatWidget
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        currentUser={userProfile}
        isInCheckout={currentView === 'checkout'}
        activeOrder={latestOrderForCurrentClient}
        supportDurationHours={supportDurationHours}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <footer className="bg-[#FCFAF7] border-t border-[#ECE3D5] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8C7A68]">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-medium text-sm text-[#1C1917] tracking-wider">OrA</span>
            <span>·</span>
            <span>Montres & Parfums</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#A89887]">
            <span>Session : {userProfile.name} {userProfile.isAdmin && '(👑 Admin)'}</span>
            <span>·</span>
            <span>MTN · Moov · Celtiis</span>
            <span>·</span>
            <span>© 2026 OrA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
