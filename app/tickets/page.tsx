'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Ticket, User, Shield, Plus, Send } from 'lucide-react'

export default function TicketsPage() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ticketType, setTicketType] = useState<'CANDIDATURE_STAFF' | 'CANDIDATURE_CLAN'>('CANDIDATURE_STAFF')
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })

  const ticketTypes = [
    {
      type: 'CANDIDATURE_STAFF' as const,
      title: 'Candidature Staff',
      description: 'Postulez pour rejoindre l\'équipe de modération du serveur',
      icon: Shield,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-500'
    },
    {
      type: 'CANDIDATURE_CLAN' as const,
      title: 'Candidature Clan',
      description: 'Demandez à rejoindre un clan ou une organisation spécifique',
      icon: User,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-500'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      alert('Vous devez être connecté pour créer un ticket')
      return
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: ticketType,
        }),
      })

      if (response.ok) {
        alert('Ticket créé avec succès !')
        setIsModalOpen(false)
        setFormData({ title: '', description: '' })
      } else {
        alert('Erreur lors de la création du ticket')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création du ticket')
    }
  }

  const openModal = (type: 'CANDIDATURE_STAFF' | 'CANDIDATURE_CLAN') => {
    setTicketType(type)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Ticket Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {ticketTypes.map((ticketTypeInfo) => (
            <Card 
              key={ticketTypeInfo.type}
              className={`glass-effect ${ticketTypeInfo.borderColor} border-l-4 hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer`}
              onClick={() => openModal(ticketTypeInfo.type)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${ticketTypeInfo.bgColor}`}>
                    <ticketTypeInfo.icon className={`h-8 w-8 ${ticketTypeInfo.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">{ticketTypeInfo.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {ticketTypeInfo.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full group"
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal(ticketTypeInfo.type)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Créer un Ticket
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <Ticket className="h-12 w-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Réponse Rapide</h3>
              <p className="text-gray-400 text-sm">
                Nous répondons à tous les tickets dans les 24 heures
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Confidentiel</h3>
              <p className="text-gray-400 text-sm">
                Tous vos tickets sont traités de manière confidentielle
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Support Personnalisé</h3>
              <p className="text-gray-400 text-sm">
                Chaque ticket est traité individuellement par notre équipe
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Créer un Ticket - ${ticketTypes.find(t => t.type === ticketType)?.title}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Titre du ticket
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Donnez un titre clair à votre demande"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description détaillée
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre demande en détail..."
                rows={6}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="glow"
                className="flex-1 group"
              >
                <Send className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Envoyer le Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

