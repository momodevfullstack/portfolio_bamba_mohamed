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
  /** Affiche les videos dans la galerie au lieu du hero. */
  videosInGallery?: boolean;
};

/** Projets publiés avec le site statique. */
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
    id: 'resilience-alpha',
    title: 'Resilience-Alpha — plateforme de paiement résiliente',
    summary:
      'Plateforme fictive de laboratoire qui détecte les incidents, rétablit automatiquement le service et vérifie une transaction de bout en bout.',
    description:
      'Projet d’équipe réalisé dans le cadre du Workshop M2 à l’EPSI. La plateforme simule un service de paiement dans un environnement Docker isolé et démontre une reprise autonome après incident. ' +
      'Un détecteur fondé sur IsolationForest analyse les métriques opérationnelles ; un moteur de remédiation applique des actions autorisées, puis vérifie la santé des services et la réussite d’une nouvelle transaction fictive. ' +
      'Le projet complète cette chaîne par un WAF, une supervision centralisée, un dashboard temps réel, un déploiement durci et un assistant RAG local basé sur les runbooks.',
    stack: [
      'Python',
      'FastAPI',
      'Docker Compose',
      'PostgreSQL',
      'IsolationForest',
      'Prometheus',
      'Grafana',
      'Loki',
      'OWASP CRS',
      'Ansible',
      'SOPS',
      'Ollama',
      'LangChain',
      'ChromaDB',
    ],
    role:
      'Projet d’équipe : intégration d’une chaîne de détection d’anomalies, de remédiation contrôlée et de vérification métier.',
    outcome:
      'La reprise est considérée comme réussie uniquement lorsque les services sont sains et qu’une nouvelle transaction fictive aboutit — pas simplement lorsque le conteneur redémarre.',
    github: 'https://github.com/JCHNT/Workshop-M2',
    videosInGallery: true,
    media: [
      {
        type: 'image',
        src: '/resilience-alpha.svg',
        alt: 'Illustration de la plateforme Resilience-Alpha',
      },
      {
        type: 'video',
        src: '/resilience-alpha/video_1.mp4',
        alt: 'Démonstration vidéo 1 de Resilience-Alpha',
      },
      {
        type: 'video',
        src: '/resilience-alpha/video_2.mp4',
        alt: 'Démonstration vidéo 2 de Resilience-Alpha',
      },
    ],
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
