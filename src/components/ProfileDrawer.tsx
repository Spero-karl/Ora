import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Check,
  Edit2,
  Save,
  CreditCard,
  Trash2,
  Smartphone,
  Wallet
} from 'lucide-react';
import { UserProfile, Order, SavedCard, SavedMobileMoney } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  orders: Order[];
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  orders
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'orders'>('profile');
  const [paymentSubTab, setPaymentSubTab] = useState<'momo' | 'card'>('momo');
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isEditingMM, setIsEditingMM] = useState(false);
  
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Card form state
  const [cardData, setCardData] = useState<SavedCard>({
    cardNumber: userProfile.savedCard?.cardNumber || '4532 8920 1192 8842',
    cardHolder: userProfile.savedCard?.cardHolder || userProfile.name || 'Karl',
    cardExp: userProfile.savedCard?.cardExp || '11/29',
    cardBrand: userProfile.savedCard?.cardBrand || 'OrA Card',
    last4: userProfile.savedCard?.last4 || '8842'
  });

  // Mobile Money form state
  const [mmData, setMmData] = useState<SavedMobileMoney>({
    operator: userProfile.savedMobileMoney?.operator || 'MTN',
    phoneNumber: userProfile.savedMobileMoney?.phoneNumber || '+229 97 00 12 34',
    accountName: userProfile.name || 'Karl'
  });

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditingProfile(false);
    setSavedSuccess('Coordonnées enregistrées.');
    setTimeout(() => setSavedSuccess(null), 2000);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardData.cardNumber.replace(/\s+/g, '');
    const last4 = cleanNumber.slice(-4) || '8842';
    const formattedCard: SavedCard = {
      ...cardData,
      cardNumber: cleanNumber.length >= 16 ? cleanNumber : `•••• •••• •••• ${last4}`,
      last4: last4,
      cardBrand: 'OrA Card'
    };

    const updated = {
      ...userProfile,
      savedCard: formattedCard
    };
    onUpdateProfile(updated);
    setIsEditingCard(false);
    setSavedSuccess('Carte bancaire enregistrée.');
    setTimeout(() => setSavedSuccess(null), 2200);
  };

  const handleRemoveCard = () => {
    const updated = {
      ...userProfile,
      savedCard: null
    };
    onUpdateProfile(updated);
    setSavedSuccess('Carte bancaire supprimée.');
    setTimeout(() => setSavedSuccess(null), 2000);
  };

  const handleSaveMM = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...userProfile,
      savedMobileMoney: mmData
    };
    onUpdateProfile(updated);
    setIsEditingMM(false);
    setSavedSuccess(`Numéro ${mmData.operator} MoMo enregistré.`);
    setTimeout(() => setSavedSuccess(null), 2200);
  };

  const handleRemoveMM = () => {
    const updated = {
      ...userProfile,
      savedMobileMoney: null
    };
    onUpdateProfile(updated);
    setSavedSuccess('Numéro MoMo supprimé.');
    setTimeout(() => setSavedSuccess(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#141210]/45 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <aside className="w-screen max-w-md bg-[#FAF7F2] border-r border-[#ECE3D5] shadow-2xl flex flex-col justify-between overflow-y-auto">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#ECE3D5] flex items-center justify-between bg-[#FCFAF7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#FAF7F2] flex items-center justify-center font-serif-luxury text-sm font-medium">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'K'}
              </div>
              <div>
                <h3 className="font-serif-luxury text-base font-medium text-[#1C1917]">
                  {userProfile.name || 'Karl'}
                </h3>
                <span className="text-[9px] uppercase tracking-wider text-[#9A8977]">
                  Mon compte
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-[#8C7A68] hover:bg-[#F3ECE1] rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector: Profil | Moyens de paiement | Commandes */}
          <div className="px-4 pt-2 border-b border-[#ECE3D5] bg-[#FCFAF7]">
            <div className="flex space-x-4 text-xs font-semibold whitespace-nowrap">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 text-xs ${
                  activeTab === 'profile'
                    ? 'border-[#1C1917] text-[#1C1917]'
                    : 'border-transparent text-[#8C7A68] hover:text-[#1C1917]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 text-xs ${
                  activeTab === 'payments'
                    ? 'border-[#1C1917] text-[#1C1917]'
                    : 'border-transparent text-[#8C7A68] hover:text-[#1C1917]'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Moyens de paiement</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 text-xs ${
                  activeTab === 'orders'
                    ? 'border-[#1C1917] text-[#1C1917]'
                    : 'border-transparent text-[#8C7A68] hover:text-[#1C1917]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Commandes ({orders.length})</span>
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="p-4 sm:p-5 flex-1 space-y-4">
            {savedSuccess && (
              <div className="p-2.5 bg-[#F4ECE1] border border-[#E3D7C7] text-[#2E2823] text-xs rounded-xl flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#8C7A68]" />
                <span>{savedSuccess}</span>
              </div>
            )}

            {/* TAB 1: Profile & Shipping Details */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#8C7A68] tracking-wider">
                    Coordonnées
                  </span>
                  {!isEditingProfile ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center gap-1 text-xs text-[#1C1917] hover:underline"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Modifier</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setFormData(userProfile);
                      }}
                      className="text-xs text-[#8C7A68]"
                    >
                      Annuler
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-4 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[9px] text-[#9A8977] uppercase block">Nom</span>
                      <p className="font-semibold text-[#1C1917]">{userProfile.name}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#9A8977] uppercase block">Email</span>
                      <p className="text-[#1C1917]">{userProfile.email}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#9A8977] uppercase block">Téléphone</span>
                      <p className="text-[#1C1917]">{userProfile.phone}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#9A8977] uppercase block">Adresse de livraison</span>
                      <p className="text-[#1C1917]">{userProfile.address}, {userProfile.postalCode} {userProfile.city}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-2 text-xs">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nom complet"
                      className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg"
                    />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Téléphone"
                      className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Adresse"
                      className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="Code postal"
                        className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg"
                      />
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Ville"
                        className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2 py-2 px-3 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-medium"
                    >
                      Enregistrer
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: UNIFIED MOYENS DE PAIEMENT (MOMO & CARTE) */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#8C7A68] tracking-wider block mb-1">
                    Enregistrement des moyens de paiement
                  </span>
                  <p className="text-xs text-[#78716C]">
                    Configurez votre numéro MoMo (MTN, Moov, Celtiis) ou votre carte bancaire pour régler vos achats.
                  </p>
                </div>

                {/* Sub-selector: MoMo ou Carte */}
                <div className="flex bg-[#F2EDE4] p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab('momo')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      paymentSubTab === 'momo'
                        ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#E6C694]" />
                    <span>MoMo (MTN / Moov / Celtiis)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentSubTab('card')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      paymentSubTab === 'card'
                        ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Carte bancaire</span>
                  </button>
                </div>

                {/* 1. SECTION MOMO */}
                {paymentSubTab === 'momo' && (
                  <div className="space-y-3">
                    {!isEditingMM ? (
                      <div>
                        {userProfile.savedMobileMoney ? (
                          <div className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-4 space-y-2.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                                userProfile.savedMobileMoney.operator === 'MTN'
                                  ? 'bg-[#E6B800] text-black'
                                  : userProfile.savedMobileMoney.operator === 'Moov'
                                  ? 'bg-[#0055A5]'
                                  : 'bg-[#008080]'
                              }`}>
                                {userProfile.savedMobileMoney.operator === 'MTN'
                                  ? 'MTN MoMo'
                                  : userProfile.savedMobileMoney.operator === 'Moov'
                                  ? 'Moov Money'
                                  : 'Celtiis Cash'}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsEditingMM(true)}
                                  className="text-xs text-[#1C1917] hover:underline flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Modifier</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleRemoveMM}
                                  className="text-xs text-red-700 hover:underline flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Supprimer</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] text-[#9A8977] uppercase block">Numéro enregistré</span>
                              <p className="font-mono font-bold text-[#1C1917] text-sm">
                                {userProfile.savedMobileMoney.phoneNumber}
                              </p>
                            </div>
                            <p className="text-[10px] text-[#78716C]">
                              Ce numéro est pré-rempli automatiquement lors de vos paiements sur le site.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-[#F7F2EB] border border-[#EAE1D3] rounded-2xl p-5 text-center space-y-2 text-xs">
                            <Smartphone className="w-6 h-6 text-[#8C7A68] mx-auto" />
                            <p className="font-semibold text-[#1C1917]">Aucun numéro MoMo enregistré</p>
                            <p className="text-[11px] text-[#78716C]">
                              Enregistrez votre numéro MTN, Moov ou Celtiis pour payer en 1 clic.
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsEditingMM(true)}
                              className="mt-1 px-4 py-1.5 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-semibold"
                            >
                              Enregistrer un numéro MoMo
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleSaveMM} className="space-y-3 bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-4 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-[#1C1917]">Configuration MoMo</span>
                          <button
                            type="button"
                            onClick={() => setIsEditingMM(false)}
                            className="text-xs text-[#8C7A68]"
                          >
                            Annuler
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-[#78716C] block mb-1">
                            Opérateur
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(['MTN', 'Moov', 'Celtiis'] as const).map((op) => (
                              <button
                                key={op}
                                type="button"
                                onClick={() => setMmData({ ...mmData, operator: op })}
                                className={`py-1.5 px-2 rounded-lg border text-center text-xs font-bold ${
                                  mmData.operator === op
                                    ? op === 'MTN'
                                      ? 'bg-[#FFCC00] text-black border-[#E6B800]'
                                      : op === 'Moov'
                                      ? 'bg-[#0055A5] text-white border-[#004488]'
                                      : 'bg-[#008080] text-white border-[#006666]'
                                    : 'bg-white text-[#44403C] border-[#D9CDBF]'
                                }`}
                              >
                                {op === 'MTN' ? 'MTN MoMo' : op === 'Moov' ? 'Moov' : 'Celtiis'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-[#78716C] block mb-1">
                            Numéro de téléphone {mmData.operator}
                          </label>
                          <input
                            type="tel"
                            required
                            value={mmData.phoneNumber}
                            onChange={(e) => setMmData({ ...mmData, phoneNumber: e.target.value })}
                            placeholder="+229 97 00 12 34"
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-semibold"
                        >
                          Enregistrer mon numéro {mmData.operator}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 2. SECTION CARTE BANCAIRE */}
                {paymentSubTab === 'card' && (
                  <div className="space-y-3">
                    {!isEditingCard ? (
                      <div>
                        {userProfile.savedCard ? (
                          <div className="space-y-3">
                            <div className="bg-[#1C1917] text-[#FAF7F2] rounded-2xl p-4 space-y-2.5 shadow-md border border-[#3E3832]">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-serif-luxury font-medium tracking-widest text-[#E6C694]">OrA Card</span>
                                <span className="text-[10px] text-[#A89887]">•••• {userProfile.savedCard.last4}</span>
                              </div>
                              <p className="font-mono text-sm tracking-widest">
                                •••• •••• •••• {userProfile.savedCard.last4}
                              </p>
                              <div className="flex justify-between text-[10px] text-[#A89887]">
                                <span>{userProfile.savedCard.cardHolder}</span>
                                <span>Exp : {userProfile.savedCard.cardExp}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-1 text-xs">
                              <button
                                type="button"
                                onClick={() => setIsEditingCard(true)}
                                className="text-[#1C1917] hover:underline flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Modifier la carte</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveCard}
                                className="text-red-700 hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#F7F2EB] border border-[#EAE1D3] rounded-2xl p-5 text-center space-y-2 text-xs">
                            <CreditCard className="w-6 h-6 text-[#8C7A68] mx-auto" />
                            <p className="font-semibold text-[#1C1917]">Aucune carte enregistrée</p>
                            <p className="text-[11px] text-[#78716C]">
                              Enregistrez votre carte bancaire pour vos prochains règlements.
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsEditingCard(true)}
                              className="mt-1 px-4 py-1.5 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-semibold"
                            >
                              Enregistrer une carte
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleSaveCard} className="space-y-2.5 bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-4 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-xs text-[#1C1917]">Enregistrement carte bancaire</span>
                          <button
                            type="button"
                            onClick={() => setIsEditingCard(false)}
                            className="text-xs text-[#8C7A68]"
                          >
                            Annuler
                          </button>
                        </div>

                        <input
                          type="text"
                          required
                          value={cardData.cardHolder}
                          onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                          placeholder="Nom sur la carte"
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg"
                        />
                        <input
                          type="text"
                          required
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                          placeholder="Numéro de carte (16 chiffres)"
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={cardData.cardExp}
                            onChange={(e) => setCardData({ ...cardData, cardExp: e.target.value })}
                            placeholder="MM/AA"
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-xs"
                          />
                          <input
                            type="text"
                            required
                            placeholder="CVV"
                            defaultValue="782"
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-xs"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-semibold"
                        >
                          Enregistrer cette carte
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ORDERS (Initially 0) */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-semibold text-[#8C7A68] tracking-wider block">
                  Historique de vos commandes
                </span>
                {orders.length === 0 ? (
                  <div className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-6 text-center space-y-1.5">
                    <Package className="w-7 h-7 text-[#A89887] mx-auto stroke-1" />
                    <p className="text-xs font-medium text-[#1C1917]">Aucune commande</p>
                    <p className="text-[11px] text-[#78716C]">Vous n'avez passé aucune commande pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-xl p-3 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[11px] pb-1 border-b border-[#ECE3D5]">
                          <span className="font-mono font-bold text-[#1C1917]">#{order.id}</span>
                          <span className="bg-[#F3ECE1] text-[#2E2823] px-1.5 py-0.2 rounded-full font-medium">
                            {order.status}
                          </span>
                        </div>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] text-[#44403C]">
                            <span className="truncate max-w-[190px]">{it.quantity}x {it.productName}</span>
                            <span className="tabular-nums font-medium">{it.price * it.quantity} €</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold pt-1 border-t border-[#ECE3D5] text-xs">
                          <span>Total</span>
                          <span className="tabular-nums">{order.total.toFixed(2)} €</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#ECE3D5] bg-[#FCFAF7] text-center text-[10px] text-[#9A8977]">
            OrA · Montres & Parfums
          </div>
        </aside>
      </div>
    </div>
  );
};
