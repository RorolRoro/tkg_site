'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { User, Shield, Mail, Calendar, LogOut } from 'lucide-react'

export default function TestSessionPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement de la session...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card className="glass-effect max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">Non connecté</CardTitle>
            <CardDescription className="text-center">
              Vous n'êtes pas connecté
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = '/auth/signin'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Test de Session
          </h1>
          <p className="text-gray-400">
            Informations de la session utilisateur
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de base */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations Utilisateur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ID:</span>
                <span className="text-white font-mono text-sm">
                  {session?.user?.id || 'Non défini'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Nom:</span>
                <span className="text-white">
                  {session?.user?.name || 'Non défini'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">
                  {session?.user?.email || 'Non défini'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Image:</span>
                <span className="text-white">
                  {session?.user?.image ? 'Présente' : 'Absente'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Rôle et permissions */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Rôle et Permissions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Rôle:</span>
                <Badge 
                  variant="outline" 
                  className={
                    session?.user?.role === 'ADMIN' ? 'border-red-500 text-red-400' :
                    session?.user?.role === 'STAFF' ? 'border-blue-500 text-blue-400' :
                    'border-green-500 text-green-400'
                  }
                >
                  {session?.user?.role || 'Non défini'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Accès Staff:</span>
                <span className={`text-sm ${
                  session?.user?.role === 'STAFF' || session?.user?.role === 'ADMIN' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {session?.user?.role === 'STAFF' || session?.user?.role === 'ADMIN' 
                    ? 'Autorisé' 
                    : 'Refusé'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Accès Admin:</span>
                <span className={`text-sm ${
                  session?.user?.role === 'ADMIN' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {session?.user?.role === 'ADMIN' ? 'Autorisé' : 'Refusé'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Informations de session */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Informations de Session</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Statut:</span>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Expires:</span>
                <span className="text-white text-sm">
                  {session?.expires ? new Date(session.expires).toLocaleString('fr-FR') : 'Non défini'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <LogOut className="h-5 w-5" />
                <span>Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                Retour à l'accueil
              </Button>
              {(session?.user?.role === 'STAFF' || session?.user?.role === 'ADMIN') && (
                <Button 
                  onClick={() => window.location.href = '/staff/tableur'}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                >
                  Accéder au Tableur
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Debug info */}
        <Card className="glass-effect mt-8">
          <CardHeader>
            <CardTitle className="text-white">Debug - Données Brutes</CardTitle>
            <CardDescription>
              Informations complètes de la session pour le débogage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-dark-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}