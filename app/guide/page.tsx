import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, User, MessageSquare, Shield, BookOpen, Users, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function GuidePage() {
  const steps = [
    {
      icon: User,
      title: 'Créer votre Personnage',
      description: 'Développez un personnage unique avec une histoire et une personnalité cohérentes',
      details: [
        'Choisissez votre espèce (Inspecteur, Ghoul)',
        'Développez une backstory détaillée',
        'Définissez la personnalité et les motivations',
        'Créez des relations avec d\'autres personnages'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Comprendre le RP',
      description: 'Apprenez les bases du roleplay et les conventions de notre serveur',
      details: [
        'Utilisez des actions en utilisant le /me pour décrire vos actions',
        'Utilisez des pensées en utilisant le /it pour les réflexions internes',
        'En tant que ghoul, vous devez avoir peur des inspecteurs.',
        'Acceptez les conséquences de vos actions RP'
      ]
    },
    {
      icon: Shield,
      title: 'Respecter les Règles',
      description: 'Familiarisez-vous avec le règlement pour une expérience harmonieuse',
      details: [
        'Lisez attentivement le règlement complet',
        'Respectez les autres joueurs et leurs limites',
        'Signalez tout comportement inapproprié',
        'Participez de manière constructive à la communauté'
      ]
    },
    {
      icon: BookOpen,
      title: 'Explorer le Lore',
      description: 'Plongez dans l\'univers de Tokyo Ghoul et ses subtilités',
      details: [
        'Étudiez l\'histoire et les factions principales',
        'Comprenez les relations entre humains et ghouls',
        'Explorez les différents clans et organisations',
        'Adaptez votre personnage à l\'univers établi'
      ]
    },
    {
      icon: Users,
      title: 'Intégrer la Communauté',
      description: 'Participez activement à la vie du serveur et créez des liens',
      details: [
        'Participez aux événements et activités',
        'Rejoignez des groupes ou clans selon votre personnage',
        'Interagissez avec les autres joueurs de manière respectueuse',
        'Contribuez à l\'ambiance générale du serveur'
      ]
    },
    {
      icon: Star,
      title: 'Progresser et Évoluer',
      description: 'Développez votre personnage et participez aux événements majeurs',
      details: [
        'Participez aux arcs narratifs principaux',
        'Développez votre personnage au fil du temps',
        'Créez des événements RP intéressants',
        'Devenez un membre actif et respecté de la communauté'
      ]
    }
  ]

  const tips = [
    'Commencez par observer les autres joueurs pour comprendre le style RP',
    'N\'ayez pas peur de poser des questions aux membres expérimentés',
    'Créez des personnages avec des défauts et des faiblesses pour plus de réalisme',
    'Participez aux événements organisés par le staff',
    'Respectez toujours le consentement des autres joueurs',
    'Utilisez les canaux appropriés pour chaque type de discussion'
  ]

  const resources = [
    {
      title: 'Règlement Complet',
      description: 'Consultez toutes les règles et conventions du serveur',
      href: '/reglement',
      icon: Shield
    },
    {
      title: 'Lore Détaillé',
      description: 'Explorez l\'univers et l\'histoire de Tokyo Ghoul',
      href: '/lore',
      icon: BookOpen
    },
    {
      title: 'Système de Tickets',
      description: 'Créez un ticket pour toute question ou problème',
      href: '/tickets',
      icon: MessageSquare
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Guide du Nouveau Joueur
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Bienvenue dans l&apos;univers de Tokyo Ghoul RP ! Ce guide vous accompagnera 
            dans vos premiers pas pour devenir un membre actif de notre communauté.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="glass-effect mb-12 border-primary-600/50">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Démarrage Rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Link key={index} href={resource.href}>
                  <Card className="glass-effect hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <resource.icon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">{resource.title}</h3>
                      <p className="text-gray-400 text-sm">{resource.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Étapes pour Commencer
          </h2>
          
          {steps.map((step, index) => (
            <Card key={index} className="glass-effect">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">
                      Étape {index + 1}: {step.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="glass-effect mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Conseils d&apos;Experts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="glass-effect border-primary-600/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Prêt à Commencer votre Aventure ?
            </h3>
            <p className="text-gray-400 mb-6">
              Maintenant que vous connaissez les bases, il est temps de créer votre personnage 
              et de rejoindre la communauté !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reglement">
                <Button variant="outline" size="lg" className="group">
                  Lire le Règlement
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/tickets">
                <Button variant="glow" size="lg" className="group">
                  Créer un Ticket
                  <MessageSquare className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
