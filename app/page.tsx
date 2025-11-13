'use client'

import { useSession, signIn } from 'next-auth/react'
import { ArrowRight, Users, Shield, BookOpen, Ticket, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  const { data: session } = useSession()

  const features = [
    {
      icon: Users,
      title: 'Communauté Active',
      description: 'Rejoignez une communauté passionnée de roleplay avec plus de 2000 membres actifs.',
    },
    {
      icon: Shield,
      title: 'Staff Dévoué',
      description: 'Une équipe de modération expérimentée pour garantir une expérience de jeu optimale.',
    },
    {
      icon: BookOpen,
      title: 'Lore Riche',
      description: 'Explorez un univers détaillé avec une histoire captivante et des personnages complexes.',
    },
    {
      icon: Ticket,
      title: 'Support 24/7',
      description: 'Système de tickets pour toute question ou problème, réponse garantie sous 24h.',
    },
  ]

  const stats = [
    { number: '2000+', label: 'Membres Actifs' },
    { number: '30+', label: 'Événements/Mois' },
    { number: '24/7', label: 'Support' },
    { number: '100%', label: 'Satisfaction' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center urban-bg overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-700/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 glow-text">
              Tokyo Ghoul RP
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Plongez dans l&apos;univers sombre et immersif de Tokyo Ghoul. 
              Rejoignez notre communauté de roleplay et vivez des aventures épiques 
              dans les rues de Tokyo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {session ? (
                <Link href="/guide">
                  <Button size="xl" variant="glow" className="group">
                    Commencer l&apos;Aventure
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="xl" 
                  variant="glow" 
                  className="group"
                  onClick={() => window.location.href = 'steam://connect/45.154.34.96:27017'}
                >
                  Rejoindre le Serveur
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              
              <Link href="/guide">
                <Button size="xl" variant="outline" className="group">
                  Guide du Serveur
                  <BookOpen className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Découvrez ce qui fait de Tokyo Ghoul RP la meilleure expérience de roleplay 
              dans l&apos;univers de Tokyo Ghoul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect hover:shadow-glow transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
