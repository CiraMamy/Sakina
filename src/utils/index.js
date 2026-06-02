/**
 * Returns the route path for a given page name.
 * Used to navigate between screens via Expo Router.
 */
export function createPageUrl(pageName) {
  const routeMap = {
    Splash: '/',
    Onboarding: '/onboarding',
    Accueil: '/(tabs)/',
    Chat: '/(tabs)/chat',
    Dashboard: '/(tabs)/dashboard',
    Profil: '/(tabs)/profil',
    Emotions: '/emotions',
    Journal: '/journal',
    Sommeil: '/sommeil',
    Addictions: '/addictions',
    Ressources: '/ressources',
    Tendances: '/tendances',
    Recompenses: '/recompenses',
    Coaching: '/coaching',
    Professionnels: '/professionnels',
    Parametres: '/parametres',
    Preferences: '/preferences',
  };
  return routeMap[pageName] || '/';
}

/**
 * Format a date with French locale style
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Format time (HH:MM)
 */
export function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
