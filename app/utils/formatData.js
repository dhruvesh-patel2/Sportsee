/**
 * Formate les informations utilisateur récupérées depuis l'API
 * Objectif :
 * - conserver toutes les données existantes
 * - convertir certaines valeurs pour qu'elles soient plus faciles à utiliser côté frontend
 *
 * Ici on transforme totalDistance (string) en nombre
 * pour faciliter son utilisation dans les graphiques ou calculs.
 */
export function formatUserInfo(userInfo) {
    return {
      ...userInfo,
      statistics: {
        ...userInfo.statistics,
        totalDistance: Number(userInfo.statistics.totalDistance),
      },
    };
  }
  
  /**
   * Formate les données d'activité sportive de l'utilisateur
   * Objectif :
   * - préparer les données pour les graphiques (Recharts)
   * - ajouter un id unique pour chaque session
   * - créer un label de date lisible pour l'affichage
   *
   * Exemple :
   * "2025-01-04" → "04/01"
   */
  export function formatActivityData(activity) {
    return activity.map((session, index) => ({
      ...session,
      id: index + 1, // id unique pour React (clé de liste)
      dayLabel: new Date(session.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
    }));
  }
  
  /**
   * Retourne uniquement les dernières sessions d'activité
   * Objectif :
   * - limiter le nombre de données affichées dans un graphique
   * - rendre la visualisation plus lisible
   *
   * Par défaut on récupère les 7 dernières séances.
   */
  export function getLastSessions(activity, limit = 7) {
    return activity.slice(-limit);
  }