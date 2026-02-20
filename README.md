# NordItalie Planner (Nuxt Micro-SaaS)

Micro-SaaS Nuxt 4 pour generer un itineraire optimise dans le nord de l Italie:
- spots les plus beaux
- arbitrage beaute / cout
- estimation budget jour et total
- sauvegarde locale des preferences

## Stack

- Nuxt 4 + TypeScript
- Nuxt UI 4 + Tailwind CSS 4
- Pinia (`@pinia/nuxt`) pour l etat
- VueUse (`@vueuse/nuxt`) pour la persistence locale
- i18n (`@nuxtjs/i18n`) pret pour FR/EN

## Lancer en local

```bash
npm install
npm run dev
```

## Qualite

```bash
npm run typecheck
npm run build
```

## Deploy Vercel

```bash
vercel
vercel --prod -y
```
