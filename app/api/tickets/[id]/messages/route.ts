import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTicketById, addMessageToTicket } from '@/lib/tickets-store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { content, attachments } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Contenu du message manquant' }, { status: 400 })
    }

    // Trouver le ticket
    const ticket = getTicketById(params.id)
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 })
    }

    // Vérifier si le ticket est fermé
    if (ticket.status === 'CLOSED') {
      return NextResponse.json({ error: 'Impossible d\'envoyer un message sur un ticket fermé' }, { status: 403 })
    }

    // Créer le nouveau message
    const newMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user' as const,
      senderName: session.user.name || 'Utilisateur',
      senderDiscordId: session.user.id,
      senderDiscordUsername: session.user.name || undefined,
      timestamp: new Date().toISOString(),
      attachments: attachments || []
    }

    // Ajouter le message au ticket
    const updatedTicket = addMessageToTicket(params.id, newMessage)
    if (!updatedTicket) {
      return NextResponse.json({ error: 'Erreur lors de l\'ajout du message' }, { status: 500 })
    }

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

