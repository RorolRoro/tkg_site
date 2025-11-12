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

// Données mockées pour simuler l'API Discord
const mockDiscordMembers = [
  // Owner
  {
    user: {
      id: 'owner1_discord_id',
      username: 'OwnerAlpha',
      global_name: 'Owner Alpha',
      avatar: 'a1b2c3d4e5f6',
      discriminator: '0'
    },
    roles: ['1332323285303558147'],
    nick: null
  },
  {
    user: {
      id: 'owner2_discord_id',
      username: 'OwnerBeta',
      global_name: 'Owner Beta',
      avatar: 'b2c3d4e5f6a1',
      discriminator: '0'
    },
    roles: ['1332323285303558147'],
    nick: null
  },
  {
    user: {
      id: 'owner3_discord_id',
      username: 'OwnerGamma',
      global_name: 'Owner Gamma',
      avatar: 'c3d4e5f6a1b2',
      discriminator: '0'
    },
    roles: ['1332323285303558147'],
    nick: null
  },
  // Responsable RP
  {
    user: {
      id: '1386374837404176417',
      username: 'ResponsableRP',
      global_name: 'Responsable RP',
      avatar: 'd4e5f6a1b2c3',
      discriminator: '0'
    },
    roles: ['1386374837404176417'],
    nick: null
  },
  // Administrateur
  {
    user: {
      id: '1332323285278654473',
      username: 'Administrateur',
      global_name: 'Administrateur',
      avatar: 'e5f6a1b2c3d4',
      discriminator: '0'
    },
    roles: ['1332323285278654473'],
    nick: null
  },
  // Gérant Modération
  {
    user: {
      id: '1385724637337485362',
      username: 'GerantModeration',
      global_name: 'Gérant Modération',
      avatar: 'f6a1b2c3d4e5',
      discriminator: '0'
    },
    roles: ['1385724637337485362'],
    nick: null
  },
  // Gérant MJ
  {
    user: {
      id: '1332323285278654470',
      username: 'GerantMJ',
      global_name: 'Gérant MJ',
      avatar: 'a1b2c3d4e5f6',
      discriminator: '0'
    },
    roles: ['1332323285278654470'],
    nick: null
  },
  // Gérant Animation
  {
    user: {
      id: '1332323285278654469',
      username: 'GerantAnimation',
      global_name: 'Gérant Animation',
      avatar: 'b2c3d4e5f6a1',
      discriminator: '0'
    },
    roles: ['1332323285278654469'],
    nick: null
  },
  // Gérant Équilibrage
  {
    user: {
      id: '1386709386017247254',
      username: 'GerantEquilibrage',
      global_name: 'Gérant Équilibrage',
      avatar: 'c3d4e5f6a1b2',
      discriminator: '0'
    },
    roles: ['1386709386017247254'],
    nick: null
  },
  // Modérateur
  {
    user: {
      id: '1332323285278654465',
      username: 'Moderateur',
      global_name: 'Modérateur',
      avatar: 'd4e5f6a1b2c3',
      discriminator: '0'
    },
    roles: ['1332323285278654465'],
    nick: null
  },
  // Animateur
  {
    user: {
      id: '1332323285278654464',
      username: 'Animateur',
      global_name: 'Animateur',
      avatar: 'e5f6a1b2c3d4',
      discriminator: '0'
    },
    roles: ['1332323285278654464'],
    nick: null
  },
  // Maître du Jeu
  {
    user: {
      id: '1332323285249298472',
      username: 'MaitreDuJeu',
      global_name: 'Maître du Jeu',
      avatar: 'f6a1b2c3d4e5',
      discriminator: '0'
    },
    roles: ['1332323285249298472'],
    nick: null
  }
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les membres du staff peuvent récupérer les membres
    if (session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Essayer de récupérer les vrais membres Discord
    let discordMembers = []
    
    if (process.env.DISCORD_BOT_TOKEN) {
      try {
        console.log('Tentative de récupération des membres Discord...')
        const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}/members?limit=1000`, {
          headers: {
            'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        })
        
        if (response.ok) {
          discordMembers = await response.json()
          console.log(`Récupéré ${discordMembers.length} membres Discord`)
        } else {
          console.error('Erreur API Discord:', response.status, await response.text())
        }
      } catch (error) {
        console.error('Erreur lors de la récupération Discord:', error)
      }
    } else {
      console.log('DISCORD_BOT_TOKEN non configuré, utilisation des données mockées')
    }

    // Si pas de données Discord, utiliser les données mockées
    if (discordMembers.length === 0) {
      console.log('Utilisation des données mockées')
      discordMembers = mockDiscordMembers
    }

    // Filtrer les membres qui ont les rôles requis
    const staffMembers = discordMembers.filter(member => {
      return member.roles && member.roles.some(roleId => Object.values(DISCORD_ROLES).includes(roleId))
    })

    // Transformer les données pour l'organigramme
    const transformedMembers = staffMembers.map(member => {
      const user = member.user
      const displayName = member.nick || user.global_name || user.username
      const avatarUrl = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`

      // Déterminer le rôle principal (le plus élevé dans la hiérarchie)
      let mainRole = 'Staff'
      let roleName = 'Staff'

      if (member.roles.includes(DISCORD_ROLES.OWNER)) {
        mainRole = 'Owner'
        roleName = 'Owner'
      } else if (member.roles.includes(DISCORD_ROLES.RESPONSABLE_RP)) {
        mainRole = 'Haut Staff+'
        roleName = 'Responsable RP'
      } else if (member.roles.includes(DISCORD_ROLES.ADMINISTRATEUR)) {
        mainRole = 'Haut Staff+'
        roleName = 'Administrateur'
      } else if (member.roles.includes(DISCORD_ROLES.GERANT_MODERATION)) {
        mainRole = 'Haut Staff'
        roleName = 'Gérant Modération'
      } else if (member.roles.includes(DISCORD_ROLES.GERANT_MJ)) {
        mainRole = 'Haut Staff'
        roleName = 'Gérant MJ'
      } else if (member.roles.includes(DISCORD_ROLES.GERANT_ANIMATION)) {
        mainRole = 'Haut Staff'
        roleName = 'Gérant Animation'
      } else if (member.roles.includes(DISCORD_ROLES.GERANT_EQUILIBRAGE)) {
        mainRole = 'Haut Staff'
        roleName = 'Gérant Équilibrage'
      } else if (member.roles.includes(DISCORD_ROLES.MODERATEUR)) {
        mainRole = 'Staff'
        roleName = 'Modérateur'
      } else if (member.roles.includes(DISCORD_ROLES.ANIMATEUR)) {
        mainRole = 'Staff'
        roleName = 'Animateur'
      } else if (member.roles.includes(DISCORD_ROLES.MAITRE_DU_JEU)) {
        mainRole = 'Staff'
        roleName = 'Maître du Jeu'
      }

      // Déterminer les permissions selon le rôle
      let permissions: string[] = []
      switch (mainRole) {
        case 'Owner':
          permissions = ['gestion_complete']
          break
        case 'Haut Staff+':
          if (roleName === 'Responsable RP') {
            permissions = ['gestion_complete', 'roleplay', 'evenements', 'communication']
          } else if (roleName === 'Administrateur') {
            permissions = ['gestion_complete', 'moderation', 'technique', 'recrutement']
          }
          break
        case 'Haut Staff':
          if (roleName === 'Gérant Modération') {
            permissions = ['moderation', 'staff', 'communication']
          } else if (roleName === 'Gérant MJ') {
            permissions = ['evenements', 'roleplay', 'staff']
          } else if (roleName === 'Gérant Animation') {
            permissions = ['evenements', 'animation', 'staff']
          } else if (roleName === 'Gérant Équilibrage') {
            permissions = ['equilibrage', 'technique', 'staff']
          }
          break
        case 'Staff':
          if (roleName === 'Modérateur') {
            permissions = ['moderation']
          } else if (roleName === 'Animateur') {
            permissions = ['animation', 'evenements']
          } else if (roleName === 'Maître du Jeu') {
            permissions = ['roleplay', 'evenements']
          }
          break
      }

      return {
        id: user.id,
        discordId: user.id,
        name: displayName,
        role: mainRole,
        roleName: roleName,
        permissions: permissions,
        description: `${roleName} du serveur Tokyo Ghoul RP`,
        avatar: avatarUrl,
        status: 'ONLINE', // En production, récupérer le statut réel
        isActive: true
      }
    })

    return NextResponse.json(transformedMembers)
  } catch (error) {
    console.error('Erreur lors de la récupération des membres Discord:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

