import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, MessageSquare, AlertTriangle, CheckCircle, XCircle, Clock, Ban, Eye } from 'lucide-react'

export default function StaffReglementPage() {
  const sections = [
    {
      icon: Shield,
      title: '1 – Devoirs et Responsabilités',
      color: 'text-blue-400',
      rules: [
        'Adopter un comportement exemplaire, que ce soit en RP ou hors RP',
        'Être garants du respect des règles générales du serveur',
        'Intervenir avec neutralité et discernement',
        'Prendre des décisions cohérentes entre membres du staff',
        'Demander l\'avis de l\'équipe en cas de doute',
        'Encadrer les joueurs et accompagner les nouveaux',
        'Répondre aux questions et résoudre les conflits de manière calme et posée'
      ]
    },
    {
      icon: MessageSquare,
      title: '2 – Communication Interne',
      color: 'text-purple-400',
      rules: [
        'Communication interne uniquement via les salons dédiés',
        'En cas d\'urgence, utiliser les messages privés',
        'Régler les conflits internes exclusivement en privé ou dans le salon staff',
        'Aucun règlement de compte toléré publiquement',
        'Interdiction de régler ses différends dans le Chat Staff In-Game',
        'En cas de désaccord, rejoindre un salon vocal staff et exposer la situation',
        'Le passage en mode staff doit être justifié',
        'Si vous restez en mode staff (ex. pour observer), remplir le rapport de mise en mode staff',
        'Répondre à un ticket ne nécessite pas ce rapport',
        'Se mettre en mode staff sans raison valable est interdit'
      ]
    },
    {
      icon: Users,
      title: '3 – Pouvoirs et Limites',
      color: 'text-green-400',
      rules: [
        'Les permissions staff ne doivent jamais être utilisées pour favoriser un joueur',
        'Ne pas influencer le RP de manière injuste',
        'Les commandes (kick, ban, mute, attribution de rôles, etc.) doivent être accompagnées d\'une justification claire',
        'Si nécessaire, fournir une preuve',
        'Chaque sanction (avertissement, kick, ban) doit être notifiée avec votre pseudo Discord',
        'Les tickets doivent être traités dans l\'ordre',
        'Si vous prenez un ticket secondaire, vous devez ensuite obligatoirement récupérer le ticket prioritaire en attente',
        'Le non-respect de cette règle peut entraîner des sanctions'
      ]
    },
    {
      icon: Ban,
      title: 'Interdictions en Mode Staff',
      color: 'text-red-400',
      rules: [
        'Ramasser des équipements',
        'Rester à proximité des points de capture',
        'Utiliser le mode staff pour obtenir des informations RP ou liées à un combat',
        'Aucun staff ne peut faire apparaître un véhicule ou une arme, sauf :',
        '• Via les NPC disponibles',
        '• Par une attribution RP légitime',
        '• Avec autorisation d\'un Head Staff (HS), dans un contexte RP ou lors d\'un event'
      ]
    },
    {
      icon: Clock,
      title: '4 – Disponibilité et Investissement',
      color: 'text-orange-400',
      rules: [
        'Une présence régulière est attendue',
        'En cas d\'absence prolongée, prévenir via le salon prévu ou en message privé à un administrateur',
        'Une inactivité non justifiée de plus de 7 jours peut entraîner un retrait temporaire des permissions',
        'Le staff est bénévole, mais un investissement minimum est nécessaire',
        'Assurer le bon fonctionnement du serveur'
      ]
    },
    {
      icon: Eye,
      title: '5 – Confidentialité et Respect',
      color: 'text-emerald-400',
      rules: [
        'Toute information échangée en interne doit rester confidentielle',
        'Interdiction de divulguer publiquement des décisions internes',
        'Interdiction de parler de sanctions sans autorisation',
        'Le respect entre membres du staff est obligatoire, même en cas de divergences d\'opinion',
        'Vous n\'avez pas le droit de traiter un ticket vous concernant ou impliquant une personne proche de vous',
        'Dans ce cas, laisser un autre staff prendre en charge le ticket',
        'Aucun staff ne peut rester AFK dans les channels tickets réservés aux BDA',
        'Seuls les Head Staff (HG/HS) peuvent intervenir dans un ticket BDA en cours',
        'Les autres doivent attendre une demande officielle via un ping sur les salons staff pour rejoindre le ticket'
      ]
    }
  ]

  const procedures = [
    {
      title: 'Traitement des Tickets',
      steps: [
        'Traiter les tickets dans l\'ordre de priorité',
        'Si vous prenez un ticket secondaire, récupérer obligatoirement le ticket prioritaire en attente',
        'Accuser réception du ticket rapidement',
        'Analyser la demande et rassembler les informations nécessaires',
        'Fournir une réponse complète et justifiée',
        'Fermer le ticket avec une résolution claire',
        'Notifier chaque sanction avec votre pseudo Discord'
      ]
    },
    {
      title: 'Mode Staff',
      steps: [
        'Justifier le passage en mode staff',
        'Si vous restez en mode staff pour observer, remplir le rapport de mise en mode staff',
        'Répondre à un ticket ne nécessite pas ce rapport',
        'Ne pas ramasser d\'équipements en mode staff',
        'Ne pas rester à proximité des points de capture',
        'Ne pas utiliser le mode staff pour obtenir des informations RP',
        'Ne pas faire apparaître de véhicules ou armes sans autorisation'
      ]
    },
    {
      title: 'Gestion des Conflits',
      steps: [
        'Régler les conflits internes exclusivement en privé ou dans le salon staff',
        'Aucun règlement de compte public toléré',
        'En cas de désaccord, rejoindre un salon vocal staff',
        'Exposer la situation calmement',
        'Respecter les autres membres du staff même en cas de divergences',
        'Demander l\'avis de l\'équipe en cas de doute'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-dark-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Règlement Staff
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Règlement officiel du staff Tokyo Ghoul RP. 
            Ce document définit les devoirs, responsabilités et procédures pour tous les membres de l'équipe staff.
          </p>
        </div>

        {/* Warning */}
        <Card className="glass-effect mb-12 border-red-600/50 bg-red-600/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <div>
                <h3 className="text-white font-semibold">Information Confidentielle</h3>
                <p className="text-gray-400 text-sm">
                  Ce contenu est strictement réservé aux membres du staff. 
                  Toute divulgation à des non-membres du staff est interdite.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} className="glass-effect border-l-4 border-l-primary-600">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-dark-800">
                    <section.icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <CardTitle className="text-white text-2xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300 leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Procedures */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Procédures Opérationnelles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {procedures.map((procedure, index) => (
              <Card key={index} className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{procedure.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {procedure.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start space-x-3">
                        <span className="w-6 h-6 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-300 text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="glass-effect border-primary-600/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Questions ou Clarifications ?
            </h3>
            <p className="text-gray-400 mb-6">
              Pour toute question concernant ce règlement ou les procédures staff, 
              contactez un administrateur ou utilisez le canal staff dédié. 
              En cas de conflit interne, rejoignez un salon vocal staff pour exposer la situation.
            </p>
            <div className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')} | 
              Règlement Staff Tokyo Ghoul RP | Confidential
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

