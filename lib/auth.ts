import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

// IDs Discord spécifiques au serveur
const DISCORD_SERVER_ID = '1332323284825411658'
const STAFF_ROLE_ID = '1332323285249298471'
const JOUEUR_ROLE_ID = '1332323285249298466'

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds guilds.members.read',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT callback - Token:', token)
      console.log('JWT callback - User:', user)
      console.log('JWT callback - Account:', account)
      
      if (user && account?.provider === 'discord') {
        try {
          // Vérifier l'appartenance au serveur
          const guildResponse = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${DISCORD_SERVER_ID}/member`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          )

          let userRole = 'JOUEUR' // Rôle par défaut

          if (guildResponse.ok) {
            const guildMember = await guildResponse.json()
            console.log('Membre du serveur trouvé:', guildMember)
            
            // Déterminer le rôle basé sur les rôles Discord
            if (guildMember.roles?.includes(STAFF_ROLE_ID)) {
              userRole = 'STAFF'
              console.log('Rôle Staff détecté')
            } else if (guildMember.roles?.includes(JOUEUR_ROLE_ID)) {
              userRole = 'JOUEUR'
              console.log('Rôle Joueur détecté')
            } else {
              console.log('Aucun rôle spécifique détecté, rôle par défaut: JOUEUR')
            }
          } else {
            console.log('Utilisateur non membre du serveur Discord, rôle par défaut: JOUEUR')
          }

          token.role = userRole
          console.log('JWT callback - Rôle ajouté:', token.role)
        } catch (error) {
          console.error('Erreur lors de la vérification Discord:', error)
          token.role = 'JOUEUR' // Rôle par défaut en cas d'erreur
        }
      }
      
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - Session:', session)
      console.log('Session callback - Token:', token)
      
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = (token.role as string) || 'JOUEUR'
        console.log('Session callback - Final role:', session.user.role)
      }
      
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
}
