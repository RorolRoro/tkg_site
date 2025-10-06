import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les membres du staff peuvent récupérer les profils
    if (session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const discordId = params.id

    // Simuler la récupération du profil Discord
    // En production, vous utiliseriez l'API Discord avec un bot token
    const mockProfile = {
      id: discordId,
      username: `User_${discordId.slice(-4)}`,
      global_name: `User ${discordId.slice(-4)}`,
      avatar: `https://cdn.discordapp.com/avatars/${discordId}/avatar.png`,
      discriminator: '0',
      public_flags: 0,
      banner: null,
      accent_color: null,
      banner_color: null
    }

    return NextResponse.json(mockProfile)
  } catch (error) {
    console.error('Erreur lors de la récupération du profil Discord:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

