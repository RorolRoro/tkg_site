import { prisma } from './prisma'

export const mockTickets = [
  {
    id: '1',
    title: 'Candidature pour le poste de Modérateur',
    description: 'Bonjour, je souhaite postuler pour le poste de modérateur. J\'ai de l\'expérience dans la modération de serveurs Discord et je suis très actif sur le serveur depuis plusieurs mois. Je connais bien les règles et j\'aimerais contribuer à maintenir une bonne ambiance.',
    type: 'CANDIDATURE_STAFF' as const,
    status: 'OPEN' as const,
    user: {
      name: 'Alexandre K.',
      email: 'alexandre@example.com'
    },
    createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T10:30:00Z').toISOString()
  },
  {
    id: '2',
    title: 'Demande d\'intégration au clan Aogiri Tree',
    description: 'Salut ! Mon personnage ghoul souhaite rejoindre le clan Aogiri Tree. Il a un passé violent et partage les idéaux du clan. Pouvez-vous me donner plus d\'informations sur le processus d\'intégration ?',
    type: 'CANDIDATURE_CLAN' as const,
    status: 'IN_PROGRESS' as const,
    user: {
      name: 'Marie L.',
      email: 'marie@example.com'
    },
    response: 'Merci pour votre candidature. Nous allons examiner votre demande et vous recontacterons sous peu.',
    createdAt: new Date('2024-01-14T15:45:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T09:20:00Z').toISOString()
  },
  {
    id: '3',
    title: 'Candidature Staff - Expérience RP',
    description: 'Je postule pour un poste dans l\'équipe staff. J\'ai 3 ans d\'expérience en RP sur différents serveurs et je maîtrise parfaitement l\'univers Tokyo Ghoul. Je suis disponible tous les jours et j\'aimerais organiser des événements.',
    type: 'CANDIDATURE_STAFF' as const,
    status: 'CLOSED' as const,
    user: {
      name: 'Thomas R.',
      email: 'thomas@example.com'
    },
    response: 'Merci pour votre candidature. Après examen, nous avons décidé de ne pas retenir votre candidature pour le moment. N\'hésitez pas à reposer votre candidature dans quelques mois.',
    createdAt: new Date('2024-01-10T14:20:00Z').toISOString(),
    updatedAt: new Date('2024-01-12T16:30:00Z').toISOString()
  },
  {
    id: '4',
    title: 'Intégration clan Anteiku',
    description: 'Mon personnage half-ghoul cherche un refuge et souhaite rejoindre Anteiku. Il a des difficultés à contrôler ses instincts et espère trouver de l\'aide auprès du clan.',
    type: 'CANDIDATURE_CLAN' as const,
    status: 'OPEN' as const,
    user: {
      name: 'Sophie M.',
      email: 'sophie@example.com'
    },
    createdAt: new Date('2024-01-16T11:15:00Z').toISOString(),
    updatedAt: new Date('2024-01-16T11:15:00Z').toISOString()
  }
]

export const mockStaffMembers = [
  {
    id: '1',
    name: 'Kaneki Ken',
    role: 'Administrateur Principal',
    description: 'Fondateur du serveur, responsable de la direction générale et de la stratégie',
    avatar: null,
    order: 1,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '2',
    name: 'Touka Kirishima',
    role: 'Administratrice',
    description: 'Co-administratrice, spécialisée dans la gestion des événements et la communauté',
    avatar: null,
    order: 2,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '3',
    name: 'Yoshimura',
    role: 'Modérateur Senior',
    description: 'Modérateur expérimenté, responsable de la formation des nouveaux modérateurs',
    avatar: null,
    order: 3,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '4',
    name: 'Hinami Fueguchi',
    role: 'Modératrice',
    description: 'Modératrice spécialisée dans l\'accueil des nouveaux membres et le support',
    avatar: null,
    order: 4,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '5',
    name: 'Nishiki Nishio',
    role: 'Modérateur',
    description: 'Modérateur responsable de la surveillance des canaux et de la modération générale',
    avatar: null,
    order: 5,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '6',
    name: 'Koutarou Amon',
    role: 'Organisateur d\'Événements',
    description: 'Responsable de la création et de l\'organisation des événements communautaires',
    avatar: null,
    order: 6,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '7',
    name: 'Kureo Mado',
    role: 'Support Technique',
    description: 'Responsable du support technique et de la maintenance du serveur',
    avatar: null,
    order: 7,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '8',
    name: 'Rize Kamishiro',
    role: 'Community Manager',
    description: 'Responsable de la communication et de l\'animation de la communauté',
    avatar: null,
    order: 8,
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  }
]

export async function seedDatabase() {
  try {
    // Créer des utilisateurs mock
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'alexandre@example.com' },
        update: {},
        create: {
          name: 'Alexandre K.',
          email: 'alexandre@example.com',
          discordId: '123456789',
          role: 'JOUEUR'
        }
      }),
      prisma.user.upsert({
        where: { email: 'marie@example.com' },
        update: {},
        create: {
          name: 'Marie L.',
          email: 'marie@example.com',
          discordId: '987654321',
          role: 'JOUEUR'
        }
      }),
      prisma.user.upsert({
        where: { email: 'thomas@example.com' },
        update: {},
        create: {
          name: 'Thomas R.',
          email: 'thomas@example.com',
          discordId: '456789123',
          role: 'JOUEUR'
        }
      }),
      prisma.user.upsert({
        where: { email: 'sophie@example.com' },
        update: {},
        create: {
          name: 'Sophie M.',
          email: 'sophie@example.com',
          discordId: '789123456',
          role: 'JOUEUR'
        }
      })
    ])

    // Créer des tickets mock
    for (const ticket of mockTickets) {
      const user = users.find(u => u.email === ticket.user.email)
      if (user) {
        await prisma.ticket.upsert({
          where: { id: ticket.id },
          update: {},
          create: {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            type: ticket.type,
            status: ticket.status,
            userId: user.id,
            response: ticket.response,
            createdAt: new Date(ticket.createdAt),
            updatedAt: new Date(ticket.updatedAt)
          }
        })
      }
    }

    // Créer des membres staff mock
    for (const staff of mockStaffMembers) {
      await prisma.staffMember.upsert({
        where: { id: staff.id },
        update: {},
        create: {
          id: staff.id,
          name: staff.name,
          role: staff.role,
          description: staff.description,
          avatar: staff.avatar,
          order: staff.order,
          isActive: staff.isActive,
          createdAt: staff.createdAt,
          updatedAt: staff.updatedAt
        }
      })
    }

    console.log('Base de données initialisée avec les données mock')
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error)
  }
}

