import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-watch-1',
    name: 'Chrono Titane Grade 5 & Cuir Sellier',
    category: 'Montres & Horlogerie',
    categorySlug: 'montres',
    price: 420,
    originalPrice: 490,
    discountPercentage: 15,
    isRecent: true,
    isPromo: true,
    promoBadgeText: '-15% Sélection Horlogère',
    image: './images/promo_watch_cover_1791023597096.jpg',
    description: 'Boîtier monobloc en titane sablé aérospatial, mouvement chronographe suisse et cuir sellier.',
    fullDescription: 'Pièce emblématique en titane Grade 5 hypoallergénique. Verre saphir double face inrayable, étanchéité certifiée 100 mètres et poussoirs de chrono biseautés.',
    features: [
      'Boîtier monobloc titane Grade 5 (62g)',
      'Verre saphir inrayable antireflet',
      'Mouvement chronographe suisse de précision',
      'Bracelet cuir de veau sellier tannage végétal',
      'Étanchéité 10 ATM (100 mètres)'
    ],
    specs: {
      'Diamètre': '40 mm',
      'Épaisseur': '10.2 mm',
      'Mouvement': 'Quartz Swiss Made',
      'Verre': 'Saphir antireflet',
      'Étanchéité': '10 ATM / 100 m',
      'Garantie': '3 ans'
    },
    inStock: true,
    rating: 4.9,
    reviewsCount: 142
  },
  {
    id: 'prod-perfume-1',
    name: 'Santal & Ambre Sauvage — Extrait',
    category: 'Haute Parfumerie',
    categorySlug: 'parfums',
    price: 195,
    originalPrice: 230,
    discountPercentage: 15,
    isRecent: true,
    isPromo: true,
    promoBadgeText: '-15% Édition Limitée',
    image: './images/promo_parfum_cover_1791024218895.jpg',
    description: 'Concentration pure à 28% aux accords de santal d’Australie, encens et ambre gris.',
    fullDescription: 'Créé à Grasse par un maître nez indépendant. Bergamote de Calabre en tête, cœur de cèdre fumé et fond chaud de santal et ambre gris.',
    features: [
      'Concentration pure Extrait de Parfum (28%)',
      'Flacon verre lourd avec bouchon magnétique',
      'Maturation en fût de chêne pendant 90 jours',
      'Tenue sur peau supérieure à 16 heures'
    ],
    specs: {
      'Volume': '100 ml / 3.4 fl. oz',
      'Concentration': 'Extrait de Parfum (28%)',
      'Notes de tête': 'Cardamome, Bergamote',
      'Notes de cœur': 'Cèdre fumé, Iris',
      'Notes de fond': 'Santal crémeux, Ambre gris'
    },
    inStock: true,
    rating: 4.9,
    reviewsCount: 98
  },
  {
    id: 'prod-watch-2',
    name: 'Céramique Noire & Or Rose Automatique',
    category: 'Montres & Horlogerie',
    categorySlug: 'montres',
    price: 680,
    originalPrice: 780,
    discountPercentage: 12,
    isRecent: true,
    isPromo: true,
    promoBadgeText: '-12% Atelier',
    image: './images/promo_watch_gold_1791024262834.jpg',
    description: 'Céramique haute technologie inrayable avec index or rose 18k et calibre mécanique.',
    fullDescription: 'Sculpté dans une céramique noire frittée à 1500°C. Fond saphir transparent avec vue sur la masse oscillante Côtes de Genève.',
    features: [
      'Boîtier céramique frittée inaltérable',
      'Calibre mécanique automatique (28 800 alt/h)',
      'Réserve de marche de 48 heures',
      'Index Super-LumiNova BGW9 bleuté',
      'Étanchéité 15 ATM (150 mètres)'
    ],
    specs: {
      'Diamètre': '41 mm',
      'Épaisseur': '11.4 mm',
      'Calibre': 'Automatique 24 rubis',
      'Réserve': '48 heures',
      'Étanchéité': '15 ATM'
    },
    inStock: true,
    rating: 5.0,
    reviewsCount: 67
  },
  {
    id: 'prod-perfume-2',
    name: 'Cuir Fumé & Vanille Bourbon — Eau de Parfum',
    category: 'Haute Parfumerie',
    categorySlug: 'parfums',
    price: 165,
    originalPrice: 190,
    discountPercentage: 13,
    isRecent: false,
    isPromo: true,
    promoBadgeText: '-13% Best-Seller',
    image: './images/product_parfum_amber_1791024229905.jpg',
    description: 'Cuir tanné florentin, gousse de vanille noire de Madagascar et touches de tabac.',
    fullDescription: 'Une élégance feutrée. La rondeur gourmande de la vanille Bourbon s’associe à la force du cuir vieilli et de la fève tonka toastée.',
    features: [
      'Alcool végétal biologique',
      'Flacon ambré anti-UV',
      'Sillage raffiné et magnétique',
      'Formule mixte pour homme et femme'
    ],
    specs: {
      'Volume': '75 ml',
      'Concentration': 'Eau de Parfum (20%)',
      'Notes de tête': 'Poivre rose, Muscade',
      'Notes de cœur': 'Cuir florentin, Tabac',
      'Notes de fond': 'Vanille Bourbon, Fève tonka'
    },
    inStock: true,
    rating: 4.8,
    reviewsCount: 84
  },
  {
    id: 'prod-watch-3',
    name: 'Automatique Bauhaus — Blanc & Acier',
    category: 'Montres & Horlogerie',
    categorySlug: 'montres',
    price: 340,
    originalPrice: 390,
    discountPercentage: 12,
    isRecent: true,
    isPromo: false,
    promoBadgeText: 'Classique',
    image: './images/product_watch_automatic_1791024250532.jpg',
    description: 'Design épuré d’inspiration moderniste, cadran blanc opalin et aiguilles acier bleui.',
    fullDescription: 'Une épure totale. Deux aiguilles fines glissent sur un cadran grainé blanc mat. Profil ultra-plat de 8,6 mm qui se glisse sous toute chemise.',
    features: [
      'Boîtier acier 316L poli miroir',
      'Cadran opalin blanc immaculé',
      'Verre saphir double dôme',
      'Bracelet maille milanaise ajustable'
    ],
    specs: {
      'Diamètre': '38.5 mm',
      'Épaisseur': '8.6 mm',
      'Mouvement': 'Automatique 21 600 vph',
      'Étanchéité': '5 ATM / 50 m'
    },
    inStock: true,
    rating: 4.9,
    reviewsCount: 110
  },
  {
    id: 'prod-perfume-3',
    name: 'Iris Poudré & Vétiver Blanc — Cristal Pur',
    category: 'Haute Parfumerie',
    categorySlug: 'parfums',
    price: 175,
    originalPrice: 200,
    discountPercentage: 12,
    isRecent: true,
    isPromo: false,
    promoBadgeText: 'Frais',
    image: './images/product_parfum_blanc_1791024240360.jpg',
    description: 'Iris toscan poudré, fraîcheur minérale de vétiver blanc et muscs cotonneux.',
    fullDescription: 'Clarté cristalline inspirée d’un matin frais. L’iris noble de Florence s’adoucit avec le néroli et les muscs blancs vaporeux.',
    features: [
      'Rizome d’iris séché 3 ans à Florence',
      'Flacon cristal clair lourd',
      'Diffusion brume de soie ultra-fine'
    ],
    specs: {
      'Volume': '100 ml',
      'Concentration': 'Eau de Parfum (18%)',
      'Notes de tête': 'Néroli, Baie rose',
      'Notes de cœur': 'Iris florentin, Violette',
      'Notes de fond': 'Vétiver blanc, Muscs doux'
    },
    inStock: true,
    rating: 4.8,
    reviewsCount: 52
  },
  {
    id: 'prod-watch-4',
    name: 'Squelette Mécanique OrA — Calibre Ouvert',
    category: 'Montres & Horlogerie',
    categorySlug: 'montres',
    price: 750,
    originalPrice: 850,
    discountPercentage: 11,
    isRecent: true,
    isPromo: true,
    promoBadgeText: '-11% Pièce Maîtresse',
    image: './images/watch_skeleton_1791187754455.jpg',
    description: 'Mouvement mécanique entièrement ajouré révélant le train d’engrenages et le balancier.',
    fullDescription: 'Pièce d’art horloger. Le cadran et le fond saphir laissent observer les oscillations à 28 800 alternances par heure et les rouages anglés à la main.',
    features: [
      'Calibre mécanique squelette squeletté main',
      'Boîtier acier satiné et angles polis',
      'Verres saphir double face inrayables',
      'Bracelet en cuir alligator noir cousu sellier'
    ],
    specs: {
      'Diamètre': '42 mm',
      'Épaisseur': '10.8 mm',
      'Mouvement': 'Mécanique manuel 46h de réserve',
      'Étanchéité': '5 ATM / 50 m'
    },
    inStock: true,
    rating: 5.0,
    reviewsCount: 39
  },
  {
    id: 'prod-perfume-4',
    name: 'Oud Impérial & Encens d\'Oman — Flacon Laqué',
    category: 'Haute Parfumerie',
    categorySlug: 'parfums',
    price: 220,
    originalPrice: 250,
    discountPercentage: 12,
    isRecent: true,
    isPromo: false,
    promoBadgeText: 'Rare',
    image: './images/parfum_oud_noir_1791187767103.jpg',
    description: 'Bois de oud précieux du Cambodge, volutes d’encens sacré et touches d’ambre doré.',
    fullDescription: 'Puissant, majestueux et boisé. Un oud naturel rare distillé selon la tradition orientale et équilibré par des notes d’épices chaudes.',
    features: [
      'Oud sauvage naturel du Cambodge certifié',
      'Flacon laqué noir obsidienne avec lettres or',
      'Sillage remarquable et persistance longue durée'
    ],
    specs: {
      'Volume': '100 ml',
      'Concentration': 'Extrait de Parfum (25%)',
      'Notes de tête': 'Safran d’Orient, Poivre noir',
      'Notes de cœur': 'Encens d’Oman, Cuir sombre',
      'Notes de fond': 'Oud cambodgien, Bois de santal'
    },
    inStock: true,
    rating: 4.9,
    reviewsCount: 71
  },
  {
    id: 'prod-watch-5',
    name: 'Plongeuse Abyssale 300M — Céramique & Acier',
    category: 'Montres & Horlogerie',
    categorySlug: 'montres',
    price: 510,
    originalPrice: 580,
    discountPercentage: 12,
    isRecent: true,
    isPromo: true,
    promoBadgeText: '-12% Sport Chic',
    image: './images/watch_diver_steel_1791187779058.jpg',
    description: 'Lunette tournante en céramique bleu nuit, couronne vissée et étanchéité certifiée 300m.',
    fullDescription: 'Conçue pour les grandes profondeurs et le port quotidien. Valve à hélium, index surdimensionnés luminescents et acier 316L massif.',
    features: [
      'Étanchéité extrême 30 ATM (300 mètres)',
      'Lunette tournante unidirectionnelle céramique 120 clics',
      'Calibre automatique haute cadence antichoc',
      'Bracelet acier à maillons vissés et fermoir sécurisé'
    ],
    specs: {
      'Diamètre': '41.5 mm',
      'Épaisseur': '12.6 mm',
      'Calibre': 'Automatique 28 800 vph',
      'Étanchéité': '30 ATM / 300 m'
    },
    inStock: true,
    rating: 4.9,
    reviewsCount: 88
  },
  {
    id: 'prod-perfume-5',
    name: 'Rose Centifolia & Chypre Doré — Essence de Grasse',
    category: 'Haute Parfumerie',
    categorySlug: 'parfums',
    price: 185,
    originalPrice: 210,
    discountPercentage: 12,
    isRecent: false,
    isPromo: true,
    promoBadgeText: '-12% Édition Mai',
    image: './images/parfum_rose_chypre_1791187790943.jpg',
    description: 'Pétales de rose de mai récoltés à l’aube à Grasse, mousse de chêne et patchouli noble.',
    fullDescription: 'Une interprétation moderne du chypre floral. Les roses de mai fraîches s’unissent à la fraîcheur de la bergamote et au velouté du patchouli.',
    features: [
      'Rose Centifolia cueillie à la main à Grasse',
      'Flacon facetté transparent avec col doré',
      'Sillage délicat, élégant et lumineux'
    ],
    specs: {
      'Volume': '75 ml',
      'Concentration': 'Eau de Parfum Intense (22%)',
      'Notes de tête': 'Mandarine verte, Poivre blanc',
      'Notes de cœur': 'Rose de Mai de Grasse, Pivoine',
      'Notes de fond': 'Patchouli épuré, Mousse de chêne'
    },
    inStock: true,
    rating: 4.8,
    reviewsCount: 46
  },
  {
    id: 'prod-watch-6',
    name: 'Or Jaune 18K & Cadran Émeraude Solaire',
    category: 'Montres & Horlogerie',
    categorySlug: 'montres',
    price: 890,
    originalPrice: 990,
    discountPercentage: 10,
    isRecent: true,
    isPromo: false,
    promoBadgeText: 'Haute Joaillerie',
    image: './images/watch_emerald_gold_1791187803480.jpg',
    description: 'Boîtier fin en or jaune 18 carats, cadran vert émeraude soleillé et cuir noir.',
    fullDescription: 'L’élégance habillée par excellence. Le reflet vert forêt profond du cadran soleillé contraste avec la chaleur de l’or 18 carats.',
    features: [
      'Boîtier galbé or jaune 18 carats',
      'Cadran brossé soleillé vert émeraude profond',
      'Mouvement extra-plat de manufacture suisse',
      'Bracelet en cuir d’alligator véritable'
    ],
    specs: {
      'Diamètre': '39 mm',
      'Épaisseur': '7.9 mm (Ultra-plat)',
      'Calibre': 'Mécanique 28 800 alt/h',
      'Étanchéité': '3 ATM / 30 m'
    },
    inStock: true,
    rating: 5.0,
    reviewsCount: 31
  },
  {
    id: 'prod-perfume-6',
    name: 'Vétiver d\'Haïti & Bergamote Solaire',
    category: 'Haute Parfumerie',
    categorySlug: 'parfums',
    price: 150,
    originalPrice: 170,
    discountPercentage: 12,
    isRecent: true,
    isPromo: false,
    promoBadgeText: 'Nouveau',
    image: './images/parfum_vetiver_1791187815093.jpg',
    description: 'Racines de vétiver d’Haïti fumées, zeste de bergamote de Calabre et cèdre blanc.',
    fullDescription: 'Une création vivifiante et terrienne. Le zeste pétillant d’agrumes italiens réveille les facettes fumées et boisées du vétiver d’Haïti.',
    features: [
      'Vétiver équitable issu de coopératives d’Haïti',
      'Bouchon en bois massif précieux ciré main',
      'Parfum énergisant et d’une grande netteté'
    ],
    specs: {
      'Volume': '100 ml',
      'Concentration': 'Eau de Parfum (19%)',
      'Notes de tête': 'Bergamote, Pamplemousse',
      'Notes de cœur': 'Baie de genièvre, Noix de muscade',
      'Notes de fond': 'Vétiver d’Haïti, Cèdre de Virginie'
    },
    inStock: true,
    rating: 4.8,
    reviewsCount: 63
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Toutes les pièces' },
  { id: 'promo', label: 'En Promotion' },
  { id: 'montres', label: 'Montres & Horlogerie' },
  { id: 'parfums', label: 'Haute Parfumerie' }
];

export const PROMO_COVERS = [
  {
    productId: 'prod-watch-1',
    title: 'Chrono Titane Grade 5 & Cuir Sellier',
    subtitle: 'Précision suisse, boîtier titane sablé',
    discountBadge: 'HORLOGERIE · -15%',
    image: './images/promo_watch_cover_1791023597096.jpg',
    price: 420,
    originalPrice: 490,
    category: 'Montres'
  },
  {
    productId: 'prod-perfume-1',
    title: 'Santal & Ambre Sauvage — Extrait',
    subtitle: 'Concentration à 28% et maturation à Grasse',
    discountBadge: 'PARFUMERIE · -15%',
    image: './images/promo_parfum_cover_1791024218895.jpg',
    price: 195,
    originalPrice: 230,
    category: 'Parfums'
  },
  {
    productId: 'prod-watch-4',
    title: 'Squelette Mécanique OrA — Calibre Ouvert',
    subtitle: 'Mouvement entièrement ajouré & verres saphir',
    discountBadge: 'NOUVEAUTÉ · -11%',
    image: './images/watch_skeleton_1791187754455.jpg',
    price: 750,
    originalPrice: 850,
    category: 'Montres'
  }
];
