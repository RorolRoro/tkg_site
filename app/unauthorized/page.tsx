import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-400" />
            </div>
            <CardTitle className="text-white text-2xl">
              Accès Refusé
            </CardTitle>
            <CardDescription className="text-gray-400">
              Vous n'avez pas les permissions nécessaires pour accéder à ce site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                Ce site est réservé aux membres du serveur Discord Tokyo Ghoul RP avec le rôle Joueur ou Staff. 
                Vous devez être connecté avec un compte Discord ayant le bon rôle pour accéder au site.
              </p>
            </div>

            <div className="bg-dark-800/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Pour accéder au site :</h4>
              <ol className="text-gray-400 text-sm space-y-1">
                <li>1. Rejoignez le serveur Discord Tokyo Ghoul RP</li>
                <li>2. Demandez le rôle Joueur (ID: 1332323285249298466) à un membre du staff</li>
                <li>3. Reconnectez-vous sur ce site</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://discord.gg/foc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="glow" className="w-full group">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Rejoindre Discord
                </Button>
              </a>
              <Link href="/auth/signin" className="flex-1">
                <Button variant="outline" className="w-full group">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Se Connecter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
