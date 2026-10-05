import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, isAdminLogin?: boolean) => void;
  reason?: 'checkout' | 'manual' | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  reason
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Discreet Admin detection without exposing it in the UI:
  // "au admin apres formation de savoir qu'ils auront à mettre AD-"infos" avant de se connecter"
  const isSecretAdmin = (idStr: string) => {
    return idStr.trim().toUpperCase().startsWith('AD-');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Veuillez renseigner votre identifiant ou email.');
      return;
    }

    const isAdmin = isSecretAdmin(cleanId);

    if (isAdmin) {
      const adminName = cleanId.replace(/^AD-/i, '') || 'Administrateur';
      const adminUser: UserProfile = {
        id: cleanId,
        name: adminName.charAt(0).toUpperCase() + adminName.slice(1),
        email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@ora.luxury`,
        phone: '+229 97 00 00 00',
        address: 'Siège OrA',
        city: 'Cotonou',
        postalCode: '00229',
        country: 'Bénin',
        role: 'admin',
        isAdmin: true
      };
      // Pass true so App immediately opens the Admin Console
      onLoginSuccess(adminUser, true);
      onClose();
      return;
    }

    if (mode === 'login') {
      const isKarl = cleanId.toLowerCase().includes('karl');
      const customerUser: UserProfile = {
        id: isKarl ? 'user-karl' : `user-${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now()}`,
        name: isKarl ? 'Karl' : cleanId.split('@')[0],
        email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@client.luxury`,
        phone: '+229 97 00 12 34',
        address: '14 Avenue Montaigne',
        city: 'Paris',
        postalCode: '75008',
        country: 'France',
        role: 'customer',
        isAdmin: false,
        savedCard: {
          cardNumber: '•••• •••• •••• 8842',
          cardHolder: isKarl ? 'Karl' : cleanId.split('@')[0],
          cardExp: '11/29',
          cardBrand: 'OrA Card',
          last4: '8842'
        },
        savedMobileMoney: {
          operator: 'MTN',
          phoneNumber: '+229 97 00 12 34',
          accountName: isKarl ? 'Karl' : cleanId.split('@')[0]
        }
      };
      onLoginSuccess(customerUser, false);
      onClose();
      return;
    }

    // Register mode
    const registeredUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Client OrA',
      email: cleanId,
      phone: phone.trim() || '+229 97 00 12 34',
      address: 'Adresse client',
      city: city.trim() || 'Cotonou',
      postalCode: '00229',
      country: 'Bénin',
      role: 'customer',
      isAdmin: false,
      savedMobileMoney: {
        operator: 'MTN',
        phoneNumber: phone.trim() || '+229 97 00 12 34',
        accountName: name.trim() || 'Client'
      }
    };

    onLoginSuccess(registeredUser, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#141210]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-[#FCFAF7] text-left shadow-2xl transition-all w-full max-w-sm sm:max-w-md border border-[#ECE3D5] p-5 sm:p-7 space-y-4">
          
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F3ECE1] text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Clean luxury brand header */}
          <div className="text-center space-y-1">
            <span className="font-serif-luxury text-2xl font-medium tracking-[0.25em] text-[#1C1917]">
              OrA
            </span>
            <h2 className="font-serif-luxury text-lg font-medium text-[#1C1917]">
              {mode === 'login' ? 'Espace Connexion' : 'Création de compte'}
            </h2>
            {reason === 'checkout' && (
              <p className="text-xs text-[#9E7A4A] bg-[#F7F2EB] py-1 px-3 rounded-full inline-block font-medium">
                Veuillez vous authentifier pour régler votre commande
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg text-center font-medium">
              {error}
            </p>
          )}

          {/* Standard authentication form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D9CDBF] rounded-xl text-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                Identifiant ou Adresse email
              </label>
              <input
                type="text"
                required
                placeholder="nom@exemple.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D9CDBF] rounded-xl text-xs focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D9CDBF] rounded-xl text-xs focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+229 97 00 12 34"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D9CDBF] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8C7A68] block mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D9CDBF] rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#2A2623] text-[#FAF7F2] rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{mode === 'login' ? 'Se connecter' : 'Valider mon inscription'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-1 text-xs">
            {mode === 'login' ? (
              <p className="text-[#78716C]">
                Nouveau chez OrA ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-[#1C1917] underline ml-1"
                >
                  Créer un compte
                </button>
              </p>
            ) : (
              <p className="text-[#78716C]">
                Déjà membre ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#1C1917] underline ml-1"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
