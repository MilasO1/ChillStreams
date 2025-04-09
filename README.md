# ChillStreams - Backend API

ChillStreams est une plateforme de streaming vidéo permettant aux utilisateurs de découvrir et regarder des vidéos. Ce dépôt contient le code source de l'API backend qui gère l'authentification des utilisateurs, le stockage et la diffusion des vidéos.

## Technologies Utilisées

- **Node.js** & **Express.js** - Framework backend
- **MongoDB** & **Mongoose** - Base de données et ODM
- **JWT** - Authentification par tokens
- **Cloudinary** - Stockage et diffusion des vidéos et images
- **Multer** - Gestion des uploads de fichiers
- **Winston** - Système de journalisation

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou distant)
- Compte Cloudinary (pour le stockage des médias)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-username/chillstreams-backend.git
   cd chillstreams-backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=votre_uri_mongodb
   JWT_SECRET=votre_jwt_secret
   JWT_EXPIRES_IN=30d
   CLOUDINARY_CLOUD_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Créez un dossier `uploads` à la racine du projet :
   ```bash
   mkdir uploads
   ```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

L'API sera disponible à l'adresse `http://localhost:5000`.

## Structure du Projet

```
├── config/               # Configuration (DB, Cloudinary, Logger)
├── controllers/          # Logique métier
├── middlewares/          # Middlewares Express
│   ├── asyncHandler.js   # Gestion des erreurs asynchrones
│   ├── authMiddleware.js # Protection des routes
│   └── ...
├── models/               # Modèles Mongoose
├── routes/               # Routes de l'API
├── uploads/              # Stockage temporaire des fichiers
├── validations/          # Validation des requêtes
├── app.js                # Configuration de l'application Express
└── server.js             # Point d'entrée
```

## API Endpoints

### Authentification & Utilisateurs

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/api/users/register` | Inscription | Public |
| POST | `/api/users/login` | Connexion | Public |
| POST | `/api/users/logout` | Déconnexion | Public |
| GET | `/api/users/profile` | Profil utilisateur | Privé |
| PUT | `/api/users/profile` | Mise à jour du profil | Privé |
| GET | `/api/users/users` | Liste des utilisateurs | Admin |
| GET | `/api/users/users/:id` | Détails d'un utilisateur | Admin |
| DELETE | `/api/users/users/:id` | Suppression d'un utilisateur | Admin |

### Vidéos

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/videos` | Liste des vidéos | Public |
| GET | `/api/videos/:id` | Détails d'une vidéo | Public |
| POST | `/api/videos` | Ajout d'une vidéo | Admin |
| PUT | `/api/videos/:id` | Mise à jour d'une vidéo | Admin |
| DELETE | `/api/videos/:id` | Suppression d'une vidéo | Admin |

## Modèles de Données

### Utilisateur (User)
```javascript
{
  name: String,           // Nom de l'utilisateur
  email: String,          // Email (unique)
  password: String,       // Mot de passe (haché)
  pic: String,            // URL de l'avatar
  isAdmin: Boolean,       // Rôle administrateur
  createdAt: Date,        // Date de création
  updatedAt: Date         // Date de mise à jour
}
```

### Vidéo (Video)
```javascript
{
  title: String,          // Titre de la vidéo
  description: String,    // Description
  url: String,            // URL Cloudinary
  thumbnail: String,      // URL de la miniature
  publicId: String,       // ID public Cloudinary
  genre: String,          // Genre (Action, Comedy, etc.)
  createdAt: Date,        // Date de création
  updatedAt: Date         // Date de mise à jour
}
```

## Gestion des Erreurs

L'API utilise un middleware centralisé pour la gestion des erreurs. Les réponses d'erreur suivent le format :

```json
{
  "message": "Description de l'erreur",
  "stack": "Stack trace (en mode développement uniquement)"
}
```

## Authentification

L'authentification utilise JSON Web Tokens (JWT). Les tokens sont envoyés via :
- Cookies HTTP-only
- En-tête d'autorisation (`Authorization: Bearer <token>`)

## Déploiement

### Préparation
```bash
npm run build
```

### Hébergement recommandé
- Heroku
- DigitalOcean
- AWS

## Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commitez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe ChillStreams à [contact@chillstreams.com](mailto:contact@chillstreams.com).