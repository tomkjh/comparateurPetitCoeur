# Comparateur d'images (gauche toujours gagnante)

## Personnaliser les images et les phrases

1. Ouvrir `script.js`.
2. Modifier le tableau `leftImages`:
   - `label`: nom visible dans la liste.
   - `src`: chemin de l'image (ex: `images/gauche1.jpg`).
   - `winText`: phrase affichée quand cette image de gauche est sélectionnée.
3. Modifier le tableau `rightImages`:
   - `label`: nom visible dans la liste.
   - `src`: chemin de l'image (ex: `images/droite1.jpg`).
4. Mettre vos fichiers image dans un dossier `images/` à la racine du projet.

## Comportement

- À gauche: sélection parmi les images proposées.
- À droite: sélection parmi les images proposées + upload depuis la galerie.
- Le bouton `Comparer` affiche toujours une phrase de victoire liée à l'image de gauche choisie.

## Déployer sur GitHub Pages

1. Créer un nouveau dépôt GitHub.
2. Dans ce dossier, exécuter:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USER/VOTRE_REPO.git
git push -u origin main
```

3. Sur GitHub: `Settings` > `Pages`.
4. Dans `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` et dossier `/ (root)`
5. Enregistrer puis attendre 1 à 3 minutes.
6. Votre site sera disponible à l'URL indiquée dans la section Pages.