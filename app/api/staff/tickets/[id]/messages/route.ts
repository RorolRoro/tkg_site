import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Données mockées pour les messages staff (même array que dans user/tickets)
let userTickets: any[] = [
  {
    id: '1',
    title: 'Candidature pour le poste de Modérateur',
    description: 'Bonjour, je souhaite postuler pour le poste de modérateur. J\'ai de l\'expérience dans la modération de serveurs Discord et je suis très actif sur le serveur depuis plusieurs mois.',
    type: 'CANDIDATURE_STAFF',
    status: 'OPEN',
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les membres du staff peuvent envoyer des messages
    if (session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { content, attachments } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Contenu du message manquant' }, { status: 400 })
    }

    // Trouver le ticket
    const ticketIndex = userTickets.findIndex(t => t.id === params.id)
    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 })
    }

    // Créer le nouveau message
    const newMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'staff' as const,
      senderName: session.user.name || 'Staff',
      timestamp: new Date().toISOString(),
      attachments: attachments || []
    }

    // Ajouter le message au ticket
    userTickets[ticketIndex].messages.push(newMessage)
    userTickets[ticketIndex].updatedAt = new Date().toISOString()

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message staff:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
