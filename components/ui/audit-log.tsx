'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Eye, 
  Filter, 
  Download, 
  RefreshCw,
  Clock,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'INSERT_ROW' | 'INSERT_SECTION' | 'CREATE_SHEET'
  resource: string
  resourceId: string
  details: {
    before?: any
    after?: any
    changes?: any
    metadata?: any
  }
  ipAddress?: string
  userAgent?: string
}

interface AuditLogProps {
  resourceId?: string
  userId?: string
  limit?: number
}

const ACTION_ICONS = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  INSERT_ROW: Plus,
  INSERT_SECTION: Plus,
  CREATE_SHEET: Plus
}

const ACTION_COLORS = {
  CREATE: 'bg-green-600',
  UPDATE: 'bg-blue-600',
  DELETE: 'bg-red-600',
  INSERT_ROW: 'bg-green-600',
  INSERT_SECTION: 'bg-purple-600',
  CREATE_SHEET: 'bg-blue-600'
}

const ACTION_LABELS = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  INSERT_ROW: 'Ajout Ligne',
  INSERT_SECTION: 'Ajout Section',
  CREATE_SHEET: 'Création Feuille'
}

export function AuditLogComponent({ resourceId, userId, limit = 50 }: AuditLogProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    user: ''
  })

  const loadLogs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (resourceId) params.append('resourceId', resourceId)
      if (userId) params.append('userId', userId)
      params.append('limit', limit.toString())

      const response = await fetch(`/api/audit?${params}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des logs')
      }

      const data = await response.json()
      setLogs(data.logs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [resourceId, userId, limit])

  const filteredLogs = logs.filter(log => {
    if (filters.action && log.action !== filters.action) return false
    if (filters.resource && log.resource !== filters.resource) return false
    if (filters.user && !log.userName.toLowerCase().includes(filters.user.toLowerCase())) return false
    return true
  })

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp)
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionIcon = (action: string) => {
    const IconComponent = ACTION_ICONS[action as keyof typeof ACTION_ICONS] || Activity
    return <IconComponent className="h-4 w-4" />
  }

  const getActionColor = (action: string) => {
    return ACTION_COLORS[action as keyof typeof ACTION_COLORS] || 'bg-gray-600'
  }

  const getActionLabel = (action: string) => {
    return ACTION_LABELS[action as keyof typeof ACTION_LABELS] || action
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary-400" />
            <span className="text-gray-400">Chargement des logs d'audit...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button onClick={loadLogs} className="mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Logs d'Audit</CardTitle>
            <CardDescription>
              Historique des actions effectuées sur le tableur
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={loadLogs} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filtres */}
        <div className="mb-6 p-4 bg-dark-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
              >
                <option value="">Toutes les actions</option>
                <option value="CREATE">Création</option>
                <option value="UPDATE">Modification</option>
                <option value="DELETE">Suppression</option>
                <option value="INSERT_ROW">Ajout Ligne</option>
                <option value="INSERT_SECTION">Ajout Section</option>
                <option value="CREATE_SHEET">Création Feuille</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ressource
              </label>
              <select
                value={filters.resource}
                onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
              >
                <option value="">Toutes les ressources</option>
                <option value="sheet">Feuille</option>
                <option value="row">Ligne</option>
                <option value="cell">Cellule</option>
                <option value="section">Section</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Utilisateur
              </label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                placeholder="Rechercher par nom..."
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* Liste des logs */}
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Aucun log d'audit trouvé</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getActionLabel(log.action)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {log.resource}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {log.resourceId}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{log.userName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimestamp(log.timestamp)}</span>
                        </div>
                        {log.ipAddress && (
                          <div className="text-xs text-gray-500">
                            IP: {log.ipAddress}
                          </div>
                        )}
                      </div>
                      {log.details.metadata && (
                        <div className="mt-2 text-xs text-gray-400">
                          <details>
                            <summary className="cursor-pointer hover:text-gray-300">
                              Détails
                            </summary>
                            <pre className="mt-2 p-2 bg-dark-900 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details.metadata, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredLogs.length >= limit && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              Charger plus
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}




