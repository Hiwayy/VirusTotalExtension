# VirusTotal URL Scanner Extension

## Introduction
Une extension Chrome simple qui permet de scanner les URLs avec l'API VirusTotal pour détecter d'éventuelles menaces.

## Prérequis
- **Clé API VirusTotal** requise
  - Créez un compte sur [VirusTotal](https://www.virustotal.com)
  - Obtenez votre clé API dans les paramètres de votre profil

## Installation
1. Téléchargez les fichiers de l'extension
2. Ouvrez Chrome et accédez à `chrome://extensions/`
3. Activez le "Mode développeur" (bouton en haut à droite)
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant les fichiers de l'extension

## Utilisation
1. Cliquez sur l'icône de l'extension
2. Entrez votre clé API VirusTotal et sauvegardez-la
3. Naviguez sur n'importe quelle page web
4. Cliquez sur "Scanner URL actuelle"
5. Consultez les résultats et l'analyse détaillée

## Structure des fichiers
- `manifest.json` - Configuration de l'extension
- `popup.html` - Interface utilisateur
- `popup.js` - Logique de l'extension

## Fonctionnalités
- Scan d'URL via l'API VirusTotal
- Affichage des statistiques de détection
- Analyse détaillée et recommandations
- Stockage local de la clé API

## Limitations
- API gratuite limitée à 4 requêtes/minute
- Analyse uniquement de l'URL principale