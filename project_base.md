# Prompt Phase 1 — Foundation : Plateforme de négociation de contrats

## Contexte du projet

Je veux construire une web app SaaS B2B pour faciliter la négociation de contrats entre un vendeur et son client, en mettant directement en relation **les avocats des deux parties** sur une plateforme commune.

### Le problème actuel
Aujourd'hui, le processus est lent et fragmenté :
1. Le vendeur démarche le client
2. Une partie fournit son template de contrat (vendeur ou client)
3. L'avocat du vendeur révise → renvoie au vendeur → qui renvoie au client
4. Le client transmet à son avocat → qui re-révise → renvoie au client → qui renvoie au vendeur → qui renvoie à son avocat
5. Cycle qui se répète, avec perte d'information, retards, versions multiples

### La solution
Une plateforme où les deux avocats (vendeur + client) collaborent **directement** sur le contrat, avec :
- Upload de contrats Word et PDF (sans altération de la mise en forme d'origine)
- Édition track changes directement dans le document, fidèle au rendu original
- Visualisation rapide des modifications
- Playbook par cabinet (clauses non-négociables, fallbacks, points de flexibilité)
- Conciliateur IA pour résoudre les conflits entre redlines des deux parties
- Workflow de notification entre avocats

### Acteurs (rôles à modéliser)
- **Vendor Lawyer** (avocat du vendeur)
- **Client Lawyer** (avocat du client)
- **Sales Rep** (le commercial du vendeur — accès limité, suivi statut uniquement)
- **Client Contact** (le contact côté client — accès limité, suivi statut uniquement)
- **Admin** (admin de cabinet, gère le playbook et les utilisateurs)

Une **négociation** appartient à deux organisations (le cabinet vendeur et le cabinet/entreprise client) et regroupe le contrat + ses révisions + l'historique.

---

## Scope de cette Phase 1

**Important** : ceci est la **Phase 1 sur 5** d'un projet plus large. Cette phase pose la fondation. Les phases suivantes ajouteront :
- Phase 2 : Viewer Word/PDF haute fidélité dans le navigateur
- Phase 3 : Track changes / redline collaboratif
- Phase 4 : Playbook engine
- Phase 5 : Conciliateur IA

**Pour la Phase 1, livre uniquement** :
1. Setup complet du projet (stack imposé ci-dessous)
2. Architecture multi-tenant propre
3. Authentification + autorisation par rôle
4. Modèle de données complet (toutes les phases anticipées dans le schema, mais seules les tables Phase 1 sont utilisées)
5. Upload de documents (stockage fichier brut, pas encore de viewer)
6. CRUD des négociations
7. Dashboard de base par rôle
8. Tests de base + documentation

**Ne livre PAS en Phase 1** : le viewer de document, le track changes, le playbook, le conciliateur. Mais **anticipe-les dans l'architecture** (modèle de données, structure de dossiers, points d'extension).

---

## Stack technique imposé

- **Framework** : Next.js 15 avec App Router + Server Components
- **Langage** : TypeScript strict
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **API** : tRPC pour le typage end-to-end
- **Auth** : Auth.js (NextAuth v5) avec multi-tenant — providers email magic link + credentials pour le dev
- **Styling** : Tailwind CSS + shadcn/ui
- **Validation** : Zod
- **Storage fichiers** : abstraction propre — implémenter d'abord en local (filesystem) en dev, mais avec une interface qui permet de swap pour S3/R2 en prod sans réécriture
- **Tests** : Vitest pour unit, Playwright pour e2e (au moins un happy path)
- **Linting** : ESLint + Prettier configurés
- **Package manager** : pnpm

---

## Exigences fonctionnelles Phase 1

### 1. Multi-tenant
- Une **Organization** = un cabinet d'avocats OU une entreprise cliente
- Chaque utilisateur appartient à une organization
- Chaque négociation lie deux organizations (vendor side + client side)
- Isolation stricte des données entre organizations (un user ne voit JAMAIS les données d'une org à laquelle il n'appartient pas)

### 2. Authentification & Rôles
- Login par magic link (email)
- Login credentials uniquement en dev (pour les seeds)
- Middleware qui enforce les rôles sur les routes
- 5 rôles : `VENDOR_LAWYER`, `CLIENT_LAWYER`, `SALES_REP`, `CLIENT_CONTACT`, `ADMIN`
- Les avocats voient et éditent les contrats
- Les rôles non-avocat voient uniquement le statut + les commentaires de leur avocat

### 3. Création de négociation
- Un Sales Rep ou un Vendor Lawyer crée une négociation
- Champs : nom du deal, description, organisation cliente (existante ou à inviter par email), template provider (vendor ou client), deadline cible
- Si la partie cliente n'existe pas encore → invitation par email aux contacts indiqués

### 4. Upload de documents
- Drag & drop d'un fichier .docx ou .pdf
- Validation du type MIME (réelle, pas juste l'extension)
- Limite de taille (configurable, défaut 25 MB)
- Stockage via l'abstraction `StorageProvider` (interface)
- Hash SHA-256 du fichier pour intégrité
- Versioning : chaque upload crée une nouvelle `DocumentVersion` liée au `Document` parent
- En Phase 1 : on stocke et on permet le download. Pas de viewer encore.

### 5. Modèle de données (Prisma schema)

Anticipe TOUTES les phases. Les tables non utilisées en Phase 1 sont créées mais peuvent rester vides. Inclus au minimum :

- `Organization` (cabinet ou entreprise cliente, avec un type)
- `User` (avec role, organizationId)
- `Negotiation` (deal entre deux orgs, statut, deadline, etc.)
- `NegotiationParticipant` (lien user ↔ negotiation avec rôle dans la négo)
- `Document` (entité logique du contrat)
- `DocumentVersion` (chaque upload, avec uploaderId, hash, mimeType, storageKey, createdAt)
- `Redline` (Phase 3 — anticiper : type de modif, position, auteur, statut accept/reject/pending)
- `Comment` (sur un document ou un redline)
- `Playbook` (Phase 4 — appartient à une org)
- `PlaybookRule` (Phase 4 — clause type, criticité non-négo/fallback/flex, texte alternatif)
- `ConciliationRequest` (Phase 5 — déclenché par un avocat sur un set de redlines)
- `ConciliationProposal` (Phase 5 — propositions générées, statut accepté/rejeté/modifié)
- `AuditLog` (toute action sensible : qui a fait quoi quand)
- `Notification` (in-app + email)

Documente chaque modèle avec un commentaire en haut expliquant son rôle et sa phase.

### 6. Dashboard
- Liste des négociations de l'utilisateur, filtrable par statut
- Détail d'une négociation : participants, documents (liste des versions, download), historique d'actions
- Bouton "Upload nouvelle version" pour les avocats
- Vue différente selon le rôle (avocat vs commercial vs client)

### 7. Notifications (Phase 1 : in-app seulement, email à anticiper)
- Quand une nouvelle version est uploadée → notif à l'avocat de l'autre partie
- Stockée en DB, affichée dans la UI (cloche en header)
- Anticipe une couche d'envoi email (interface `Notifier`) sans l'implémenter — juste un stub qui log

### 8. Audit trail
- Toute action critique loggée dans `AuditLog` : login, upload, création de négo, etc.
- Visible par les admins de l'org

---

## Exigences non-fonctionnelles

- **Type safety** : TypeScript strict, pas de `any` sauf justification documentée
- **Sécurité** :
  - Toutes les routes tRPC vérifient l'auth + l'autorisation par rôle ET par appartenance à l'organization
  - CSRF géré par Auth.js
  - Rate limiting sur les endpoints sensibles (login, upload)
  - Sanitization de tous les inputs
  - Pas de secrets dans le code, tout en `.env.example`
- **Architecture** :
  - Séparation claire `app/` (routes Next), `server/` (logique métier, tRPC routers, services), `lib/` (utils, abstractions storage/notifier), `prisma/`
  - Services métier découplés des routers tRPC (les routers appellent des services, ne contiennent pas de logique)
- **Documentation** :
  - `README.md` complet : prérequis, install, run en dev, run tests, structure du projet
  - `ARCHITECTURE.md` : décisions techniques + diagramme texte de l'architecture + roadmap des phases
  - `CONTEXT.md` : résumé de l'état du projet à la fin de la Phase 1, à donner en input à la Phase 2
- **DX** :
  - `pnpm dev` lance tout (Next + Postgres en docker-compose)
  - `pnpm db:seed` crée des données de test (2 organizations, 4 users, 1 négociation, 2 documents)
  - `docker-compose.yml` pour Postgres en local

---

## Livrables attendus à la fin de la Phase 1

1. Code source complet du projet, qui run avec `pnpm install && docker-compose up -d && pnpm db:migrate && pnpm db:seed && pnpm dev`
2. README, ARCHITECTURE, CONTEXT — les trois fichiers
3. Au moins 1 test e2e Playwright (login + création de négo + upload de document) qui passe
4. Tests unitaires sur les services critiques (auth, autorisation, upload)
5. À la fin, un récap de ce qui a été fait + recommandations explicites pour la Phase 2 (notamment : ta recommandation entre OnlyOffice Document Server, Collabora Online, ou autre solution pour le viewer fidèle Word/PDF avec track changes natif — argumente avec trade-offs)

---

## Méthode de travail attendue

1. **Avant de coder**, présente-moi :
   - Ton plan d'attaque de la Phase 1 en étapes
   - Le schema Prisma complet (toutes les phases anticipées)
   - L'arborescence du projet
   - Tes choix sur les points où j'ai laissé de la marge
   - Tes questions s'il y en a

2. **Attends ma validation** avant de commencer l'implémentation

3. **Pendant l'implémentation** : commits fréquents avec messages clairs, par étape logique

4. **À la fin** : démo des features, run des tests, récap + recommandations Phase 2

---

## Question importante sur la Phase 2

Dans ton récap final, je veux ta recommandation argumentée sur l'approche pour le viewer + track changes (Phase 2 et 3). Mes critères :
- **Fidélité visuelle parfaite** au document Word/PDF original (pas d'extraction texte qui perd la mise en forme)
- Track changes nativement supporté (idéalement compatible avec le track changes Word natif)
- Open-source ou licence acceptable pour un SaaS B2B
- Self-hostable

Compare au minimum : **OnlyOffice Document Server**, **Collabora Online (LibreOffice)**, et toute autre option pertinente que tu identifies. Ne te limite pas à mes suggestions si tu connais mieux.
