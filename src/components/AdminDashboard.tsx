import React, { useState, useMemo, useRef } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Truck,
  DollarSign,
  ShoppingBag,
  MessageSquare,
  Send,
  Save,
  Clock,
  Layers,
  Search,
  Upload,
  Eye,
  Star,
  Users,
  Calendar,
  AlertCircle,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';
import { Product, Order, ChatMessage, UserProfile, ClientAccount } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (prodId: string) => void;
  onToggleHeroFeature: (prodId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  chatMessages: ChatMessage[];
  onSendAdminReplyToClient: (clientId: string, text: string) => void;
  onSetClientSupportDuration?: (clientId: string, hours: number) => void;
  adminUser: UserProfile;
  onSwitchToClientView: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleHeroFeature,
  orders,
  onUpdateOrderStatus,
  chatMessages,
  onSendAdminReplyToClient,
  onSetClientSupportDuration,
  adminUser,
  onSwitchToClientView,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'products' | 'chat'>('clients');
  const [productSearch, setProductSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  // Product creation/edit state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin chat response
  const [adminReplyText, setAdminReplyText] = useState('');
  const [customSupportHours, setCustomSupportHours] = useState(24);

  // Group orders by Client ID: "differencier chaque id client avec ces commandes, les commandes ne doivent pas etre melanger"
  const clientAccounts: ClientAccount[] = useMemo(() => {
    const map = new Map<string, ClientAccount>();

    orders.forEach((ord) => {
      const cId = ord.clientId || `client-${ord.buyerName?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'inconnu'}`;
      if (!map.has(cId)) {
        map.set(cId, {
          clientId: cId,
          name: ord.buyerName || 'Client OrA',
          email: ord.buyerEmail || 'client@ora.luxury',
          phone: ord.buyerPhone || 'Non renseigné',
          address: ord.shippingAddress,
          city: '',
          orders: [],
          totalSpent: 0,
          supportDurationHours: 24,
          supportExpiresAt: ord.createdAt ? ord.createdAt + 24 * 3600 * 1000 : Date.now() + 24 * 3600 * 1000
        });
      }
      const acc = map.get(cId)!;
      acc.orders.push(ord);
      acc.totalSpent += ord.total;
    });

    return Array.from(map.values());
  }, [orders]);

  // Selected client for assistance
  const activeClient = clientAccounts.find((c) => c.clientId === selectedClientId) || clientAccounts[0];

  // Client-specific chat messages
  const activeClientMessages = useMemo(() => {
    if (!activeClient) return chatMessages;
    return chatMessages.filter(
      (m) => !m.clientId || m.clientId === activeClient.clientId
    );
  }, [chatMessages, activeClient]);

  // Handle local photo upload from device: "importer des photos depuis l'appareil et non uniquement referntier des lien en ligne"
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64 && editingProduct) {
        setEditingProduct({ ...editingProduct, image: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNewProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      category: 'Montres & Horlogerie',
      categorySlug: 'montres',
      price: 350,
      isPromo: false,
      isFeaturedInHero: false,
      image: '/src/assets/images/promo_watch_cover_1791023597096.jpg',
      description: 'Pièce exclusive créée selon les standards de la maison.',
      inStock: true,
      rating: 5.0,
      reviewsCount: 1
    });
    setIsEditingProduct(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    const fullProduct: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name,
      category: editingProduct.categorySlug === 'parfums' ? 'Haute Parfumerie' : 'Montres & Horlogerie',
      categorySlug: editingProduct.categorySlug || 'montres',
      price: Number(editingProduct.price),
      originalPrice: editingProduct.isPromo ? Number(editingProduct.originalPrice || editingProduct.price * 1.15) : undefined,
      discountPercentage: editingProduct.isPromo ? Number(editingProduct.discountPercentage || 12) : undefined,
      isPromo: editingProduct.isPromo || false,
      isFeaturedInHero: editingProduct.isFeaturedInHero || false,
      image: editingProduct.image || '/src/assets/images/promo_watch_cover_1791023597096.jpg',
      description: editingProduct.description || 'Création d\'exception OrA.',
      inStock: editingProduct.inStock !== false,
      rating: editingProduct.rating || 5.0,
      reviewsCount: editingProduct.reviewsCount || 12
    };

    const exists = products.some((p) => p.id === fullProduct.id);
    if (exists) {
      onUpdateProduct(fullProduct);
    } else {
      onAddProduct(fullProduct);
    }

    setIsEditingProduct(false);
    setEditingProduct(null);
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    const targetClientId = activeClient?.clientId || 'all';
    onSendAdminReplyToClient(targetClientId, adminReplyText.trim());
    setAdminReplyText('');
  };

  const handleUpdateDuration = () => {
    if (activeClient && onSetClientSupportDuration) {
      onSetClientSupportDuration(activeClient.clientId, customSupportHours);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const heroCount = products.filter((p) => p.isFeaturedInHero).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col">
      {/* Full Page Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#1C1917] text-[#FAF7F2] border-b border-[#3E3832] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#E6C694] text-[#1C1917] font-bold text-sm flex items-center justify-center shadow-xs">
              👑
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-base sm:text-lg font-medium tracking-wide">
                  Console d'Administration OrA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#3E3832] text-[#E6C694] font-bold">
                  {adminUser.id || 'AD-Admin'}
                </span>
              </div>
              <p className="text-[11px] text-[#A89887] hidden sm:block">
                Espace de gestion intégrale : commandes, clients, catalogue et assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Client Mode button */}
            <button
              type="button"
              onClick={onSwitchToClientView}
              className="py-1.5 px-3.5 bg-[#E6C694] text-[#1C1917] hover:bg-[#F3DDBA] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              title="Voir la boutique telle que les clients la voient"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu Vue Client</span>
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-full text-[#A89887] hover:text-[#FAF7F2] hover:bg-[#2A2623] transition-colors"
              title="Déconnexion Administrateur"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <section className="bg-[#FCFAF7] border-b border-[#ECE3D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#ECE3D5]">
            <div className="p-1">
              <p className="text-[10px] uppercase tracking-wider text-[#8C7A68] font-semibold">Chiffre d'Affaires</p>
              <p className="font-serif-luxury font-bold text-base sm:text-xl text-[#1C1917] tabular-nums mt-0.5">
                {totalRevenue.toFixed(2)} €
              </p>
            </div>
            <div className="p-1">
              <p className="text-[10px] uppercase tracking-wider text-[#8C7A68] font-semibold">Comptes Clients</p>
              <p className="font-serif-luxury font-bold text-base sm:text-xl text-[#1C1917] tabular-nums mt-0.5">
                {clientAccounts.length}
              </p>
            </div>
            <div className="p-1 pt-2 sm:pt-1">
              <p className="text-[10px] uppercase tracking-wider text-[#8C7A68] font-semibold">Commandes Réalisées</p>
              <p className="font-serif-luxury font-bold text-base sm:text-xl text-[#1C1917] tabular-nums mt-0.5">
                {orders.length}
              </p>
            </div>
            <div className="p-1 pt-2 sm:pt-1">
              <p className="text-[10px] uppercase tracking-wider text-[#8C7A68] font-semibold">Bannière Défilante</p>
              <p className="font-serif-luxury font-bold text-base sm:text-xl text-[#1C1917] tabular-nums mt-0.5">
                {heroCount || 3} articles actifs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Full-Page Content Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Navigation Tabs */}
        <div className="border-b border-[#ECE3D5] flex space-x-6 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('clients')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'clients'
                ? 'border-[#1C1917] text-[#1C1917]'
                : 'border-transparent text-[#8C7A68] hover:text-[#1C1917]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Comptes Clients & Commandes Cloisonnées ({clientAccounts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#1C1917] text-[#1C1917]'
                : 'border-transparent text-[#8C7A68] hover:text-[#1C1917]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalogue & Bannière Défilante ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-[#1C1917] text-[#1C1917]'
                : 'border-transparent text-[#8C7A68] hover:text-[#1C1917]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Assistance Personnalisée & Support (24h)</span>
          </button>
        </div>

        {/* 1. COMPTES CLIENTS & COMMANDES CLOISONNÉES PAR ID */}
        {activeTab === 'clients' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                  Comptes Clients & Historique Cloisonné des Commandes
                </h3>
                <p className="text-xs text-[#78716C]">
                  Chaque client est identifié par son ID unique. Les commandes ne sont jamais mélangées.
                </p>
              </div>
            </div>

            {clientAccounts.length === 0 ? (
              <div className="bg-white border border-[#ECE3D5] rounded-3xl p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-[#A89887] mx-auto stroke-1" />
                <h4 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                  Aucun compte client enregistré
                </h4>
                <p className="text-xs text-[#78716C] max-w-md mx-auto">
                  Dès qu'un visiteur s'authentifie et passe commande, son compte apparaîtra ici avec l'intégralité de ses achats et le suivi de livraison.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {clientAccounts.map((account) => (
                  <div
                    key={account.clientId}
                    className="bg-white border border-[#ECE3D5] rounded-2xl p-5 shadow-xs space-y-4 text-xs"
                  >
                    {/* Client Identity Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECE3D5] gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FAF7F2] flex items-center justify-center font-serif-luxury text-base font-bold shadow-xs">
                          {account.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif-luxury text-base font-bold text-[#1C1917]">
                              {account.name}
                            </h4>
                            <span className="font-mono text-[10px] bg-[#F3ECE1] text-[#1C1917] px-2.5 py-0.5 rounded-full font-bold">
                              ID: {account.clientId}
                            </span>
                          </div>
                          <p className="text-xs text-[#78716C] mt-0.5">
                            {account.email} · {account.phone} · {account.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#1C1917] tabular-nums bg-[#FCFAF7] px-3 py-1.5 rounded-xl border border-[#ECE3D5]">
                          Cumul dépensé : {account.totalSpent.toFixed(2)} €
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClientId(account.clientId);
                            setActiveTab('chat');
                          }}
                          className="py-1.5 px-3.5 bg-[#1C1917] hover:bg-[#2A2623] text-[#FAF7F2] rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#E6C694]" />
                          <span>Assistance (24h)</span>
                        </button>
                      </div>
                    </div>

                    {/* Orders under this specific client */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] uppercase font-bold text-[#8C7A68] tracking-wider block">
                        Commandes enregistrées ({account.orders.length}) :
                      </span>

                      <div className="space-y-2.5">
                        {account.orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-xl p-3.5 space-y-2.5"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[#ECE3D5]">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-sm text-[#1C1917]">#{ord.id}</span>
                                <span className="text-xs text-[#8C7A68]">· Date : {ord.date}</span>
                                <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-full border border-[#D9CDBF] font-medium text-[#44403C]">
                                  {ord.paymentMethod}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#78716C] font-medium">Statut de livraison :</span>
                                <select
                                  value={ord.status}
                                  onChange={(e) =>
                                    onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                                  }
                                  className="text-xs font-bold py-1 px-2.5 rounded-lg border border-[#D9CDBF] bg-white text-[#1C1917] focus:outline-none"
                                >
                                  <option value="Confirmée">Confirmée</option>
                                  <option value="En préparation">En préparation</option>
                                  <option value="Expédiée">Expédiée</option>
                                  <option value="Livrée">Livrée</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={it.productImage}
                                      alt={it.productName}
                                      className="w-9 h-9 rounded-lg object-cover border border-[#ECE3D5]"
                                    />
                                    <div>
                                      <p className="font-semibold text-[#1C1917]">{it.productName}</p>
                                      <p className="text-[10px] text-[#8C7A68]">Quantité : {it.quantity}</p>
                                    </div>
                                  </div>
                                  <span className="font-bold tabular-nums text-sm">{it.price * it.quantity} €</span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-[#ECE3D5] flex flex-col sm:flex-row justify-between text-xs text-[#78716C] gap-1">
                              <span><strong>Adresse de livraison :</strong> {ord.shippingAddress}</span>
                              <span className="font-bold text-sm text-[#1C1917] sm:text-right">
                                Total réglé : {ord.total.toFixed(2)} €
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. CATALOGUE & BANNIERE DEFILANTE */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                  Catalogue & Articles en Bannière Défilante
                </h3>
                <p className="text-xs text-[#78716C]">
                  Gérez vos montres et parfums, importez vos photos depuis l'appareil et sélectionnez les articles de la bannière.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C7A68]" />
                  <input
                    type="text"
                    placeholder="Filtrer un article..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-48 sm:w-60 text-xs pl-8 pr-3 py-2 bg-white border border-[#D9CDBF] rounded-xl focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewProduct}
                  className="py-2 px-4 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#2A2623] shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Créer un article</span>
                </button>
              </div>
            </div>

            <div className="bg-[#FCFAF7] border border-[#ECE3D5] p-3.5 rounded-2xl text-xs text-[#57534E] flex items-center gap-2.5">
              <Star className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <p>
                Cliquez sur le bouton <strong>« ★ Bannière défilante »</strong> pour choisir quels articles apparaissent sur la grande bannière d'accueil vue par tous les visiteurs.
              </p>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {products
                .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#ECE3D5] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#ECE3D5] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-[#8C7A68]">
                            {p.categorySlug === 'montres' ? 'Montre' : 'Parfum'}
                          </span>
                          {p.isPromo && (
                            <span className="bg-[#1C1917] text-white text-[9px] px-2 py-0.2 rounded-full font-bold">
                              Promo
                            </span>
                          )}
                          {p.isFeaturedInHero && (
                            <span className="bg-[#E6C694] text-[#1C1917] text-[9px] px-2 py-0.2 rounded-full font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> Bannière active
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif-luxury font-semibold text-sm text-[#1C1917] truncate mt-0.5">
                          {p.name}
                        </h4>
                        <p className="text-sm font-bold text-[#1C1917] tabular-nums mt-0.5">
                          {p.price} €
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleHeroFeature(p.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                          p.isFeaturedInHero
                            ? 'bg-[#1C1917] text-[#E6C694] border border-[#1C1917]'
                            : 'bg-white text-[#78716C] border border-[#D9CDBF] hover:bg-[#F3ECE1]'
                        }`}
                        title="Ajouter ou retirer de la bannière défilante"
                      >
                        <Star className={`w-3 h-3 ${p.isFeaturedInHero ? 'fill-current' : ''}`} />
                        <span>{p.isFeaturedInHero ? 'En bannière' : '+ Bannière'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditingProduct(true);
                          }}
                          className="p-2 rounded-xl border border-[#D9CDBF] hover:bg-[#F3ECE1] text-[#44403C]"
                          title="Modifier l'article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 3. ASSISTANCE CLIENT & RÈGLE DES 24H */}
        {activeTab === 'chat' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ECE3D5] gap-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                  Assistance Déclenchée au Paiement & Règle des 24h
                </h3>
                <p className="text-xs text-[#78716C]">
                  L'assistance s'active au paiement et dure 24h par défaut. Vous pouvez ajuster la durée pour chaque client ci-dessous.
                </p>
              </div>

              {activeClient && (
                <div className="flex items-center gap-2 bg-[#FCFAF7] border border-[#ECE3D5] p-2 rounded-xl text-xs">
                  <Clock className="w-4 h-4 text-[#8C7A68]" />
                  <span className="font-medium">Durée pour {activeClient.name} :</span>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={customSupportHours}
                    onChange={(e) => setCustomSupportHours(Number(e.target.value))}
                    className="w-14 text-center bg-white border border-[#D9CDBF] rounded-lg px-1.5 py-1 text-xs font-bold"
                  />
                  <span>h</span>
                  <button
                    type="button"
                    onClick={handleUpdateDuration}
                    className="px-2.5 py-1 bg-[#1C1917] text-[#FAF7F2] rounded-lg text-xs font-semibold hover:bg-[#2A2623]"
                  >
                    Appliquer
                  </button>
                </div>
              )}
            </div>

            {/* Client selector tabs */}
            {clientAccounts.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {clientAccounts.map((acc) => (
                  <button
                    key={acc.clientId}
                    type="button"
                    onClick={() => setSelectedClientId(acc.clientId)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                      (selectedClientId || clientAccounts[0].clientId) === acc.clientId
                        ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917]'
                        : 'bg-white text-[#57534E] border-[#D9CDBF] hover:bg-[#F3ECE1]'
                    }`}
                  >
                    {acc.name} ({acc.orders.length} commande{acc.orders.length > 1 ? 's' : ''})
                  </button>
                ))}
              </div>
            )}

            {/* Chat discussion view */}
            <div className="bg-white border border-[#ECE3D5] rounded-3xl p-5 h-96 overflow-y-auto space-y-3 text-xs shadow-2xs">
              {activeClientMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#A89887] space-y-2">
                  <MessageSquare className="w-10 h-10 stroke-1" />
                  <p className="font-medium text-sm text-[#1C1917]">Aucun échange avec {activeClient?.name || 'ce client'}</p>
                  <p className="text-xs text-[#78716C]">Vous pouvez initier l'assistance directement via le formulaire ci-dessous.</p>
                </div>
              ) : (
                activeClientMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'admin' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-2xs ${
                        msg.sender === 'admin'
                          ? 'bg-[#1C1917] text-[#FAF7F2]'
                          : 'bg-[#F2EDE4] text-[#1C1917]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1">
                        <span className="font-semibold">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendAdminReply} className="flex gap-2.5">
              <input
                type="text"
                placeholder={`Écrire une réponse d'assistance à ${activeClient?.name || 'ce client'}...`}
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                className="flex-1 text-xs px-4 py-2.5 bg-white border border-[#D9CDBF] rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                className="py-2.5 px-5 bg-[#1C1917] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#2A2623] shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer au client</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Product Edit / Creation Modal */}
      {isEditingProduct && editingProduct && (
        <div className="fixed inset-0 bg-[#141210]/65 z-50 p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
          <div className="bg-[#FAF7F2] border border-[#ECE3D5] rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE3D5] pb-3">
              <h3 className="font-serif-luxury text-base font-bold text-[#1C1917]">
                {products.some((p) => p.id === editingProduct.id)
                  ? 'Modifier l\'article'
                  : 'Créer un nouvel article'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProduct(false)}
                className="p-1 rounded-full text-[#8C7A68] hover:text-[#1C1917]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                  Nom de l'article
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Ex: Montre Automatique Squelette OrA"
                  className="w-full px-3 py-2 bg-white border border-[#D9CDBF] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                    Catégorie
                  </label>
                  <select
                    value={editingProduct.categorySlug || 'montres'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        categorySlug: e.target.value,
                        category: e.target.value === 'parfums' ? 'Haute Parfumerie' : 'Montres & Horlogerie'
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#D9CDBF] rounded-xl font-medium"
                  >
                    <option value="montres">Montres & Horlogerie</option>
                    <option value="parfums">Haute Parfumerie</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#D9CDBF] rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Photo Upload: Local device file import */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block">
                  Photo de l'article (Depuis votre appareil ou URL)
                </label>
                
                <div className="flex items-center gap-3">
                  {editingProduct.image && (
                    <img
                      src={editingProduct.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-[#D9CDBF] shrink-0"
                    />
                  )}

                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-1.5 px-3 bg-white hover:bg-[#F3ECE1] border border-[#D9CDBF] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#8C7A68]" />
                      <span>Importer une photo depuis l'appareil</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Ou saisissez un lien / chemin d'image..."
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                  Description courte
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D9CDBF] rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs text-[#44403C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeaturedInHero || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeaturedInHero: e.target.checked })}
                    className="rounded accent-[#1C1917]"
                  />
                  <span className="font-semibold text-[#1C1917]">★ Afficher en Bannière défilante</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-[#44403C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPromo || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPromo: e.target.checked })}
                    className="rounded accent-[#1C1917]"
                  />
                  <span>Article en promotion</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-[#44403C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded accent-[#1C1917]"
                  />
                  <span>En stock</span>
                </label>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs hover:bg-[#2A2623]"
                >
                  Enregistrer l'article
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="py-2.5 px-5 border border-[#D9CDBF] rounded-full text-xs text-[#78716C] hover:bg-[#F3ECE1]"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
