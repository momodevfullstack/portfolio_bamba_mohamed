# Portfolio statique

Site Next.js exporte en fichiers statiques et heberge gratuitement avec GitHub Pages. Le site public ne necessite ni serveur, ni base de donnees, ni compte Supabase.

## Modifier le contenu

- Les projets et leurs descriptions se trouvent dans `src/data/projects.ts`.
- Les images et videos locales se trouvent dans `public/`.
- Les medias associes aux projets sont references dans `src/data/generated/assetMediaMap.ts`.

Apres une modification, pousse les changements sur `main` ou `master` : le workflow GitHub Pages reconstruit et publie automatiquement le site.

## Publication GitHub Pages

1. Dans le depot GitHub, ouvre **Settings > Pages**.
2. Choisis **GitHub Actions** comme source de publication.
3. Pousse le projet sur la branche `main` ou `master`.

Le workflow `.github/workflows/deploy.yml` construit le site avec `npm ci` et `npm run build`, puis publie le dossier `portfolio-clean/out`. Le chemin de base est configure automatiquement pour les depots de projet et les depots `utilisateur.github.io`.

## Developpement local

```bash
npm ci
npm run dev
```

Pour verifier l'export statique :

```bash
npm run build
```

Les fichiers publies sont generes dans `out/`.
