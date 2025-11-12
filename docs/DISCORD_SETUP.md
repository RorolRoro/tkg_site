# Configuration Discord pour l'Organigramme

Ce guide vous explique comment configurer l'intégration Discord pour que l'organigramme affiche les vrais pseudos des membres du staff.

## 🎯 Objectif

Actuellement, l'organigramme affiche des pseudos mockés comme "Owner 1", "Owner 2", etc. Avec la configuration Discord, il affichera les vrais pseudos des membres du serveur.

## 📋 Prérequis

1. **Accès administrateur** au serveur Discord Tokyo Ghoul RP
2. **Accès développeur Discord** pour créer un bot
3. **Accès au serveur** où déployer l'application

## 🤖 Étape 1 : Créer un Bot Discord

1. **Aller sur le portail développeur Discord**
   - Visitez [https://discord.com/developers/applications](https://discord.com/developers/applications)
   - Connectez-vous avec votre compte Discord

2. **Créer une nouvelle application**
   - Cliquez sur "New Application"
   - Nom : "Tokyo Ghoul RP - Organigramme"
   - Description : "Bot pour gérer l'organigramme du staff"

3. **Créer le bot**
   - Allez dans l'onglet "Bot"
   - Cliquez sur "Add Bot"
   - Notez le **Token** (gardez-le secret !)

4. **Configurer les permissions**
   - Dans "Privileged Gateway Intents", activez :
     - ✅ Server Members Intent
     - ✅ Presence Intent (optionnel)

## 🔗 Étape 2 : Inviter le Bot sur le Serveur

1. **Générer le lien d'invitation**
   - Allez dans l'onglet "OAuth2" > "URL Generator"
   - Scopes : ✅ `bot`
   - Bot Permissions :
     - ✅ View Channels
     - ✅ Read Message History
     - ✅ View Server Members (important !)

2. **Inviter le bot**
   - Copiez l'URL générée
   - Ouvrez-la dans votre navigateur
   - Sélectionnez le serveur "Tokyo Ghoul RP"
   - Autorisez toutes les permissions

## ⚙️ Étape 3 : Configuration de l'Application

1. **Ajouter les variables d'environnement**
   
   Créez ou modifiez votre fichier `.env.local` :
   ```env
   # Discord Bot Configuration
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_SERVER_ID=1332323284825411658
   
   # Autres variables existantes...
   DISCORD_CLIENT_ID=your_discord_client_id_here
   DISCORD_CLIENT_SECRET=your_discord_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key_here
   DATABASE_URL="file:./dev.db"
   ```

2. **Récupérer l'ID du serveur**
   - Dans Discord, activez le mode développeur (Paramètres > Avancé > Mode développeur)
   - Clic droit sur le nom du serveur > "Copier l'ID"
   - L'ID est déjà configuré : `1332323284825411658`

## 🧪 Étape 4 : Test de la Configuration

1. **Démarrer l'application**
   ```bash
   npm run dev
   ```

2. **Tester la connexion**
   - Allez sur `/debug/discord`
   - Cliquez sur "Tester la connexion Discord"
   - Vérifiez que vous voyez les vrais pseudos

3. **Vérifier l'organigramme**
   - Allez sur `/staff/organigramme`
   - Les pseudos doivent maintenant être réels

## 🔍 Dépannage

### Problème : "Token Discord non configuré"
- ✅ Vérifiez que `DISCORD_BOT_TOKEN` est dans votre `.env.local`
- ✅ Redémarrez l'application après modification du `.env`

### Problème : "Erreur API Discord: 403"
- ✅ Vérifiez que le bot a la permission "View Server Members"
- ✅ Vérifiez que le bot est bien sur le serveur
- ✅ Vérifiez que le token est correct

### Problème : "Erreur API Discord: 401"
- ✅ Vérifiez que le token du bot est valide
- ✅ Régénérez le token si nécessaire

### Problème : Aucun membre trouvé
- ✅ Vérifiez que les membres ont bien les rôles staff
- ✅ Vérifiez que l'ID du serveur est correct

## 📊 Rôles Discord Configurés

L'application recherche les membres avec ces rôles :

| Rôle | ID Discord | Niveau |
|------|------------|--------|
| Owner | `1332323285303558147` | Owner |
| Responsable RP | `1386374837404176417` | Haut Staff+ |
| Administrateur | `1332323285278654473` | Haut Staff+ |
| Gérant Modération | `1385724637337485362` | Haut Staff |
| Gérant MJ | `1332323285278654470` | Haut Staff |
| Gérant Animation | `1332323285278654469` | Haut Staff |
| Gérant Équilibrage | `1386709386017247254` | Haut Staff |
| Modérateur | `1332323285278654465` | Staff |
| Animateur | `1332323285278654464` | Staff |
| Maître du Jeu | `1332323285249298472` | Staff |

## 🔒 Sécurité

- ⚠️ **Ne jamais commiter le token Discord** dans le code
- ⚠️ **Garder le token secret** et le régénérer si compromis
- ⚠️ **Limiter les permissions** du bot au minimum nécessaire
- ⚠️ **Surveiller l'utilisation** du bot

## 📈 Fonctionnalités Avancées

Une fois configuré, vous pourrez :

- ✅ **Voir les vrais pseudos** des membres du staff
- ✅ **Synchroniser automatiquement** avec Discord
- ✅ **Voir les avatars** réels des membres
- ✅ **Détecter les changements** de rôles automatiquement

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de l'application
2. Testez avec `/debug/discord`
3. Vérifiez la configuration du bot Discord
4. Contactez l'équipe technique

---

**Note** : Sans cette configuration, l'organigramme fonctionnera en mode démo avec des données mockées.
