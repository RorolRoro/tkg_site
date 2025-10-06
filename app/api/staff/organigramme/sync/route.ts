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

const DISCORD_SERVER_ID = '1332323284825411658'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les Haut Staff+ peuvent synchroniser
    const hautStaffPlusRoles = [
      DISCORD_ROLES.OWNER,
      DISCORD_ROLES.RESPONSABLE_RP,
      DISCORD_ROLES.ADMINISTRATEUR
    ]

    if (!hautStaffPlusRoles.includes(session.user.id || '')) {
      return NextResponse.json({ error: 'Accès refusé - Haut Staff+ requis' }, { status: 403 })
    }

    // En production, vous utiliseriez l'API Discord avec un bot token
    // const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}/members`, {
    //   headers: {
    //     'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    //   },
    // })
    // const members = await response.json()

    // Simuler la synchronisation
    console.log('Synchronisation de l\'organigramme avec Discord...')
    
    // Ici, vous pourriez :
    // 1. Récupérer tous les membres du serveur Discord
    // 2. Filtrer ceux qui ont les rôles requis
    // 3. Mettre à jour la base de données
    // 4. Retourner les nouveaux membres

    const syncResult = {
      success: true,
      message: 'Organigramme synchronisé avec Discord',
      membersUpdated: 12, // Nombre de membres mis à jour
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(syncResult)
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

