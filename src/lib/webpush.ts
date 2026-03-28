import { supabase } from './supabase';

/**
 * Convertit une clé VAPID base64 en Uint8Array pour le pushManager
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Enregistre le Service Worker
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Workers non supportés par ce navigateur');
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    console.log('Service Worker enregistré avec succès:', registration);
    return registration;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
    throw error;
  }
}

/**
 * S'abonne aux notifications push
 */
export async function subscribeToPush(registration: ServiceWorkerRegistration) {
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  
  if (!vapidPublicKey) {
    throw new Error('Clé publique VAPID non configurée (VITE_VAPID_PUBLIC_KEY)');
  }

  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
  
  try {
    // On vérifie si une souscription existe déjà
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Si elle existe, on peut éventuellement la renouveler ou simplement la retourner
      return subscription;
    }

    // Sinon on en crée une nouvelle
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });
    
    console.log('Nouvelle souscription push créée:', subscription);
    return subscription;
  } catch (error) {
    console.error('Erreur lors de la souscription aux notifications push:', error);
    throw error;
  }
}

/**
 * Sauvegarde la souscription dans Supabase
 */
export async function saveSubscription(subscription: PushSubscription) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Utilisateur non authentifié');
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: user.id,
      subscription: subscription.toJSON(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Erreur lors de la sauvegarde de la souscription dans Supabase:', error);
    throw error;
  }
  
  console.log('Souscription sauvegardée avec succès dans Supabase');
}

/**
 * Initialise les notifications push (demande permission + register + subscribe + save)
 */
export async function initPushNotifications(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Les notifications push ne sont pas supportées par ce navigateur.');
    return false;
  }

  try {
    // 1. Demander la permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permission de notification refusée par l\'utilisateur.');
      return false;
    }

    // 2. Enregistrer le Service Worker
    const registration = await registerServiceWorker();

    // 3. S'abonner au push
    const subscription = await subscribeToPush(registration);

    // 4. Sauvegarder dans Supabase
    await saveSubscription(subscription);

    return true;
  } catch (error) {
    console.error('Échec de l\'initialisation des notifications push:', error);
    return false;
  }
}
