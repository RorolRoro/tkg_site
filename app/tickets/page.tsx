'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Ticket, User, Shield, Plus, Send, Clock, CheckCircle, MessageSquare, Calendar, Image, Link, FileText, AlertCircle } from 'lucide-react'
import { PhotoUpload } from '@/components/ui/photo-upload'
import { MediaUpload, type MediaItem } from '@/components/ui/media-upload'
import { getAvailableCategoriesForCreation, TICKET_CATEGORIES, type TicketCategory } from '@/lib/ticket-permissions'

interface TicketMessage {
  id: string
  content: string
  sender: 'user' | 'staff'
  senderName: string
  timestamp: string
  attachments?: {
    type: 'image' | 'link' | 'video'
    url: string
    name?: string
  }[]
}

interface UserTicket {
  id: string
  title: string
  description: string
  category?: string
  type?: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  messages: TicketMessage[]
  createdAt: string
  updatedAt: string
}

export default function TicketsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'create' | 'my-tickets'>('create')
  
  // État pour la création de ticket
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as TicketCategory | '',
    additionalInfo: '',
    steamId: ''
  })
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const availableCategories = getAvailableCategoriesForCreation()

  // État pour mes tickets
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [showClosedTickets, setShowClosedTickets] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === 'my-tickets' && session) {
      fetchUserTickets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, session])

  const fetchUserTickets = async (includeClosed = false) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user/tickets?includeClosed=${includeClosed}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
        // Préserver le ticket sélectionné après le rechargement
        if (selectedTicket) {
          const updatedTicket = data.find((t: UserTicket) => t.id === selectedTicket.id)
          if (updatedTicket) {
            setSelectedTicket(updatedTicket)
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      alert('Vous devez être connecté pour créer un ticket')
      return
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Veuillez remplir au moins le titre et la description')
      return
    }

    if (!formData.category) {
      alert('Veuillez sélectionner une catégorie')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          additionalInfo: formData.additionalInfo,
          steamId: formData.steamId,
          attachments: mediaItems.map(item => ({
            type: item.type,
            url: item.dataUrl || item.url, // Utiliser dataUrl (base64) pour la persistance
            name: item.name
          }))
        }),
      })

      if (response.ok) {
        alert('Ticket créé avec succès !')
        setFormData({
          title: '',
          description: '',
          category: '' as TicketCategory | '',
          additionalInfo: '',
          steamId: ''
        })
        setMediaItems([])
        // Basculer vers l'onglet mes tickets et rafraîchir
        setActiveTab('my-tickets')
        fetchUserTickets()
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la création du ticket')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création du ticket')
    } finally {
      setIsSubmitting(false)
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
        // Mise à jour optimiste du ticket sélectionné
        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null)
        // Mise à jour optimiste de la liste des tickets
        setTickets(prev => prev.map(ticket => 
          ticket.id === selectedTicket.id
            ? { ...ticket, messages: [...ticket.messages, message] }
            : ticket
        ))
        setNewMessage('')
        // Ne pas recharger immédiatement - la mise à jour optimiste suffit
        // Le rechargement se fera lors de la prochaine ouverture du modal ou changement d'onglet
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
    console.log('Upload de photos:', files)
    
    const photoUrls = files.map(file => ({
      type: 'image' as const,
      url: URL.createObjectURL(file),
      name: file.name
    }))

    if (newMessage.trim()) {
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
          // Mise à jour optimiste
          setSelectedTicket(prev => prev ? {
            ...prev,
            messages: [...prev.messages, message]
          } : null)
          setTickets(prev => prev.map(ticket => 
            ticket.id === selectedTicket?.id
              ? { ...ticket, messages: [...ticket.messages, message] }
              : ticket
          ))
          setNewMessage('')
          setShowPhotoUpload(false)
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message avec photos:', error)
      }
    } else {
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
    setIsTicketModalOpen(true)
  }

  const closeTicket = () => {
    if (selectedTicket) {
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id ? selectedTicket : ticket
      ))
    }
    setIsTicketModalOpen(false)
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

  const getFilteredTickets = () => {
    const openTickets = tickets.filter(ticket => ticket.status !== 'CLOSED')
    const closedTickets = tickets.filter(ticket => ticket.status === 'CLOSED')
    return { openTickets, closedTickets }
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Système de Tickets
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Créez un ticket pour toute demande, question ou candidature. 
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Créer un Ticket
            </button>
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'my-tickets'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mes Tickets
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' ? (
          <div className="max-w-4xl mx-auto">
            {!session ? (
              <Card className="glass-effect">
                <CardContent className="p-12 text-center">
                  <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl mb-2">Connexion requise</h3>
                  <p className="text-gray-400 mb-6">
                    Vous devez être connecté pour créer un ticket.
                  </p>
                  <Button
                    variant="glow"
                    onClick={() => window.location.href = '/auth/signin'}
                  >
                    Se connecter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-effect border-l-4 border-l-primary-600">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-primary-600/10">
                      <FileText className="h-8 w-8 text-primary-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">Créer un nouveau ticket</CardTitle>
                      <CardDescription className="text-gray-400">
                        Remplissez tous les champs nécessaires pour créer votre ticket
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Titre */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Titre du ticket <span className="text-red-400">*</span>
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Donnez un titre clair et concis à votre demande"
                        required
                        className="bg-dark-800/50 border-dark-700 text-white"
                      />
                    </div>

                    {/* Catégorie */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Catégorie <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                        required
                        className="w-full px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez une catégorie...</option>
                        {['Haut Staff+', 'Haut Staff', 'Modérateur'].map((group) => (
                          <optgroup key={group} label={group}>
                            {availableCategories
                              .filter(cat => cat.group === group)
                              .map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </option>
                              ))}
                          </optgroup>
                        ))}
                      </select>
                      {formData.category && (
                        <p className="text-xs text-gray-500 mt-1">
                          {availableCategories.find(c => c.value === formData.category)?.description}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Description détaillée <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez votre demande en détail. Plus vous fournissez d'informations, plus nous pourrons vous aider rapidement..."
                        rows={8}
                        required
                        className="bg-dark-800/50 border-dark-700 text-white resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 50 caractères recommandés
                      </p>
                    </div>

                    {/* Steam ID */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Steam ID <span className="text-red-400">*</span>
                      </label>
                      <Input
                        value={formData.steamId}
                        onChange={(e) => setFormData({ ...formData, steamId: e.target.value })}
                        placeholder="Ex: 76561198000000000"
                        required
                        className="bg-dark-800/50 border-dark-700 text-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Votre identifiant Steam (obligatoire pour le traitement de votre ticket)
                      </p>
                    </div>

                    {/* Informations supplémentaires */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Informations supplémentaires
                      </label>
                      <Textarea
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                        placeholder="Toute information supplémentaire qui pourrait être utile (contexte, détails, etc.)"
                        rows={4}
                        className="bg-dark-800/50 border-dark-700 text-white resize-none mb-4"
                      />
                      
                      {/* Media Upload */}
                      <div className="bg-dark-800/30 rounded-lg p-4">
                        <label className="block text-sm font-medium text-white mb-3">
                          Ajouter des médias (images, vidéos, liens)
                        </label>
                        <MediaUpload
                          onMediaChange={setMediaItems}
                          maxFiles={10}
                          maxSize={50}
                        />
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-primary-600/10 border border-primary-600/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-300">
                          <p className="font-medium text-white mb-1">Conseil</p>
                          <p>
                            Assurez-vous de fournir toutes les informations nécessaires pour que notre équipe puisse traiter votre demande efficacement. 
                            Les tickets avec des descriptions complètes sont traités plus rapidement.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            title: '',
                            description: '',
                            category: '' as TicketCategory | '',
                            additionalInfo: '',
                            steamId: ''
                          })
                          setMediaItems([])
                        }}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Réinitialiser
                      </Button>
                      <Button
                        type="submit"
                        variant="glow"
                        className="flex-1 group"
                        disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.category || !formData.steamId.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Création en cours...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            Créer le Ticket
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <>
            {!session ? (
              <Card className="glass-effect">
                <CardContent className="p-12 text-center">
                  <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl mb-2">Connexion requise</h3>
                  <p className="text-gray-400 mb-6">
                    Vous devez être connecté pour voir vos tickets.
                  </p>
                  <Button
                    variant="glow"
                    onClick={() => window.location.href = '/auth/signin'}
                  >
                    Se connecter
                  </Button>
                </CardContent>
              </Card>
            ) : isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Chargement de vos tickets...</p>
              </div>
            ) : (
              <>
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

                {/* Toggle Closed Tickets */}
                <div className="mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newValue = !showClosedTickets
                      setShowClosedTickets(newValue)
                      fetchUserTickets(newValue)
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span>{showClosedTickets ? 'Masquer' : 'Afficher'} les tickets fermés</span>
                    <Badge variant="secondary">
                      {getFilteredTickets().closedTickets.length}
                    </Badge>
                  </Button>
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
                              Vous n&apos;avez pas encore créé de ticket.
                            </p>
                            <Button
                              variant="glow"
                              onClick={() => setActiveTab('create')}
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
                                    {(ticket.category || ticket.type) && (
                                      <Badge variant="outline" className="text-primary-400 border-primary-400">
                                        {TICKET_CATEGORIES[(ticket.category || ticket.type) as TicketCategory]?.label || ticket.category || ticket.type}
                                      </Badge>
                                    )}
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
                                          {(ticket.category || ticket.type) && (
                                            <Badge variant="outline" className="text-primary-400 border-primary-400">
                                              {TICKET_CATEGORIES[(ticket.category || ticket.type) as TicketCategory]?.label || ticket.category || ticket.type}
                                            </Badge>
                                          )}
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
                    isOpen={isTicketModalOpen}
                    onClose={closeTicket}
                    title={`Ticket #${selectedTicket.id} - ${selectedTicket.title}`}
                    className="max-w-4xl"
                  >
                    <div className="space-y-6">
                      {/* Ticket Info */}
                      <div className="bg-dark-800/50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {(selectedTicket.category || selectedTicket.type) && (
                            <div>
                              <span className="text-gray-400">Catégorie:</span>
                              <span className="text-white ml-2">
                                {TICKET_CATEGORIES[(selectedTicket.category || selectedTicket.type) as TicketCategory]?.label || selectedTicket.category || selectedTicket.type}
                              </span>
                            </div>
                          )}
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
                                <div className="flex items-center space-x-2 mb-1 flex-wrap">
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
                                <div className="text-sm whitespace-pre-wrap">
                                  {message.content.split('\n').map((line, index) => {
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
                            placeholder="Tapez votre message..."
                            rows={3}
                            className="flex-1 bg-dark-800/50 border-dark-700 text-white"
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
                                const link = prompt('Entrez l&apos;URL du lien:')
                                if (link) {
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
                      )}
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
