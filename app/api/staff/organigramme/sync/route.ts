import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const DISCORD_SERVER_ID = '1332323284825411658'

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

    console.log('Début de la synchronisation avec Discord...')

    // Récupérer les membres Discord
    let discordMembers = []
    
    if (process.env.DISCORD_BOT_TOKEN) {
      try {
        console.log('Récupération des membres Discord...')
        const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}/members?limit=1000`, {
          headers: {
            'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        })
        
        if (response.ok) {
          discordMembers = await response.json()
          console.log(`✅ Récupéré ${discordMembers.length} membres Discord`)
        } else {
          const errorText = await response.text()
          console.error('❌ Erreur API Discord:', response.status, errorText)
          return NextResponse.json({ 
            error: 'Erreur lors de la récupération des membres Discord',
            details: errorText
          }, { status: response.status })
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération Discord:', error)
        return NextResponse.json({ 
          error: 'Erreur de connexion à Discord',
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        }, { status: 500 })
      }
    } else {
      console.log('⚠️ DISCORD_BOT_TOKEN non configuré')
      return NextResponse.json({ 
        error: 'Token Discord non configuré',
        details: 'Veuillez configurer DISCORD_BOT_TOKEN dans les variables d\'environnement'
      }, { status: 500 })
    }

    // Filtrer les membres staff
    const staffMembers = discordMembers.filter((member: any) => {
      return member.roles && member.roles.some((roleId: string) => Object.values(DISCORD_ROLES).includes(roleId))
    })

    console.log(`📊 ${staffMembers.length} membres staff trouvés`)

    // Transformer les données
    const transformedMembers = staffMembers.map((member: any) => {
      const user = member.user
      const displayName = member.nick || user.global_name || user.username
      const avatarUrl = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`

      // Déterminer le rôle principal
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

      // Déterminer les permissions
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
        isActive: true,
        username: user.username,
        globalName: user.global_name,
        discriminator: user.discriminator
      }
    })

    console.log('✅ Synchronisation terminée avec succès')

    return NextResponse.json({
      success: true,
      message: 'Synchronisation réussie',
      membersCount: transformedMembers.length,
      members: transformedMembers
    })

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur lors de la synchronisation',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}