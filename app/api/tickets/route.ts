import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canAccessTicketCategory, TICKET_CATEGORIES, type TicketCategory } from '@/lib/ticket-permissions'
import { getAllTickets, addTicket } from '@/lib/tickets-store'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Filtrer les tickets selon les permissions de l'utilisateur
    const allTickets = getAllTickets()
    const userId = session.user.id || 'unknown'
    const accessibleTickets = allTickets.filter(ticket => {
      // L'utilisateur peut toujours voir ses propres tickets
      if (ticket.userId === userId) {
        return true
      }

      // Si le ticket n'a pas de catégorie, seuls les staffs peuvent le voir
      if (!ticket.category && !ticket.type) {
        return session.user.role === 'STAFF' || session.user.role === 'ADMIN'
      }

      // Vérifier l'accès selon la catégorie
      const category = (ticket.category || ticket.type) as TicketCategory
      if (category && TICKET_CATEGORIES[category]) {
        return canAccessTicketCategory(
          session.user.id,
          session.user.role,
          category
        )
      }

      // Par défaut, seuls les staffs peuvent voir
      return session.user.role === 'STAFF' || session.user.role === 'ADMIN'
    })

    // Filtrer les tickets fermés dans "TOUS" - seulement les tickets ouverts
    const filteredTickets = accessibleTickets.filter(ticket => ticket.status !== 'CLOSED')

    return NextResponse.json(filteredTickets)
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

    const { title, description, category, additionalInfo, attachments, steamId } = await request.json()

    if (!title || !description || !category || !steamId) {
      return NextResponse.json({ error: 'Données manquantes (titre, description, catégorie et Steam ID requis)' }, { status: 400 })
    }

    // Vérifier que la catégorie existe
    if (!TICKET_CATEGORIES[category as TicketCategory]) {
      return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
    }

    // Créer un nouveau ticket avec les données mockées
    const newTicket = {
      id: Date.now().toString(),
      title,
      description,
      category: category as TicketCategory,
      additionalInfo: additionalInfo || '',
      steamId: steamId || '',
      status: 'OPEN' as const,
      userId: session.user.id || 'unknown',
      user: {
        name: session.user.name || 'Utilisateur',
        email: session.user.email || 'email@example.com',
        discordId: session.user.id,
        discordUsername: session.user.name || undefined
      },
      messages: [
        {
          id: Date.now().toString(),
          content: description + (additionalInfo ? `\n\nInformations supplémentaires:\n${additionalInfo}` : ''),
          sender: 'user' as const,
          senderName: session.user.name || 'Utilisateur',
          senderDiscordId: session.user.id,
          senderDiscordUsername: session.user.name || undefined,
          timestamp: new Date().toISOString(),
          attachments: attachments || []
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addTicket(newTicket)

    return NextResponse.json(newTicket, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
