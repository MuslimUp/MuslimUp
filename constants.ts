import { Category, Freelancer, Service, Testimonial, Review, Project } from './types';
import { 
    CodeBracketIcon, 
    PaintBrushIcon, 
    PencilIcon, 
    VideoCameraIcon,
    MegaphoneIcon,
    UsersIcon
} from './components/icons';

export const CATEGORIES: Category[] = [
  { id: 'dev', name: 'Site et Développement', icon: CodeBracketIcon },
  { id: 'design', name: 'Design & Graphisme', icon: PaintBrushIcon },
  { id: 'writing', name: 'Rédaction & Traduction', icon: PencilIcon },
  { id: 'video', name: 'Vidéo & Animation', icon: VideoCameraIcon },
  { id: 'seo', name: 'SEO & Communication', icon: MegaphoneIcon },
  { id: 'social', name: 'Réseaux sociaux', icon: UsersIcon },
];

export const FREELANCERS: Freelancer[] = [
  {
    id: 'f1',
    name: 'Ayoub El Khazzani',
    title: 'Développeur Full-Stack',
    avatarUrl: 'https://picsum.photos/seed/f1/128/128',
    level: 'Top Vendeur',
    description: "Passionné par le code et l'innovation, je transforme vos idées en applications web performantes et élégantes.",
    sellerTestimonial: "MuslimUp m'a permis de me connecter avec des clients qui comprennent vraiment ma vision. C'est plus qu'une plateforme, c'est une communauté qui soutient mon développement.",
    rating: 4.9,
    reviewCount: 124,
    stats: {
      responseTime: 2,
      ordersCompleted: 250,
      onTimeDeliveryRate: 99,
    },
    memberSince: 'Juin 2021',
  },
  {
    id: 'f2',
    name: 'Fatima Zahra',
    title: 'Designer UI/UX & Logo',
    avatarUrl: 'https://picsum.photos/seed/f2/128/128',
    level: 'Vendeur de Niveau 2',
    description: "Créative et à l'écoute, je conçois des identités visuelles uniques et des interfaces utilisateur intuitives qui marquent les esprits.",
    sellerTestimonial: "Lancer mon activité de designer freelance ici a été la meilleure décision. La facilité d'utilisation et la qualité des projets sont incomparables. Je me sens valorisée et en sécurité.",
    rating: 5.0,
    reviewCount: 88,
    stats: {
      responseTime: 1,
      ordersCompleted: 150,
      onTimeDeliveryRate: 100,
    },
    memberSince: 'Mars 2022',
  },
  {
    id: 'f3',
    name: 'Youssef Alami',
    title: 'Monteur Vidéo & Motion Designer',
    avatarUrl: 'https://picsum.photos/seed/f3/128/128',
    level: 'Vendeur de Niveau 2',
    description: 'Je donne vie à vos histoires avec des montages dynamiques et des animations captivantes. Votre message, en mouvement.',
    rating: 4.8,
    reviewCount: 76,
    stats: {
      responseTime: 4,
      ordersCompleted: 110,
      onTimeDeliveryRate: 98,
    },
    memberSince: 'Janvier 2022',
  },
   {
    id: 'f4',
    name: 'Safia Benali',
    title: 'Rédactrice Web SEO',
    avatarUrl: 'https://picsum.photos/seed/f4/128/128',
    level: 'Nouveau vendeur',
    description: 'Des mots qui ont de l\'impact. Je rédige des contenus optimisés pour les moteurs de recherche qui engagent votre audience.',
    sellerTestimonial: "J'étais hésitante à me lancer, mais la communauté bienveillante de MuslimUp et les outils simples m'ont tout de suite mise en confiance. J'ai décroché ma première commande en une semaine !",
    rating: 4.9,
    reviewCount: 32,
    stats: {
      responseTime: 3,
      ordersCompleted: 50,
      onTimeDeliveryRate: 100,
    },
    memberSince: 'Août 2023',
  },
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    freelancerId: 'f1',
    categoryId: 'dev',
    title: 'Je vais créer votre site web moderne avec React et Node.js',
    imageUrl: 'https://picsum.photos/seed/s1-website/600/400',
    rating: 4.9,
    reviewCount: 78,
    price: 450,
    ordersInQueue: 3,
    description: 'Un site web sur mesure, rapide et sécurisé. Parfait pour les entreprises, les portfolios ou les blogs. Inclus : design responsive, optimisation SEO de base, et déploiement.',
    features: ['Développement front-end (React)', 'Développement back-end (Node.js)', 'Base de données (MongoDB/PostgreSQL)', 'Déploiement sur serveur', '3 pages incluses', 'Design responsive'],
  },
  {
    id: 's2',
    freelancerId: 'f2',
    categoryId: 'design',
    title: 'Je vais concevoir un logo professionnel et une identité de marque',
    imageUrl: 'https://picsum.photos/seed/s2-logo/600/400',
    rating: 5.0,
    reviewCount: 52,
    price: 250,
    ordersInQueue: 5,
    description: 'Votre marque mérite un logo mémorable. Je vous propose un processus de création collaboratif pour aboutir à un logo unique et une charte graphique complète.',
    features: ['3 concepts de logo', 'Fichiers vectoriels (.ai, .svg)', 'Charte graphique (couleurs, typographies)', 'Maquettes de cartes de visite', 'Révisions illimitées'],
  },
  {
    id: 's3',
    freelancerId: 'f3',
    categoryId: 'video',
    title: 'Je vais réaliser un montage vidéo professionnel pour vos réseaux sociaux',
    imageUrl: 'https://picsum.photos/seed/s3-video/600/400',
    rating: 4.8,
    reviewCount: 45,
    price: 150,
    ordersInQueue: 2,
    description: 'Boostez votre engagement avec des vidéos percutantes. Je monte vos rushs pour créer des vidéos dynamiques (Reels, TikTok, YouTube Shorts) avec sous-titres, musique et effets.',
    features: ['Montage jusqu\'à 60 secondes', 'Ajout de musique libre de droits', 'Sous-titres animés', 'Étalonnage des couleurs', '2 séries de révisions'],
  },
  {
    id: 's4',
    freelancerId: 'f4',
    categoryId: 'writing',
    title: 'Je vais écrire 5 articles de blog optimisés SEO (500 mots)',
    imageUrl: 'https://picsum.photos/seed/s4-writing/600/400',
    rating: 4.9,
    reviewCount: 21,
    price: 200,
    ordersInQueue: 1,
    description: 'Améliorez votre référencement naturel avec du contenu de qualité. Je rédige des articles de blog informatifs, engageants et optimisés pour les mots-clés de votre secteur.',
    features: ['Recherche de mots-clés', '5 articles de 500 mots', 'Optimisation SEO (balises, méta)', 'Contenu 100% unique', '1 révision par article'],
  },
  { id: 's5', freelancerId: 'f1', categoryId: 'dev', title: 'Développement d\'une API RESTful sécurisée', imageUrl: 'https://picsum.photos/seed/s5-api/600/400', rating: 4.9, reviewCount: 22, price: 300, ordersInQueue: 1, description: 'API robuste et documentée pour votre application.', features: ['Node.js/Express', 'Authentification JWT', 'Documentation Swagger'] },
  { id: 's6', freelancerId: 'f2', categoryId: 'design', title: 'Design d\'interface pour application mobile (UI/UX)', imageUrl: 'https://picsum.photos/seed/s6-mobile-ui/600/400', rating: 5.0, reviewCount: 31, price: 600, ordersInQueue: 2, description: 'Une expérience utilisateur fluide et un design attractif.', features: ['Fichiers Figma', 'Prototype cliquable', 'Jusqu\'à 10 écrans'] },
  { id: 's7', freelancerId: 'f3', categoryId: 'video', title: 'Animation de logo (intro/outro)', imageUrl: 'https://picsum.photos/seed/s7-logo-anim/600/400', rating: 4.9, reviewCount: 19, price: 100, ordersInQueue: 4, description: 'Donnez vie à votre logo avec une animation professionnelle.', features: ['Animation 5-10s', 'Musique & effets sonores', 'Format 4K'] },
  { id: 's8', freelancerId: 'f2', categoryId: 'design', title: 'Création de bannières publicitaires pour le web', imageUrl: 'https://picsum.photos/seed/s8-banners/600/400', rating: 4.9, reviewCount: 15, price: 80, ordersInQueue: 3, description: 'Visuels percutants pour vos campagnes publicitaires.', features: ['3 tailles de bannières', 'Formats JPG/PNG/GIF', '2 révisions'] },
  { 
    id: 's9', 
    freelancerId: 'f4',
    categoryId: 'seo', 
    title: 'Je vais réaliser un audit SEO complet de votre site web', 
    imageUrl: 'https://picsum.photos/seed/s9-seo-audit/600/400', 
    rating: 4.9, 
    reviewCount: 28, 
    price: 350, 
    ordersInQueue: 2, 
    description: 'Identifiez les points faibles de votre site et obtenez un plan d\'action clair pour grimper dans les résultats de recherche Google.', 
    features: ['Analyse technique', 'Analyse des mots-clés', 'Analyse concurrentielle', 'Rapport détaillé', 'Recommandations stratégiques'] 
  },
  { 
    id: 's10', 
    freelancerId: 'f2', 
    categoryId: 'social',
    title: 'Je vais créer 10 templates de posts Instagram pour votre marque', 
    imageUrl: 'https://picsum.photos/seed/s10-instagram/600/400', 
    rating: 5.0, 
    reviewCount: 41, 
    price: 180, 
    ordersInQueue: 3, 
    description: 'Harmonisez votre feed Instagram avec des templates personnalisés et professionnels. Fichiers modifiables sur Canva.', 
    features: ['10 templates uniques', 'Adaptés à votre charte graphique', 'Format Post & Story', 'Livrés en 3 jours', 'Fichiers source Canva'] 
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: "MuslimUp a été une révélation. J'ai trouvé Ayoub, un développeur exceptionnel qui a compris ma vision et l'a réalisée au-delà de mes espérances. La plateforme est simple et sécurisante.",
    clientName: 'Karim D.',
    clientTitle: 'Fondateur de "NourShop"',
    clientAvatarUrl: 'https://picsum.photos/seed/t1-client/128/128',
  },
  {
    id: 't2',
    quote: "En tant que créatrice de contenu, l'identité visuelle est primordiale. Fatima a créé un logo et une charte graphique qui représentent parfaitement ma marque. Une collaboration fluide et inspirante !",
    clientName: 'Leila C.',
    clientTitle: 'Blogueuse & Influenceuse',
    clientAvatarUrl: 'https://picsum.photos/seed/t2-client/128/128',
  },
  {
    id: 't3',
    quote: "J'avais besoin de vidéos dynamiques pour mes réseaux sociaux, mais je n'avais ni le temps ni les compétences. Youssef a été incroyable ! Il est rapide, créatif et très professionnel. Je recommande vivement.",
    clientName: 'Mehdi T.',
    clientTitle: 'Coach Sportif',
    clientAvatarUrl: 'https://picsum.photos/seed/t3-client/128/128',
  },
];

export const REVIEWS: Review[] = [
    { id: 'r1', authorName: 'Ibrahim Diallo', authorAvatarUrl: 'https://picsum.photos/seed/r1-author/128/128', rating: 5, comment: 'Excellent travail ! Ayoub est très professionnel, communicatif et a livré un site web impeccable bien avant la date limite. Je referai appel à lui sans hésiter.', date: 'il y a 2 semaines' },
    { id: 'r2', authorName: 'Khadija S.', authorAvatarUrl: 'https://picsum.photos/seed/r2-author/128/128', rating: 5, comment: 'Très satisfait du site web. Le design est moderne et les fonctionnalités correspondent parfaitement à mes attentes.', date: 'il y a 1 mois' },
    { id: 'r3', authorName: 'Moussa Traoré', authorAvatarUrl: 'https://picsum.photos/seed/r3-author/128/128', rating: 4, comment: 'Bonne collaboration dans l\'ensemble. Quelques petits ajustements ont été nécessaires mais le résultat final est de qualité.', date: 'il y a 3 mois' },
];

export const FAQ_ITEMS = [
    {
      q: "Comment MuslimUp garantit-il la sécurité de mon paiement ?",
      a: "Votre paiement est conservé en toute sécurité par MuslimUp dès que vous passez commande. Nous ne transférons les fonds au freelance qu'après que vous ayez confirmé que le travail a été livré à votre entière satisfaction. C'est notre engagement pour une transaction sans risque.",
    },
    {
      q: "Puis-je discuter avec un freelance avant de passer commande ?",
      a: "Absolument. Nous vous encourageons à contacter les freelances pour discuter des détails de votre projet avant de commander. Cela garantit que tout le monde est sur la même longueur d'onde et que le freelance est le bon choix pour vos besoins.",
    },
    {
      q: "Que se passe-t-il si je ne suis pas satisfait du travail livré ?",
      a: "Votre satisfaction est notre priorité. Si le travail ne correspond pas à vos attentes, vous pouvez demander des révisions au vendeur. En cas de désaccord persistant, vous pouvez ouvrir un litige et notre équipe de support client interviendra pour trouver une solution équitable.",
    },
    {
      q: "Est-ce que l'inscription est payante pour les freelances ?",
      a: "Non, l'inscription et la création de services sur MuslimUp sont entièrement gratuites. Nous prélevons une commission de service uniquement sur les commandes terminées, ce qui signifie que vous ne payez que lorsque vous gagnez de l'argent.",
    },
    {
      q: "Quels types de services puis-je trouver sur la plateforme ?",
      a: "Vous can trouver une large gamme de services numériques, tels que le développement web et mobile, le design graphique, la rédaction, la traduction, le montage vidéo, le marketing digital, et bien plus encore. Explorez nos catégories pour découvrir tous les talents disponibles.",
    },
];

export const SELLER_FAQ_ITEMS = [
    {
      q: "Combien ça coûte de vendre sur MuslimUp ?",
      a: "L'inscription et la publication de vos services sont gratuites. Pour assurer le bon fonctionnement et la sécurité de la plateforme, nous prélevons une commission de 20% sur chaque vente. C'est un modèle simple qui nous permet de vous accompagner dans votre succès.",
    },
    {
      q: "Comment suis-je payé ?",
      a: "Une fois qu'une commande est validée par le client, vos revenus sont disponibles sur votre solde MuslimUp. Vous êtes libre de retirer vos fonds quand vous le souhaitez, via nos options de paiement sécurisées.",
    },
    {
      q: "Puis-je fixer mes propres prix ?",
      a: "Absolument. Vous avez un contrôle total sur vos tarifs. Vous pouvez proposer des forfaits de base et ajouter des options supplémentaires pour permettre aux clients de personnaliser leur commande.",
    },
    {
      q: "De quel type de support puis-je bénéficier ?",
      a: "Notre équipe de support est là pour vous aider à chaque étape. Que vous ayez une question sur une commande ou besoin d'aide pour optimiser votre profil, nous sommes à votre disposition pour assurer votre succès sur la plateforme.",
    },
];

export const PROJECTS: Project[] = [
    {
        id: 'p1',
        categoryId: 'dev',
        title: 'Création d\'une boutique en ligne de produits artisanaux',
        description: 'Nous recherchons un développeur pour créer une boutique en ligne simple et élégante sur Shopify ou WooCommerce. Le site devra présenter nos produits, gérer les stocks et intégrer un système de paiement sécurisé. Une bonne connaissance du design et de l\'expérience utilisateur est un plus.',
        budget: { min: 800, max: 1500 },
        postedAt: 'Posté il y a 2 jours',
        proposalsCount: 12,
    },
    {
        id: 'p2',
        categoryId: 'design',
        title: 'Refonte de notre identité visuelle (logo et charte graphique)',
        description: 'Notre association a besoin d\'un coup de jeune ! Nous cherchons un graphiste talentueux pour moderniser notre logo et créer une charte graphique complète (couleurs, typographies, déclinaisons). Le style recherché est épuré, moderne et inspirant confiance.',
        budget: { min: 400, max: 700 },
        postedAt: 'Posté il y a 5 jours',
        proposalsCount: 25,
    },
];