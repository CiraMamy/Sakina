# Déploiement Sakina — Instructions

## 1. Créer le repo GitHub (30 secondes)
Va sur https://github.com/new et crée un repo nommé `sakina-mobile` (public, sans README).

## 2. Pousser le code
Ouvre PowerShell dans le dossier `sakina-mobile` et exécute :

```powershell
git push -u origin Cira
```

## 3. Déployer sur Vercel (2 minutes)
1. Va sur https://vercel.com/new
2. Clique "Import Git Repository"
3. Sélectionne `CiraMamy/sakina-mobile`
4. Build settings (Vercel les détecte automatiquement depuis vercel.json) :
   - **Build Command** : `npx expo export --platform web`
   - **Output Directory** : `dist`
5. Clique **Deploy** → ton URL sera `sakina-mobile.vercel.app`

## 4. Build natif iOS/Android (EAS)
```bash
npm install -g eas-cli
eas login          # se connecte à ton compte Expo
eas build --platform android --profile preview   # APK de test
eas build --platform ios --profile preview       # IPA simulateur
```
