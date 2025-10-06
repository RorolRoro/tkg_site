import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Données mockées pour les tickets (en attendant la base de données)
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
    messages: [
      {
        id: '1',
        content: 'Bonjour, je souhaite postuler pour le poste de modérateur. J\'ai de l\'expérience dans la modération de serveurs Discord et je suis très actif sur le serveur depuis plusieurs mois.',
        sender: 'user',
        senderName: 'Alexandre K.',
        timestamp: new Date('2024-01-15T10:30:00Z').toISOString()
      },
      {
        id: '2',
        content: 'Merci pour votre candidature. Nous allons examiner votre dossier et vous recontacterons sous peu. Pouvez-vous nous donner plus de détails sur votre expérience ?',
        sender: 'staff',
        senderName: 'Staff Tokyo Ghoul RP',
        timestamp: new Date('2024-01-15T14:20:00Z').toISOString()
      }
    ],
    createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T14:20:00Z').toISOString()
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
    messages: [
      {
        id: '3',
        content: 'Salut ! Mon personnage ghoul souhaite rejoindre le clan Aogiri Tree. Il a un passé violent et partage les idéaux du clan.',
        sender: 'user',
        senderName: 'Marie L.',
        timestamp: new Date('2024-01-14T15:45:00Z').toISOString()
      }
    ],
    createdAt: new Date('2024-01-14T15:45:00Z').toISOString(),
    updatedAt: new Date('2024-01-14T15:45:00Z').toISOString()
  }
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les membres du staff peuvent voir tous les tickets
    if (session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    return NextResponse.json(mockTickets)
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { title, description, type } = await request.json()

    if (!title || !description || !type) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Créer un nouveau ticket avec les données mockées
    const newTicket = {
      id: Date.now().toString(),
      title,
      description,
      type,
      status: 'OPEN',
      user: {
        name: session.user.name || 'Utilisateur',
        email: session.user.email || 'email@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockTickets.push(newTicket)

    return NextResponse.json(newTicket, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
