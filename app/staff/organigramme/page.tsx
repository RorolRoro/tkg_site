'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Crown, Shield, Users, Settings, Plus, Edit, Trash2, ExternalLink, User } from 'lucide-react'

type StaffRoleKey = 'MODERATEUR' | 'ANIMATEUR' | 'MAITRE_DU_JEU'

interface StaffMember {
  id: string
  discordId: string
  name: string
  role: string
  roleName?: string
  primaryRoleId?: string
  roleIds?: string[]
  permissions: string[]
  description: string
  avatar: string
  status: 'ONLINE' | 'OFFLINE' | 'BUSY'
  isActive: boolean
}

interface PermissionTag {
  id: string
  name: string
  color: string
  description: string
}

const DISCORD_ROLES = {
  OWNER: '1332323285303558147',
  RESPONSABLE_RP: '1386374837404176417',
  ADMINISTRATEUR: '1332323285278654473',
  GERANT_MODERATION: '1385724637337485362',
  GERANT_MJ: '1332323285278654470',
  GERANT_ANIMATION: '1332323285278654469',
  GERANT_EQUILIBRAGE: '1386709386017247254',
  MODERATEUR: '1332323285278654465',
  ANIMATEUR: '1332323285278654464',
  MAITRE_DU_JEU: '1332323285249298472'
}

const STAFF_ROLE_CONFIG = {
  MODERATEUR: {
    label: 'Modérateur',
    borderClass: 'border-blue-400/30',
    textClass: 'text-blue-300',
    circleClass: 'border-blue-400 text-blue-400'
  },
  ANIMATEUR: {
    label: 'Animateur',
    borderClass: 'border-green-400/30',
    textClass: 'text-green-300',
    circleClass: 'border-green-400 text-green-400'
  },
  MAITRE_DU_JEU: {
    label: 'Maître du Jeu',
    borderClass: 'border-purple-400/30',
    textClass: 'text-purple-300',
    circleClass: 'border-purple-400 text-purple-400'
  }
} as const

const ROLE_PERMISSION_HINTS: Record<StaffRoleKey, string> = {
  MODERATEUR: 'moderation',
  ANIMATEUR: 'animation',
  MAITRE_DU_JEU: 'roleplay'
}

const PERMISSION_TAGS: PermissionTag[] = [
  { id: 'gestion_complete', name: 'Gestion complète', color: 'bg-red-600', description: 'Accès total au serveur' },
  { id: 'moderation', name: 'Modération', color: 'bg-yellow-600', description: 'Gestion des sanctions et modération' },
  { id: 'evenements', name: 'Événements', color: 'bg-green-600', description: 'Création et gestion d\'événements' },
  { id: 'staff', name: 'Staff', color: 'bg-blue-600', description: 'Accès aux outils staff' },
  { id: 'roleplay', name: 'Roleplay', color: 'bg-purple-600', description: 'Gestion du roleplay et du lore' },
  { id: 'animation', name: 'Animation', color: 'bg-pink-600', description: 'Animation et divertissement' },
  { id: 'equilibrage', name: 'Équilibrage', color: 'bg-orange-600', description: 'Équilibrage du gameplay' },
  { id: 'communication', name: 'Communication', color: 'bg-cyan-600', description: 'Gestion des communications' },
  { id: 'technique', name: 'Technique', color: 'bg-gray-600', description: 'Support technique et maintenance' },
  { id: 'recrutement', name: 'Recrutement', color: 'bg-indigo-600', description: 'Recrutement de nouveaux membres' }
]

// Données mockées pour l'organigramme avec les vrais IDs Discord
const mockStaffMembers: StaffMember[] = [
  // Owner (3 membres avec le grade 1332323285303558147)
  {
    id: '1',
    discordId: 'owner1_discord_id',
    name: 'Owner 1',
    role: 'Owner',
    permissions: ['gestion_complete'],
    description: 'Fondateur et propriétaire du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/owner1_discord_id/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  {
    id: '2',
    discordId: 'owner2_discord_id',
    name: 'Owner 2',
    role: 'Owner',
    permissions: ['gestion_complete'],
    description: 'Co-fondateur du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/owner2_discord_id/avatar.png',
    status: 'BUSY',
    isActive: true
  },
  {
    id: '3',
    discordId: 'owner3_discord_id',
    name: 'Owner 3',
    role: 'Owner',
    permissions: ['gestion_complete'],
    description: 'Co-fondateur du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/owner3_discord_id/avatar.png',
    status: 'OFFLINE',
    isActive: true
  },
  // Haut Staff+ - Responsable RP (1386374837404176417)
  {
    id: '4',
    discordId: '1386374837404176417',
    name: 'Responsable RP',
    role: 'Haut Staff+',
    permissions: ['gestion_complete', 'roleplay', 'evenements', 'communication'],
    description: 'Responsable de la cohérence du roleplay',
    avatar: 'https://cdn.discordapp.com/avatars/1386374837404176417/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff+ - Administrateur (1332323285278654473)
  {
    id: '5',
    discordId: '1332323285278654473',
    name: 'Administrateur',
    role: 'Haut Staff+',
    permissions: ['gestion_complete', 'moderation', 'technique', 'recrutement'],
    description: 'Administrateur général du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654473/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff - Gérant Modération (1385724637337485362)
  {
    id: '6',
    discordId: '1385724637337485362',
    name: 'Gérant Modération',
    role: 'Haut Staff',
    permissions: ['moderation', 'staff', 'communication'],
    description: 'Gérant de l\'équipe de modération',
    avatar: 'https://cdn.discordapp.com/avatars/1385724637337485362/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff - Gérant MJ (1332323285278654470)
  {
    id: '7',
    discordId: '1332323285278654470',
    name: 'Gérant MJ',
    role: 'Haut Staff',
    permissions: ['evenements', 'roleplay', 'staff'],
    description: 'Gérant des Maîtres du Jeu',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654470/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Haut Staff - Gérant Animation (1332323285278654469)
  {
    id: '8',
    discordId: '1332323285278654469',
    name: 'Gérant Animation',
    role: 'Haut Staff',
    permissions: ['evenements', 'animation', 'staff'],
    description: 'Gérant de l\'équipe d\'animation',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654469/avatar.png',
    status: 'BUSY',
    isActive: true
  },
  // Haut Staff - Gérant Équilibrage (1386709386017247254)
  {
    id: '9',
    discordId: '1386709386017247254',
    name: 'Gérant Équilibrage',
    role: 'Haut Staff',
    permissions: ['equilibrage', 'technique', 'staff'],
    description: 'Gérant de l\'équilibrage du serveur',
    avatar: 'https://cdn.discordapp.com/avatars/1386709386017247254/avatar.png',
    status: 'OFFLINE',
    isActive: true
  },
  // Staff - Modérateur (1332323285278654465)
  {
    id: '10',
    discordId: '1400163566987903127',
    name: 'Modérateur',
    role: 'Staff',
    primaryRoleId: DISCORD_ROLES.MODERATEUR,
    permissions: ['moderation'],
    description: 'Membre de l\'équipe de modération',
    avatar: 'https://cdn.discordapp.com/avatars/1400163566987903127/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Staff - Animateur (1332323285278654464)
  {
    id: '11',
    discordId: '1332323285278654464',
    name: 'Animateur',
    role: 'Staff',
    primaryRoleId: DISCORD_ROLES.ANIMATEUR,
    permissions: ['animation', 'evenements'],
    description: 'Membre de l\'équipe d\'animation',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285278654464/avatar.png',
    status: 'ONLINE',
    isActive: true
  },
  // Staff - Maître du Jeu (1332323285249298472)
  {
    id: '12',
    discordId: '1332323285249298472',
    name: 'Maître du Jeu',
    role: 'Staff',
    primaryRoleId: DISCORD_ROLES.MAITRE_DU_JEU,
    permissions: ['roleplay', 'evenements'],
    description: 'Maître du Jeu pour les événements RP',
    avatar: 'https://cdn.discordapp.com/avatars/1332323285249298472/avatar.png',
    status: 'BUSY',
    isActive: true
  }
]

export default function OrganigrammePage() {
  const { data: session } = useSession()
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)

  // Vérifier si l'utilisateur peut gérer les permissions (Haut Staff+)
  const canManagePermissions = session?.user?.role === 'STAFF' && 
    ['1332323285303558147', '1386374837404176417', '1332323285278654473'].includes(session.user.id || '')

  useEffect(() => {
    fetchStaffMembers()
  }, [])

  const fetchStaffMembers = async () => {
    try {
      console.log('🔄 Récupération des membres Discord...')
      // Récupérer les membres depuis Discord
      const response = await fetch('/api/discord/guild/members')
      const data = await response.json()
      
      if (response.ok) {
        console.log('✅ Membres Discord récupérés:', data.length, 'membres')
        setStaffMembers(data)
      } else {
        console.error('❌ Erreur API Discord:', data.error)
        console.log('🔄 Fallback vers les données mockées')
        // Fallback vers les données mockées
        setStaffMembers(mockStaffMembers)
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l\'organigramme:', error)
      console.log('🔄 Fallback vers les données mockées')
      // Fallback vers les données mockées
      setStaffMembers(mockStaffMembers)
    } finally {
      setIsLoadingMembers(false)
    }
  }

  const syncWithDiscord = async () => {
    if (!canManagePermissions) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/staff/organigramme/sync', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Synchronisation réussie:', result)
        
        // Recharger les membres après synchronisation
        await fetchStaffMembers()
      } else {
        console.error('Erreur lors de la synchronisation')
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'text-yellow-400'
      case 'Haut Staff+':
        return 'text-red-400'
      case 'Haut Staff':
        return 'text-purple-400'
      case 'Staff':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-500'
      case 'BUSY':
        return 'bg-yellow-500'
      case 'OFFLINE':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPermissionColor = (permissionId: string) => {
    const permission = PERMISSION_TAGS.find(p => p.id === permissionId)
    return permission?.color || 'bg-gray-600'
  }

  const getDisplayRole = (member: StaffMember) => member.roleName || member.role
  const normalizeRoleName = (value?: string) =>
    (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  const isMemberOfRole = (member: StaffMember, roleKey: StaffRoleKey) => {
    const targetId = DISCORD_ROLES[roleKey]
    if (member.primaryRoleId) {
      return member.primaryRoleId === targetId
    }

    const hint = ROLE_PERMISSION_HINTS[roleKey]
    if (hint && member.permissions?.includes(hint)) {
      return true
    }

    return normalizeRoleName(getDisplayRole(member)) === normalizeRoleName(STAFF_ROLE_CONFIG[roleKey].label)
  }

  const openEditModal = (member: StaffMember) => {
    setSelectedMember(member)
    setIsEditModalOpen(true)
  }

  const updateMemberPermissions = async (memberId: string, permissions: string[], description: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/staff/organigramme', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId,
          permissions,
          description
        }),
      })

      if (response.ok) {
        const updatedMember = await response.json()
        setStaffMembers(prev => prev.map(member => 
          member.id === memberId 
            ? updatedMember
            : member
        ))
        setIsEditModalOpen(false)
        setSelectedMember(null)
      } else {
        console.error('Erreur lors de la mise à jour des permissions')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openDiscordProfile = (discordId: string) => {
    window.open(`https://discord.com/users/${discordId}`, '_blank')
  }

  const groupedStaff = {
    owner: staffMembers.filter(m => m.role === 'Owner'),
    hautStaffPlus: staffMembers.filter(m => m.role === 'Haut Staff+'),
    hautStaff: staffMembers.filter(m => m.role === 'Haut Staff'),
    staff: staffMembers.filter(m => m.role === 'Staff')
  }

  const staffRoleSummary = Object.entries(STAFF_ROLE_CONFIG).map(([key, config]) => ({
    key,
    label: config.label,
    borderClass: config.borderClass,
    textClass: config.textClass,
    circleClass: config.circleClass,
    count: groupedStaff.staff.filter(member => isMemberOfRole(member, key as StaffRoleKey)).length
  }))

  if (isLoadingMembers) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement de l&apos;organigramme...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Organigramme Staff
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
            Structure hiérarchique du staff Tokyo Ghoul RP.
            {canManagePermissions ? ' Vous pouvez gérer les permissions des membres.' : ''}
          </p>
          
          {/* Status Indicator */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-800/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                {staffMembers.length} membres chargés
                {staffMembers.some((m: any) => m.username) ? ' (Discord connecté)' : ' (Mode démo)'}
              </span>
            </div>
          </div>
          
          {/* Boutons de synchronisation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              onClick={fetchStaffMembers}
              disabled={isLoadingMembers}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>{isLoadingMembers ? 'Chargement...' : 'Actualiser'}</span>
            </Button>
            
            {canManagePermissions && (
              <Button
                variant="glow"
                onClick={syncWithDiscord}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>{isLoading ? 'Synchronisation...' : 'Synchroniser avec Discord'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Owner Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-yellow-400">Owner</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupedStaff.owner.map((member) => (
              <Card key={member.id} className="glass-effect border-yellow-400/30">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 rounded-full border-4 border-yellow-400/50"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(member.status)} rounded-full border-2 border-dark-950`} />
                  </div>
                  <CardTitle className="text-white text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-yellow-400 font-semibold">
                    {getDisplayRole(member)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-300 text-sm">{member.description}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.permissions.map((permissionId) => {
                      const permission = PERMISSION_TAGS.find(p => p.id === permissionId)
                      return (
                        <Badge key={permissionId} className={`${getPermissionColor(permissionId)} text-white text-xs`}>
                          {permission?.name}
                        </Badge>
                      )
                    })}
                  </div>

                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDiscordProfile(member.discordId)}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Discord</span>
                    </Button>
                    {canManagePermissions && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(member)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Modifier</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Haut Staff+ Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-red-400" />
            <h2 className="text-3xl font-bold text-red-400">Haut Staff+</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedStaff.hautStaffPlus.map((member) => (
              <Card key={member.id} className="glass-effect border-red-400/30">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-16 h-16 rounded-full border-2 border-red-400/50"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(member.status)} rounded-full border-2 border-dark-950`} />
                    </div>
                    <div>
                      <CardTitle className="text-white">{member.name}</CardTitle>
                      <CardDescription className="text-red-400 font-semibold">
                        {getDisplayRole(member)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{member.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {member.permissions.map((permissionId) => {
                      const permission = PERMISSION_TAGS.find(p => p.id === permissionId)
                      return (
                        <Badge key={permissionId} className={`${getPermissionColor(permissionId)} text-white text-xs`}>
                          {permission?.name}
                        </Badge>
                      )
                    })}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDiscordProfile(member.discordId)}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Discord</span>
                    </Button>
                    {canManagePermissions && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(member)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Modifier</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Haut Staff Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="h-8 w-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-purple-400">Haut Staff</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {groupedStaff.hautStaff.map((member) => (
              <Card key={member.id} className="glass-effect border-purple-400/30">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full border-2 border-purple-400/50"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(member.status)} rounded-full border-2 border-dark-950`} />
                  </div>
                  <CardTitle className="text-white text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-purple-400 font-semibold">
                    {getDisplayRole(member)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-gray-300 text-sm">{member.description}</p>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.permissions.map((permissionId) => {
                      const permission = PERMISSION_TAGS.find(p => p.id === permissionId)
                      return (
                        <Badge key={permissionId} className={`${getPermissionColor(permissionId)} text-white text-xs`}>
                          {permission?.name}
                        </Badge>
                      )
                    })}
                  </div>

                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDiscordProfile(member.discordId)}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Discord</span>
                    </Button>
                    {canManagePermissions && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(member)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Modifier</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Staff Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-8 w-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-blue-400">Staff</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staffRoleSummary.map(({ key, label, count, borderClass, textClass, circleClass }) => (
              <Card key={key} className={`glass-effect ${borderClass}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{label}</CardTitle>
                  <CardDescription className={textClass}>
                    {count > 1 ? `${count} membres` : `${count} membre`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center bg-dark-900/70 text-4xl font-bold ${circleClass}`}>
                      {count}
                    </div>
                    <p className="text-gray-400 mt-3 text-sm">Nombre total</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {selectedMember && (
          <EditMemberModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            member={selectedMember}
            onSave={updateMemberPermissions}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

interface EditMemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: StaffMember
  onSave: (memberId: string, permissions: string[], description: string) => void
  isLoading: boolean
}

function EditMemberModal({ isOpen, onClose, member, onSave, isLoading }: EditMemberModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(member.permissions)
  const [description, setDescription] = useState(member.description)

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSave = () => {
    onSave(member.id, selectedPermissions, description)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Modifier ${member.name}`}
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Member Info */}
        <div className="flex items-center space-x-4">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-white text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-400">{getDisplayRole(member)}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du membre..."
            rows={3}
          />
        </div>

        {/* Permissions */}
        <div>
          <label className="block text-sm font-medium text-white mb-4">
            Permissions
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PERMISSION_TAGS.map((permission) => (
              <div
                key={permission.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedPermissions.includes(permission.id)
                    ? 'border-primary-400 bg-primary-400/10'
                    : 'border-dark-700 hover:border-dark-600'
                }`}
                onClick={() => handlePermissionToggle(permission.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${permission.color}`} />
                  <div>
                    <div className="text-white font-medium">{permission.name}</div>
                    <div className="text-gray-400 text-sm">{permission.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="glow"
            onClick={handleSave}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
