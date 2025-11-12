'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Shield, Users, MessageSquare, Sword, Heart, AlertTriangle, BookOpen, Gavel } from 'lucide-react'

interface RuleSection {
  id: string
  title: string
  description: string
  interdictions: string[]
  autorisations: string[]
  expanded: boolean
}

export default function ReglementPage() {
  const [activeTab, setActiveTab] = useState('reglement-rp')

  const tabs = [
    { id: 'reglement-rp', label: 'Règlement RP', icon: Sword },
    { id: 'reglement-general', label: 'Règlement Général', icon: Shield },
    { id: 'lexique-rp', label: 'Lexique RP', icon: BookOpen }
  ]

  const sectionsReglementRP: RuleSection[] = [
    {
      id: 'familles-clans',
      title: 'Familles & Clans',
      description: 'Les familles ou clans (hors lore) composés de plus de quatre membres sont interdits pour les Ghouls ou le CCG. Pour dépasser cette limite, il est nécessaire d\'ouvrir un ticket accompagné d\'un dossier RP, qui sera ensuite examiné par le staff.',
      interdictions: [
        'Familles ou clans (hors lore) de plus de 4 membres interdits pour Ghouls ou CCG sans dossier RP validé.'
      ],
      autorisations: [
        'Dépassement possible avec ticket et dossier RP validé par le staff.'
      ],
      expanded: false
    },
    {
      id: 'qg-bases',
      title: 'QG & Bases',
      description: 'Les bases d\'organisations issues du lore sont considérées comme secrètes. Menacer ou attaquer directement un membre dans sa propre base expose le joueur à un risque de RPK. La répétition d\'infractions peut mener à un assaut sur la base, dans le seul but de capturer le joueur, avec autorisation préalable d\'un administrateur.',
      interdictions: [
        'Attaquer un membre dans sa base, sauf en cas d\'assaut, de raid ou d\'infiltration.',
        'Retourner en zone safe ou QG lors d\'une poursuite, sauf si l\'on a semé ses assaillants depuis plus de trois minutes.'
      ],
      autorisations: [
        'Si un joueur entre dans sa base sans avoir semé ses poursuivants, ces derniers peuvent utiliser cette information en RP.'
      ],
      expanded: false
    },
    {
      id: 'vol-corps',
      title: 'Vol de corps',
      description: 'Il est strictement interdit de manger un cadavre ou de le mettre en sac pendant un combat, même si le joueur n\'est pas directement impliqué dans celui-ci. Faites preuve de discrétion. Si vous êtes aperçu par un membre du CCG, il aura le droit de vous arrêter.',
      interdictions: [
        'Voler des corps en pleine ville sous les yeux de tous.',
        'Consommer les cadavres ou les quinques lors d\'événements, sauf autorisation exceptionnelle du staff.',
        'Consommer ou quinquer un personnage "animation" sans autorisation explicite.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'amnésie-combat',
      title: 'Amnésie lorsque l\'on tombe au combat',
      description: 'Quand vous tombez lors d\'un combat, vous oubliez toute information récoltée lors de la scène post combat (noms, tenues, organisation, lieux, etc) et lors du combat (kagune, spell, éveil, stratégie). Mécanique de rappel progressif : Plus la scène (combat + post-combat) dure longtemps avant que vous tombiez, plus vous pouvez vous souvenir de certains éléments, de façon vague d\'abord, puis plus précis.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'armes-quinques-kagune',
      title: 'Utilisation des armes / Quinques / Kagune',
      description: 'Il est interdit de changer plusieurs fois d\'arme au cours d\'un même combat (arme à feu, kagune, quinque). Exemple : si vous commencez avec une arme à feu, vous pouvez passer au kagune ou quinque, mais vous ne pouvez pas revenir à l\'arme à feu. Il est interdit de commencer un combat par une charge ou une attaque de zone, dans un souci d\'équité et de fair-play.',
      interdictions: [
        'Changer plusieurs fois d\'arme au cours d\'un même combat.',
        'Commencer un combat par une charge ou une attaque de zone.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'captures-menottes-rc',
      title: 'Captures et Menottes RC',
      description: 'Il est interdit de menotter quelqu\'un avant la fin du combat. Pour menotter une personne, celle-ci doit soit donner son accord, soit être en état de "pain" (moins de 10% de ses points de vie). Règles strictes concernant les captures : Si vous êtes attaqué alors que vous transportez une personne (menottée ou portée sur votre dos), vous avez l\'obligation de vous arrêter immédiatement afin de privilégier l\'interaction RP.',
      interdictions: [
        'Menotter quelqu\'un avant la fin du combat.',
        'Courir ou utiliser le ParkourMod avec une personne menottée.',
        'Porter une arme lorsqu\'on transporte une personne menottée.',
        'Menotter ou démenotter quelqu\'un en plein combat.',
        'Appeler des renforts par radio, écrit ou vocal sur Discord une fois menotté.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'rpk',
      title: 'RPK (Roleplay Kill)',
      description: 'En cas de RPK, le personnage est considéré comme définitivement mort. Vous perdez son histoire et ses relations et devez créer un nouveau personnage. Les ghouls de rang SS et les inspecteurs en chef sont en risque RPK permanent. Leurs agresseurs le sont également en cas d\'agression injustifiée.',
      interdictions: [],
      autorisations: [],
      expanded: false
    }
  ]

  const sectionsReglementGeneral: RuleSection[] = [
    {
      id: 'hrp-vocal',
      title: 'HRP Vocal',
      description: 'Toutes les discussions sortant du contexte RP (par exemple, "je vais manger, viens sur Discord") sont considérées comme du HRP vocal et sont passibles de sanctions. Le spam vocal est interdit, ainsi que l\'utilisation de multiples systèmes de saturation. Le langage de banlieue est également interdit. La communauté FOC est francophone, nous utilisons donc uniquement le français.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'carkills',
      title: 'Car Kill',
      description: 'Le fait d\'écraser quelqu\'un avec un véhicule est INTERDIT.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'propskill',
      title: 'Props Kill',
      description: 'Le fait de tuer quelqu\'un avec un accessoire (prop) en utilisant les collisions est INTERDIT.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'deconnexion-scene',
      title: 'Déconnexion en scène',
      description: 'Il est interdit de se déconnecter en pleine scène. Si vous y êtes vraiment contraint, il est obligatoire de prévenir les autres joueurs de la scène. Tout abus de déconnexion sera sanctionné : n\'entrez pas dans des scènes que vous ne pourrez pas terminer.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'cheat',
      title: 'Triche (Cheat)',
      description: 'Il est interdit d\'utiliser des menus de triche (mod-menus), des logiciels d\'aide à la visée (aimbot), de vision à travers les murs (x-ray) ou toute autre forme de logiciel tiers qui procurerait un avantage en jeu.',
      interdictions: [],
      autorisations: [
        'L\'ajout d\'un réticule de visée (crosshair) grâce à un add-on est autorisé.'
      ],
      expanded: false
    }
  ]

  const sectionsLexiqueRP: RuleSection[] = [
    {
      id: 'fear-rp',
      title: 'Fear RP',
      description: 'Il s\'agit de simuler la peur au cours d\'une scène RP. Dans la vraie vie, tout le monde (ou presque) craint la vue d\'une arme à feu. Si vous décidez de sortir une arme ou d\'appeler la police alors que vous êtes vous-même braqué, cela constitue du "No Fear RP", ce qui est interdit.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'metagaming',
      title: 'Metagaming / Streamhack',
      description: 'Le metagaming consiste à utiliser des informations HRP (Hors RolePlay) pour s\'avantager en RP. Par exemple, il est interdit d\'utiliser une information vue sur un stream pour avantager son personnage.',
      interdictions: [
        'Regarder le stream d\'un joueur et raconter ce qui s\'y passe à un ami dans le jeu.',
        'Utiliser une annonce (/NA) qui ne vous concerne pas.',
        'Utiliser des informations HRP dans votre RP.'
      ],
      autorisations: [
        'Utiliser uniquement les informations obtenues en RP.'
      ],
      expanded: false
    },
    {
      id: 'freekill',
      title: 'Free Kill',
      description: 'Il est interdit de tuer un joueur sans raison roleplay valable.',
      interdictions: [
        'Tuer quelqu\'un sans motivation RP.',
        'Tuer sans interaction préalable.'
      ],
      autorisations: [
        'Tuer uniquement avec une raison RP valable et après une interaction.'
      ],
      expanded: false
    },
    {
      id: 'nlr',
      title: 'NLR (New Life Rule)',
      description: 'La mort en scène ou en combat est l\'équivalent d\'un black-out ou d\'un trou de mémoire. Vous devez obligatoirement oublier la scène ou le combat dans lequel vous étiez.',
      interdictions: [
        'Il est interdit de retourner sur le lieu de votre mort.',
        'Vous devez attendre 30 minutes avant de pouvoir retourner sur les lieux de la scène.',
        'Vous devez attendre la fin d\'une scène pour pouvoir y retourner.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'pain-rp',
      title: 'Pain RP',
      description: 'Le Pain RP consiste à faire ressentir la douleur à travers son personnage. Si la personne que vous affrontez peut vous achever en un coup, il vous est impossible de courir. Les excuses du type "oui, mais j\'ai entraîné mon personnage à la torture" ne fonctionnent pas (sauf validation du staff par ticket RP).',
      interdictions: [
        'Il est INTERDIT de bouger ou de prendre part au combat lorsque vous êtes en état de "pain" (10% HP).',
        'Il est INTERDIT de se faire porter par une personne extérieure au combat.',
        'Il est INTERDIT de reprendre le combat une fois que la régénération passive vous a sorti de l\'état de "pain".'
      ],
      autorisations: [],
      expanded: false
    }
  ]

  const getCurrentSections = () => {
    switch (activeTab) {
      case 'reglement-rp':
        return sectionsReglementRP
      case 'reglement-general':
        return sectionsReglementGeneral
      case 'lexique-rp':
        return sectionsLexiqueRP
      default:
        return sectionsReglementRP
    }
  }

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Règlement Tokyo Ghoul RP
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Règles complètes pour garantir une expérience de roleplay immersive et équitable.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'glow' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Rules Sections */}
        <div className="space-y-6">
          {getCurrentSections().map((section) => {
            const isExpanded = expandedSections.has(section.id)
            return (
              <Card key={section.id} className="glass-effect border-l-4 border-l-primary-600">
                <CardHeader>
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-dark-800/50 p-2 rounded transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <CardTitle className="text-white text-xl">{section.title}</CardTitle>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {section.description}
                      </p>
                      
                      {section.interdictions.length > 0 && (
                        <div>
                          <h4 className="text-red-400 font-semibold mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Interdictions
                          </h4>
                          <ul className="space-y-2">
                            {section.interdictions.map((interdiction, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{interdiction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {section.autorisations.length > 0 && (
                        <div>
                          <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Autorisations
                          </h4>
                          <ul className="space-y-2">
                            {section.autorisations.map((autorisation, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{autorisation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Footer Note */}
        <Card className="glass-effect mt-12 border-primary-600/50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Questions ou Clarifications ?
              </h3>
              <p className="text-gray-400 mb-4">
                Si vous avez des questions concernant le règlement ou besoin de clarifications, 
                n&apos;hésitez pas à créer un ticket ou contacter un membre du staff.
              </p>
              <div className="text-sm text-gray-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
