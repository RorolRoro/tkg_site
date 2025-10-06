'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'

export default function TestSessionPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log('TestSession - Status changed:', status)
    console.log('TestSession - Session changed:', session)
  }, [session, status])

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white">Test de Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
