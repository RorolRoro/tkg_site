'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, Home, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Accès Refusé',
          description: 'Vous n&apos;êtes pas membre du serveur Discord Tokyo Ghoul RP ou vous n&apos;avez pas les permissions nécessaires.',
          details: 'Pour vous connecter, vous devez être membre du serveur Discord avec un rôle valide (Joueur ou Staff).'
        }
      case 'Configuration':
        return {
          title: 'Erreur de Configuration',
          description: 'Il y a un problème avec la configuration de l\'authentification Discord.',
          details: 'Veuillez contacter un administrateur pour résoudre ce problème.'
        }
      case 'Verification':
        return {
          title: 'Erreur de Vérification',
          description: 'Impossible de vérifier votre compte Discord.',
          details: 'Veuillez réessayer ou contacter le support si le problème persiste.'
        }
      default:
        return {
          title: 'Erreur d\'Authentification',
          description: 'Une erreur inattendue s\'est produite lors de la connexion.',
          details: 'Veuillez réessayer ou contacter le support si le problème persiste.'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <CardTitle className="text-white text-2xl">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-dark-800/50 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">
                {errorInfo.details}
              </p>
            </div>

            {error === 'AccessDenied' && (
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-sm">Pour rejoindre le serveur :</h4>
                <ol className="text-gray-400 text-sm space-y-1">
                  <li>1. Rejoignez le serveur Discord Tokyo Ghoul RP</li>
                  <li>2. Attendez qu&apos;un membre du staff vous assigne un rôle</li>
                  <li>3. Revenez sur ce site et reconnectez-vous</li>
                </ol>
                <div className="mt-4">
                  <a
                    href="https://discord.gg/foc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>Rejoindre le Serveur Discord</span>
                  </a>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full group">
                  <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Retour à l&apos;Accueil
                </Button>
              </Link>
              <Link href="/tickets" className="flex-1">
                <Button variant="glow" className="w-full group">
                  <MessageSquare className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Créer un Ticket
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

