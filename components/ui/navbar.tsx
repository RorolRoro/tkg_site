'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, User, Shield, ChevronDown } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const staffMenuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu staff quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (staffMenuRef.current && !staffMenuRef.current.contains(event.target as Node)) {
        setIsStaffMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Règlement', href: '/reglement' },
    { name: 'Lore', href: '/lore' },
    { name: 'Guide', href: '/guide' },
    { name: 'Tickets', href: '/tickets' },
    { name: 'Mes Tickets', href: '/mes-tickets' },
  ]

  const staffNavigation = [
    { name: 'Règlement Staff', href: '/staff/reglement' },
    { name: 'Tickets', href: '/staff/tickets' },
    { name: 'Organigramme', href: '/staff/organigramme' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TG</span>
            </div>
            <span className="text-white font-semibold text-lg">Tokyo Ghoul RP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            
            {session?.user?.role === 'STAFF' && (
              <div ref={staffMenuRef} className="relative ml-4 pl-4 border-l border-dark-700">
                <button
                  onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
                  className="text-primary-400 hover:text-primary-300 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Shield className="h-4 w-4" />
                  <span>Staff</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isStaffMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStaffMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-dark-900/95 backdrop-blur-md border border-dark-700 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {staffNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-primary-300 hover:text-primary-200 hover:bg-dark-800 transition-colors duration-200"
                          onClick={() => setIsStaffMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-dark-700 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'Avatar'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white text-sm">{session.user?.name}</span>
                    <span className={`text-xs ${
                      session.user?.role === 'STAFF' 
                        ? 'text-yellow-400' 
                        : 'text-blue-400'
                    }`}>
                      {session.user?.role === 'STAFF' ? 'Staff' : 'Joueur'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    // Forcer la synchronisation des rôles
                    await signIn('discord', { callbackUrl: window.location.href })
                  }}
                  className="flex items-center space-x-1"
                >
                  <Shield className="h-3 w-3" />
                  <span>Sync Rôles</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button
                variant="glow"
                size="sm"
                onClick={() => signIn('discord')}
              >
                Connexion Discord
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-900/95 backdrop-blur-md border-t border-dark-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {session?.user?.role === 'STAFF' && (
                <div className="pt-4 border-t border-dark-700">
                  <div className="px-3 py-2 text-primary-400 font-medium">Staff</div>
                  {staffNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-6 py-2 text-primary-300 hover:text-primary-200 hover:bg-dark-800 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-dark-700">
                {session ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2 mb-3">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'Avatar'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-white text-sm">{session.user?.name}</span>
                        <span className={`text-xs ${
                          session.user?.role === 'STAFF' 
                            ? 'text-yellow-400' 
                            : 'text-blue-400'
                        }`}>
                          {session.user?.role === 'STAFF' ? 'Staff' : 'Joueur'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={async () => {
                          await signIn('discord', { callbackUrl: window.location.href })
                          setIsMenuOpen(false)
                        }}
                      >
                        <Shield className="mr-2 h-3 w-3" />
                        Synchroniser Rôles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                      >
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <Button
                      variant="glow"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        signIn('discord')
                        setIsMenuOpen(false)
                      }}
                    >
                      Connexion Discord
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export { Navbar }
