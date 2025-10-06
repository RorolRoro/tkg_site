import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Import des données mockées (même array que dans route.ts)
let mockTickets: any[] = [
  {
    id: '1',
    title: 'Candidature pour le poste de Modérateur',
    description: 'Bonjour, je souhaite postuler pour le poste de modérateur. J\'ai de l\'expérience dans la modération de serveurs Discord et je suis très actif sur le serveur depuis plusieurs mois.',
    type: 'CANDIDATURE_STAFF',
    status: 'OPEN',
    user: {
      name: 'Alexandre K.',
      email: 'alexandre@example.com'
    },
    createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T10:30:00Z').toISOString()
  },
  {
    id: '2',
    title: 'Demande d\'intégration au clan Aogiri Tree',
    description: 'Salut ! Mon personnage ghoul souhaite rejoindre le clan Aogiri Tree. Il a un passé violent et partage les idéaux du clan.',
    type: 'CANDIDATURE_CLAN',
    status: 'IN_PROGRESS',
    user: {
      name: 'Marie L.',
      email: 'marie@example.com'
    },
    response: 'Merci pour votre candidature. Nous allons examiner votre demande et vous recontacterons sous peu.',
    createdAt: new Date('2024-01-14T15:45:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T09:20:00Z').toISOString()
  }
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les membres du staff peuvent modifier les tickets
    if (session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { status, response } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Statut manquant' }, { status: 400 })
    }

    // Trouver et mettre à jour le ticket dans les données mockées
    const ticketIndex = mockTickets.findIndex(t => t.id === params.id)
    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 })
    }

    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      status,
      response,
      respondedBy: session.user.id,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(mockTickets[ticketIndex])
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
