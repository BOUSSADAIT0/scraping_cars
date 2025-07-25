# Projet de Scraping Automobile 🚗

## 🎓 Projet académique — Groupe de 3 étudiants

Ce projet consiste à :
- Scraper des annonces de voitures depuis le site [automobile.fr](https://www.automobile.fr).
- Extraire les données de chaque véhicule.
- Les stocker dans une base de données MongoDB Atlas.
- Préparer les données pour entraîner un modèle de prédiction de prix.

---

## 👥 Membres du groupe
- Membre 1 : [Nom 1]
- Membre 2 : [Nom 2]
- Membre 3 : [Nom 3]

> Remplacez ces lignes avec vos vrais noms.

---

## 🧰 Technologies utilisées

- Python 3.10+
- [Scrapy](https://scrapy.org/)
- MongoDB Atlas
- pymongo
- BeautifulSoup (facultatif)
- VS Code ou PyCharm

---

## 📁 Structure du projet

```
autoscraper/
├── scrapy.cfg
└── autoscraper/
    ├── __init__.py
    ├── items.py            # Définit les champs à scraper
    ├── pipelines.py        # Insertion MongoDB Atlas
    ├── settings.py         # Configuration globale
    └── spiders/
        └── voiture_spider.py   # Le spider principal
```

---

## ⚙️ Instructions d'installation

1. **Cloner le projet**
   ```bash
   git clone <lien-git-ou-extraire-le-zip>
   cd autoscraper
   ```

2. **Créer un environnement virtuel (optionnel mais recommandé)**
   ```bash
   python -m venv env
   source env/bin/activate  # Linux/Mac
   .\env\Scripts\activate  # Windows
   ```

3. **Installer les dépendances**
   ```bash
   pip install scrapy pymongo
   ```

4. **Configurer MongoDB Atlas**

Dans `autoscraper/settings.py`, modifiez :
```python
MONGO_URI = 'mongodb+srv://<username>:<password>@<cluster-url>/test?retryWrites=true&w=majority'
```

---

## 🚀 Exécuter le scraper

```bash
scrapy crawl voiture
```

> Vous pouvez aussi exporter les résultats :
```bash
scrapy crawl voiture -o voitures.json
```

---

## 🧪 Champs extraits

- `titre`
- `prix`
- `kilometrage`
- `annee`
- `boite`
- `carburant`
- `puissance`
- `lieu`
- `url`

---

## 📌 Points importants

- Respect du `robots.txt`
- Anti-bloquage activé : délai aléatoire entre requêtes
- Insertion **immédiate** dans Mongo (pipeline temps réel)

---

## 📊 Étape suivante (Data Science)

Vous pouvez maintenant :
- Nettoyer les données
- Entraîner un modèle (régression) pour prédire le prix
- Construire une API ou une interface pour tester votre modèle

---

## 📄 Licence

Projet à usage académique uniquement. Ne pas utiliser à des fins commerciales sans autorisation.

---
