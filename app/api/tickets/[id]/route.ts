import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTicketById, updateTicket } from '@/lib/tickets-store'

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

    // Trouver et mettre à jour le ticket
    const ticket = getTicketById(params.id)
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 })
    }

    const updatedTicket = updateTicket(params.id, {
      status,
      ...(response && { response }),
      ...(session.user.id && { respondedBy: session.user.id })
    })

    if (!updatedTicket) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
