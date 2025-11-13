// IDs Discord pour les rôles Haut Staff+
const HAUT_STAFF_PLUS_IDS = [
  '1332323285303558147', // Owner
  '1386374837404176417', // Responsable RP
  '1332323285278654473'  // Administrateur
]

// Catégories de tickets avec leurs permissions requises
export const TICKET_CATEGORIES = {
  // Haut Staff+ uniquement
  'CANDIDATURE_CLAN': {
    label: 'Candidature Clan',
    requiredRole: 'HAUT_STAFF_PLUS',
    description: 'Candidature pour rejoindre un clan'
  },
  'RPK_CK': {
    label: 'RPK / CK',
    requiredRole: 'HAUT_STAFF_PLUS',
    description: 'Demande concernant un RPK (Roleplay Kill) ou CK (Character Kill)'
  },
  
  // Haut Staff et +
  'CANDIDATURE_STAFF_ANIMATEUR': {
    label: 'Candidature Staff - Animateur',
    requiredRole: 'HAUT_STAFF',
    subCategory: 'ANIMATEUR',
    description: 'Candidature pour le poste d\'Animateur'
  },
  'CANDIDATURE_STAFF_MODERATEUR': {
    label: 'Candidature Staff - Modérateur',
    requiredRole: 'HAUT_STAFF',
    subCategory: 'MODERATEUR',
    description: 'Candidature pour le poste de Modérateur'
  },
  'CANDIDATURE_STAFF_MAITRE_DU_JEU': {
    label: 'Candidature Staff - Maître du Jeu',
    requiredRole: 'HAUT_STAFF',
    subCategory: 'MAITRE_DU_JEU',
    description: 'Candidature pour le poste de Maître du Jeu'
  },
  'CANDIDATURE_ORGANISATION': {
    label: 'Candidature Organisation',
    requiredRole: 'HAUT_STAFF',
    description: 'Candidature pour rejoindre une organisation spécifique'
  },
  
  // Modérateur et +
  'PLAINTE': {
    label: 'Plainte',
    requiredRole: 'MODERATEUR',
    description: 'Déposer une plainte contre un joueur ou une situation'
  },
  'RECLAMATION': {
    label: 'Réclamation',
    requiredRole: 'MODERATEUR',
    description: 'Faire une réclamation concernant une décision ou une sanction'
  },
  'QUESTIONS': {
    label: 'Questions',
    requiredRole: 'MODERATEUR',
    description: 'Poser une question générale au staff'
  }
} as const

export type TicketCategory = keyof typeof TICKET_CATEGORIES

// Fonction pour vérifier si un utilisateur a accès à une catégorie de ticket
export function canAccessTicketCategory(
  userId: string | undefined,
  userRole: string | undefined,
  category: TicketCategory
): boolean {
  if (!userId || !userRole) {
    return false
  }

  const categoryConfig = TICKET_CATEGORIES[category]
  
  // Admin a accès à tout
  if (userRole === 'ADMIN') {
    return true
  }

  // Vérifier selon le rôle requis
  switch (categoryConfig.requiredRole) {
    case 'HAUT_STAFF_PLUS':
      // Owner ou Haut Staff+ uniquement
      return HAUT_STAFF_PLUS_IDS.includes(userId)
    
    case 'HAUT_STAFF':
      // Haut Staff+ ou Haut Staff (tous les staffs)
      return (
        HAUT_STAFF_PLUS_IDS.includes(userId) ||
        userRole === 'STAFF'
      )
    
    case 'MODERATEUR':
      // Modérateur et tous les rôles supérieurs (tous les staffs)
      return userRole === 'STAFF'
    
    default:
      return false
  }
}

// Fonction pour obtenir toutes les catégories accessibles par un utilisateur
export function getAccessibleCategories(
  userId: string | undefined,
  userRole: string | undefined
): TicketCategory[] {
  if (!userId || !userRole) {
    return []
  }

  const categories = Object.keys(TICKET_CATEGORIES) as TicketCategory[]
  
  return categories.filter(category => 
    canAccessTicketCategory(userId, userRole, category)
  )
}

// Fonction pour obtenir les catégories disponibles pour la création (tous les utilisateurs peuvent créer)
export function getAvailableCategoriesForCreation(): Array<{
  value: TicketCategory
  label: string
  description: string
  group: string
}> {
  return [
    {
      value: 'CANDIDATURE_CLAN',
      label: 'Candidature Clan',
      description: 'Candidature pour rejoindre un clan ou une organisation',
      group: 'Haut Staff+'
    },
    {
      value: 'RPK_CK',
      label: 'RPK / CK',
      description: 'Demande concernant un RPK ou CK',
      group: 'Haut Staff+'
    },
    {
      value: 'CANDIDATURE_STAFF_ANIMATEUR',
      label: 'Candidature Staff - Animateur',
      description: 'Candidature pour le poste d\'Animateur',
      group: 'Haut Staff'
    },
    {
      value: 'CANDIDATURE_STAFF_MODERATEUR',
      label: 'Candidature Staff - Modérateur',
      description: 'Candidature pour le poste de Modérateur',
      group: 'Haut Staff'
    },
    {
      value: 'CANDIDATURE_STAFF_MAITRE_DU_JEU',
      label: 'Candidature Staff - Maître du Jeu',
      description: 'Candidature pour le poste de Maître du Jeu',
      group: 'Haut Staff'
    },
    {
      value: 'CANDIDATURE_ORGANISATION',
      label: 'Candidature Organisation',
      description: 'Candidature pour rejoindre une organisation spécifique',
      group: 'Haut Staff'
    },
    {
      value: 'PLAINTE',
      label: 'Plainte',
      description: 'Déposer une plainte contre un joueur ou une situation',
      group: 'Modérateur'
    },
    {
      value: 'RECLAMATION',
      label: 'Réclamation',
      description: 'Faire une réclamation concernant une décision ou une sanction',
      group: 'Modérateur'
    },
    {
      value: 'QUESTIONS',
      label: 'Questions',
      description: 'Poser une question générale au staff',
      group: 'Modérateur'
    }
  ]
}

