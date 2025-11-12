'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  ExternalLink,
  User
} from 'lucide-react'

export default function DiscordDebugPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [discordData, setDiscordData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testDiscordConnection = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Test de connexion Discord...')
      
      // Test 1: Récupérer les membres du serveur
      const membersResponse = await fetch('/api/discord/guild/members')
      const membersData = await membersResponse.json()
      
      if (!membersResponse.ok) {
        throw new Error(`Erreur membres: ${membersData.error}`)
      }
      
      // Test 2: Synchronisation
      const syncResponse = await fetch('/api/staff/organigramme/sync', {
        method: 'POST'
      })
      const syncData = await syncResponse.json()
      
      if (!syncResponse.ok) {
        throw new Error(`Erreur sync: ${syncData.error}`)
      }
      
      setDiscordData({
        members: membersData,
        sync: syncData,
        timestamp: new Date().toISOString()
      })
      
      console.log('✅ Tests Discord réussis:', { membersData, syncData })
      
    } catch (err) {
      console.error('❌ Erreur tests Discord:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const testProfile = async (discordId: string) => {
    try {
      const response = await fetch(`/api/discord/profile/${discordId}`)
      const profile = await response.json()
      console.log(`Profil ${discordId}:`, profile)
      return profile
    } catch (err) {
      console.error(`Erreur profil ${discordId}:`, err)
      return null
    }
  }

  if (session?.user?.role !== 'STAFF') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card className="glass-effect max-w-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <span>Accès Refusé</span>
            </CardTitle>
            <CardDescription>
              Cette page est réservée aux membres du staff.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Debug Discord API
          </h1>
          <p className="text-gray-400">
            Testez la connexion et la récupération des données Discord
          </p>
        </div>

        {/* Test Button */}
        <div className="mb-8">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Tests Discord</span>
              </CardTitle>
              <CardDescription>
                Testez la connexion à l&apos;API Discord et la récupération des membres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={testDiscordConnection}
                disabled={isLoading}
                className="w-full"
                variant="glow"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Test en cours...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Tester la connexion Discord
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="glass-effect border-red-500/50 mb-8">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Erreur</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {discordData && (
          <div className="space-y-6">
            {/* Members Data */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Membres Discord</span>
                  <Badge variant="outline" className="text-green-400">
                    {Array.isArray(discordData.members) ? discordData.members.length : 0} membres
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Données récupérées depuis l&apos;API Discord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(discordData.members) && discordData.members.slice(0, 5).map((member: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-dark-800/50 rounded-lg">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{member.name}</div>
                        <div className="text-gray-400 text-sm">
                          {member.role} • {member.discordId}
                        </div>
                        {member.username && (
                          <div className="text-gray-500 text-xs">
                            @{member.username}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => testProfile(member.discordId)}
                        variant="outline"
                        size="sm"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Test Profil
                      </Button>
                    </div>
                  ))}
                  {Array.isArray(discordData.members) && discordData.members.length > 5 && (
                    <p className="text-gray-400 text-sm text-center">
                      ... et {discordData.members.length - 5} autres membres
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sync Data */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Synchronisation</span>
                  <Badge variant="outline" className="text-green-400">
                    {discordData.sync?.membersCount || 0} membres synchronisés
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Résultat de la synchronisation avec Discord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Statut:</span>
                    <Badge className="bg-green-600 text-white">
                      {discordData.sync?.success ? 'Succès' : 'Échec'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Message:</span>
                    <span className="text-white">{discordData.sync?.message}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timestamp:</span>
                    <span className="text-gray-300 text-sm">{discordData.timestamp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Raw Data */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white">Données Brutes</CardTitle>
                <CardDescription>
                  Données complètes retournées par l&apos;API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-dark-900 p-4 rounded-lg overflow-auto text-xs text-gray-300">
                  {JSON.stringify(discordData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="glass-effect mt-8">
          <CardHeader>
            <CardTitle className="text-white">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">1. Configuration du Bot Discord</h3>
              <p className="text-gray-400 text-sm">
                Pour que l&apos;organigramme fonctionne avec les vrais pseudos Discord, vous devez :
              </p>
              <ul className="text-gray-400 text-sm mt-2 space-y-1">
                <li>• Créer un bot Discord sur le portail développeur</li>
                <li>• Inviter le bot sur votre serveur avec les permissions &quot;View Server Members&quot;</li>
                <li>• Ajouter le token du bot dans votre fichier .env</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">2. Variables d&apos;environnement</h3>
              <p className="text-gray-400 text-sm">
                Ajoutez ces variables à votre fichier .env :
              </p>
              <pre className="bg-dark-900 p-3 rounded mt-2 text-xs text-gray-300">
{`DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_SERVER_ID=1332323284825411658`}
              </pre>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">3. Test</h3>
              <p className="text-gray-400 text-sm">
                Cliquez sur &quot;Tester la connexion Discord&quot; pour vérifier que tout fonctionne.
                Si vous voyez des pseudos réels au lieu de &quot;Owner 1&quot;, &quot;Owner 2&quot;, etc., c&apos;est que ça marche !
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
