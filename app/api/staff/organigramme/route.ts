import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// IDs Discord des rôles
const DISCORD_ROLES = {
  OWNER: '1332323285303558147',
  RESPONSABLE_RP: '1386374837404176417',
  ADMINISTRATEUR: '1332323285278654473',
  GERANT_MODERATION: '1385724637337485362',
  GERANT_MJ: '1332323285278654470',
  GERANT_ANIMATION: '1332323285278654469',
  GERANT_EQUILIBRAGE: '1386709386017247254',
  MODERATEUR: '1332323285278654465',
  ANIMATEUR: '1332323285278654464',
  MAITRE_DU_JEU: '1332323285249298472'
}

// Données mockées pour l'organigramme (en attendant l'intégration Discord API)
let staffMembers: any[] = [
  // Owner (3 membres avec le grade 1332323285303558147)
  {
    id: '1',
    discordId: 'owner1_discord_id',
    name: 'Owner 1',
    role: 'Owner',
    permissions: ['gestion_complete'],
    description: 'Fondateur et propriétaire du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/owner1_discord_id/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  {
    id: '2',
    discordId: 'owner2_discord_id',
    name: 'Owner 2',
    role: 'Owner',
    permissions: ['gestion_complete'],
    description: 'Co-fondateur du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/owner2_discord_id/avatar.png',
    status: 'BUSY',
    isActive: true
  },
  {
    id: '3',
    discordId: 'owner3_discord_id',
    name: 'Owner 3',
    role: 'Owner',
    permissions: ['gestion_complete'],
    description: 'Co-fondateur du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/owner3_discord_id/avatar.png',
    status: 'OFFLINE',
    isActive: true
  },
  // Haut Staff+ - Responsable RP (1386374837404176417)
  {
    id: '4',
    discordId: '1386374837404176417',
    name: 'Responsable RP',
    role: 'Haut Staff+',
    permissions: ['gestion_complete', 'evenements'],
    description: 'Responsable de la cohérence du roleplay',
    avatar: 'https://cdn.discordapp.com/avatars/1386374837404176417/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff+ - Administrateur (1332323285278654473)
  {
    id: '5',
    discordId: '1332323285278654473',
    name: 'Administrateur',
    role: 'Haut Staff+',
    permissions: ['gestion_complete', 'moderation'],
    description: 'Administrateur général du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654473/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff - Gérant Modération (1385724637337485362)
  {
    id: '6',
    discordId: '1385724637337485362',
    name: 'Gérant Modération',
    role: 'Haut Staff',
    permissions: ['moderation', 'staff'],
    description: 'Gérant de l\'équipe de modération',
    avatar: 'https://cdn.discordapp.com/avatars/1385724637337485362/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff - Gérant MJ (1332323285278654470)
  {
    id: '7',
    discordId: '1332323285278654470',
    name: 'Gérant MJ',
    role: 'Haut Staff',
    permissions: ['evenements', 'staff'],
    description: 'Gérant des Maîtres du Jeu',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654470/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff - Gérant Animation (1332323285278654469)
  {
    id: '8',
    discordId: '1332323285278654469',
    name: 'Gérant Animation',
    role: 'Haut Staff',
    permissions: ['evenements', 'staff'],
    description: 'Gérant de l\'équipe d\'animation',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654469/avatar.png',
    status: 'BUSY',
    isActive: true
  },
  // Haut Staff - Gérant Équilibrage (1386709386017247254)
  {
    id: '9',
    discordId: '1386709386017247254',
    name: 'Gérant Équilibrage',
    role: 'Haut Staff',
    permissions: ['moderation', 'staff'],
    description: 'Gérant de l\'équilibrage du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/1386709386017247254/avatar.png',
    status: 'OFFLINE',
    isActive: true
  },
  // Staff - Modérateur (1332323285278654465)
  {
    id: '10',
    discordId: '1332323285278654465',
    name: 'Modérateur',
    role: 'Staff',
    permissions: ['moderation'],
    description: 'Membre de l\'équipe de modération',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654465/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Staff - Animateur (1332323285278654464)
  {
    id: '11',
    discordId: '1332323285278654464',
    name: 'Animateur',
    role: 'Staff',
    permissions: ['evenements'],
    description: 'Membre de l\'équipe d\'animation',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654464/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Staff - Maître du Jeu (1332323285249298472)
  {
    id: '12',
    discordId: '1332323285249298472',
    name: 'Maître du Jeu',
    role: 'Staff',
    permissions: ['evenements'],
    description: 'Maître du Jeu pour les événements RP',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285249298472/avatar.png',
    status: 'BUSY',
    isActive: true
  }
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les membres du staff peuvent voir l'organigramme
    if (session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    return NextResponse.json(staffMembers)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'organigramme:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les Haut Staff+ peuvent modifier les permissions
    const hautStaffPlusRoles = [
      DISCORD_ROLES.OWNER,
      DISCORD_ROLES.RESPONSABLE_RP,
      DISCORD_ROLES.ADMINISTRATEUR
    ]

    if (!hautStaffPlusRoles.includes(session.user.id || '')) {
      return NextResponse.json({ error: 'Accès refusé - Haut Staff+ requis' }, { status: 403 })
    }

    const { memberId, permissions, description } = await request.json()

    if (!memberId || !permissions || !description) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Trouver et mettre à jour le membre
    const memberIndex = staffMembers.findIndex(m => m.id === memberId)
    if (memberIndex === -1) {
      return NextResponse.json({ error: 'Membre non trouvé' }, { status: 404 })
    }

    staffMembers[memberIndex] = {
      ...staffMembers[memberIndex],
      permissions,
      description
    }

    return NextResponse.json(staffMembers[memberIndex])
  } catch (error) {
    console.error('Erreur lors de la mise à jour des permissions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

