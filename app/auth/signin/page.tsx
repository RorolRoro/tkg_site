'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, ArrowRight } from 'lucide-react'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    getSession().then((session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  const handleDiscordSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('discord', { 
        callbackUrl: '/',
        redirect: false 
      })
      
      console.log('SignIn result:', result)
      
      if (result?.ok) {
        // Forcer le rechargement de la page pour mettre à jour la session
        window.location.href = '/'
      } else {
        console.error('Erreur de connexion:', result?.error)
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">TG</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Connexion à Tokyo Ghoul RP
          </h2>
          <p className="text-gray-400">
            Connectez-vous avec votre compte Discord pour accéder au serveur
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl">
              Authentification Discord
            </CardTitle>
            <CardDescription className="text-gray-400">
              Vous devez être membre du serveur Discord pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleDiscordSignIn}
              disabled={isLoading}
              variant="glow"
              size="lg"
              className="w-full group"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Connexion en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Se connecter avec Discord
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                En vous connectant, vous acceptez nos conditions d'utilisation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <div className="space-y-4">
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-yellow-400" />
                <div>
                  <h3 className="text-white font-medium text-sm">Membre du Serveur</h3>
                  <p className="text-gray-400 text-xs">
                    Vous devez être membre du serveur Discord Tokyo Ghoul RP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium text-sm">Rôle Assigné</h3>
                  <p className="text-gray-400 text-xs">
                    Votre rôle sera automatiquement détecté (Joueur ou Staff)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
