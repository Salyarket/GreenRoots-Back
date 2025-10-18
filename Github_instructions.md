          ┌───────────────┐
          │     main      │  ← Production (stable)
          └───────▲───────┘
                  │
                  │ (PR dev → main)
                  │
          ┌───────┴───────┐
          │      dev      │  ← Intégration
          └───▲───▲───▲───┘
              │   │   │

┌──────────┘ │ └───────────┐
│ │ │
┌──┴─────────┐┌───┴─────────┐┌────┴─────────┐
│ feature/A ││ feature/B ││ feature/C │ ← branches perso
└────────────┘└─────────────┘└─────────────┘

# Créer une branche de travail (feature)

git branch -a : voir toutes les branches
git checkout dev : (aller sur dev = notre branche intégration)
git pull origin dev : (récupérer branche dev la plus récente)
git checkout -b feature/ma-feature (pour créer votre branche avec nom explicite)
git push -u origin feature/ma-feature (pour qu'elle apparaisse en ligne)

---

# Travailler sur sa feature

git add .
git commit -m "Ajout de la feature XYZ"
git push

---

# Mettre sa feature à jour avec dev

git checkout dev
git pull origin dev (récupérer les derniers changements de l’équipe)
git checkout feature/ma-feature
git merge dev (fusionner dev dans ma feature)
résoudre les conflits si besoin


git push

---

# Ouvrir une Pull Request (PR)

Aller sur GitHub → Pull requests → New pull request
base branch = dev
compare branch = feature/ma-feature
Ajouter un titre + description → Create pull request pour envoyer sur dev
faire pareil de dev => main
