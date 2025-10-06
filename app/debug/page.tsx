'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function DebugPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log('Debug - Status changed:', status)
    console.log('Debug - Session changed:', session)
  }, [session, status])

  const handleSignIn = async () => {
    console.log('Debug - Attempting sign in...')
    const result = await signIn('discord', { 
      callbackUrl: '/debug',
      redirect: false 
    })
    console.log('Debug - Sign in result:', result)
  }

  const handleSignOut = async () => {
    console.log('Debug - Attempting sign out...')
    const result = await signOut({ redirect: false })
    console.log('Debug - Sign out result:', result)
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white">Debug NextAuth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Button onClick={handleSignIn} variant="glow">
                  Se Connecter Discord
                </Button>
                <Button onClick={handleSignOut} variant="outline">
                  Se Déconnecter
                </Button>
              </div>
              
              <div>
                <strong className="text-white">Status:</strong>
                <span className="ml-2 text-gray-300">{status}</span>
              </div>
              
              <div>
                <strong className="text-white">Session:</strong>
                <pre className="mt-2 p-4 bg-dark-800 rounded text-gray-300 text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
              
              <div>
                <strong className="text-white">Rôle:</strong>
                <span className="ml-2 text-primary-400">{session?.user?.role || 'Non défini'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

