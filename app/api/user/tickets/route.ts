import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTicketsByUserId } from '@/lib/tickets-store'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les tickets de l'utilisateur connecté
    const userId = session.user.id || 'unknown'
    const userTickets = getTicketsByUserId(userId)
    
    // Transformer les messages pour remplacer "Vous" par le nom de l'utilisateur
    const formattedTickets = userTickets.map(ticket => ({
      ...ticket,
      messages: ticket.messages.map(msg => ({
        ...msg,
        senderName: msg.sender === 'user' ? 'Vous' : msg.senderName
      }))
    }))

    return NextResponse.json(formattedTickets)
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets utilisateur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

