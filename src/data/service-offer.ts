import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  Database,
  LineChart,
  Monitor,
  Palette,
  Server,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export type ServiceOfferCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  iconShadow?: boolean;
};

export const serviceOfferCards: ServiceOfferCard[] = [
  {
    icon: Monitor,
    title: 'Applications web',
    body: 'Sites et applications avec React / Next.js : performances, SEO et experience utilisateur soignee.',
  },
  {
    icon: Smartphone,
    title: 'Applications mobiles',
    body: 'Applications Flutter sur iOS et Android : navigation fluide, maintenance et evolutions fonctionnelles.',
    iconShadow: true,
  },
  {
    icon: Server,
    title: 'APIs & backend',
    body: 'Services et APIs avec Node.js ou PHP, integration securisee aux bases de donnees et outils tiers.',
    iconShadow: true,
  },
  {
    icon: Database,
    title: 'Data & SQL',
    body: 'Modelisation relationnelle, requetes, preparation et fiabilisation des donnees metier.',
    iconShadow: true,
  },
  {
    icon: Brain,
    title: 'IA & analyse',
    body: 'Experimentation Python (Pandas, scikit-learn), modeles predictifs et lecture de donnees complexes.',
  },
  {
    icon: Palette,
    title: 'UI & experience',
    body: 'Interfaces lisibles, coherence visuelle et accessibilite pour des parcours utilisateur clairs.',
    iconShadow: true,
  },
  {
    icon: LineChart,
    title: 'Produit & pilotage',
    body: 'Specifications, priorisation agile, suivi des indicateurs et outils type CRM / reporting.',
    iconShadow: true,
  },
  {
    icon: ShieldCheck,
    title: 'Qualite & fiabilite',
    body: 'Tests, corrections, stabilisation des parcours et attention aux performances en production.',
    iconShadow: true,
  },
];
