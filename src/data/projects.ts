import { mediaFromAssetFolder } from '@/lib/projectMediaFromAssets';

export type ProjectMedia = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster?: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  role: string;
  outcome: string;
  github?: string;
  demo?: string;
  media: ProjectMedia[];
  /** Affiche en tete des listes (accueil, portfolio). */
  spotlight?: boolean;
  /** Badge « en cours » + message discret sur la fiche. */
  inProgress?: boolean;
};

/** Fallback si Supabase n'est pas configure ou sans donnees. */
export const staticProjectsFallback: Project[] = [
  {
    id: 'mobile-expo-app',
    spotlight: true,
    inProgress: true,
    title: 'Application mobile (projet personnel)',
    summary: 'Projet en cours — apercu technique uniquement, sans detail fonctionnel public.',
    description:
      'Application mobile realisee avec React Native et Expo. Le perimetre metier et les parcours utilisateur ne sont pas decrits ici (projet personnel, volontairement peu documente pour limiter la copie).',
    stack: ['React Native', 'Expo'],
    role: 'Developpement mobile (ecrans, navigation, etat applicatif).',
    outcome: 'Travail iteratif en cours ; objectif de stabilisation puis diffusion quand le produit sera pret.',
    media: mediaFromAssetFolder('app_mobile', {
      video: 'Apercu video application mobile',
    }),
  },
  {
    id: 'site-mariage-1',
    title: 'Site mariage — presentation & RSVP',
    summary: 'Site vitrine pour un mariage : informations, programme et reponse en ligne.',
    description:
      "Site web dedie au mariage : accueil soignee, details du lieu et du deroule, galerie et formulaire pour confirmer sa presence. " +
      "Interface realisee avec React et Tailwind CSS ; une API Node.js gere les soumissions et la logique cote serveur.",
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    role: 'Developpement front (composants, mise en page responsive), integration avec le backend Node.js.',
    outcome: "Les invites retrouvent toutes les infos au meme endroit et peuvent repondre sans friction.",
    media: mediaFromAssetFolder('site_mariage_1', {
      video: 'Apercu video du site mariage',
      imageAlts: [
        "Page d'accueil du site mariage",
        'Section informations et programme',
        'Formulaire ou page complementaire',
      ],
    }),
  },
  {
    id: 'vodason-compagn',
    title: 'Vadason — site vitrine',
    summary: "Site web pour presenter l'activite, les services et rassurer les clients.",
    description:
      'Pages structurees, identite visuelle coherente et formulaire de contact. ' +
      'Realise avec React et Tailwind CSS, avec des endpoints Node.js pour les envois et la logique metier.',
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    role: 'Integration maquettes, composants reutilisables, responsive et branchement API.',
    outcome: 'Image professionnelle en ligne et parcours visiteur clarifie.',
    media: mediaFromAssetFolder('vodason_compagn', {
      video: 'Presentation video du site Vadason',
      imageAlts: [
        'Vue accueil ou hero',
        'Section services ou contenu',
        'Detail supplementaire',
        'Contact ou pied de page',
      ],
    }),
  },
  {
    id: 'site-esct',
    title: 'ESCT Abidjan — formation professionnelle et diplômante',
    summary:
      'Formations professionnelles diplômantes et certifiantes à Abidjan : BTP, informatique, gestion et autres filières.',
    description:
      'ESCT Abidjan met en avant ses parcours de formation et facilite la prise de contact des futurs apprenants. ' +
      'Le site présente les filières (BTP, informatique, gestion, etc.), les dispositifs diplômants et certifiants, et l\'offre locale à Abidjan. ' +
      'Réalisé avec React et Tailwind CSS pour une interface responsive ; Node.js pour la partie serveur (API, formulaires, logique métier).',
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    role: 'Developpement des pages et composants, mise en page responsive, integration avec le backend Node.js.',
    outcome:
      'Visibilite renforcee pour l\'ecole, parcours visiteur oriente vers l\'information sur les formations et la conversion.',
    demo: 'https://esct-ci.com',
    media: mediaFromAssetFolder('esct', {
      video: 'Apercu video du site ESCT Abidjan',
      imageAlts: [
        'Accueil — ESCT Abidjan',
        'Formations et filieres',
        'Contenu pedagogique ou detail',
        'Contact ou informations pratiques',
      ],
    }),
  },
  {
    id: 'recruitment-dashboard',
    title: 'Recruitment Dashboard',
    summary: 'Plateforme web de suivi candidats et pipeline RH.',
    description:
      "Application web pour centraliser les candidatures, les etapes du processus (sourcing, entretiens, offre) et les indicateurs cles pour l'equipe RH. " +
      "Les recruteurs filtrent et trient les profils en temps reel, mettent a jour le statut d'un candidat et visualisent le funnel sans tableurs. " +
      "L'interface est construite avec Next.js et Tailwind ; Supabase assure l'auth, les donnees et les politiques d'acces.",
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
    role: 'Conception UI, composants et flux (liste, fiche candidat, vues pipeline), integration API et etats de chargement.',
    outcome:
      "Pipeline lisible pour toute l'equipe, moins de copies manuelles entre outils, et base pour des exports ou tableaux de bord plus pousses.",
    media: [
      {
        type: 'video',
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        alt: 'Parcours du dashboard de recrutement',
      },
      { type: 'image', src: '/photo_profile.png', alt: "Vue d'ensemble du tableau de bord recrutement" },
      { type: 'image', src: '/photo_profile.png', alt: 'Detail du pipeline et des etapes candidat' },
    ],
  },
  {
    id: 'ai-support-assistant',
    title: 'AI Support Assistant',
    summary: 'Assistant IA pour qualification des demandes clients.',
    description:
      "Integration d'un assistant conversationnel pour orienter les demandes et preparer des reponses pertinentes.",
    stack: ['Next.js', 'Python', 'OpenAI API', 'Redis'],
    role: 'AI engineer',
    outcome: 'Acceleration du traitement et meilleure qualite des reponses.',
    media: [
      {
        type: 'video',
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        alt: "Conversation avec l'assistant support",
      },
      { type: 'image', src: '/photo_profile.png', alt: 'Interface assistant IA' },
    ],
  },
];

export function getStaticProjectBySlug(slug: string) {
  return staticProjectsFallback.find((project) => project.id === slug);
}

/** Spotlight en premier (fallback statique). */
export function getStaticOrderedProjects(): Project[] {
  const spot = staticProjectsFallback.filter((p) => p.spotlight);
  const rest = staticProjectsFallback.filter((p) => !p.spotlight);
  return [...spot, ...rest];
}
