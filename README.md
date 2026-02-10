## Description du projet
Le projet **FEN-ALIM** vise à développer une application mobile (Android et iOS) destinée à fournir des informations essentielles sur les moyens d’alimentation en eau pour les pompiers sur le terrain.  

L'application permet :
- Le suivi des différents points d’eau existants (hydrants et points d’eau naturels).
- La consultation d’informations et de statistiques : coordonnées, débit, raccordement, état, dernière vérification, photos, etc.
- La gestion par différents niveaux d’accès :
  - Civil
  - Pompier
  - Commandement
  - Administrateur
- La participation du grand public pour signaler l’état des hydrants ou ajouter des points d’eau privés accessibles aux secours.
- Une cartographie interactive permettant de filtrer les points d’eau par caractéristiques (débit, proximité, état) pour faciliter le travail des pompiers.  

Cette application est un outil majeur pour la prévention et la lutte contre les feux de forêt.

---

## Utilisation
Récupérer le dépot git (à faire une seul fois): git clone https://forgens.univ-ubs.fr/gitlab/but2info/fen-alim_b.git  

Puis avant de modifier: 
- git pull               # récupérer les modification faites par les autres
- git checkout dev       # passer sur la branche de développement  
- git pull origin dev    # récupérer les dernières modifications  

Créer une nouvelle branche pour votre travail: git checkout -b feature/ma_nouvelle_fonctionnalite

Maintenant vous pouvez ravailler sur vos fichiers.

Une fois votre travail effectuer il faut :
- Ajouter vos modifications au dépôt local: git add /path/to/modified/files
- Commiter vos modifications avec un message explicatif: git commit -m "explication des modifications"
- Envoyer vos modifications sur le dépôt commun: git push

Enfin il faut fusionner votre travail dans dev:
- Passer sur la branche dev: git checkout dev
- Mettre à jour dev avec la version distante: git pull origin dev
- Fusionner votre branche: git merge feature/ma_nouvelle_fonctionnalite
- Pousser dev à jour vers le dépôt distant: git push origin dev

⚡ Astuces  
  Toujours récupérer (git pull) avant de commencer pour éviter les conflits.  
  Créer une branche par tâche pour garder dev propre et stable.  
  Commits fréquents avec messages clairs pour tracer vos modifications.

---

## Authors and acknowledgment

Peysson Pierre
@e2400532 

Le Jalle Emma
@e2306629 

Cajean Lucie
@e2400469 

Quintane Faustin
@e2401308 

## Lancer le projet

npm install
npx expo start
