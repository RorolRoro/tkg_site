import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function StaffReglementPage() {
  const sections = [
    {
      icon: Shield,
      title: 'Rôles et Responsabilités',
      color: 'text-blue-400',
      rules: [
        'Respectez votre rôle et vos responsabilités assignées',
        'Soyez disponible et réactif aux demandes de la communauté',
        'Maintenez un comportement exemplaire en toutes circonstances',
        'Participez activement aux réunions et formations staff',
        'Respectez la hiérarchie et les décisions des supérieurs'
      ]
    },
    {
      icon: Users,
      title: 'Gestion de la Communauté',
      color: 'text-green-400',
      rules: [
        'Traitez tous les membres avec respect et équité',
        'Appliquez les sanctions de manière cohérente et justifiée',
        'Documentez toutes les actions de modération prises',
        'Encouragez un environnement positif et inclusif',
        'Signalez tout comportement inapproprié aux supérieurs'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Communication Staff',
      color: 'text-purple-400',
      rules: [
        'Utilisez les canaux staff appropriés pour les discussions internes',
        'Respectez la confidentialité des informations staff',
        'Communiquez clairement et professionnellement',
        'Partagez les informations importantes avec l\'équipe',
        'Respectez les délais de réponse aux tickets et demandes'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Gestion des Conflits',
      color: 'text-orange-400',
      rules: [
        'Restez neutre et objectif dans les situations conflictuelles',
        'Écoutez toutes les parties avant de prendre une décision',
        'Appliquez les sanctions de manière progressive',
        'Documentez les incidents et les mesures prises',
        'Demandez conseil aux supérieurs en cas de doute'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Excellence et Amélioration',
      color: 'text-emerald-400',
      rules: [
        'Cherchez constamment à améliorer vos compétences',
        'Participez aux formations et aux évaluations',
        'Proposez des améliorations constructives',
        'Maintenez un niveau de service élevé',
        'Soyez ouvert aux feedbacks et aux critiques constructives'
      ]
    },
    {
      icon: XCircle,
      title: 'Interdictions Absolues',
      color: 'text-red-400',
      rules: [
        'Aucun abus de pouvoir ou favoritisme',
        'Pas de divulgation d\'informations confidentielles',
        'Interdiction de sanctions personnelles ou vindicatives',
        'Pas de comportement inapproprié envers les membres',
        'Interdiction de contourner les procédures établies'
      ]
    }
  ]

  const procedures = [
    {
      title: 'Traitement des Tickets',
      steps: [
        'Accuser réception du ticket dans les 2 heures',
        'Analyser la demande et rassembler les informations nécessaires',
        'Fournir une réponse complète dans les 24 heures',
        'Fermer le ticket avec une résolution claire',
        'Documenter la résolution pour référence future'
      ]
    },
    {
      title: 'Application des Sanctions',
      steps: [
        'Vérifier les faits et rassembler les preuves',
        'Consulter l\'historique du membre si nécessaire',
        'Appliquer la sanction appropriée selon la gravité',
        'Informer le membre des raisons de la sanction',
        'Documenter l\'incident et la sanction appliquée'
      ]
    },
    {
      title: 'Gestion des Événements',
      steps: [
        'Planifier l\'événement avec l\'équipe staff',
        'Préparer le matériel et les ressources nécessaires',
        'Annoncer l\'événement à la communauté',
        'Superviser l\'événement et assurer la sécurité',
        'Faire un retour d\'expérience après l\'événement'
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
            Guide complet des règles et procédures pour les membres de l'équipe staff. 
            Ce document est confidentiel et réservé aux membres du staff.
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
            </p>
            <div className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')} | 
              Version 2.1 | Confidential
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

