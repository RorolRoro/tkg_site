'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Ticket, Clock, CheckCircle, MessageSquare, User, Calendar, Plus, Image, Link, Send } from 'lucide-react'
import { PhotoUpload } from '@/components/ui/photo-upload'

interface TicketMessage {
  id: string
  content: string
  sender: 'user' | 'staff'
  senderName: string
  timestamp: string
  attachments?: {
    type: 'image' | 'link'
    url: string
    name?: string
  }[]
}

interface UserTicket {
  id: string
  title: string
  description: string
  type: 'CANDIDATURE_STAFF' | 'CANDIDATURE_CLAN'
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  messages: TicketMessage[]
  createdAt: string
  updatedAt: string
}

export default function MesTicketsPage() {
  const { data: session } = useSession()
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showClosedTickets, setShowClosedTickets] = useState(false)

  useEffect(() => {
    fetchUserTickets()
  }, [])

  const fetchUserTickets = async () => {
    try {
      const response = await fetch('/api/user/tickets')
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

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null)
        setNewMessage('')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
    }
  }

  const handlePhotoUpload = async (files: File[]) => {
    // Simuler l'upload des photos
    console.log('Upload de photos:', files)
    
    // Ici, vous pourriez uploader les fichiers vers un service comme Cloudinary
    // Pour l'instant, on simule juste l'ajout des URLs
    const photoUrls = files.map(file => ({
      type: 'image' as const,
      url: URL.createObjectURL(file),
      name: file.name
    }))

    // Ajouter les photos au message
    if (newMessage.trim()) {
      // Si il y a du texte, l'envoyer avec les photos
      try {
        const response = await fetch(`/api/tickets/${selectedTicket?.id}/messages`, {
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
      // Si pas de texte, juste envoyer les photos
      try {
        const response = await fetch(`/api/tickets/${selectedTicket?.id}/messages`, {
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

  const openTicket = (ticket: UserTicket) => {
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
  }

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CANDIDATURE_STAFF':
        return 'Candidature Staff'
      case 'CANDIDATURE_CLAN':
        return 'Candidature Clan'
      default:
        return type
    }
  }

  const getFilteredTickets = () => {
    let filtered = tickets

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ticket => ticket.type === selectedCategory)
    }

    // Séparer les tickets fermés
    const openTickets = filtered.filter(ticket => ticket.status !== 'CLOSED')
    const closedTickets = filtered.filter(ticket => ticket.status === 'CLOSED')

    return { openTickets, closedTickets }
  }

  const categories = [
    { id: 'all', label: 'Tous', count: tickets.length },
    { id: 'CANDIDATURE_STAFF', label: 'Candidature Staff', count: tickets.filter(t => t.type === 'CANDIDATURE_STAFF').length },
    { id: 'CANDIDATURE_CLAN', label: 'Candidature Clan', count: tickets.filter(t => t.type === 'CANDIDATURE_CLAN').length },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement de vos tickets...</p>
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
            Mes Tickets
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Gérez vos candidatures et suivez les réponses du staff en temps réel.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {tickets.filter(t => t.status === 'OPEN').length}
              </div>
              <div className="text-gray-400">Ouverts</div>
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
                    <p className="text-gray-400 mb-6">
                      Vous n'avez pas encore créé de ticket.
                    </p>
                    <Button
                      variant="glow"
                      onClick={() => window.location.href = '/tickets'}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un Ticket
                    </Button>
                  </CardContent>
                </Card>
              )
            }

            return (
              <>
                {/* Open Tickets */}
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
                              {getTypeLabel(ticket.type)}
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
                                    {getTypeLabel(ticket.type)}
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
                    <span className="text-white ml-2">{getTypeLabel(selectedTicket.type)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Statut:</span>
                    <span className="text-white ml-2">{selectedTicket.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Créé le:</span>
                    <span className="text-white ml-2">
                      {new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Dernière activité:</span>
                    <span className="text-white ml-2">
                      {new Date(selectedTicket.updatedAt).toLocaleDateString('fr-FR')}
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
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-700 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-medium">{message.senderName}</span>
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleDateString('fr-FR')} à {new Date(message.timestamp).toLocaleTimeString('fr-FR')}
                          </span>
                        </div>
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
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                {attachment.type === 'image' ? (
                                  <Image className="h-3 w-3" />
                                ) : (
                                  <Link className="h-3 w-3" />
                                )}
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs underline hover:no-underline"
                                >
                                  {attachment.name || 'Pièce jointe'}
                                </a>
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
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    rows={3}
                    className="flex-1"
                  />
                </div>
                
                {/* Photo Upload */}
                {showPhotoUpload && (
                  <div className="bg-dark-800/50 p-4 rounded-lg">
                    <PhotoUpload onUpload={handlePhotoUpload} />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                      onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    >
                      <Image className="h-4 w-4" />
                      <span>Photo</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                      onClick={() => {
                        const link = prompt('Entrez l\'URL du lien:')
                        if (link) {
                          // Ajouter le lien directement sans emoji si c'est déjà un lien complet
                          if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('steam://')) {
                            setNewMessage(prev => prev + (prev ? '\n' : '') + link)
                          } else {
                            setNewMessage(prev => prev + (prev ? '\n' : '') + `🔗 ${link}`)
                          }
                        }
                      }}
                    >
                      <Link className="h-4 w-4" />
                      <span>Lien</span>
                    </Button>
                  </div>
                  
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    variant="glow"
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Envoyer</span>
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
