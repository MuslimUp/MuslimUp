# 🚀 Guide de Déploiement - MuslimUp

## ✅ Prérequis

Votre application est maintenant **prête pour le déploiement** avec toutes les fonctionnalités suivantes :

### Fonctionnalités implémentées
- ✅ Authentification complète (email/password)
- ✅ Système de packages multi-niveaux (basic, standard, premium)
- ✅ Gestion complète des commandes avec workflow
- ✅ **Intégration Stripe pour les paiements sécurisés**
- ✅ **Système de retrait pour les vendeurs**
- ✅ Système d'avis et notes
- ✅ Dashboard vendeur avec statistiques
- ✅ Recherche avancée avec filtres
- ✅ Messagerie dans les commandes
- ✅ Notifications
- ✅ Favoris
- ✅ Base de données complète avec RLS

---

## 📋 Configuration Requise

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```env
# Supabase
VITE_SUPABASE_URL=votre_supabase_url
VITE_SUPABASE_ANON_KEY=votre_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=votre_stripe_publishable_key
```

### 2. Secrets Supabase (pour les Edge Functions)

Dans votre dashboard Supabase, configurez ces secrets :

```bash
STRIPE_SECRET_KEY=votre_stripe_secret_key
STRIPE_WEBHOOK_SECRET=votre_stripe_webhook_secret
```

---

## 🔧 Configuration Stripe

### 1. Créer un compte Stripe

1. Allez sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Créez votre compte
3. Activez votre compte (vérification d'identité requise pour production)

### 2. Récupérer les clés API

1. Dans le dashboard Stripe, allez dans **Developers > API keys**
2. Copiez :
   - **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY` (secret Supabase)

### 3. Configurer le webhook

1. Allez dans **Developers > Webhooks**
2. Cliquez sur **Add endpoint**
3. URL du endpoint : `https://votre-projet.supabase.co/functions/v1/stripe-webhook`
4. Événements à écouter :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiez le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 4. Déployer les Edge Functions

Les Edge Functions Stripe sont déjà créées dans `supabase/functions/`. Vous devez les déployer :

```bash
# Via Supabase CLI (si installé)
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook

# Ou via le dashboard Supabase > Edge Functions
# Uploadez les dossiers manuellement
```

**Note:** Les Edge Functions sont déjà prêtes dans votre projet !

---

## 🌐 Déploiement

### Option 1 : Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY

# Redéployer avec les env vars
vercel --prod
```

### Option 2 : Netlify

```bash
# Build
npm run build

# Le dossier dist/ est prêt
# Uploadez-le dans Netlify
# Configurez les variables d'environnement dans Netlify dashboard
```

### Option 3 : Hébergement custom

```bash
npm run build
# Servez le dossier dist/ avec nginx ou Apache
```

---

## 🔐 Configuration de Sécurité

### 1. CORS Supabase

Dans votre dashboard Supabase > Settings > API :
- Ajoutez votre domaine de production dans **Allowed Origins**

### 2. Politiques RLS

✅ Déjà configurées ! Toutes les tables ont :
- Row Level Security activé
- Policies restrictives
- Protection des données utilisateurs

### 3. Vérification email (Optionnel)

Par défaut, la vérification email est désactivée. Pour l'activer :

1. Dashboard Supabase > Authentication > Settings
2. Activez **"Enable email confirmations"**
3. Configurez un template d'email personnalisé

---

## 💰 Gestion des Paiements

### Commission de la plateforme

Actuellement configuré à **20%** sur chaque vente. Pour modifier :

1. Ouvrez `supabase/migrations/`
2. La commission est calculée lors de la création des commandes
3. Vous pouvez ajuster le pourcentage dans le code

### Workflow de paiement

1. **Acheteur** : Passe commande → Paiement via Stripe
2. **Stripe** : Confirme le paiement → Webhook
3. **Système** : Met à jour le statut → Notifie le vendeur
4. **Vendeur** : Livre le service
5. **Acheteur** : Valide la livraison
6. **Vendeur** : Peut demander un retrait

### Retraits vendeurs

- Minimum : 50€
- Méthodes : Virement bancaire, PayPal
- Statuts : Pending → Processing → Completed
- Page dédiée : `/withdrawals` (à ajouter dans la navigation)

---

## 📧 Notifications Email (À configurer)

Pour activer les emails automatiques :

### Via SendGrid (Recommandé)

1. Créez un compte [SendGrid](https://sendgrid.com)
2. Créez une API key
3. Créez une Edge Function pour l'envoi d'emails :

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { to, subject, html } = await req.json()

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "noreply@muslimup.com" },
      subject,
      content: [{ type: "text/html", value: html }]
    })
  })

  return new Response(JSON.stringify({ success: true }))
})
```

### Événements à notifier

- ✉️ Confirmation d'inscription
- ✉️ Nouvelle commande (vendeur)
- ✉️ Paiement confirmé (acheteur + vendeur)
- ✉️ Service livré (acheteur)
- ✉️ Commande validée (vendeur)
- ✉️ Nouvel avis (vendeur)
- ✉️ Retrait traité (vendeur)

---

## 📱 Fonctionnalités Futures

### À implémenter

- [ ] **Messagerie temps réel complète** (Supabase Realtime)
- [ ] **Dashboard admin** (gestion des utilisateurs, services, litiges)
- [ ] **Système de modération** (validation des services avant publication)
- [ ] **Signalement de contenu** (services, avis, utilisateurs)
- [ ] **Système de promotion** (services mis en avant)
- [ ] **Programme d'affiliation**
- [ ] **Application mobile** (React Native)

### Extensions possibles

- 🤝 **Stripe Connect** : Paiements directs aux vendeurs
- 💬 **Chat en direct** : Support client temps réel
- 📊 **Analytics avancés** : Tableaux de bord détaillés
- 🌍 **Multi-langues** : i18n (FR, EN, AR)
- 💎 **Abonnements premium** : Fonctionnalités avancées pour vendeurs

---

## 🧪 Tests Avant Lancement

### Checklist

- [ ] Inscription d'un nouvel utilisateur
- [ ] Connexion
- [ ] Devenir vendeur
- [ ] Créer un service avec 3 packages
- [ ] Passer une commande (avec un 2ème compte)
- [ ] Effectuer un paiement test Stripe
- [ ] Livrer la commande (vendeur)
- [ ] Valider la commande (acheteur)
- [ ] Laisser un avis
- [ ] Demander un retrait (vendeur)
- [ ] Tester la recherche et les filtres
- [ ] Vérifier les notifications

### Mode Test Stripe

Par défaut, Stripe est en mode test. Utilisez ces cartes :

- **Succès** : 4242 4242 4242 4242
- **Échec** : 4000 0000 0000 0002
- Date : Toute date future
- CVC : N'importe quel 3 chiffres

---

## 🎯 Lancement Progressif

### Phase 1 : Beta Testing (Recommandé)

1. **Inviter 10-20 vendeurs de confiance**
2. **Tester le workflow complet**
3. **Collecter les retours**
4. **Ajuster et corriger**

### Phase 2 : Lancement Soft

1. **Ouvrir à 100 premiers vendeurs**
2. **Marketing ciblé**
3. **Support actif**
4. **Monitoring des performances**

### Phase 3 : Lancement Public

1. **Retirer les limites**
2. **Campagne marketing**
3. **Relations presse**
4. **Partenariats**

---

## 📞 Support

### En cas de problème

1. **Logs Supabase** : Dashboard > Logs
2. **Logs Stripe** : Dashboard > Developers > Logs
3. **Logs Vercel/Netlify** : Dans leur dashboard respectif

### Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Stripe](https://stripe.com/docs)
- [Guide Stripe Connect](https://stripe.com/docs/connect) (pour paiements directs)

---

## ✅ Checklist Finale

Avant le lancement :

- [ ] Variables d'environnement configurées
- [ ] Stripe activé et webhooks configurés
- [ ] Edge Functions déployées
- [ ] Tests de paiement effectués
- [ ] CGU/CGV rédigées
- [ ] Politique de confidentialité
- [ ] Mentions légales
- [ ] RGPD compliance
- [ ] Support client prêt
- [ ] Monitoring en place

---

## 🎉 Vous êtes prêt !

Votre plateforme **MuslimUp** est maintenant prête à accueillir ses premiers vendeurs et clients !

**Bon lancement ! 🚀**
