import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Shield, Eye, Heart, Zap } from 'lucide-react'

export default function LorePage() {
  const loreSections = [
    {
      icon: BookOpen,
      title: 'Histoire Générale',
      color: 'text-blue-400',
      content: `L'univers de Tokyo Ghoul RP se déroule dans un Tokyo moderne où coexistent humains et ghouls. 
      Les ghouls sont des créatures qui ressemblent aux humains mais se nourrissent exclusivement de chair humaine. 
      Cette coexistence fragile est maintenue par l'organisation CCG (Centre de Controle des Ghouls) qui traque 
      les ghouls violents tout en protégeant les humains innocents.`
    },
    {
      icon: Users,
      title: 'Les Ghouls',
      color: 'text-red-400',
      content: `Les ghouls possèdent des organes appelés "kagune" qui leur permettent de se défendre et de chasser. 
      Chaque ghoul a un kagune unique basé sur son type (Rinkaku, Koukaku, Bikaku, Ukaku). 
      Ils doivent se nourrir de chair humaine pour survivre, mais certains choisissent de ne consommer que 
      des cadavres pour éviter de tuer. Leur force physique est supérieure à celle des humains.`
    },
    {
      icon: Shield,
      title: 'La CCG',
      color: 'text-yellow-400',
      content: `Le Centre de Controle des Ghouls est l'organisation gouvernementale chargée de maintenir l'ordre 
      entre humains et ghouls. Elle emploie des Inspecteurs spécialisés qui utilisent des quinques, 
      des armes fabriquées à partir des kagune de ghouls morts. Leur mission est de protéger les humains 
      et d'éliminer les ghouls dangereux.`
    },
    {
      icon: Eye,
      title: 'Les Inspecteurs',
      color: 'text-green-400',
      content: `Les Inspecteurs du CCG sont des humains entraînés pour combattre les ghouls. 
      Ils sont classés par rang (Agent à Inspecteur Spéciale) selon leurs compétences. 
      Les Inspecteurs Spéciaux sont les plus redoutables et peuvent rivaliser 
      avec les ghouls les plus puissants.`
    },
    {
      icon: Heart,
      title: 'Les Relations',
      color: 'text-pink-400',
      content: `Les relations entre humains et ghouls sont complexes. Certains ghouls tentent de vivre 
      en harmonie avec les humains, tandis que d'autres les considèrent comme de la nourriture. 
      Des amitiés, voire des amours, peuvent naître entre les deux espèces, mais elles restent 
      extrêmement dangereuses et souvent condamnées.`
    },
    {
      icon: Zap,
      title: 'Les Pouvoirs',
      color: 'text-purple-400',
      content: `Les ghouls possèdent des capacités surhumaines : force, vitesse, régénération et kagune. 
      Les Inspecteurs utilisent des quinques et des techniques de combat spécialisées. 
      Certains humains peuvent devenir des "half-ghouls" après avoir reçu des organes de ghoul, 
      acquérant ainsi des capacités hybrides.`
    }
  ]

  const clans = [
    {
      name: 'Aogiri Tree',
      description: 'Organisation ghoul radicale qui prône la supériorité des ghouls sur les humains',
      color: 'border-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      name: 'Anteiku',
      description: 'Café ghoul qui sert de refuge aux ghouls pacifiques et aux half-ghouls',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'CCG',
      description: 'Commission gouvernementale chargée de lutter contre les ghouls dangereux',
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      name: 'Les Indépendants',
      description: 'Ghouls solitaires qui ne s\'affilient à aucune organisation particulière',
      color: 'border-gray-500',
      bgColor: 'bg-gray-500/10'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Lore Global
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explorez l'univers riche et complexe de Tokyo Ghoul, 
            découvrez les factions, les personnages et l'histoire qui façonnent notre monde RP.
          </p>
        </div>

        {/* Lore Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {loreSections.map((section, index) => (
            <Card key={index} className="glass-effect hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-dark-800">
                    <section.icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <CardTitle className="text-white text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Clans Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Les Clans et Organisations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clans.map((clan, index) => (
              <Card key={index} className={`glass-effect border-l-4 ${clan.color} ${clan.bgColor}`}>
                <CardHeader>
                  <CardTitle className="text-white text-xl">{clan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {clan.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Chronologie des Événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-primary-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Époque Moderne</h4>
                  <p className="text-gray-400">
                    Tokyo actuel où les ghouls et humains coexistent dans un équilibre fragile. 
                    La CCG maintient l'ordre tandis que diverses organisations ghouls opèrent dans l'ombre.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-primary-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Formation du CCG</h4>
                  <p className="text-gray-400">
                    Création de la Centre de Controle des Ghouls pour répondre à la menace croissante 
                    des ghouls violents et protéger la population humaine.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-primary-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Découverte des Ghouls</h4>
                  <p className="text-gray-400">
                    Première reconnaissance officielle de l'existence des ghouls et début des recherches 
                    sur leurs capacités et leur biologie unique.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
