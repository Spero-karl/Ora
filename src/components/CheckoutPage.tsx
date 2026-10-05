import React, { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Lock,
  Plus,
  Minus,
  Smartphone,
  Check
} from 'lucide-react';
import { Product, CartItem, UserProfile, Order, SavedCard, SavedMobileMoney } from '../types';

interface CheckoutPageProps {
  primaryProduct?: Product | null;
  cartItems?: CartItem[];
  userProfile: UserProfile;
  onBack: () => void;
  onOrderComplete: (order: Order) => void;
  onSaveCard: (card: SavedCard) => void;
  onSaveMobileMoney?: (mm: SavedMobileMoney) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  primaryProduct,
  cartItems = [],
  userProfile,
  onBack,
  onOrderComplete,
  onSaveCard,
  onSaveMobileMoney
}) => {
  const [quantity, setQuantity] = useState(1);
  
  // Exactly 4 payment methods: google_pay, card, apple_pay, momo
  const [paymentMethod, setPaymentMethod] = useState<'google_pay' | 'card' | 'apple_pay' | 'momo'>('google_pay');
  
  // MoMo sub-state: MTN, Moov, Celtiis
  const [momoOperator, setMomoOperator] = useState<'MTN' | 'Moov' | 'Celtiis'>(
    userProfile.savedMobileMoney?.operator || 'MTN'
  );
  const [momoPhone, setMomoPhone] = useState(
    userProfile.savedMobileMoney?.phoneNumber || userProfile.phone || '+229 97 00 12 34'
  );
  const [saveMomoForFuture, setSaveMomoForFuture] = useState(true);

  // Card sub-state
  const [useCardOption, setUseCardOption] = useState<'saved' | 'new'>(
    userProfile.savedCard ? 'saved' : 'new'
  );
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: userProfile.name || 'Karl',
    email: userProfile.email || 'karl@atelier.luxury',
    phone: userProfile.phone || '+33 6 12 84 90 21',
    address: userProfile.address || '14 Avenue Montaigne',
    city: userProfile.city || 'Paris',
    postalCode: userProfile.postalCode || '75008',
    cardNumber: userProfile.savedCard?.cardNumber || '•••• •••• •••• 8842',
    cardExp: userProfile.savedCard?.cardExp || '11/29',
    cardCvc: '•••'
  });

  const isSingleProduct = !!primaryProduct;
  const unitPrice = primaryProduct ? primaryProduct.price : 0;
  const subtotal = isSingleProduct
    ? unitPrice * quantity
    : cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const total = subtotal;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Save Card if applicable
      if (paymentMethod === 'card' && useCardOption === 'new' && saveCardForFuture) {
        const last4 = formData.cardNumber.replace(/\s+/g, '').slice(-4) || '8842';
        const newSavedCard: SavedCard = {
          cardNumber: formData.cardNumber.length >= 16 ? formData.cardNumber : '•••• •••• •••• ' + last4,
          cardHolder: formData.name,
          cardExp: formData.cardExp,
          cardBrand: 'OrA Card',
          last4: last4
        };
        onSaveCard(newSavedCard);
      }

      // Save MoMo if chosen
      if (paymentMethod === 'momo' && saveMomoForFuture && onSaveMobileMoney) {
        const newMM: SavedMobileMoney = {
          operator: momoOperator,
          phoneNumber: momoPhone,
          accountName: formData.name
        };
        onSaveMobileMoney(newMM);
      }

      const randomOrderId = `ORA-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderItems = isSingleProduct && primaryProduct
        ? [
            {
              productId: primaryProduct.id,
              productName: primaryProduct.name,
              productImage: primaryProduct.image,
              price: primaryProduct.price,
              quantity: quantity
            }
          ]
        : cartItems.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.image,
            price: item.product.price,
            quantity: item.quantity
          }));

      let chosenMethodLabel = 'Google Pay';
      if (paymentMethod === 'google_pay') {
        chosenMethodLabel = 'Google Pay';
      } else if (paymentMethod === 'card') {
        chosenMethodLabel = useCardOption === 'saved' && userProfile.savedCard
          ? `Carte enregistrée (•••• ${userProfile.savedCard.last4})`
          : 'Carte bancaire';
      } else if (paymentMethod === 'apple_pay') {
        chosenMethodLabel = 'Apple Pay';
      } else if (paymentMethod === 'momo') {
        chosenMethodLabel = `MoMo (${momoOperator} · ${momoPhone})`;
      }

      const newOrder: Order = {
        id: randomOrderId,
        clientId: userProfile.id || `client-${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'anonyme'}`,
        date: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        createdAt: Date.now(),
        items: orderItems,
        subtotal,
        shipping: 0,
        total,
        status: 'Confirmée',
        shippingAddress: `${formData.address}, ${formData.postalCode} ${formData.city}`,
        paymentMethod: chosenMethodLabel,
        buyerName: formData.name,
        buyerEmail: formData.email,
        buyerPhone: formData.phone
      };

      setConfirmedOrder(newOrder);
      onOrderComplete(newOrder);
    }, 1000);
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-md mx-auto px-3 py-8">
        <div className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-3xl p-5 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-[#F4ECE1] text-[#1C1917] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 stroke-1 text-[#8C7A68]" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif-luxury text-xl font-medium text-[#1C1917]">
              Paiement réussi
            </h1>
            <p className="text-xs text-[#78716C]">
              Commande <span className="font-mono font-bold text-[#1C1917]">#{confirmedOrder.id}</span>
            </p>
          </div>

          <div className="border border-[#EBE2D5] rounded-2xl p-3.5 text-left bg-[#F7F2EB]/60 space-y-2.5 text-xs">
            {confirmedOrder.items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={it.productImage}
                    alt={it.productName}
                    className="w-10 h-10 object-cover rounded-lg border border-[#E3D7C7]"
                  />
                  <div>
                    <p className="font-medium text-[#1C1917] line-clamp-1">{it.productName}</p>
                    <p className="text-[10px] text-[#8C7A68]">Quantité : {it.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-[#1C1917] tabular-nums">
                  {it.price * it.quantity} €
                </span>
              </div>
            ))}

            <div className="border-t border-[#EBE2D5] pt-2 flex justify-between font-bold text-sm">
              <span>Total réglé</span>
              <span className="tabular-nums">{confirmedOrder.total.toFixed(2)} €</span>
            </div>

            <div className="pt-1 text-[11px] text-[#78716C]">
              <p>Moyen de paiement : <strong className="text-[#1C1917]">{confirmedOrder.paymentMethod}</strong></p>
              <p>Destinataire : {formData.name} ({formData.phone})</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 bg-[#1C1917] text-[#FAF7F2] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#2A2623]"
          >
            Retourner aux articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4">
      {/* Return button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour au catalogue</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left Side (5 cols): Product Summary WITHOUT technical sheet */}
        <div className="md:col-span-5 space-y-3">
          {primaryProduct ? (
            <div className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-3.5 space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden bg-[#F3ECE1] border border-[#ECE3D5]">
                <img
                  src={primaryProduct.image}
                  alt={primaryProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[#8C7A68] tracking-wider block">
                  {primaryProduct.category}
                </span>
                <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917] leading-snug">
                  {primaryProduct.name}
                </h2>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between bg-[#F7F2EB] p-2 rounded-xl">
                <span className="text-xs text-[#57534E]">Quantité</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-6 h-6 rounded-full bg-white border border-[#D9CDBF] flex items-center justify-center text-xs disabled:opacity-40"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold tabular-nums w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-6 h-6 rounded-full bg-white border border-[#D9CDBF] flex items-center justify-center text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1 border-t border-[#ECE3D5] text-xs">
                <span className="text-[#78716C]">Prix unitaire</span>
                <span className="font-serif-luxury font-bold text-sm text-[#1C1917] tabular-nums">
                  {primaryProduct.price} €
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-3.5 space-y-2.5">
              <h3 className="font-serif-luxury text-sm font-semibold text-[#1C1917]">
                Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
              </h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-2 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-[#ECE3D5]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1C1917] truncate">{item.product.name}</p>
                      <p className="text-[10px] text-[#78716C]">{item.quantity} × {item.product.price} €</p>
                    </div>
                    <span className="font-bold tabular-nums">{item.quantity * item.product.price} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side (7 cols): Checkout form with EXACTLY 4 payment methods */}
        <div className="md:col-span-7">
          <form onSubmit={handleConfirmPayment} className="bg-[#FCFAF7] border border-[#ECE3D5] rounded-2xl p-4 sm:p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#ECE3D5] pb-2.5">
              <h2 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                Règlement
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-[#57534E]">
                <Lock className="w-3 h-3 text-[#8C7A68]" />
                <span>Paiement sécurisé</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold text-[#8C7A68] tracking-wider block">
                Adresse & Contact ({formData.name})
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nom"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-[#F7F2EB] border border-[#E1D6C6] rounded-xl focus:bg-white focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-[#F7F2EB] border border-[#E1D6C6] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Adresse de livraison"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-[#F7F2EB] border border-[#E1D6C6] rounded-xl focus:bg-white focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Code Postal"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-[#F7F2EB] border border-[#E1D6C6] rounded-xl focus:bg-white focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Ville"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-[#F7F2EB] border border-[#E1D6C6] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* MANDATORY: EXACTLY 4 PAYMENT METHODS: GOOGLE PAY / CARTE / APPLE PAY / MOMO (MTN, MOOV, CELTIIS) */}
            <div className="space-y-2 pt-2 border-t border-[#ECE3D5]">
              <span className="text-[10px] uppercase font-semibold text-[#8C7A68] tracking-wider block">
                Moyen de paiement (4 options)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {/* 1. GOOGLE PAY */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'google_pay'
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#FAF7F2]'
                      : 'border-[#E5DACD] bg-[#F7F2EB] text-[#44403C] hover:bg-[#EFE8DC]'
                  }`}
                >
                  <span className="text-xs font-bold tracking-tight">G Pay</span>
                  <span className="text-[9px] mt-0.5 font-medium">Google Pay</span>
                </button>

                {/* 2. CARTE */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#FAF7F2]'
                      : 'border-[#E5DACD] bg-[#F7F2EB] text-[#44403C] hover:bg-[#EFE8DC]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 mb-0.5" />
                  <span className="text-[9px] font-medium">Carte</span>
                </button>

                {/* 3. APPLE PAY */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#FAF7F2]'
                      : 'border-[#E5DACD] bg-[#F7F2EB] text-[#44403C] hover:bg-[#EFE8DC]'
                  }`}
                >
                  <span className="text-xs">Pay</span>
                  <span className="text-[9px] mt-0.5 font-medium">Apple Pay</span>
                </button>

                {/* 4. MOMO (MTN, MOOV, CELTIIS) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#FAF7F2]'
                      : 'border-[#E5DACD] bg-[#F7F2EB] text-[#44403C] hover:bg-[#EFE8DC]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 mb-0.5 text-[#E6C694]" />
                  <span className="text-[9px] font-bold">MoMo</span>
                </button>
              </div>

              {/* DETAILS FOR MOMO: MTN, MOOV, CELTIIS */}
              {paymentMethod === 'momo' && (
                <div className="bg-[#F7F2EB] p-3 rounded-xl border border-[#E3D7C7] space-y-2 text-xs">
                  <span className="text-[10px] font-semibold text-[#8C7A68] uppercase block">
                    Sélectionnez votre réseau MoMo :
                  </span>

                  {/* 3 Operators: MTN, Moov, Celtiis */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['MTN', 'Moov', 'Celtiis'] as const).map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setMomoOperator(op)}
                        className={`py-1.5 px-1 rounded-lg border text-center text-xs font-bold transition-all ${
                          momoOperator === op
                            ? op === 'MTN'
                              ? 'bg-[#FFCC00] text-black border-[#E6B800] shadow-xs'
                              : op === 'Moov'
                              ? 'bg-[#0055A5] text-white border-[#004488] shadow-xs'
                              : 'bg-[#008080] text-white border-[#006666] shadow-xs'
                            : 'bg-white text-[#44403C] border-[#D9CDBF]'
                        }`}
                      >
                        {op === 'MTN' ? 'MTN MoMo' : op === 'Moov' ? 'Moov Money' : 'Celtiis Cash'}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-semibold text-[#8C7A68] block mb-0.5">
                      Numéro {momoOperator}
                    </label>
                    <div className="flex items-center bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#8C7A68] mr-1.5 shrink-0" />
                      <input
                        type="tel"
                        required
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                        placeholder="+229 97 00 12 34"
                        className="w-full text-xs font-mono text-[#1C1917] focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 pt-0.5 cursor-pointer text-[10px] text-[#44403C]">
                    <input
                      type="checkbox"
                      checked={saveMomoForFuture}
                      onChange={(e) => setSaveMomoForFuture(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#1C1917]"
                    />
                    <span>Enregistrer ce numéro {momoOperator} pour Karl</span>
                  </label>
                </div>
              )}

              {/* DETAILS FOR CARTE */}
              {paymentMethod === 'card' && (
                <div className="bg-[#F7F2EB] p-3 rounded-xl border border-[#E3D7C7] space-y-2 text-xs">
                  {userProfile.savedCard && (
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-[10px] font-semibold text-[#8C7A68] uppercase">
                        Option de carte
                      </span>
                      <div className="flex gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setUseCardOption('saved')}
                          className={`px-2 py-0.5 rounded-full ${
                            useCardOption === 'saved' ? 'bg-[#1C1917] text-white' : 'text-[#8C7A68]'
                          }`}
                        >
                          Carte de Karl
                        </button>
                        <button
                          type="button"
                          onClick={() => setUseCardOption('new')}
                          className={`px-2 py-0.5 rounded-full ${
                            useCardOption === 'new' ? 'bg-[#1C1917] text-white' : 'text-[#8C7A68]'
                          }`}
                        >
                          Autre carte
                        </button>
                      </div>
                    </div>
                  )}

                  {useCardOption === 'saved' && userProfile.savedCard ? (
                    <div className="p-2 rounded-lg bg-white border border-[#D9CDBF] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#8C7A68]" />
                        <div>
                          <p className="font-semibold text-xs text-[#1C1917]">Carte enregistrée (Karl)</p>
                          <p className="text-[10px] text-[#78716C] font-mono">•••• {userProfile.savedCard.last4} · Exp : {userProfile.savedCard.cardExp}</p>
                        </div>
                      </div>
                      <Check className="w-4 h-4 text-green-700" />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        placeholder="Numéro de carte"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={formData.cardExp}
                          onChange={(e) => handleInputChange('cardExp', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-xs"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={formData.cardCvc}
                          onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D9CDBF] rounded-lg font-mono text-xs"
                        />
                      </div>
                      <label className="flex items-center gap-1.5 text-[10px] text-[#44403C]">
                        <input
                          type="checkbox"
                          checked={saveCardForFuture}
                          onChange={(e) => setSaveCardForFuture(e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-[#1C1917]"
                        />
                        <span>Enregistrer cette carte pour Karl</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* DETAILS FOR GOOGLE PAY */}
              {paymentMethod === 'google_pay' && (
                <div className="p-2.5 rounded-xl bg-[#F7F2EB] border border-[#E3D7C7] text-xs text-[#57534E] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-black text-white px-2 py-0.5 rounded-md">GPay</span>
                    <span>Paiement en 1 clic avec votre compte Google</span>
                  </div>
                  <Check className="w-4 h-4 text-green-700" />
                </div>
              )}

              {/* DETAILS FOR APPLE PAY */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-2.5 rounded-xl bg-[#F7F2EB] border border-[#E3D7C7] text-xs text-[#57534E] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-black text-white px-2 py-0.5 rounded-md">Pay</span>
                    <span>Validation Touch ID ou Face ID</span>
                  </div>
                  <Check className="w-4 h-4 text-green-700" />
                </div>
              )}
            </div>

            {/* Total and CTA */}
            <div className="border-t border-[#ECE3D5] pt-2 flex items-baseline justify-between">
              <span className="text-xs text-[#78716C]">Total à payer</span>
              <span className="font-serif-luxury text-base font-bold text-[#1C1917] tabular-nums">
                {total.toFixed(2)} €
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#2A2623] text-[#FAF7F2] rounded-full font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validation du paiement...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {paymentMethod === 'google_pay' && `Payer avec Google Pay · ${total.toFixed(2)} €`}
                    {paymentMethod === 'card' && `Payer par Carte · ${total.toFixed(2)} €`}
                    {paymentMethod === 'apple_pay' && `Payer avec Apple Pay · ${total.toFixed(2)} €`}
                    {paymentMethod === 'momo' && `Payer via ${momoOperator} MoMo · ${total.toFixed(2)} €`}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
