'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { PhotoUpload } from '@/components/ui/photo-upload'
import { MediaUpload, type MediaItem } from '@/components/ui/media-upload'
import { Ticket, Clock, CheckCircle, XCircle, MessageSquare, User, Calendar, Plus, Image, Link, Send, Play, Square, Edit } from 'lucide-react'
import { TICKET_CATEGORIES } from '@/lib/ticket-permissions'

interface TicketMessage {
  id: string
  content: string
  sender: 'user' | 'staff'
  senderName: string
  senderDiscordId?: string
  senderDiscordUsername?: string
  timestamp: string
  attachments?: {
    type: 'image' | 'link' | 'video'
    url: string
    name?: string
  }[]
}

interface TicketData {
  id: string
  title: string
  description: string
  category?: string
  type?: 'CANDIDATURE_STAFF' | 'CANDIDATURE_CLAN' | string
  steamId?: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  user: {
    name: string
    email: string
    discordId?: string
    discordUsername?: string
  }
  messages: TicketMessage[]
  createdAt: string
  updatedAt: string
}

export default function StaffTicketsPage() {
  const { data: session } = useSession()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [staffMediaItems, setStaffMediaItems] = useState<MediaItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showClosedTickets, setShowClosedTickets] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingMessageContent, setEditingMessageContent] = useState('')
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return

    // Vérifier si le ticket est fermé
    if (selectedTicket.status === 'CLOSED') {
      alert('Impossible d\'envoyer un message sur un ticket fermé')
      return
    }

    try {
      const response = await fetch(`/api/staff/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          attachments: staffMediaItems.map(item => ({
            type: item.type,
            url: item.dataUrl || item.url, // Utiliser dataUrl (base64) pour la persistance
            name: item.name
          }))
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null)
        setNewMessage('')
        setStaffMediaItems([])
        fetchTickets()
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      alert('Erreur lors de l\'envoi du message')
    }
  }

  const handlePhotoUpload = async (files: File[]) => {
    // Simuler l'upload des photos
    console.log('Upload de photos:', files)
    
    const photoUrls = files.map(file => ({
      type: 'image' as const,
      url: URL.createObjectURL(file),
      name: file.name
    }))

    if (newMessage.trim()) {
      try {
        const response = await fetch(`/api/staff/tickets/${selectedTicket?.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newMessage,
            attachments: photoUrls
          }),
        })

        if (response.ok) {
          const message = await response.json()
          setSelectedTicket(prev => prev ? {
            ...prev,
            messages: [...prev.messages, message]
          } : null)
          setNewMessage('')
          setShowPhotoUpload(false)
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message avec photos:', error)
      }
    } else {
      try {
        const response = await fetch(`/api/staff/tickets/${selectedTicket?.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: '📷 Photos partagées',
            attachments: photoUrls
          }),
        })

        if (response.ok) {
          const message = await response.json()
          setSelectedTicket(prev => prev ? {
            ...prev,
            messages: [...prev.messages, message]
          } : null)
          setShowPhotoUpload(false)
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi des photos:', error)
      }
    }
  }

  const updateTicketStatus = async (ticketId: string, status: 'IN_PROGRESS' | 'CLOSED') => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
        }),
      })

      if (response.ok) {
        await fetchTickets()
        if (selectedTicket) {
          setSelectedTicket(prev => prev ? { ...prev, status } : null)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du ticket:', error)
    }
  }

  const openTicket = (ticket: TicketData) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const closeTicket = () => {
    // Sauvegarder les modifications dans la liste des tickets
    if (selectedTicket) {
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id ? selectedTicket : ticket
      ))
    }
    setIsModalOpen(false)
    setSelectedTicket(null)
    setNewMessage('')
    setShowPhotoUpload(false)
    setEditingMessageId(null)
    setEditingMessageContent('')
  }

  const editMessage = (messageId: string) => {
    const message = selectedTicket?.messages.find(m => m.id === messageId)
    if (message) {
      setEditingMessageId(messageId)
      setEditingMessageContent(message.content)
    }
  }

  const saveMessageEdit = async () => {
    if (!editingMessageId || !selectedTicket) return

    console.log('Sauvegarde du message:', {
      ticketId: selectedTicket.id,
      messageId: editingMessageId,
      content: editingMessageContent
    })

    try {
      const response = await fetch(`/api/staff/tickets/${selectedTicket.id}/messages/${editingMessageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editingMessageContent,
        }),
      })

      console.log('Réponse API:', response.status, response.statusText)

      if (response.ok) {
        const updatedMessage = await response.json()
        console.log('Message mis à jour:', updatedMessage)
        
        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: prev.messages.map(m => 
            m.id === editingMessageId ? updatedMessage : m
          )
        } : null)
        setEditingMessageId(null)
        setEditingMessageContent('')
      } else {
        const errorData = await response.json()
        console.error('Erreur API:', errorData)
      }
    } catch (error) {
      console.error('Erreur lors de la modification du message:', error)
    }
  }

  const cancelMessageEdit = () => {
    setEditingMessageId(null)
    setEditingMessageContent('')
  }

  const getFilteredTickets = () => {
    let filtered = tickets

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ticket => (ticket.category || ticket.type) === selectedCategory)
    }

    // Séparer les tickets fermés
    const openTickets = filtered.filter(ticket => ticket.status !== 'CLOSED')
    const closedTickets = filtered.filter(ticket => ticket.status === 'CLOSED')

    return { openTickets, closedTickets, allFiltered: filtered }
  }

  // Obtenir les catégories uniques des tickets
  const uniqueCategories = Array.from(new Set(tickets.map(t => t.category || t.type).filter(Boolean))) as string[]
  const categories = [
    { 
      id: 'all', 
      label: 'Tous', 
      count: tickets.filter(t => t.status !== 'CLOSED').length
    },
    ...uniqueCategories.map(cat => ({
      id: cat,
      label: cat,
      count: showClosedTickets
        ? tickets.filter(t => (t.category || t.type) === cat && t.status !== 'CLOSED').length
        : tickets.filter(t => (t.category || t.type) === cat).length
    }))
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-600'
      case 'IN_PROGRESS':
        return 'bg-yellow-600'
      case 'CLOSED':
        return 'bg-green-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <MessageSquare className="h-4 w-4" />
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Ticket className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type?: string) => {
    if (!type) return 'Non spécifié'
    // Utiliser les labels des catégories si disponible
    if (TICKET_CATEGORIES[type as keyof typeof TICKET_CATEGORIES]) {
      return TICKET_CATEGORIES[type as keyof typeof TICKET_CATEGORIES].label
    }
    return type
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement des tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Gestion des Tickets
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Gérez et répondez aux tickets de la communauté. 
            Assurez-vous de traiter chaque demande avec attention et professionnalisme.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {tickets.filter(t => t.status === 'OPEN').length}
              </div>
              <div className="text-gray-400">Tickets Ouverts</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {tickets.filter(t => t.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-gray-400">En Cours</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {tickets.filter(t => t.status === 'CLOSED').length}
              </div>
              <div className="text-gray-400">Fermés</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">
                {tickets.length}
              </div>
              <div className="text-gray-400">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'glow' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.label}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
          
          {/* Toggle Closed Tickets */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClosedTickets(!showClosedTickets)}
              className="flex items-center space-x-2"
            >
              <span>{showClosedTickets ? 'Masquer' : 'Afficher'} les tickets fermés</span>
              <Badge variant="secondary">
                {getFilteredTickets().closedTickets.length}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-6">
          {(() => {
            const { openTickets, closedTickets } = getFilteredTickets()
            
            if (openTickets.length === 0 && (!showClosedTickets || closedTickets.length === 0)) {
              return (
                <Card className="glass-effect">
                  <CardContent className="p-12 text-center">
                    <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl mb-2">Aucun ticket</h3>
                    <p className="text-gray-400">
                      Il n&apos;y a actuellement aucun ticket à traiter.
                    </p>
                  </CardContent>
                </Card>
              )
            }

            return (
              <>
                {/* Open Tickets */}
                {openTickets.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-white text-lg font-semibold">Tickets Ouverts</h3>
                    <Badge variant="secondary">{openTickets.length}</Badge>
                  </div>
                  <div className="space-y-4">
                    {openTickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className="glass-effect hover:shadow-glow transition-all duration-300 cursor-pointer"
                    onClick={() => openTicket(ticket)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CardTitle className="text-white text-lg">{ticket.title}</CardTitle>
                            <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1">{ticket.status}</span>
                            </Badge>
                                    <Badge variant="outline" className="text-primary-400 border-primary-400">
                                      {getTypeLabel(ticket.category || ticket.type)}
                                    </Badge>
                          </div>
                          <CardDescription className="text-gray-400 line-clamp-2">
                            {ticket.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.user.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{ticket.messages.length} messages</span>
                          </div>
                        </div>
                        {ticket.messages.length > 0 && (
                          <div className="flex items-center space-x-1 text-primary-400">
                            <MessageSquare className="h-4 w-4" />
                            <span>Répondu</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                    ))}
                  </div>
                </div>
                )}

                {/* Separator */}
                {openTickets.length > 0 && showClosedTickets && closedTickets.length > 0 && (
                  <div className="my-8 border-t border-dark-700"></div>
                )}

                {/* Closed Tickets Section */}
                {showClosedTickets && closedTickets.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-white text-lg font-semibold">Tickets Fermés</h3>
                      <Badge variant="secondary">{closedTickets.length}</Badge>
                    </div>
                    <div className="space-y-4">
                      {closedTickets.map((ticket) => (
                        <Card 
                          key={ticket.id} 
                          className="glass-effect opacity-60 hover:opacity-80 transition-all duration-300 cursor-pointer"
                          onClick={() => openTicket(ticket)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <CardTitle className="text-white text-lg">{ticket.title}</CardTitle>
                                  <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                                    {getStatusIcon(ticket.status)}
                                    <span className="ml-1">{ticket.status}</span>
                                  </Badge>
                                    <Badge variant="outline" className="text-primary-400 border-primary-400">
                                      {getTypeLabel(ticket.category || ticket.type)}
                                    </Badge>
                                </div>
                                <CardDescription className="text-gray-400 line-clamp-2">
                                  {ticket.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{ticket.user.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{ticket.messages.length} messages</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          })()}
        </div>

        {/* Chat Modal */}
        {selectedTicket && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeTicket}
            title={`Ticket #${selectedTicket.id} - ${selectedTicket.title}`}
            className="max-w-4xl"
          >
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="bg-dark-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2">{getTypeLabel(selectedTicket.category || selectedTicket.type)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Statut:</span>
                    <span className="text-white ml-2">{selectedTicket.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Utilisateur:</span>
                    <span className="text-white ml-2">
                      {selectedTicket.user.discordUsername || selectedTicket.user.name}
                      {selectedTicket.user.discordId && (
                        <span className="text-xs opacity-60 ml-1">
                          ({selectedTicket.user.discordId})
                        </span>
                      )}
                    </span>
                  </div>
                  {selectedTicket.steamId && (
                    <div>
                      <span className="text-gray-400">Steam ID:</span>
                      <span className="text-white ml-2">{selectedTicket.steamId}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Créé le:</span>
                    <span className="text-white ml-2">
                      {new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="bg-dark-800/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-dark-700 text-gray-300'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {message.senderDiscordUsername || message.senderName}
                              {message.senderDiscordId && (
                                <span className="text-xs opacity-60 ml-1">
                                  ({message.senderDiscordId})
                                </span>
                              )}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleDateString('fr-FR')} à {new Date(message.timestamp).toLocaleTimeString('fr-FR')}
                            </span>
                          </div>
                          {message.sender === 'staff' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              onClick={() => editMessage(message.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {editingMessageId === message.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingMessageContent}
                              onChange={(e) => setEditingMessageContent(e.target.value)}
                              rows={3}
                              className="text-sm"
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={saveMessageEdit}
                                className="h-6 px-2 text-xs"
                              >
                                Sauvegarder
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelMessageEdit}
                                className="h-6 px-2 text-xs text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content.split('\n').map((line, index) => {
                              // Détecter les liens (commençant par http://, https://, ou steam://)
                              const linkRegex = /(https?:\/\/[^\s]+|steam:\/\/[^\s]+)/g
                              const parts = line.split(linkRegex)
                              
                              return (
                                <div key={index}>
                                  {parts.map((part, partIndex) => {
                                    if (linkRegex.test(part)) {
                                      return (
                                        <a
                                          key={partIndex}
                                          href={part}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-400 hover:text-blue-300 underline break-all"
                                        >
                                          {part}
                                        </a>
                                      )
                                    }
                                    return part
                                  })}
                                </div>
                              )
                            })}
                          </div>
                        )}
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index}>
                                {attachment.type === 'image' && (
                                  <div className="rounded-lg overflow-hidden cursor-pointer" onClick={() => setExpandedImage(attachment.url)}>
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name || `Image ${index + 1}`}
                                      className="max-w-full max-h-64 object-contain hover:opacity-90 transition-opacity"
                                    />
                                  </div>
                                )}
                                {attachment.type === 'video' && (
                                  <div className="rounded-lg overflow-hidden">
                                    <video
                                      src={attachment.url}
                                      controls
                                      className="max-w-full max-h-64"
                                    >
                                      Votre navigateur ne supporte pas la lecture de vidéos.
                                    </video>
                                  </div>
                                )}
                                {attachment.type === 'link' && (
                                  <div className="flex items-center space-x-2">
                                    <Link className="h-4 w-4" />
                                    <a
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs underline hover:no-underline break-all"
                                    >
                                      {attachment.name || attachment.url}
                                    </a>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              {selectedTicket.status === 'CLOSED' ? (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 text-center">
                  <p className="text-red-400">Ce ticket est fermé. Vous ne pouvez plus envoyer de messages.</p>
                </div>
              ) : (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    rows={3}
                    className="flex-1"
                  />
                </div>
                
                {/* Media Upload */}
                <div className="bg-dark-800/30 rounded-lg p-4">
                  <MediaUpload
                    onMediaChange={setStaffMediaItems}
                    maxFiles={10}
                    maxSize={50}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() && staffMediaItems.length === 0}
                      variant="glow"
                      className="flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Envoyer</span>
                    </Button>
                  </div>
                </div>
              </div>
              )}

              {/* Staff Actions */}
              <div className="flex gap-3 pt-4 border-t border-dark-700">
                <Button
                  variant="outline"
                  onClick={closeTicket}
                  className="flex-1"
                >
                  Fermer
                </Button>
                {selectedTicket.status === 'OPEN' && (
                  <Button
                    variant="secondary"
                    onClick={() => updateTicketStatus(selectedTicket.id, 'IN_PROGRESS')}
                    className="flex-1 flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Marquer en Cours</span>
                  </Button>
                )}
                <Button
                  variant="glow"
                  onClick={() => updateTicketStatus(selectedTicket.id, 'CLOSED')}
                  className="flex-1 flex items-center space-x-2"
                >
                  <Square className="h-4 w-4" />
                  <span>Fermer le Ticket</span>
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Image Expansion Modal */}
        {expandedImage && (
          <Modal
            isOpen={!!expandedImage}
            onClose={() => setExpandedImage(null)}
            title="Image"
            className="max-w-4xl"
          >
            <div className="p-4">
              <img
                src={expandedImage}
                alt="Image agrandie"
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
