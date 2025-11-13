// Store partagé pour les tickets (en attendant une base de données)
// Ce fichier permet de partager les tickets entre les différentes routes API
// Les tickets sont persistés dans un fichier JSON pour survivre aux redémarrages

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface TicketData {
  id: string
  title: string
  description: string
  category?: string
  type?: string
  additionalInfo?: string
  steamId?: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  userId: string
  user: {
    name: string
    email: string
    discordId?: string
    discordUsername?: string
  }
  messages: Array<{
    id: string
    content: string
    sender: 'user' | 'staff'
    senderName: string
    senderDiscordId?: string
    senderDiscordUsername?: string
    timestamp: string
    attachments?: Array<{
      type: 'image' | 'link' | 'video'
      url: string
      name?: string
    }>
  }>
  createdAt: string
  updatedAt: string
}

const TICKETS_FILE = join(process.cwd(), 'data', 'tickets.json')

// Initialiser les tickets par défaut
const defaultTickets: TicketData[] = [
  {
    id: '1',
    title: 'Candidature pour le poste de Modérateur',
    description: 'Bonjour, je souhaite postuler pour le poste de modérateur. J\'ai de l\'expérience dans la modération de serveurs Discord et je suis très actif sur le serveur depuis plusieurs mois.',
    type: 'CANDIDATURE_STAFF',
    status: 'OPEN',
    userId: 'user1',
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
    userId: 'user2',
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

// Charger les tickets depuis le fichier ou utiliser les tickets par défaut
function loadTickets(): TicketData[] {
  try {
    // En build statique, le fichier peut ne pas exister, c'est normal
    if (existsSync(TICKETS_FILE)) {
      const data = readFileSync(TICKETS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    // Ne pas faire échouer le build si le fichier n'existe pas ou est corrompu
    console.warn('Impossible de charger les tickets depuis le fichier (utilisation des tickets par défaut):', error)
  }
  return defaultTickets
}

// Sauvegarder les tickets dans le fichier
function saveTickets(tickets: TicketData[]): void {
  try {
    const { mkdirSync } = require('fs')
    const dir = join(process.cwd(), 'data')
    // Créer le dossier s'il n'existe pas (avec gestion d'erreur silencieuse)
    try {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
    } catch (mkdirError) {
      // Ignorer les erreurs de création de dossier (peut échouer en build statique)
      console.warn('Impossible de créer le dossier data:', mkdirError)
    }
    
    // Essayer d'écrire le fichier, mais ne pas échouer si on est en build statique
    try {
      writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), 'utf-8')
    } catch (writeError) {
      // En build statique ou sur Netlify, on peut ne pas pouvoir écrire
      // C'est OK, les tickets seront en mémoire pendant la session
      console.warn('Impossible d\'écrire le fichier de tickets (normal en build statique):', writeError)
    }
  } catch (error) {
    // Ne pas faire échouer le build à cause de la sauvegarde des tickets
    console.warn('Erreur lors de la sauvegarde des tickets (non bloquant):', error)
  }
}

let ticketsStore: TicketData[] = loadTickets()

export function getAllTickets(): TicketData[] {
  return ticketsStore
}

export function getTicketById(id: string): TicketData | undefined {
  return ticketsStore.find(ticket => ticket.id === id)
}

export function getTicketsByUserId(userId: string): TicketData[] {
  return ticketsStore.filter(ticket => ticket.userId === userId)
}

export function addTicket(ticket: TicketData): void {
  ticketsStore.push(ticket)
  saveTickets(ticketsStore)
}

export function updateTicket(id: string, updates: Partial<TicketData>): TicketData | null {
  const index = ticketsStore.findIndex(ticket => ticket.id === id)
  if (index === -1) {
    return null
  }
  ticketsStore[index] = { ...ticketsStore[index], ...updates, updatedAt: new Date().toISOString() }
  saveTickets(ticketsStore)
  return ticketsStore[index]
}

export function addMessageToTicket(ticketId: string, message: TicketData['messages'][0]): TicketData | null {
  const ticket = getTicketById(ticketId)
  if (!ticket) {
    return null
  }
  ticket.messages.push(message)
  ticket.updatedAt = new Date().toISOString()
  saveTickets(ticketsStore)
  return ticket
}

export function updateMessageInTicket(
  ticketId: string,
  messageId: string,
  content: string
): TicketData | null {
  const ticket = getTicketById(ticketId)
  if (!ticket) {
    return null
  }
  const message = ticket.messages.find(m => m.id === messageId)
  if (!message) {
    return null
  }
  message.content = content
  ticket.updatedAt = new Date().toISOString()
  saveTickets(ticketsStore)
  return ticket
}

