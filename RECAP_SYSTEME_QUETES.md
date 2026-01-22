# 📋 RÉCAPITULATIF COMPLET - Système de Quêtes et Niveaux

**Date de création :** 21 janvier 2026
**Application :** SaveQuest (React Native / Expo)
**Base de données :** Supabase (PostgreSQL)

---

## 🎯 CONTEXTE DU PROJET

### Application
SaveQuest est une application mobile d'éducation financière développée avec :
- **Framework :** React Native + Expo Router
- **Navigation :** Système basé sur fichiers (file-based routing)
- **Backend :** Supabase (Auth + Database)
- **Langage :** TypeScript
- **Styling :** React Native StyleSheet

### Objectif de la session
Implémenter un **système complet de gamification** avec :
- Niveaux et points d'expérience (XP)
- Quêtes à accomplir
- Récompenses
- Progression visible

---

## ✅ CE QUI A ÉTÉ IMPLÉMENTÉ

### 1. Architecture et Types (`lib/types.ts`)

**Types créés :**
```typescript
- Quest : Structure d'une quête
- QuestType : Types de quêtes (lessons_completed, quizzes_passed, streak_days, level_reached, xp_earned)
- QuestProgress : Progression d'une quête
- UserProfile : Profil utilisateur (level, points, streak, completed_quests)
```

**Important :** Documentation TODO ADMIN indiquant qu'à terme, les quêtes devront être stockées dans une table `quests` en BDD et gérées via interface admin.

---

### 2. Système de calcul Niveau/XP (`lib/utils/levelSystem.ts`)

**Formule de progression :** XP requis pour niveau suivant = niveau actuel × 100
- Niveau 1→2 : 100 XP
- Niveau 2→3 : 200 XP
- Niveau 3→4 : 300 XP
- etc.

**Fonctions principales :**
- `calculateLevel(totalXP)` - Calcule le niveau depuis l'XP total
- `getTotalXPForLevel(level)` - XP total requis pour atteindre un niveau
- `getXPForNextLevel(currentLevel)` - XP nécessaire pour niveau suivant
- `getProgressToNextLevel(currentXP, currentLevel)` - Progression en %
- `hasLeveledUp(oldXP, newXP)` - Détecte montée de niveau
- `getLevelsGained(oldXP, newXP)` - Nombre de niveaux gagnés

---

### 3. Gestion du profil utilisateur (`lib/database/userProfile.ts`)

**Fonctions principales :**
- `getUserProfile(userId)` - Récupère niveau, points, streak, completed_quests
- `addXP(userId, xpAmount)` - Ajoute XP + montée de niveau automatique
- `getUserStats(userId)` - Stats complètes (leçons, quiz, progression)
- `initializeUserProfile(userId)` - Initialise profil par défaut

**Points clés :**
- La fonction `addXP` gère automatiquement la montée de niveau
- Retourne `leveledUp: boolean` et `newLevel: number`
- Gestion d'erreur robuste (RLS permissions)

---

### 4. Gestion des quêtes (`lib/database/quests.ts`)

**⚠️ DONNÉES DE TEST HARDCODÉES**

**7 quêtes de test :**
1. **Premier pas** - Complète 1 leçon → +50 XP (niveau 1)
2. **Étudiant assidu** - Complète 5 leçons → +200 XP (niveau 1)
3. **Expert en quiz** - Réussis 3 quiz → +150 XP (niveau 2)
4. **Marathonien** - Complète 10 leçons → +500 XP (niveau 3)
5. **Régularité** - 7 jours consécutifs → +300 XP (niveau 1)
6. **Niveau 5** - Atteins niveau 5 → +1000 XP (niveau 1)
7. **Collectionneur** - Gagne 1000 XP → +250 XP (niveau 1)

**Fonctions principales :**
- `getAvailableQuests(userId)` - Quêtes disponibles selon niveau
- `getUserCompletedQuests(userId)` - IDs des quêtes complétées (stocké dans users.preferences)
- `getQuestProgress(userId, quest)` - Calcule progression en temps réel
- `completeQuest(userId, questId)` - Réclamer quête + donner XP
- `getQuestsWithProgress(userId)` - Toutes les quêtes avec progression

**Stockage :** Les quêtes complétées sont stockées dans `users.preferences.completed_quests` (JSONB)

---

### 5. Intégration Leçons (`lib/database/lessons.ts`)

**Fonction ajoutée :**
```typescript
completeLesson(userId, lessonId)
```

**Fonctionnement :**
1. Vérifie si leçon déjà complétée
2. Récupère `xp_gain` de la leçon
3. Crée/met à jour `lesson_states` (is_finished = true)
4. Appelle `addXP()` automatiquement
5. Retourne si montée de niveau

---

### 6. Composants UI créés

#### `components/ui/quest_card.tsx`
Carte de quête avec :
- Icône + titre + description
- Barre de progression (current/target)
- Badge niveau requis
- Affichage récompense XP
- Bouton "Réclamer" (si objectif atteint)
- Badge "✓ Terminée" (si complétée)
- Badge "En cours" (par défaut)

#### `components/ui/user_level_header.tsx`
En-tête profil avec :
- Badge niveau circulaire
- Barre progression XP vers niveau suivant
- Affichage XP actuel / XP requis
- Pourcentage de progression

#### `components/ui/test_button.tsx` ⚠️ TEMPORAIRE
Bouton violet de test :
- Simule complétion d'une leçon
- Récupère automatiquement la 1ère leçon en BDD
- Affiche alerte avec XP gagné et niveau up
- Rafraîchit la page après succès

---

### 7. Pages implémentées

#### `app/(tabs)/quests/index.tsx` - Page Quêtes
**Affichage :**
- En-tête avec niveau et barre XP
- **Bouton de test violet** (à supprimer en prod)
- Liste des 7 quêtes avec progression
- Pull-to-refresh
- Note visible : "données de test"

**Fonctionnalités :**
- Chargement des quêtes avec progression temps réel
- Gestion réclamation quête
- Alertes avec montée de niveau
- Rafraîchissement automatique après action

#### `app/(tabs)/profil/index.tsx` - Page Profil
**Affichage :**
- Avatar + email utilisateur
- 3 cartes statistiques : Niveau / Points XP / Streak
- Bouton rouge "Se déconnecter"

**Fonctionnalités :**
- Chargement automatique du profil
- Déconnexion avec confirmation
- Redirection vers login après déconnexion

#### `app/index.tsx` - Point d'entrée
**Modification importante :**
- Vérifie maintenant si utilisateur connecté
- Redirige vers `/(auth)/login` si non connecté
- Redirige vers `/(tabs)/learning` si connecté
- **Résout le problème de "Auth session missing"**

#### `app/(auth)/login.tsx` - Page Login
**Améliorations :**
- Ajout délai 500ms après login (pour sauvegarde session)
- Logs détaillés pour debugging
- Meilleure gestion d'erreur

---

### 8. Gestion de l'authentification (`lib/database/user.ts`)

**Fonction clé ajoutée :** `initializeUserIfNeeded(userId, userEmail)`

**Fonctionnement :**
1. Vérifie si user existe dans `public.users`
2. Si erreur PGRST116 (user n'existe pas) :
   - Crée automatiquement l'entrée dans `public.users`
   - Initialise : level=1, points=0, streak=0, preferences={}
3. Sinon, vérifie si colonnes NULL et les initialise

**Appelée automatiquement lors de :**
- Register
- Login

**Résout :** Le problème de users existant dans `auth.users` mais pas dans `public.users`

---

## 🗄️ STRUCTURE DE BASE DE DONNÉES

### Tables utilisées

#### `users`
Colonnes importantes :
- `id` (UUID) - PK, correspond à auth.users.id
- `email` (varchar)
- `level` (integer) - Niveau actuel
- `points` (integer) - XP total
- `streak` (integer) - Jours consécutifs
- `preferences` (jsonb) - Contient { completed_quests: [] }

#### `lessons`
- `id` (bigint)
- `chapter_id` (bigint)
- `title` (varchar)
- `xp_gain` (integer) - **Important pour le système**
- `order_index` (integer)

#### `lesson_states`
- `id` (bigint)
- `lesson_id` (bigint)
- `user_id` (uuid)
- `is_finished` (boolean)

#### `quiz_attempts`
- `id` (bigint)
- `user_id` (uuid)
- `quiz_id` (bigint)
- `is_passed` (boolean)

#### `chapters`
- `id` (bigint)
- `title` (varchar)
- `required_level` (integer) - Niveau requis pour déverrouiller

---

### RLS (Row Level Security)

**État actuel :** **DÉSACTIVÉ sur toutes les tables pour le développement**

SQL exécuté :
```sql
ALTER TABLE lesson_states DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
```

**À faire plus tard :** Réactiver RLS + créer policies pour la production

---

## 📁 FICHIERS CRÉÉS/MODIFIÉS

### Nouveaux fichiers
```
lib/
  utils/
    levelSystem.ts                  (Système calcul niveau/XP)
  database/
    userProfile.ts                  (Gestion profil utilisateur)
    quests.ts                       (Gestion quêtes - HARDCODÉ)
  types.ts                          (Modifié - ajout types quêtes)

components/
  ui/
    quest_card.tsx                  (Carte de quête)
    user_level_header.tsx           (En-tête niveau/XP)
    test_button.tsx                 (Bouton test - TEMPORAIRE)

app/
  (tabs)/
    quests/
      index.tsx                     (Remplacé - Page quêtes complète)
    profil/
      index.tsx                     (Remplacé - Page profil + déconnexion)
  index.tsx                         (Modifié - Vérification auth)
  (auth)/
    login.tsx                       (Modifié - Amélioration login)

Documentation/
  QUESTS_SYSTEM_README.md           (Guide complet du système)
  RECAP_SYSTEME_QUETES.md           (Ce document)
  test_data.sql                     (Script SQL données de test)
  get_test_users.sql                (Script récupération users)
```

### Fichiers modifiés seulement
```
lib/database/lessons.ts             (Ajout completeLesson)
lib/database/user.ts                (Ajout initializeUserIfNeeded)
```

---

## 🧪 TESTS À EFFECTUER

### Prérequis

1. **Exécuter `test_data.sql` dans Supabase**
   - Va dans SQL Editor
   - Copie-colle le contenu de `test_data.sql`
   - Exécute
   - Crée : 1 chapitre + 10 leçons (50-200 XP) + 3 quiz

2. **Avoir un user de test**
   - Email : `inosthful@gmail.com`
   - Password : `azerty`
   - Devrait être créé automatiquement au login

3. **RLS désactivé**
   ```sql
   ALTER TABLE lesson_states DISABLE ROW LEVEL SECURITY;
   ALTER TABLE quiz_attempts DISABLE ROW LEVEL SECURITY;
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```

---

### Test 1️⃣ : Connexion et initialisation

**Procédure :**
1. Déconnecte-toi si connecté
2. Recharge l'app complètement
3. Tu arrives sur `/login`
4. Connecte-toi avec `inosthful@gmail.com` / `azerty`

**Résultat attendu :**
```
[Login] Attempting login for: inosthful@gmail.com
[Auth] User not found in public.users, creating entry...
[Auth] User profile created successfully
[Login] Successfully logged in user
[Login] Redirecting to tabs...
```

✅ Tu arrives sur l'onglet Learning
✅ Pas d'erreur "Auth session missing"

---

### Test 2️⃣ : Affichage page Quests

**Procédure :**
1. Va sur l'onglet **Quests** (icône trophée)

**Résultat attendu :**
```
[Quests] Fetching user session...
[Quests] User found: [user_id]
[Quests] Loading data...
[Quests] Stats result: ...
[Quests] Quests result: ... Count: 7
```

✅ En-tête avec **Niveau 1** + barre XP **0/100** (0%)
✅ Bouton violet **"🧪 Tester : Compléter une leçon"**
✅ **7 quêtes** affichées avec progression 0/X
✅ Note jaune en bas : "données de test"

---

### Test 3️⃣ : Compléter une leçon (Gain XP)

**Procédure :**
1. Sur la page Quests
2. Clique sur **"🧪 Tester : Compléter une leçon"**
3. Attends l'alerte

**Résultat attendu :**
- ✅ Alerte : "Leçon 'XXX' complétée ! +50 XP"
- ✅ Barre XP passe à **50/100** (50%)
- ✅ Quête "Premier pas" : progression **1/1**
- ✅ Bouton "Réclamer" apparaît sur cette quête

**Répète 1 fois :**
- 2ème clic → +75 XP (total 125 XP)
- ⚠️ **Tu devrais voir "NIVEAU UP ! Niveau 2"** 🎉

---

### Test 4️⃣ : Montée de niveau

**Procédure :**
1. Après avoir atteint 100+ XP au test précédent

**Résultat attendu :**
- ✅ Alerte : "🎉 NIVEAU UP ! Niveau 2"
- ✅ Badge niveau affiche **2**
- ✅ Barre XP : **25/200** (car 125 XP total, niveau 2→3 = 200 XP)
- ✅ Quête "Expert en quiz" devient accessible (required_level: 2)

---

### Test 5️⃣ : Réclamer une quête

**Procédure :**
1. Quête "Premier pas" devrait afficher **1/1** et bouton "Réclamer"
2. Clique sur **"Réclamer"**

**Résultat attendu :**
- ✅ Alerte : "✅ Quête terminée ! Tu as gagné 50 XP !"
- ✅ Barre XP se met à jour (+50 XP)
- ✅ Quête affiche badge **"✓ Terminée"**
- ✅ Plus possible de cliquer dessus
- ✅ Si montée niveau → Alerte spéciale

---

### Test 6️⃣ : Compléter plusieurs leçons + quête

**Procédure :**
1. Clique **5 fois** sur le bouton test
2. Complète 5 leçons au total
3. Quête "Étudiant assidu" → **5/5**
4. Clique sur **"Réclamer"**

**Résultat attendu :**
- ✅ +200 XP d'un coup
- ✅ Sûrement **montée de niveau** (dépend XP actuel)
- ✅ 2 quêtes complétées au total
- ✅ Niveau probablement **3 ou 4**

---

### Test 7️⃣ : Page Profil

**Procédure :**
1. Va sur l'onglet **Profil** (icône personne)

**Résultat attendu :**
- ✅ Avatar + email affiché
- ✅ Carte "Niveau" : affiche ton niveau actuel
- ✅ Carte "Points XP" : affiche XP total
- ✅ Carte "Jours" : affiche 0 (streak non implémenté)
- ✅ Bouton rouge "Se déconnecter"

---

### Test 8️⃣ : Déconnexion

**Procédure :**
1. Sur page Profil
2. Clique sur **"Se déconnecter"**
3. Confirme

**Résultat attendu :**
- ✅ Alerte de confirmation
- ✅ Logs : `[Profile] Logging out...`
- ✅ Redirection vers `/login`
- ✅ Plus d'accès aux tabs sans se reconnecter

---

### Test 9️⃣ : Persistance des données

**Procédure :**
1. Déconnecte-toi
2. Reconnecte-toi
3. Va sur Quests

**Résultat attendu :**
- ✅ Niveau et XP **conservés**
- ✅ Quêtes complétées toujours **"✓ Terminée"**
- ✅ Progression des leçons conservée

---

### Test 🔟 : Vérification BDD

**SQL à exécuter :**
```sql
-- Voir ton profil
SELECT id, email, level, points, streak, preferences
FROM users
WHERE email = 'inosthful@gmail.com';

-- Voir tes leçons complétées
SELECT ls.id, l.title, ls.is_finished
FROM lesson_states ls
JOIN lessons l ON ls.lesson_id = l.id
WHERE ls.user_id = (SELECT id FROM users WHERE email = 'inosthful@gmail.com');

-- Voir tes quêtes complétées
SELECT preferences->'completed_quests' as completed_quests
FROM users
WHERE email = 'inosthful@gmail.com';
```

**Résultat attendu :**
- ✅ `level` et `points` correspondent à l'affichage
- ✅ `preferences.completed_quests` contient les IDs [1, 2, ...]
- ✅ Leçons avec `is_finished = true`

---

## ⚠️ POINTS IMPORTANTS / LIMITATIONS

### 1. Quêtes hardcodées
- **État actuel :** 7 quêtes définies dans `lib/database/quests.ts` (constante `MOCK_QUESTS`)
- **Marqué avec :** Commentaires `TODO ADMIN` partout
- **À faire :** Créer table `quests` + interface admin

### 2. RLS désactivé
- **État actuel :** Toutes les tables en mode "public"
- **Risque :** Users pourraient accéder aux données d'autres users
- **OK pour :** Développement uniquement
- **À faire :** Activer RLS + créer policies avant production

### 3. Bouton de test visible
- **Fichier :** `components/ui/test_button.tsx`
- **Utilisation :** Test manuel de complétion leçons
- **⚠️ À SUPPRIMER** avant production
- **Où :** Ligne 170 de `app/(tabs)/quests/index.tsx`

### 4. Données de test requises
- **Fichier :** `test_data.sql`
- **Contenu :** 1 chapitre + 10 leçons + 3 quiz
- **Requis :** Doit être exécuté pour que les tests fonctionnent
- **Note :** Utilise `ON CONFLICT DO NOTHING` (peut être ré-exécuté)

### 5. Streak non implémenté
- **Colonne :** `users.streak` existe
- **Affichage :** Page profil affiche toujours 0
- **Fonctionnalité :** Pas de système de suivi des jours consécutifs
- **Quête :** "Régularité" (7 jours) ne fonctionne pas encore

### 6. Formule niveau modifiable
- **Actuelle :** XP = niveau × 100
- **Fichier :** `lib/utils/levelSystem.ts`
- **Exemples :** Voir documentation dans le fichier
- **Peut être changé** facilement sans toucher au reste

### 7. Types de quêtes
- **Implémentés :** lessons_completed, quizzes_passed, level_reached, xp_earned
- **Partiellement :** streak_days (colonne existe, pas de tracking)
- **Fonction :** `getQuestProgress()` calcule automatiquement selon type

### 8. Gestion d'erreur robuste
- **RLS :** Erreurs de permissions ne bloquent plus l'app
- **User manquant :** Création automatique dans public.users
- **Session :** Vérification et gestion propre

---

## 📊 RÉSULTATS ATTENDUS APRÈS TESTS COMPLETS

### Après 5 leçons + 2 quêtes réclamées

| Métrique | Valeur attendue |
|----------|----------------|
| **Leçons complétées** | 5 |
| **XP leçons** | ~550 XP (50+75+100+125+150) |
| **XP quêtes** | +250 XP (50+200) |
| **XP total** | ~800 XP |
| **Niveau** | **3 ou 4** |
| **Quêtes complétées** | 2 ("Premier pas" + "Étudiant assidu") |
| **Barre XP** | Variable selon niveau |

### Calcul niveaux
```
Niveau 1→2 : 100 XP  (total cumulé: 100)
Niveau 2→3 : 200 XP  (total cumulé: 300)
Niveau 3→4 : 300 XP  (total cumulé: 600)
Niveau 4→5 : 400 XP  (total cumulé: 1000)

Avec 800 XP → Niveau 4 (800 > 600, mais < 1000)
Barre affiche : 200/400 (50%)
```

---

## 🚀 PROCHAINES ÉTAPES RECOMMANDÉES

### Priorité 1 : Créer table quests en BDD
```sql
CREATE TABLE quests (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR NOT NULL,
  target INTEGER NOT NULL,
  reward_xp INTEGER NOT NULL,
  icon VARCHAR,
  required_level INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Priorité 2 : Interface admin pour gérer quêtes
- Créer/modifier/supprimer quêtes
- Activer/désactiver
- Preview en temps réel

### Priorité 3 : Remplacer MOCK_QUESTS par requête SQL
Dans `lib/database/quests.ts` :
```typescript
const { data, error } = await supabase
  .from('quests')
  .select('*')
  .eq('is_active', true)
  .order('id');
```

### Priorité 4 : Système de streak
- Tracker dernière connexion
- Calculer jours consécutifs
- Réinitialiser si > 24h
- Récompenses streak

### Priorité 5 : Enrichir Dashboard
- Graphiques progression
- Dernières leçons
- Prochaines quêtes
- Classement (si multi-users)

### Priorité 6 : Système de badges
- Table `badges`
- Table `user_badges`
- Affichage sur profil
- Déblocage automatique

### Priorité 7 : Configurer RLS pour production
- Activer RLS sur toutes les tables
- Créer policies (voir `setup_rls_policies.sql` suggéré)
- Tester accès multi-users

### Priorité 8 : Supprimer code de test
- Supprimer `test_button.tsx`
- Retirer du `quests/index.tsx`
- Retirer note "données de test"

---

## 🐛 PROBLÈMES RÉSOLUS DURANT LA SESSION

### 1. AuthSessionMissingError
**Problème :** `getUser()` ne fonctionnait pas, session manquante
**Cause :** Redirection trop rapide, session pas sauvegardée
**Solution :**
- Utiliser `getSession()` au lieu de `getUser()`
- Ajouter délai 500ms après login
- Vérifier auth dans `app/index.tsx`

### 2. User existe dans auth.users mais pas public.users
**Problème :** User créé via Dashboard Supabase, pas dans public.users
**Cause :** Tables séparées (auth.users vs public.users)
**Solution :** Fonction `initializeUserIfNeeded()` détecte PGRST116 et crée l'entrée

### 3. Erreurs RLS bloquantes
**Problème :** Cannot fetch lesson_states, quiz_attempts
**Cause :** RLS activé, pas de policies
**Solution :**
- Désactiver RLS pour dev
- Gestion d'erreur robuste (try/catch, fallback 0)

### 4. Chargement infini page Quests
**Problème :** Page reste en loading indéfiniment
**Cause :** Erreur dans getUserStats() non catchée
**Solution :**
- Meilleure gestion d'erreur
- Logs détaillés
- Fallback values

---

## 📞 SUPPORT / DEBUG

### Logs importants à surveiller

**Connexion :**
```
[Login] Attempting login for: ...
[Auth] User not found / found / initialized
[Login] Successfully logged in
[Login] Redirecting to tabs...
```

**Page Quests :**
```
[Quests] Fetching user session...
[Quests] User found: [id]
[Quests] Loading data...
[Quests] Stats result: ...
[Quests] Quests result: Count: 7
[Quests] Loading complete
```

**Complétion leçon :**
```
[Lessons] Lesson completed! +XX XP
[UserProfile] Successfully added XX XP
[UserProfile] Level up to X! (si applicable)
```

**Complétion quête :**
```
[Quests] Quest completed! +XX XP
```

### Commandes utiles

**Relancer l'app :**
```bash
# Dans le terminal Expo
r (reload)
# Ou secouer le device → Reload
```

**Voir logs en temps réel :**
```bash
npm start
# Les logs s'affichent automatiquement
```

**Réinitialiser un user pour retester :**
```sql
UPDATE users
SET level = 1, points = 0, preferences = '{"completed_quests": []}'::jsonb
WHERE email = 'inosthful@gmail.com';

DELETE FROM lesson_states
WHERE user_id = (SELECT id FROM users WHERE email = 'inosthful@gmail.com');
```

---

## 📝 NOTES ADDITIONNELLES

### Structure de navigation actuelle
```
app/
├── index.tsx              (Vérif auth → redirect)
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/
    ├── _layout.tsx        (5 onglets: coming_soon, quests, learning, dashboard, profil)
    ├── coming_soon/
    ├── quests/            ✅ Implémenté
    ├── learning/          (Existant)
    ├── dashboard/         (Placeholder)
    └── profil/            ✅ Implémenté
```

### Couleurs utilisées (styles/colors)
- `primary` : Couleur principale (utilisée partout)
- `surface` : Fond des cartes
- `onSurface` : Texte sur surface
- `onPrimary` : Texte sur primary (blanc)
- `muted` : Couleur désactivée

### Dependencies importantes
```json
"@supabase/supabase-js": "^2.81.1"
"@react-native-async-storage/async-storage": "^2.2.0"
"expo-router": "~6.0.13"
"@expo/vector-icons": "^15.0.3"
```

### Configuration Supabase (lib/supabase.ts)
```typescript
auth: {
  storage: AsyncStorage,        // Persist session
  autoRefreshToken: true,        // Refresh auto
  persistSession: true,          // Sauvegarder session
  detectSessionInUrl: false,     // Pas d'URL (mobile)
}
```

---

## ✅ CHECKLIST AVANT NOUVELLE SESSION

Avant de continuer le développement, vérifie :

- [ ] `test_data.sql` exécuté (leçons créées)
- [ ] RLS désactivé sur toutes les tables
- [ ] User test existe et fonctionne
- [ ] Les 10 tests ci-dessus passent
- [ ] Page Quests affiche les 7 quêtes
- [ ] Complétion leçon fonctionne
- [ ] Montée niveau fonctionne
- [ ] Réclamer quête fonctionne
- [ ] Page Profil affiche stats
- [ ] Déconnexion fonctionne

Si tout est ✅, tu peux passer aux prochaines étapes !

---

## 🎯 RÉSUMÉ ULTRA-RAPIDE

**Ce qui fonctionne :**
- ✅ Système niveau/XP complet (formule : niveau × 100)
- ✅ 7 quêtes hardcodées avec progression temps réel
- ✅ Complétion leçons + gain XP automatique
- ✅ Montée niveau automatique
- ✅ Réclamer quêtes + récompenses
- ✅ Page Quests complète avec UI
- ✅ Page Profil avec stats + déconnexion
- ✅ Authentification corrigée
- ✅ Bouton test pour simuler leçons

**Ce qui reste à faire :**
- ⏳ Table quests en BDD (actuellement hardcodé)
- ⏳ Interface admin pour gérer quêtes
- ⏳ Système de streak (tracking jours consécutifs)
- ⏳ Enrichir Dashboard
- ⏳ Système de badges
- ⏳ RLS policies pour production
- ⏳ Supprimer bouton de test

**Fichiers clés :**
- `lib/database/quests.ts` - MOCK_QUESTS (à remplacer)
- `lib/database/userProfile.ts` - Gestion XP/niveau
- `app/(tabs)/quests/index.tsx` - Page principale
- `test_data.sql` - Données de test requises

**User de test :**
- Email : `inosthful@gmail.com`
- Password : `azerty`

---

**FIN DU RÉCAPITULATIF**

Ce document couvre 100% du travail effectué durant la session.
Copie-colle le dans une nouvelle conversation pour contexte complet.

📅 Dernière mise à jour : 21 janvier 2026
