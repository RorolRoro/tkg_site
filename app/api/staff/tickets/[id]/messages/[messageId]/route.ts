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
        senderName: 'Staff',
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    console.log('API PATCH - Paramètres:', params)
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log('API PATCH - Non authentifié')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les membres du staff peuvent modifier les messages
    if (session.user.role !== 'STAFF') {
      console.log('API PATCH - Accès refusé, rôle:', session.user.role)
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { content } = await request.json()
    console.log('API PATCH - Contenu reçu:', content)

    if (!content || !content.trim()) {
      console.log('API PATCH - Contenu manquant')
      return NextResponse.json({ error: 'Contenu du message manquant' }, { status: 400 })
    }

    // Trouver le ticket
    const ticketIndex = userTickets.findIndex(t => t.id === params.id)
    console.log('API PATCH - Index du ticket:', ticketIndex)
    
    if (ticketIndex === -1) {
      console.log('API PATCH - Ticket non trouvé, ID:', params.id)
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 })
    }

    // Trouver le message
    const messageIndex = userTickets[ticketIndex].messages.findIndex((m: any) => m.id === params.messageId)
    console.log('API PATCH - Index du message:', messageIndex)
    
    if (messageIndex === -1) {
      console.log('API PATCH - Message non trouvé, ID:', params.messageId)
      return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 })
    }

    // Vérifier que c'est un message staff
    const message = userTickets[ticketIndex].messages[messageIndex]
    console.log('API PATCH - Message trouvé:', message)
    
    if (message.sender !== 'staff') {
      console.log('API PATCH - Message non staff, sender:', message.sender)
      return NextResponse.json({ error: 'Seuls les messages staff peuvent être modifiés' }, { status: 403 })
    }

    // Mettre à jour le message
    const updatedMessage = {
      ...message,
      content: content.trim(),
      editedAt: new Date().toISOString()
    }
    
    userTickets[ticketIndex].messages[messageIndex] = updatedMessage
    userTickets[ticketIndex].updatedAt = new Date().toISOString()

    console.log('API PATCH - Message mis à jour:', updatedMessage)
    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error('Erreur lors de la modification du message staff:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
