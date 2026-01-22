-- ============================================
-- SCRIPT D'INITIALISATION DES DONNÉES DE TEST
-- Système de Quêtes et Niveaux
-- ============================================

-- 1. Créer un chapitre de test
INSERT INTO chapters (title, description, order_index, required_level)
VALUES ('Chapitre Test - Bases de l''épargne', 'Apprends les fondamentaux de l''épargne', 1, 1)
ON CONFLICT DO NOTHING;

-- 2. Créer des leçons de test avec XP variés
INSERT INTO lessons (chapter_id, title, description, content, order_index, xp_gain)
VALUES
  (1, 'Introduction à l''épargne', 'Découvre pourquoi épargner est important', 'Contenu de la leçon sur l''importance de l''épargne...', 1, 50),
  (1, 'Fixer des objectifs', 'Apprends à définir des objectifs financiers', 'Contenu sur comment fixer des objectifs SMART...', 2, 75),
  (1, 'Budget mensuel', 'Crée ton premier budget', 'Contenu sur la création d''un budget mensuel...', 3, 100),
  (1, 'Épargne d''urgence', 'Constitue ton fond d''urgence', 'Contenu sur l''importance d''un fond d''urgence...', 4, 125),
  (1, 'Investir intelligemment', 'Découvre les bases de l''investissement', 'Contenu sur les principes de base de l''investissement...', 5, 150),
  (1, 'Réduire les dépenses', 'Apprends à optimiser tes dépenses', 'Contenu sur comment réduire les dépenses inutiles...', 6, 100),
  (1, 'Épargne automatique', 'Mets en place une épargne automatique', 'Contenu sur l''automatisation de l''épargne...', 7, 125),
  (1, 'Suivre sa progression', 'Apprends à suivre tes objectifs', 'Contenu sur le suivi de la progression financière...', 8, 75),
  (1, 'Gérer les imprévus', 'Prépare-toi aux situations imprévues', 'Contenu sur la gestion des imprévus financiers...', 9, 150),
  (1, 'Planifier l''avenir', 'Projette-toi dans l''avenir', 'Contenu sur la planification financière à long terme...', 10, 200)
ON CONFLICT DO NOTHING;

-- 3. Créer quelques quiz de test
INSERT INTO quizzes (lesson_id, title)
VALUES
  (1, 'Quiz - Introduction à l''épargne'),
  (2, 'Quiz - Objectifs financiers'),
  (3, 'Quiz - Budget mensuel')
ON CONFLICT DO NOTHING;

-- 4. Créer des questions pour les quiz
INSERT INTO quiz_questions (quiz_id, question, correct_answer_index, choices, explanation)
VALUES
  (1, 'Pourquoi est-il important d''épargner ?', 0,
   '["Pour se préparer aux imprévus", "Pour acheter impulsivement", "Pour tout dépenser", "Aucune raison"]'::jsonb,
   'Épargner permet de se protéger contre les imprévus et d''atteindre ses objectifs financiers.'),

  (1, 'Quel pourcentage de son revenu devrait-on idéalement épargner ?', 1,
   '["5%", "10-20%", "50%", "0%"]'::jsonb,
   'Les experts recommandent d''épargner entre 10% et 20% de son revenu.'),

  (2, 'Qu''est-ce qu''un objectif SMART ?', 0,
   '["Spécifique, Mesurable, Atteignable, Réaliste, Temporel", "Simple, Moyen, Accessible, Rapide, Total", "Standard, Manuel, Automatique, Régulier, Temporaire", "Aucune des réponses"]'::jsonb,
   'SMART signifie Spécifique, Mesurable, Atteignable, Réaliste et Temporel.'),

  (3, 'Quelle est la première étape pour créer un budget ?', 2,
   '["Dépenser tout", "Ignorer ses revenus", "Lister tous ses revenus et dépenses", "Emprunter de l''argent"]'::jsonb,
   'La première étape consiste à lister tous ses revenus et dépenses pour avoir une vue d''ensemble.')
ON CONFLICT DO NOTHING;

-- 5. Initialiser ou réinitialiser les colonnes level/points pour tous les utilisateurs
UPDATE users
SET
  level = COALESCE(level, 1),
  points = COALESCE(points, 0),
  streak = COALESCE(streak, 0),
  preferences = COALESCE(preferences, '{}'::jsonb)
WHERE level IS NULL OR points IS NULL OR streak IS NULL OR preferences IS NULL;

-- 6. S'assurer que tous les utilisateurs ont un tableau completed_quests dans preferences
UPDATE users
SET preferences = jsonb_set(preferences, '{completed_quests}', '[]'::jsonb, true)
WHERE NOT (preferences ? 'completed_quests');

-- ============================================
-- SCRIPT DE RÉINITIALISATION (OPTIONNEL)
-- Utilise ce script pour remettre à zéro tes données de test
-- ============================================

-- Décommente ces lignes si tu veux réinitialiser les données d'un utilisateur spécifique :

-- UPDATE users
-- SET level = 1, points = 0, streak = 0, preferences = '{"completed_quests": []}'::jsonb
-- WHERE email = 'ton_email@example.com';

-- DELETE FROM lesson_states WHERE user_id = 'ton_user_id';
-- DELETE FROM quiz_attempts WHERE user_id = 'ton_user_id';

-- ============================================
-- VÉRIFICATIONS
-- ============================================

-- Vérifier que les leçons ont bien des XP
SELECT id, title, xp_gain FROM lessons WHERE chapter_id = 1;

-- Vérifier ton profil utilisateur (remplace l'email)
-- SELECT id, level, points, streak, preferences->'completed_quests' as completed_quests
-- FROM users WHERE email = 'ton_email@example.com';

-- ============================================
-- FIN DU SCRIPT
-- ============================================
