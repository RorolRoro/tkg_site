'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronRight, Shield, Users, MessageSquare, Sword, Heart, AlertTriangle, BookOpen, Gavel, Search, X } from 'lucide-react'

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
  const [searchQuery, setSearchQuery] = useState('')

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
      id: 'combat-binome-ccg',
      title: 'Combat : binôme CCG vs ghoul confirmée',
      description: 'Le CCG patrouille en binôme et ces deux agents sont autorisés à engager une ghoul confirmée isolée. La ghoul devra, pour compenser l\'infériorité numérique, utiliser son unique 10-24 autorisé afin d\'obtenir le renfort nécessaire.',
      interdictions: [],
      autorisations: [
        'Un binôme CCG peut engager une ghoul confirmée seule.',
        'La ghoul concernée peut déclencher son 10-24 pour équilibrer le combat.'
      ],
      expanded: false
    },
    {
      id: 'qg-bases',
      title: 'QG & Bases',
      description: 'Les bases d\'organisations issues du lore sont considérées comme secrètes. Menacer ou attaquer directement un membre dans sa propre base expose le joueur à un risque de RPK. La répétition d\'infractions peut mener à un assaut sur la base, dans le seul but de capturer le joueur, avec autorisation préalable d\'un administrateur. Provoquer des membres du CCG depuis une zone safe ou sa base de façon répétée et abusive entraînera des sanctions RP et HRP. Lorsqu\'une Ghoul ou un CCG entre dans son QG pendant un combat et en ressort avant un délai de vingt minutes, il s\'expose à un RPK dès qu\'il tombe. Une ghoule infiltrant une organisation ou une base d\'organisation est sous risque RPK permanent.',
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
      description: 'Quand vous tombez lors d\'un combat, vous oubliez toute information récoltée lors de la scène post combat (noms, tenues, organisation, lieux, etc) et lors du combat (kagune, spell, éveil, stratégie). Mécanique de rappel progressif : Plus la scène (combat + post-combat) dure longtemps avant que vous tombiez, plus vous pouvez vous souvenir de certains éléments, de façon vague d\'abord, puis plus précis. Courte scène (< 5 min) : souvenirs très flous ou inexistants. Scène moyenne (5 -> 13 min) : quelques éléments généraux. Longue scène (> 13 min) : souvenirs plus précis. Les personnes ayant survécu au combat peuvent raconter les événements passés à leur allié tombé lors du combat.',
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
      description: 'Il est interdit de menotter quelqu\'un avant la fin du combat. Pour menotter une personne, celle-ci doit soit donner son accord, soit être en état de "pain" (moins de 10% de ses points de vie). Si vous êtes attaqué alors que vous transportez une personne (menottée ou portée sur votre dos), vous devez vous arrêter immédiatement afin de privilégier l\'interaction RP. Dans le cas contraire, la partie adverse pourra vous attaquer directement. Si une personne tue un de ses alliés en "pain" pendant un combat, la faction adverse peut le relever si elle remporte le combat. Si l\'action est jugée volontaire, elle sera sanctionnée. La capture d\'un membre ne justifie en aucun cas une capture de représailles (sauf entre ghouls). Si le CCG participe activement au combat et se fait capturer, les ghouls peuvent l\'utiliser lors des négociations. Lorsque vous transportez un détenu, vous devez utiliser vos mains (animation de port) et conserver la vitesse associée.',
      interdictions: [
        'Menotter quelqu\'un avant la fin du combat.',
        'Courir ou utiliser le ParkourMod avec une personne menottée.',
        'Porter une arme lorsqu\'on transporte une personne menottée.',
        'Menotter ou démenotter quelqu\'un en plein combat.',
        'Appeler des renforts par radio, écrit ou vocal sur Discord une fois menotté.',
        'Courir lorsqu\'on porte un individu en état de "pain" ou utiliser un Swep kagune/quinque pour bénéficier d\'une vitesse supplémentaire pendant un transport.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'escorte-ghoul-menottee',
      title: 'Escorte de ghoul menottée',
      description: 'Lorsqu\'une ghoul est escortée menottée, seules les membres officiellement rattachées à son organisation peuvent intervenir ou négocier pour tenter de la libérer. Toute intervention extérieure est interdite. En cas de comportement No Fear constaté pendant l\'escorte (preuve vidéo/REC à l\'appui), la personne capturée sera directement soumise à un RPK.',
      interdictions: [
        'Intervenir ou négocier pour libérer une ghoul escortée sans appartenir officiellement à son organisation.',
        'Adopter un comportement No Fear pendant l\'escorte (RPK appliqué si preuve REC).'
      ],
      autorisations: [
        'Seuls les membres officiels de l\'organisation concernée peuvent organiser une intervention ou une négociation.'
      ],
      expanded: false
    },
    {
      id: 'capture-territoires',
      title: 'Capture de territoires/drapeaux',
      description: 'Lors des captures de drapeaux impliquant 4 ou 5 personnes, les personnes souhaitant contester la capture (CCG ou Ghoules) ne peuvent être plus nombreuses que celles qui capturent. Même pendant les captures de territoires, il est obligatoire de créer une scène et/ou d\'entamer des négociations avant d\'engager le combat. Toute infraction à ces règles entraînera une sanction.',
      interdictions: [
        'Capturer un territoire à plus de 5 personnes.',
        'Capturer un territoire à l\'ouverture du serveur : attendez 1h après l\'ouverture officielle avant de lancer une capture.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'capture-drapeaux',
      title: 'Capture de drapeaux : limites & récompenses',
      description: 'Pour capturer un drapeau, attendez systématiquement 1h après l\'ouverture serveur (ex : ouverture 18h05 → capture possible à partir de 19h05). Récompenses : Drapeau vert (1 à 5 viandes / 10 000 à 50 000 ¥), Drapeau orange (4 à 10 viandes / 40 000 à 100 000 ¥), Drapeau rouge (7 à 15 viandes / 70 000 à 150 000 ¥). Le maximum n\'est accordé que si vous contrôlez la zone, gérez les négociations et ne dépendez d\'aucune aide extérieure.',
      interdictions: [
        'Les ghouls de rang A ne peuvent pas capturer les points standards (uniquement les points rouges).',
        'Changer d\'effectif pour introduire des membres beaucoup plus puissants en plein capture.',
        'Observer une capture depuis un toit ou directement sur la zone sans raison RP.'
      ],
      autorisations: [
        'Revendiquer les paliers minimum/maximum prévus lorsque les conditions (contrôle, négociation, autonomie) sont réunies.'
      ],
      expanded: false
    },
    {
      id: 'fin-enquete-assauts',
      title: 'Fin d\'enquête et Assauts',
      description: 'Lorsqu\'une enquête RP arrive à son terme, le CCG peut, avec l\'autorisation du Haut-Staff, lancer un assaut contre une base d\'organisation. Si le CCG remporte le combat, il peut relever l\'ensemble des ghouls présentes pour les capturer. Si les ghouls remportent l\'assaut, la plus influente d\'entre elles peut relever les membres du CCG pour conclure la scène ou négocier un échange RP.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'chasse',
      title: 'Chasse',
      description: 'Il est interdit de former des groupes de chasse de plus de 4 personnes.',
      interdictions: [
        'Former des groupes de chasse de plus de 4 personnes.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'patrouilles-ccg',
      title: 'Patrouilles CCG',
      description: 'Les patrouilles du CCG se font désormais exclusivement en binôme. Cette limitation doit être prise en compte pour appliquer les règles concernant les combats et les appels 10-24.',
      interdictions: [
        'Former des patrouilles CCG de plus de deux agents.'
      ],
      autorisations: [
        'Adapter les combats et les renforts en se référant aux règles "Combat : binôme CCG" et "Renfort 10-24".'
      ],
      expanded: false
    },
    {
      id: 'combat-retrait',
      title: 'Combat : retrait et distance',
      description: 'Lorsqu\'un combat de groupe est engagé, si vous quittez la zone plus d\'une minute ou que vous vous éloignez trop pour temporiser/régénérer, vous ne pouvez plus revenir. Prendre un peu de distance est autorisé, mais quitter totalement la zone (ex : Tekka → chantier ou Tekka → proche de l\'Antique) met fin à votre participation.',
      interdictions: [
        'Revenir dans un combat après s\'en être éloigné plus d\'une minute.',
        'Quitter largement la zone du combat pour récupérer avant d\'y retourner.'
      ],
      autorisations: [
        'Prendre une distance raisonnable tout en restant dans le périmètre de la scène.'
      ],
      expanded: false
    },
    {
      id: 'ramassage-butin',
      title: 'Ramassage de butin',
      description: 'Il est interdit de ramasser des corps, des viandes ou des quinques si vous n\'avez pas participé à la scène depuis le début. Le CCG peut intervenir s\'il est témoin d\'une scène suspecte entre ghouls. Il est interdit au CCG de mettre une ghoul en sac pour la transformer en quinque si elle n\'était pas présente pendant la scène. Si un groupe de ghouls remporte un combat contre une escouade du CCG, une seconde escouade ne peut pas intervenir immédiatement pour relancer un combat. Cette règle laisse aux ghouls victorieuses le temps de se replier. Cependant, si les ghouls initient une nouvelle interaction hostile ou provocatrice envers le CCG, ce dernier peut riposter immédiatement.',
      interdictions: [
        'Ramasser des corps, viandes ou quinques sans avoir participé à la scène depuis le début.',
        'Mettre une ghoul en sac pour la quinquer si l\'escouade n\'était pas présente pendant la scène.'
      ],
      autorisations: [
        'Le CCG peut intervenir s\'il est témoin d\'une scène suspecte entre ghouls.'
      ],
      expanded: false
    },
    {
      id: 'negociations',
      title: 'Négociations',
      description: 'Les négociations sont autorisées sur les yens, territoires et accords, tant qu\'elles restent raisonnables. En cas de refus total de négociation, des conséquences RP peuvent être appliquées (perte de RC, risque RPK, etc.).',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'interactions-rp',
      title: 'Interactions RP',
      description: 'Une véritable interaction RP est obligatoire avant tout combat. Un simple message visant uniquement à déclencher le combat sera considéré comme une tentative de rush et sera sanctionné. Exceptions : une ghoul dévoilant son kagune en présence du CCG, ou l\'utilisation manifeste du Parkour Mod (sauts incohérents) peuvent autoriser une intervention immédiate.',
      interdictions: [
        'Déclencher un combat sans véritable interaction RP.'
      ],
      autorisations: [
        'Attaquer sans interaction préalable si une ghoul dévoile son kagune devant le CCG.',
        'Attaquer une ghoul qui abuse du Parkour Mod (sauts incohérents) sans dialogue préalable.'
      ],
      expanded: false
    },
    {
      id: 'rpk',
      title: 'RPK (Roleplay Kill)',
      description: 'En cas de RPK, le personnage est considéré comme définitivement mort : vous perdez son histoire et ses relations et devez créer un nouveau personnage. Les ghouls de rang SS et les inspecteurs en chef sont en risque RPK permanent (ainsi que leurs agresseurs si l\'agression est injustifiée). Les ghouls de rang S et supérieur ne sont en risque RPK qu\'en cas de capture par le CCG. Une interaction RP préalable est obligatoire. Nombre d\'arrestations avant RPK : ghouls de rang inférieur à B- : 5 arrestations. Ghouls de rang supérieur ou égal à B- : 3 arrestations. Le changement de palier ne remet pas le compte d\'arrestations à zéro.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'viande-rc',
      title: 'Viande RC grillée',
      description: 'Lorsque vous demandez au restaurant de cuire vos viandes, une taxe de 30% est mise en place et ira pour le restaurant ET le café. Si vous demandez de cuire 10 viandes, le restaurant vous prendra 3 viandes et vous redonnera 7 viandes. Un manquement à cette règle sera considéré comme du farm RC et sera sanctionné.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'renfort-ccg',
      title: 'Renfort CCG / 1024',
      description: 'Un seul appel 10-24 (renfort) est autorisé par camp et par combat. Les renforts arrivant via ce 10-24 n\'ont pas le droit de lancer eux-mêmes un autre appel et doivent se présenter d\'un seul bloc (pas d\'arrivées successives). Seules les ghouls travaillant en étroite collaboration RP ou alliées peuvent venir renforcer leurs pairs. Pour le CCG, le 10-24 n\'est utilisable que si le groupe adverse compte plus de 4 ghouls, et une seule escouade peut intervenir (8 agents maximum contre 5 ghouls).',
      interdictions: [
        'Effectuer plus d\'un 10-24 par faction durant un combat.',
        'Autoriser des renforts issus du 10-24 à lancer un nouvel appel.',
        'Faire entrer les membres du renfort un par un ou hors du timing initial.',
        'Faire intervenir des ghouls sans lien RP ou alliance avec la ghoul ayant demandé le 10-24.'
      ],
      autorisations: [
        'Le CCG peut appeler une escouade complète (8 maximum) lorsque le camp ghoul dépasse 4 membres, dans la limite d\'un seul 10-24.',
        'Les ghouls peuvent répondre à l\'appel de renfort uniquement si elles sont alliées RP et arrivent simultanément.'
      ],
      expanded: false
    },
    {
      id: 'combat-inclusion',
      title: 'Combat : inclusion et effectifs',
      description: 'Il est interdit de se joindre à un combat si vous n\'avez pas été appelé en renfort. Seul le CCG peut effectuer un appel lui permettant d\'amener un combattant de plus que le camp adverse (exemple : un combat démarre en 2v2, les ghouls appellent 4 personnes, le CCG peut en appeler 5 pour respecter la logique Fear/Mass RP).',
      interdictions: [
        'Rejoindre un combat sans avoir été explicitement appelé en renfort.',
        'Augmenter les effectifs ghoul au-delà du camp adverse sans accord ou appel CCG.'
      ],
      autorisations: [
        'Le CCG peut utiliser son appel pour disposer d\'un combattant supplémentaire par rapport au camp adverse.'
      ],
      expanded: false
    },
    {
      id: 'quinques',
      title: 'Quinques',
      description: 'Lorsqu\'un CCG transforme une ghoul en quinque, cette dernière perd 2% de ses RC. Tous les membres de l\'équipe ayant participé à la capture peuvent bénéficier d\'une amélioration de leur quinque.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'cochlee-assauts',
      title: 'Cochlée / Assauts',
      description: 'Un joueur envoyé à la Cochlée dispose de deux semaines pour être libéré. En attendant, il peut créer un nouveau personnage. En cas d\'assaut sur la Cochlée, toutes les ghouls participantes sont sous risque RPK. Un équilibrage doit être validé par les staffs avant le début du combat.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'test-rc',
      title: 'Test RC',
      description: 'Le CCG n\'est pas autorisé à abuser de l\'utilisation du test RC. Chaque test doit être justifié par une raison valable et documentée.',
      interdictions: [
        'Abuser du test RC sans justification valable et documentée.'
      ],
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
      id: 'outils-vocaux',
      title: 'Outils vocaux',
      description: 'Les modificateurs de voix (VoiceMods) sont autorisés s\'ils améliorent positivement votre RP.',
      interdictions: [],
      autorisations: [
        'Utiliser un modificateur de voix uniquement s\'il sert l\'immersion RP.'
      ],
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
      id: 'bunny-hop',
      title: 'Bunny Hop',
      description: 'Le "Bunny Hop" consiste à courir tout en sautant pour aller plus vite. Le RP impose de ne pas faire dans le jeu ce que vous ne pouvez pas faire dans la vie réelle.',
      interdictions: [
        'Pratiquer le "Bunny Hop" pour gagner de la vitesse en RP.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'usebug',
      title: 'Usebug',
      description: 'Il est interdit d\'utiliser un bug à son avantage : toute mécanique de jeu exploitant un moyen technique non reconnu par le serveur est prohibée.',
      interdictions: [
        'Exploiter un bug ou une faille technique pour obtenir un avantage.'
      ],
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
    },
    {
      id: 'afk-farm',
      title: 'AFK Farm',
      description: 'Il est interdit de contourner le système d\'expulsion automatique pour inactivité (15 minutes) en bougeant ou en utilisant un logiciel pour faire bouger le personnage.',
      interdictions: [
        'Contourner le système anti-AFK pour rester connecté ou farmer.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'annulation-scene',
      title: 'Annulation de scène (Void)',
      description: 'Il est interdit d\'annuler une scène à l\'amiable sans la validation du staff. Il en va de la responsabilité du staff et des joueurs impliqués de notifier cette annulation.',
      interdictions: [
        'Annuler une scène sans validation explicite du staff.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'scene-majeure',
      title: 'Scènes majeures et fermeture serveur',
      description: 'Aucune scène majeure (assaut, convoi important, capture critique, etc.) ne peut débuter dans les 45 minutes précédant la fermeture du serveur afin d\'éviter les interruptions forcées.',
      interdictions: [
        'Lancer une scène majeure moins de 45 minutes avant la fermeture du serveur.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'insultes',
      title: 'Insultes',
      description: 'Toute forme de discrimination ou d\'insultes hors de la cohérence du roleplay de l\'univers de Tokyo Ghoul est prohibée.',
      interdictions: [
        'Proférer des insultes ou discriminations HRP.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'double-vocal',
      title: 'Double vocal (Discord & en jeu)',
      description: 'Utiliser simultanément un vocal Discord et le vocal en jeu est interdit et passible de sanctions importantes.',
      interdictions: [
        'Cumuler Discord et le vocal en jeu pendant une scène.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'reglement-masque',
      title: 'Règlement des masques',
      description: 'Les masques doivent rester cohérents avec votre identité RP. Les noms trolls, "Agent", "Inspecteur", "???", ou les caractères spéciaux masquant l\'identité sont prohibés. Porter un masque en zone de Mass RP autorise le CCG à réaliser un test RC. Utilisez simplement votre nom de ghoul et évitez les changements incohérents.',
      interdictions: [
        'Utiliser un nom troll ou administratif (Agent/Inspecteur) sur un masque.',
        'Employer des caractères spéciaux, espaces, points ou symboles pour masquer votre nom (seul votre nom de ghoul/CCG est autorisé).',
        'Changer de nom de ghoul de manière illogique.'
      ],
      autorisations: [
        'Porter un masque cohérent : le CCG peut tester le RC si vous le portez en zone de Mass RP.'
      ],
      expanded: false
    }
  ]

  const sectionsLexiqueRP: RuleSection[] = [
    {
      id: 'fear-rp',
      title: 'Fear RP',
      description: 'Il s\'agit de simuler la peur au cours d\'une scène RP. Dans la vraie vie, tout le monde (ou presque) craint la vue d\'une arme à feu. Si vous décidez de sortir une arme ou d\'appeler la police alors que vous êtes vous-même braqué, cela constitue du "No Fear RP", ce qui est interdit. Explication : un personnage "Passif" peut attaquer 3 "Passifs" ou 2 "Peu Dangereux", mais ne peut pas attaquer 1 "Dangereux". Vous devez avoir peur des gens ayant 2 rangs de plus que vous et fuir ou vous rendre.',
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
      description: 'Le Pain RP consiste à faire ressentir la douleur à travers son personnage. Si la personne que vous affrontez peut vous achever en un coup, il vous est impossible de courir. Les excuses du type "oui, mais j\'ai entraîné mon personnage à la torture" ne fonctionnent pas (sauf validation du staff par ticket RP). Le CCG lorsqu\'il tombe au combat doit jouer une scène post traumatique (médecin, soins, etc), sous peine de sanction.',
      interdictions: [
        'Il est INTERDIT de bouger ou de prendre part au combat lorsque vous êtes en état de "pain" (10% HP).',
        'Il est INTERDIT de se faire porter par une personne extérieure au combat.',
        'Il est INTERDIT de reprendre le combat une fois que la régénération passive vous a sorti de l\'état de "pain".'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'rpq',
      title: 'RPQ / RP Sex',
      description: 'Le RPQ (RolePlay Cul) ou RP Sex est strictement interdit sous tous ses angles.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'safe-rp',
      title: 'Safe RP',
      description: 'Le Safe RP est le fait de jouer de manière à éviter tout risque pour son personnage, sans jamais se mettre en danger.',
      interdictions: [
        'Rester caché en permanence dans une zone inatteignable ou refuser toute interaction RP pour protéger son personnage.'
      ],
      autorisations: [
        'Jouer le danger, prendre des risques et accepter les pertes liées à votre RP.'
      ],
      expanded: false
    },
    {
      id: 'no-fear',
      title: 'No Fear',
      description: 'Comportement d\'un personnage qui ignore ou minimise des situations dangereuses sans raison logique.',
      interdictions: [
        'Ignorer une menace évidente.',
        'Ne pas réagir face à un danger majeur.'
      ],
      autorisations: [
        'Réagir de manière appropriée aux menaces.',
        'Montrer une peur réaliste.'
      ],
      expanded: false
    },
    {
      id: 'free-attack',
      title: 'Free Attack',
      description: 'Attaquer un joueur sans raison RP valable ou sans sommations claires. Sortir son Kagune ou sa Quinque sans sommation ou interaction RP est interdit.',
      interdictions: [
        'Attaquer sans avertissement.',
        'Attaquer sans motif RP.',
        'Attaquer sans interaction RP.'
      ],
      autorisations: [
        'Attaquer avec des raisons RP claires.',
        'Faire des sommations avant d\'attaquer.',
        'Instaurer une interaction RP avant d\'engager le combat.'
      ],
      expanded: false
    },
    {
      id: 'win-rp',
      title: 'Win RP',
      description: 'Chercher à "gagner" à tout prix sans respecter les interactions et l\'environnement RP.',
      interdictions: [
        'Refuser toute négociation.',
        'Imposer une action via un /me ou autre sans laisser d\'alternative.'
      ],
      autorisations: [
        'Accepter les négociations.',
        'Laisser des possibilités de réponse aux autres joueurs.'
      ],
      expanded: false
    },
    {
      id: 'loose-rp',
      title: 'Loose RP',
      description: 'Accepter les défaites et les conséquences négatives pour son personnage.',
      interdictions: [
        'Refuser un "Loose RP".',
        'Protester contre un RPK validé.'
      ],
      autorisations: [
        'Accepter les blessures et les défaites.',
        'Être prêt à perdre son personnage si nécessaire.'
      ],
      expanded: false
    },
    {
      id: 'fail-rp',
      title: 'Fail RP',
      description: 'Action où le joueur ne joue pas correctement, avec un comportement qui brise la cohérence RP (de son personnage ou de la scène).',
      interdictions: [
        'Utiliser un /me pour réaliser une action "Win RP".',
        'Briser la cohérence d\'une scène ou de son personnage.'
      ],
      autorisations: [
        'Respecter son personnage.',
        'Respecter la cohérence d\'une scène.',
        'Éviter toute action anti-RP.'
      ],
      expanded: false
    },
    {
      id: 'mass-rp',
      title: 'Mass RP',
      description: 'Il s\'agit de prendre en compte la population de la ville et non uniquement les joueurs sur le serveur (ex : un commissariat n\'est pas vide parce qu\'un seul policier est connecté).',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'force-rp',
      title: 'Force RP',
      description: 'Il est interdit de forcer un joueur à jouer une scène contre son gré.',
      interdictions: [
        'Forcer une scène qui met mal à l\'aise un joueur.',
        'Forcer quelqu\'un pour des raisons HRP.',
        'Imposer une scène qui n\'est pas fair-play et profite uniquement à l\'initiateur.'
      ],
      autorisations: [],
      expanded: false
    },
    {
      id: 'block-rp',
      title: 'Block RP',
      description: 'Il est interdit de bloquer le RP d\'un autre joueur sans raison roleplay valable. Cette règle est liée au fair-play et à la Force RP.',
      interdictions: [],
      autorisations: [],
      expanded: false
    },
    {
      id: 'free-shot',
      title: 'Free Shot',
      description: 'Il est interdit de tirer sur un autre joueur avec une arme sans raison roleplay valable.',
      interdictions: [],
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

  const filteredSections = useMemo(() => {
    let sections: RuleSection[]
    switch (activeTab) {
      case 'reglement-rp':
        sections = sectionsReglementRP
        break
      case 'reglement-general':
        sections = sectionsReglementGeneral
        break
      case 'lexique-rp':
        sections = sectionsLexiqueRP
        break
      default:
        sections = sectionsReglementRP
    }
    
    if (!searchQuery.trim()) {
      return sections
    }
    
    const query = searchQuery.toLowerCase()
    return sections.filter(section => {
      const titleMatch = section.title.toLowerCase().includes(query)
      const descMatch = section.description.toLowerCase().includes(query)
      const interdictionsMatch = section.interdictions.some(i => i.toLowerCase().includes(query))
      const autorisationsMatch = section.autorisations.some(a => a.toLowerCase().includes(query))
      
      return titleMatch || descMatch || interdictionsMatch || autorisationsMatch
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchQuery])

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

  // Fonction pour surligner le texte recherché
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) {
      return text
    }

    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <mark key={index} className="bg-yellow-400/30 text-yellow-200 px-1 rounded">
            {part}
          </mark>
        )
      }
      return part
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
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'glow' : 'outline'}
              onClick={() => {
                setActiveTab(tab.id)
                setSearchQuery('')
              }}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher dans le règlement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-dark-800/50 border-dark-700 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-400 mt-2 text-center">
              {filteredSections.length} résultat{filteredSections.length > 1 ? 's' : ''} trouvé{filteredSections.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Rules Sections */}
        <div className="space-y-6">
          {filteredSections.length === 0 && searchQuery ? (
            <Card className="glass-effect">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-xl mb-2">Aucun résultat</h3>
                <p className="text-gray-400">
                  Aucune section ne correspond à votre recherche &quot;{searchQuery}&quot;
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSections.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            return (
              <Card key={section.id} className="glass-effect border-l-4 border-l-primary-600">
                <CardHeader>
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-dark-800/50 p-2 rounded transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <CardTitle className="text-white text-xl">
                      {searchQuery ? highlightText(section.title, searchQuery) : section.title}
                    </CardTitle>
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
                        {searchQuery ? highlightText(section.description, searchQuery) : section.description}
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
                                <span className="text-gray-300 text-sm">
                                  {searchQuery ? highlightText(interdiction, searchQuery) : interdiction}
                                </span>
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
                                <span className="text-gray-300 text-sm">
                                  {searchQuery ? highlightText(autorisation, searchQuery) : autorisation}
                                </span>
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
          }))}
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
