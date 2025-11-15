"use client"

import Image, { type StaticImageData } from "next/image"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import placeholderClanCrest from "@/app/assets/placeholder1.jpg"
import placeholderGenealogy from "@/app/assets/placeholder2.jpg"
import koshinCrest from "@/app/assets/Koshin/logo.png"
import yoshimuraCrest from "@/app/assets/Yoshimura/arbre.png"
import yoshimuraGenealogy from "@/app/assets/Yoshimura/logo.png"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { Crown, Flame, Layers, Orbit, ScrollText, Shield, Swords, Users } from "lucide-react"


type LoreChapter = {
  chapter: string
  era: string
  subtitle: string
  summary: string
  icon: LucideIcon
  accent: {
    dot: string
    glow: string
    border: string
    eventBg: string
    eventBorder: string
  }
  events: {
    year: string
    title: string
    description: string
  }[]
}

const loreChapters: LoreChapter[] = [
  {
    chapter: "Prologue",
    era: "1340 - L'Ere du Chaos",
    subtitle: "Les Washu se dressent parmi les cendres des clans",
    summary:
      "Au coeur d'un Japon en guerre, les Washu emergent avec un savoir interdit. On murmure qu'ils conversent avec des dieux oublies et qu'ils ont appris a se nourrir autrement que les hommes, forgeant une dynastie aussi crainte qu'admiree.",
    icon: ScrollText,
    accent: {
      dot: "bg-teal-300",
      glow: "from-teal-500/20 via-transparent to-transparent",
      border: "border-teal-500/30",
      eventBg: "bg-teal-500/5",
      eventBorder: "border-teal-400/30"
    },
    events: [
      {
        year: "1340",
        title: "L'Ere du Chaos",
        description:
          "Le Japon se dechire sous les guerres de clans. Tandis que les puissants se disputent les terres, les Washu cherchent la verite derriere la nature humaine. Leur ascension est brutale, leur reputation entouree de rituels secrets et de pactes oublies."
      }
    ]
  },
  {
    chapter: "Chapitre 1",
    era: "1422 - Le Regne de Fer",
    subtitle: "Un siecle de domination Washu",
    summary:
      "Pendant pres de cent ans, les Washu regnent sans partage. Ils batissent des forteresses, ecrivent leurs propres lois et etouffent les rebellions avec une froide determination.",
    icon: Flame,
    accent: {
      dot: "bg-rose-300",
      glow: "from-rose-500/20 via-transparent to-transparent",
      border: "border-rose-500/30",
      eventBg: "bg-rose-500/5",
      eventBorder: "border-rose-400/30"
    },
    events: [
      {
        year: "1422",
        title: "Le Regne de Fer",
        description:
          "Les Washu sculptent un empire dans le sang, placant le Japon sous une poigne implacable. Leurs opposants disparaissent, des lois inedites surgissent et leur influence s'etend jusque dans les temples."
      },
      {
        year: "1569",
        title: "L'Eveil des Oni",
        description:
          "Des temoignages decrivent des creatures humaines devoreuses de chair. L'empereur Kagami Washu cree les Traqueurs de l'Ombre, une unite d'elite chargee d'eliminer ces Oni. Leurs victoires deviennent legende, meme si beaucoup s'effacent dans l'obscurite."
      }
    ]
  },
  {
    chapter: "Chapitre 2",
    era: "1620 - La Chute du Pouvoir",
    subtitle: "La dynastie Washu disparait des registres",
    summary:
      "Trahisons, experiences et disparitions frappent la lignee. Les Tokugawa reprennent la main et chassent les Washu dans les ombres, mais leurs heritiers gardent le secret de leur sang.",
    icon: Shield,
    accent: {
      dot: "bg-amber-300",
      glow: "from-amber-500/20 via-transparent to-transparent",
      border: "border-amber-500/30",
      eventBg: "bg-amber-500/5",
      eventBorder: "border-amber-400/30"
    },
    events: [
      {
        year: "1620",
        title: "La Chute du Pouvoir",
        description:
          "Un scandale devaste la dynastie. Les Tokugawa saisissent l'occasion et bannissent les Washu des registres imperiaux. Mais leur nom survit en secret, dissimule parmi le peuple."
      },
      {
        year: "1700",
        title: "Le Savoir Occulte",
        description:
          "Le Japon s'ouvre au monde. Science et occulte se rencontrent. Les textes Washu lient les Oni a une mutation humaine: les goules. Des chercheurs reprennent ces etudes, melant l'interdit a la biologie."
      }
    ]
  },
  {
    chapter: "Chapitre 3",
    era: "1893 - Le Retour des Washu",
    subtitle: "Une organisation nouvelle pour une menace ancienne",
    summary:
      "Face aux attaques des goules, les descendants Washu creent le CCG. Des armes nommees Quinques apparaissent, forgees dans la chair de leurs ennemis.",
    icon: Crown,
    accent: {
      dot: "bg-indigo-300",
      glow: "from-indigo-500/20 via-transparent to-transparent",
      border: "border-indigo-500/30",
      eventBg: "bg-indigo-500/5",
      eventBorder: "border-indigo-400/30"
    },
    events: [
      {
        year: "1893",
        title: "Le Retour des Washu",
        description:
          "Le gouvernement appelle les heritiers Washu. Ensemble, ils fondent le Centre de Controle des Goules (CCG), force paramilitaire chargee de proteger la population."
      },
      {
        year: "1895",
        title: "La Naissance de Sagami",
        description:
          "Dans un sanctuaire oublie nait Sagami, enfant maudit et symbole d'un equilibre fragile. Eleve par la confrerie, il devient prophetie pour certains et malheur pour d'autres."
      },
      {
        year: "1898",
        title: "La Quinque",
        description:
          "Sous Yoshi Washu et le savant Adam Gehner, le CCG modele les premieres Quinques a partir des cellules RC. L'humanite retourne la chair des goules contre elles."
      }
    ]
  },
  {
    chapter: "Chapitre 4",
    era: "1915 - Le Roi Souterrain",
    subtitle: "Tokyo cache une cite interdite",
    summary:
      "Dans les entrailles de la capitale surgit une ville batie pour les rejetes. Sagami y devient roi, dieu pour certains, abomination pour les Washu.",
    icon: Layers,
    accent: {
      dot: "bg-emerald-300",
      glow: "from-emerald-500/20 via-transparent to-transparent",
      border: "border-emerald-500/30",
      eventBg: "bg-emerald-500/5",
      eventBorder: "border-emerald-400/30"
    },
    events: [
      {
        year: "1915",
        title: "Le Roi Souterrain",
        description:
          "Sagami, desormais surnomme le Roi Souterrain, fonde la Cite Souterraine dans les egouts de Tokyo. Les goules s'y refugient et revent d'un futur sans peur, tandis que les Washu le voient comme un monstre a abattre."
      }
    ]
  },
  {
    chapter: "Chapitre 5",
    era: "1941 - La Guerre de l'Ombre",
    subtitle: "Un conflit invisible ravage Tokyo",
    summary:
      "Le CCG affronte les forces du Roi Souterrain dans un silence mediatique total. Meme apres la guerre, l'heritage de Sagami refuse de mourir.",
    icon: Swords,
    accent: {
      dot: "bg-fuchsia-300",
      glow: "from-fuchsia-500/20 via-transparent to-transparent",
      border: "border-fuchsia-500/30",
      eventBg: "bg-fuchsia-500/5",
      eventBorder: "border-fuchsia-400/30"
    },
    events: [
      {
        year: "1941",
        title: "La Guerre de l'Ombre",
        description:
          "Dans les tunnels de Tokyo, hommes et goules s'entretuent dans le secret. Le CCG proclame la mort du Roi Souterrain, mais aucun corps n'est retrouve et des Apotres jurent de preserver sa volonte."
      },
      {
        year: "1997",
        title: "La Nuit des Larmes Sanglantes",
        description:
          "Des organisations de goules frappent simultanement les installations du CCG. Les pertes sont colossales des deux cotes. Une alliance avec le GFG renforce ensuite toutes les infrastructures avec de l'acier RC."
      }
    ]
  },
  {
    chapter: "Chapitre 6",
    era: "2012 - Les Enfants des Abimes",
    subtitle: "Le retour d'une foi fanatique",
    summary:
      "Dans les egouts de Shinjuku, une organisation renait sous la banniere des Enfants des Abimes. Jikoku-Ten, leur Apotre, s'eveille dans une folie destructrice.",
    icon: Orbit,
    accent: {
      dot: "bg-sky-300",
      glow: "from-sky-500/20 via-transparent to-transparent",
      border: "border-sky-500/30",
      eventBg: "bg-sky-500/5",
      eventBorder: "border-sky-400/30"
    },
    events: [
      {
        year: "2012",
        title: "Les Enfants des Abimes",
        description:
          "Guides par Jikoku-Ten, les Enfants se proclament gardiens de la volonte du Roi Souterrain. A son reveil, l'Apotre decouvre la trahison des siens et decide d'engloutir les deux mondes dans le neant."
      },
      {
        year: "2019",
        title: "L'Incident de Shinjuku",
        description:
          "Le reveil de Jikoku-Ten fait trembler Tokyo. Un kagune gigantesque surgit et devaste Shinjuku. Le CCG organise l'evacuation tandis que les goules sont sauvees par l'Aogiri, la Rosae et l'Antique. Quand le silence retombe, Tokyo n'est plus qu'un tombeau vivant."
      }
    ]
  }
]

const presentDay = {
  title: "Present - Reconstruire sur l'abime",
  description:
    "Shinjuku renait difficilement grace aux expeditions conjointes du CCG et de groupes independants. Le CCG se reforme sur les ruines de son ancien QG pour empecher l'Abime de s'etendre. Pourtant, les tensions internes explosent, les inspecteurs doutent et les goules se reorganisent. Certaines revent de paix, d'autres de vengeance, mais toutes sentent que le retour du Roi est proche."
}

const fadeVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
}

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
}

const listParent = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  exit: { opacity: 0 }
}

const listItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } }
}

const hoverSpring = { type: "spring", stiffness: 320, damping: 20 }

type LoreView = "clan" | "global"

type ClanLore = {
  id: string
  name: string
  status: "Restraint" | "Bientot"
  description: string
  vigilance: string
  lore: string
  highlights: string[]
  timeline: { year: string; title: string }[]
  crestNote?: string
  genealogyNote?: string
  crestImage?: { src: StaticImageData; alt: string }
  genealogyImage?: { src: StaticImageData; alt: string }
}

const clanLoreEntries: ClanLore[] = [
  {
    id: "washu",
    name: "Clan Washu",
    status: "Restraint",
    description: "Dynastie fondatrice du CCG, austere et omnipresente dans les rouages de la securite interieure.",
    vigilance: "Rumeurs d'un kagune dormant dans certaines branches familiales.",
    lore:
      "Depuis l'aube de l'ere imperiale, le clan Washu dirige dans l'ombre avec une discipline totale et un reseau militaire tentaculaire. On raconte que certains membres, bien qu'humains, manifestent un kagune. Rien n'a ete prouve, mais guerisons miraculeuses et longevit e suspecte poursuivent la famille. Les Washu ont fonde le CCG et controlent encore ses hautes sph eres, dressant un rempart entre l'humanite et les monstres. Pourtant une question demeure : peuvent-ils proteger l'humanite tout en portant en eux la trace de ce qu'ils combattent ?",
    highlights: [
      "Controle historique des institutions de securite interieure.",
      "Discipline militaire et autorite incontestee sur les inspecteurs.",
      "Mythe du \"kagune maudit\" transmis dans certaines branches."
    ],
    timeline: [
      { year: "Era imperiale", title: "Le clan apparait au sommet de la chaine de commandement." },
      { year: "Fondation du CCG", title: "Les Washu erigent l'organisation contre les goules." },
      { year: "Epoque moderne", title: "Le clan maintient le masque d'une humanite parfaite malgre les rumeurs." }
    ],
    crestNote: "Inserez ici le symbole officiel ou une illustration du clan Washu.",
    genealogyNote: "Cette zone accueillera l'arbre genealogique detaille reliant les differentes branches Washu.",
    crestImage: {
      src: placeholderClanCrest,
      alt: "Illustration temporaire du clan Washu"
    },
    genealogyImage: {
      src: placeholderGenealogy,
      alt: "Placeholder pour l'arbre genealogique Washu"
    }
  },
  {
    id: "arima",
    name: "Clan Arima",
    status: "Restraint",
    description: "Lames fantomes loyales au Washu, passes maitres dans l'infiltration et l'assassinat.",
    vigilance: "Descendance soumise a des rituels ninjas et a des maladies inexplicables.",
    lore:
      "Nul ne sait d'ou provient la famille Arima. Toujours dans l'ombre du clan Washu, ils servaient le jour comme intendants et la nuit comme assassins. Leurs talents de ninjas, leurs armes maudites et des aptitudes genetiques rares leur ont permis d'affronter les premiers Oni. Lies au Washu par un pacte silencieux, ils formerent en 1569 les Traqueurs de l'Ombre et gagnerent une reputation legendaires. Beaucoup mouraient jeunes, ronges par des maux inconnus, mais les survivants accompagnerent les Washu jusque dans la creation du CCG. Akihiko Arima devint la premiere Distinction d'Honneur du Dragon apres la Nuit des Larmes Sanglantes et dirigea l'escouade speciale. Depuis, les Arima perpetuent un art martial base sur la dissimulation et la precision lethale.",
    highlights: [
      "Service secret du clan Washu depuis des siecles.",
      "Formation des Traqueurs de l'Ombre et des meilleurs samourais.",
      "Akihiko Arima, premier inspecteur adoube Dragon et chef d'escouade speciale."
    ],
    timeline: [
      { year: "Ere ancienne", title: "Les Arima jurent fidelite aux Washu et deviennent leurs ombres." },
      { year: "1569", title: "Creation et entrainement des Traqueurs de l'Ombre." },
      { year: "Nuit des Larmes Sanglantes", title: "Akihiko Arima recoit la Distinction d'Honneur du Dragon." }
    ],
    crestNote: "Ajoutez le mon ninja du clan Arima.",
    genealogyNote: "Visualisez la lignee reliant les ombres officielles aux armes secretes.",
    crestImage: {
      src: placeholderClanCrest,
      alt: "Illustration temporaire du clan Arima"
    },
    genealogyImage: {
      src: placeholderGenealogy,
      alt: "Placeholder pour l'arbre genealogique Arima"
    }
  },
  {
    id: "suzuya",
    name: "Clan Suzuya",
    status: "Restraint",
    description: "Dernier clan adosse au CCG, redoute pour sa violence chirurgicale.",
    vigilance: "Descendance marquee par des traumatismes et une biologie atypique.",
    lore:
      "Le clan Suzuya nait avec Tetsue, orphelin vendu a une organisation de goules. Dans les arenes clandestines, il tue sa premiere proie avec une froide sauvagerie, survivant quinze ans de torture avant d'etre libere par le CCG. Intrigue par son instinct meurtrier, le CCG l'integre puis l'eleve au rang des inspecteurs les plus craints. Tetsue se marie et fonde une lignee d'agents pour qui la brutalite precise est devenue un art. Aujourd'hui les Suzuya forment une famille mythique : ils frisent la folie mais restent des armes parfaites pour les missions impossibles. Leur methode demeure un mystere, oscillant entre mutation genetique et entrainement inhumain.",
    highlights: [
      "Origine dans les arenes clandestines dirigees par des goules.",
      "Integration directe au CCG apres une liberation sanglante.",
      "Style de combat base sur une violence methodique sans egale."
    ],
    timeline: [
      { year: "Enfance de Tetsue", title: "Esclave dans une arene, il abat sa premiere goule." },
      { year: "Integration au CCG", title: "Tetsue est libere puis recrute comme agent experimental." },
      { year: "Generations suivantes", title: "Le clan devient une dynastie d'inspecteurs elitaires." }
    ],
    crestNote: "Ajoutez un symbole representant le fil tranchant des Suzuya.",
    genealogyNote: "Prevoir les branches reliant Tetsue aux nouvelles generations.",
    crestImage: {
      src: placeholderClanCrest,
      alt: "Illustration temporaire du clan Suzuya"
    },
    genealogyImage: {
      src: placeholderGenealogy,
      alt: "Placeholder pour l'arbre genealogique Suzuya"
    }
  },
  {
    id: "yoshimura",
    name: "Clan Yoshimura",
    status: "Restraint",
    description: "Famille mythique d'assassins goules, maitres de la Chouette.",
    vigilance: "Rumeurs persistantes sur une survie clandestine apres leur extinction officielle.",
    lore:
      "A Tokyo, le nom Yoshimura glacait autant le CCG que les goules. Leur corps evoluait sans limites jusqu'a engendrer la forme ultime de kakuja : la Chouette, symbole de jugement. Les Yoshimura ne chassaient pas pour survivre mais pour executer des cibles designees, comme s'ils obeissaient a une cause superieure. Lors de la Nuit des Larmes Sanglantes, Atsuhiro Yoshimura deploya la Chouette Parfaite et affronta les legions du CCG avant d'etre abattu par les Washu. Depuis, le clan est officiellement eteint, mais des scenes de crime recentes portent leur signature. Certains affirment que les Yoshimura agissent encore, choisissant cette fois des proies de survie plutot que de jugement.",
    highlights: [
      "Mutations organiques donnant naissance a la Chouette ultime.",
      "Assassinats cibles realises pour une cause inconnue.",
      "Affrontement historique d'Atsuhiro durant la Nuit des Larmes Sanglantes."
    ],
    timeline: [
      { year: "Epoques anciennes", title: "Les Yoshimura deviennent juges et bourreaux nocturnes." },
      { year: "Nuit des Larmes Sanglantes", title: "Atsuhiro revele la Chouette Parfaite face au CCG." },
      { year: "Epoque moderne", title: "Le clan disparait officiellement mais laisse des traces suspectes." }
    ],
    crestNote: "Inserer une illustration de la Chouette.",
    genealogyNote: "Ajoutez les ramifications des heritiers caches.",
    crestImage: {
      src: yoshimuraCrest,
      alt: "Illustration du clan Yoshimura"
    },
    genealogyImage: {
      src: yoshimuraGenealogy,
      alt: "Arbre genealogique du clan Yoshimura"
    }
  },
  {
    id: "tsukiyama",
    name: "Clan Tsukiyama",
    status: "Restraint",
    description: "Dynastie de goules esthetes infiltrees dans l'aristocratie humaine.",
    vigilance: "Connexion directe avec le Restaurant des Goules et les Roses secretes.",
    lore:
      "Des l'ere Edo, les Tsukiyama gerent les reseaux populaires autant que les salons des goules. Ils soutiennent Oda Nobunaga en equipant ses armees afin de mieux se nourrir. Comprenant que la survie passe par les hautes spheres, ils fondent Les Roses, organisation chargee de selectionner les meilleures proies tout en masquant leurs crimes. A l'ere Meiji, ils investissent industrie, art et politique pour se fondre dans la modernite. Aujourd'hui, leurs conglomerats influencent la finance et la culture, tandis que leurs banquets restent legendaires parmi les goules gourmet. Derriere l'opulence, ils protegent un empire de predation raffinee.",
    highlights: [
      "Soutien strategique a Oda Nobunaga pour acceder aux elites.",
      "Creation des Roses pour masquer les chasses et choisir les victimes.",
      "Implantation mondiale via entreprises, art et politiques."
    ],
    timeline: [
      { year: "Ere Edo", title: "Fournissent armes et mercenaires aux seigneurs humains." },
      { year: "Ere Meiji", title: "Investissements massifs dans l'industrie et la finance." },
      { year: "Epoque actuelle", title: "Alliance discrete avec le Restaurant des Goules." }
    ],
    crestNote: "Inserez le blason floral des Tsukiyama.",
    genealogyNote: "Prevoir les branches reliant Les Roses au tronc familial.",
    crestImage: {
      src: placeholderClanCrest,
      alt: "Illustration temporaire du clan Tsukiyama"
    },
    genealogyImage: {
      src: placeholderGenealogy,
      alt: "Placeholder pour l'arbre genealogique Tsukiyama"
    }
  },
  {
    id: "kirishima",
    name: "Clan Kirishima",
    status: "Restraint",
    description: "Famille de goules yakuzas forgee sur l'honneur et l'armure d'Arata.",
    vigilance: "Clan fragmente depuis la mort d'Arata, mais heritage toujours vivant.",
    lore:
      "Dans les annees 70, Yukimura Kirishima fonde un clan de goules inspire des codes samourai. Honneur, fidelite et protection mutuelle soudent leur empire criminel. Les annees 90 marquent l'apogee sous Arata Kirishima, leader charismatique possedant un kagune-armure qui recouvre son corps. Lors de la Nuit des Larmes Sanglantes, il aurait elimine 87 inspecteurs, avant de mourir dans des circonstances floues. Son corps devient la base d'une quinque legendaire, plongeant le clan dans le chaos. Sans son chef, les factions rivales se dechirent et l'organisation s'effondre. Pourtant, le nom Kirishima continue de circuler : certains anciens membres cherchent a reunifier la famille et a ranimer l'honneur perdu.",
    highlights: [
      "Fondation type yakuza basee sur les codes samourai.",
      "Arata Kirishima et son kagune-armure quasi invincible.",
      "La quinque Arata forgee sur sa depouille apres la Nuit des Larmes Sanglantes."
    ],
    timeline: [
      { year: "Annees 70", title: "Yukimura Kirishima etablit le clan en suivant l'honneur samourai." },
      { year: "Annees 90", title: "Arata regne et affronte le CCG durant la Nuit des Larmes Sanglantes." },
      { year: "Epoque actuelle", title: "Factions dissidentes tentent de reconstruire la famille." }
    ],
    crestNote: "Ajoutez le symbole du kagune-armure.",
    genealogyNote: "Cartographier les factions issues de la chute d'Arata.",
    crestImage: {
      src: placeholderClanCrest,
      alt: "Illustration temporaire du clan Kirishima"
    },
    genealogyImage: {
      src: placeholderGenealogy,
      alt: "Placeholder pour l'arbre genealogique Kirishima"
    }
  },
  {
    id: "koshin",
    name: "Clan Koshin",
    status: "Restraint",
    description: "Manipulateurs psychiques de Kabukicho, architectes de l'esprit.",
    vigilance: "Neutres mais capables de remodeler memoires et perceptions.",
    lore:
      "Nes dans l'ombre des premiers conflits, les Koshin ont prefere etudier l'esprit plutot que dominer par la chair. Leur fondateur, Renzaburo, devorait les savants pour absorber leur savoir et aurait etabli le premier contact mental entre ghoul et humain. Depuis, le clan enseigne que la victoire n'existe que si l'esprit adverse change de prison. Ses membres maitrisent l'effacement de souvenirs, la creation de liens telepathiques et l'influence emotionnelle. Leur apparence lumineuse contraste avec leurs dons, ce qui leur vaut les surnoms d'anges menteurs. Aujourd'hui, sous Jin Koshin, l'Architecte du Silence, ils servent de conseillers ou negociateurs, imposant leur paix par des pactes invisibles. Beaucoup redoutent le jour ou ils decideront de remodeler le monde par la pensee seule.",
    highlights: [
      "Philosophie basee sur la maitrise de la conscience et de la memoire.",
      "Techniques psychiques allant de l'effacement a la suggestion collective.",
      "Isolation volontaire sous la direction de Jin Koshin, dit l'Architecte du Silence."
    ],
    timeline: [
      { year: "Origines souterraines", title: "Renzaburo Koshin experimente le lien esprit-ghoul." },
      { year: "Epoques de conflits", title: "Le clan impose la mediation mentale entre familles rivales." },
      { year: "Ere actuelle", title: "Jin Koshin tisse des alliances invisibles a Kabukicho." }
    ],
    crestNote: "Inserer la silhouette doree des yeux du mensonge.",
    genealogyNote: "Tracer la lignee reliant Renzaburo a Jin Koshin.",
    crestImage: {
      src: placeholderGenealogy,
      alt: "Illustration du clan Koshin"
    },
    genealogyImage: {
      src: koshinCrest,
      alt: "Placeholder pour l'arbre genealogique Koshin"
    }
  },
  {
    id: "kuroiwa",
    name: "Clan Kuroiwa",
    status: "Restraint",
    description: "Dynastie d'inspecteurs de Shibuya, figures de la force brute du CCG.",
    vigilance: "Loyaux jusqu'au sacrifice, allergiques aux zones grises.",
    lore:
      "Nes pendant la restructuration suivant les premieres insurrections, les Kuroiwa representent le CCG des pionniers. Pour eux, la mission prime sur la gloire et la bureaucratie. Ils refusent les compromis et definissent la justice en termes clairs: une goule est une menace a abattre. Massifs, entraines depuis l'enfance, ils preferent leurs poings a la technologie, maniants meme leurs quinques comme des masses. Leur reputation quasi mythique vient d'exploits ou certains ont terrasse des goules de rang A a mains nues. Dans un CCG devenu technocratique, ils incarnent un vestige indispensable de courage brut. Lorsque les situations degenerent, c'est encore eux que l'on envoie en premiere ligne.",
    highlights: [
      "Devouement total a la mission du CCG, loin des intrigues politiques.",
      "Capacites physiques exceptionnelles et style de combat frontal.",
      "Quinques lourdes maniees comme des prolongements de leur corps."
    ],
    timeline: [
      { year: "Restructuration initiale", title: "Fondation du clan comme corps de choc de Shibuya." },
      { year: "Sommet des insurrections", title: "Exploits contres les goules de rang A a mains nues." },
      { year: "Epoque moderne", title: "Derniers remparts envoyes quand toutes les autres tactiques echouent." }
    ],
    crestNote: "Prevoir un symbole massif representant leurs poings armes.",
    genealogyNote: "Lister les generations d'inspecteurs tombes sur le terrain.",
    crestImage: {
      src: placeholderClanCrest,
      alt: "Illustration temporaire du clan Kuroiwa"
    },
    genealogyImage: {
      src: placeholderGenealogy,
      alt: "Placeholder pour l'arbre genealogique Kuroiwa"
    }
  }
]


const loreEntryOptions: {
  title: string
  description: string
  cta: string
  view: LoreView
  badge: string
}[] = [
  {
    title: "Lore de clan",
    description: "Visualisez les histoires propres a chaque clan, leurs figures et leurs serments.",
    cta: "Voir l'exemple",
    view: "clan",
    badge: "Disponible"
  },
  {
    title: "Lore global",
    description: "Revivez la chronologie officielle du serveur et le retour du Roi Souterrain.",
    cta: "Lire la chronologie",
    view: "global",
    badge: "Disponible"
  }
]

export default function LorePage() {
  const [activeView, setActiveView] = useState<LoreView | null>(null)
  const [selectedClan, setSelectedClan] = useState<string | null>(null)
  const [revealedImages, setRevealedImages] = useState({ crest: false, genealogy: false })
  const [modalImage, setModalImage] = useState<{ src: StaticImageData; alt: string } | null>(null)
  const viewLabels: Record<LoreView, string> = {
    clan: "Lore de clan",
    global: "Lore global"
  }
  const activeClanIndex = selectedClan ? clanLoreEntries.findIndex((clan) => clan.id === selectedClan) : -1
  const activeClan = activeClanIndex >= 0 ? clanLoreEntries[activeClanIndex] : null

  useEffect(() => {
    setRevealedImages({ crest: false, genealogy: false })
    setModalImage(null)
  }, [activeClanIndex])

  const selectRelativeClan = (direction: 1 | -1) => {
    if (!clanLoreEntries.length) {
      return
    }
    if (activeClanIndex === -1) {
      setSelectedClan(clanLoreEntries[direction === 1 ? 0 : clanLoreEntries.length - 1].id)
      return
    }
    const nextIndex = (activeClanIndex + direction + clanLoreEntries.length) % clanLoreEntries.length
    setSelectedClan(clanLoreEntries[nextIndex].id)
  }

  const handleImageReveal = (type: "crest" | "genealogy") => {
    const image = type === "crest" ? activeClan?.crestImage : activeClan?.genealogyImage
    if (!image) {
      return
    }
    if (!revealedImages[type]) {
      setRevealedImages((prev) => ({ ...prev, [type]: true }))
      return
    }
    setModalImage(image)
  }

  return (
    <motion.div
      className="min-h-screen bg-dark-950 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait" initial={false}>
          {activeView === null ? (
            <motion.section
              key="selector"
              className="text-center"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="text-sm uppercase tracking-[0.4em] text-primary-300">Lore du serveur</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Choisissez votre lecture</h2>
              <p className="mt-3 text-gray-400">
                Accedez soit au panorama global, soit aux destins particuliers des clans.
              </p>
              <motion.div
                className="mt-10 grid gap-6 md:grid-cols-2"
                variants={listParent}
                initial="hidden"
                animate="visible"
              >
                {loreEntryOptions.map((option, index) => (
                  <motion.button
                    key={option.title}
                    type="button"
                    onClick={() => setActiveView(option.view)}
                    className="group block text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
                    variants={listItem}
                    custom={index}
                    whileHover={{ y: -10, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={hoverSpring}
                  >
                    <Card className="h-full border-white/10 bg-dark-900/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary-400/40">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl text-white">{option.title}</CardTitle>
                          <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-gray-300">
                            {option.badge}
                          </span>
                        </div>
                        <CardDescription className="text-base leading-relaxed text-gray-300">
                          {option.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-primary-200">
                          <span>{option.cta}</span>
                          <span aria-hidden>{">"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.button>
                ))}
              </motion.div>
            </motion.section>
          ) : (
            <motion.div
              key={`view-${activeView}`}
              className="space-y-8"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-dark-900/60 px-4 py-3"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveView(null)
                    setSelectedClan(null)
                  }}
                  className="text-sm font-semibold text-primary-200 transition hover:text-primary-100"
                >
                  <p>Retour a la page principale</p>
                </button>
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                  Vous consultez : {viewLabels[activeView]}
                </p>
              </motion.div>
                      <AnimatePresence mode="wait">
                        {activeView === "clan" && (
                          <motion.section
                            id="clan-lore"
                            className="space-y-10"
                            key="clan-view"
                            variants={fadeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                          {!activeClan && (
                            <>
                              <motion.div className="grid gap-6 md:grid-cols-2" variants={listParent} initial="hidden" animate="visible">
                                {clanLoreEntries.map((clan, index) => (
                                  <motion.button
                                    key={clan.id}
                                    type="button"
                                    onClick={() => setSelectedClan(clan.id)}
                                    className="group text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
                                    variants={listItem}
                                    custom={index}
                                    whileHover={{ y: -6, scale: 1.005 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={hoverSpring}
                                  >
                                    <Card className="h-full border border-white/10 bg-dark-900/70 transition-colors hover:border-primary-400/40">
                                      <CardHeader className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <CardTitle className="text-2xl text-white">{clan.name}</CardTitle>
                                          <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-gray-300">
                                            {clan.status}
                                          </span>
                                        </div>
                                        <CardDescription className="text-base leading-relaxed text-gray-300">{clan.description}</CardDescription>
                                        <p className="text-sm text-primary-200">Vigilance : {clan.vigilance}</p>
                                      </CardHeader>
                                      <CardContent className="flex items-center gap-2 text-primary-200">
                                        <Users className="h-4 w-4" />
                                        <span>Lire ce clan</span>
                                      </CardContent>
                                    </Card>
                                  </motion.button>
                                ))}
                              </motion.div>
                              <motion.div variants={scaleVariants} initial="hidden" animate="visible" className="rounded-2xl border border-dashed border-white/10 bg-dark-900/60">
                                <CardContent className="py-10 text-center text-gray-400">Choisissez un clan pour afficher ses details.</CardContent>
                              </motion.div>
                            </>
                          )}

                          {activeClan && (
                            <motion.div key={activeClan.id} className="space-y-10" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
                              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-dark-900/60 px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedClan(null)}
                                  className="text-sm font-semibold text-primary-200 transition hover:text-primary-100"
                                >
                                  <p>Retour aux clans</p>
                                </button>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => selectRelativeClan(-1)}
                                    disabled={clanLoreEntries.length < 2}
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-primary-300"
                                    aria-label="Voir le clan precedent"
                                  >
                                    {"<"}
                                  </button>
                                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                    {activeClanIndex + 1}/{clanLoreEntries.length}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => selectRelativeClan(1)}
                                    disabled={clanLoreEntries.length < 2}
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-primary-300"
                                    aria-label="Voir le clan suivant"
                                  >
                                    {">"}
                                  </button>
                                </div>
                              </div>
                              <section className="grid gap-6 rounded-3xl border border-white/10 bg-dark-900/70 p-6 lg:grid-cols-2">
                                <div>
                                  <p className="text-sm uppercase tracking-[0.4em] text-primary-300">Clan selectionne</p>
                                  <h2 className="mt-2 text-3xl font-semibold text-white">{activeClan.name}</h2>
                                  <p className="mt-4 text-lg text-gray-300">{activeClan.lore}</p>
                                </div>
                                <div className="space-y-4">
                                  <div className="rounded-2xl border border-dashed border-white/15 bg-dark-950/60 p-6 text-center">
                                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Arbre genealogique</p>
                                    <div className="mt-4">
                                      {activeClan.crestImage ? (
                                        <motion.button
                                          type="button"
                                          onClick={() => handleImageReveal("crest")}
                                          className="group relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-dark-900/60 text-gray-500 transition hover:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
                                          aria-label="Afficher le logo en grand"
                                          whileHover={{ y: -4, scale: 1.01 }}
                                          whileTap={{ scale: 0.98 }}
                                          transition={hoverSpring}
                                        >
                                          <Image
                                            src={activeClan.crestImage.src}
                                            alt={activeClan.crestImage.alt}
                                            fill
                                            sizes="(min-width: 1024px) 360px, 100vw"
                                            className={`object-cover transition duration-500 ${revealedImages.crest ? "opacity-100 blur-0" : "opacity-30 blur-sm"}`}
                                            priority
                                          />
                                          {!revealedImages.crest ? (
                                            <span className="absolute inset-0 flex items-center justify-center bg-black/45 px-6 text-center text-sm font-semibold uppercase tracking-widest text-white">
                                              Spoiler : cliquer pour reveler
                                            </span>
                                          ) : (
                                            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                                              Voir en plein ecran
                                            </span>
                                          )}
                                        </motion.button>
                                      ) : (
                                        <div className="flex h-48 items-center justify-center rounded-xl border border-white/10 bg-dark-900/60 text-gray-500">
                                          {activeClan.crestNote ?? "Ajoutez une illustration de clan."}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-white/10 bg-dark-950/60 p-6">
                                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Points clefs</p>
                                    <ul className="mt-4 space-y-3 text-gray-200">
                                      {activeClan.highlights.map((highlight) => (
                                        <li key={highlight} className="flex gap-2">
                                          <span className="mt-1 h-2 w-2 rounded-full bg-primary-300" />
                                          <span>{highlight}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </section>

                              <section className="grid gap-6 lg:grid-cols-3">
                                <Card className="border-white/10 bg-dark-900/70 lg:col-span-2">
                                  <CardHeader>
                                    <CardTitle className="text-xl text-white">Moments determinants</CardTitle>
                                    <CardDescription className="text-gray-300">Balises pour retracer l&apos;influence du clan.</CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    {activeClan.timeline.map((step) => (
                                      <motion.div
                                        key={`${step.year}-${step.title}`}
                                        className="rounded-2xl border border-white/10 bg-dark-950/60 p-4"
                                        whileHover={{ scale: 1.01, x: 6 }}
                                        transition={hoverSpring}
                                      >
                                        <p className="text-sm font-semibold text-primary-200">{step.year}</p>
                                        <p className="text-lg text-white">{step.title}</p>
                                      </motion.div>
                                    ))}
                                  </CardContent>
                                </Card>

                                <Card className="border-dashed border-primary-400/30 bg-dark-900/70">
                                  <CardHeader>
                                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Arbre genealogique</p>
                                    <CardDescription className="text-gray-300">
                                      {activeClan.genealogyImage
                                        ? ""
                                        : activeClan.genealogyNote ?? "Ajoutez l&apos;arbre genealogique."}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    {activeClan.genealogyImage ? (
                                      <motion.button
                                        type="button"
                                        onClick={() => handleImageReveal("genealogy")}
                                        className="group w-full rounded-xl border border-white/10 bg-dark-950/60 text-left transition hover:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
                                        aria-label="Afficher l'arbre genealogique"
                                        whileHover={{ y: -4, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={hoverSpring}
                                      >
                                        <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl">
                                          <Image
                                            src={activeClan.genealogyImage.src}
                                            alt={activeClan.genealogyImage.alt}
                                            fill
                                            sizes="(min-width: 1024px) 420px, 100vw"
                                            className={`object-cover transition duration-500 ${revealedImages.genealogy ? "opacity-100 blur-0" : "opacity-30 blur-sm"}`}
                                          />
                                          {!revealedImages.genealogy ? (
                                            <span className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-6 text-center text-sm font-semibold uppercase tracking-widest text-white">
                                              Spoiler : cliquer pour reveler
                                            </span>
                                          ) : (
                                            <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                                              Voir en plein ecran
                                            </span>
                                          )}
                                        </div>
                                      </motion.button>
                                    ) : (
                                      <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-dark-950/60 text-center text-gray-400">
                                        Zone reservee pour importer ou dessiner l&apos;arbre.
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </section>
                            </motion.div>
                          )}
                          </motion.section>
                        )}
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        {activeView === "global" && (
                          <motion.div key="global-view" variants={fadeVariants} initial="hidden" animate="visible" exit="exit">
                            <section id="global-lore" className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-dark-900 via-dark-950 to-black p-8 md:p-12">
                              <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_55%)]" />
                              <div className="relative">
                                <p className="mb-4 text-sm uppercase tracking-[0.4em] text-primary-300">Lore officiel du serveur</p>
                                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">Lignes de sang, pactes oublies et renaissance du Roi Souterrain.</h1>
                                <p className="mt-6 max-w-3xl text-lg text-gray-300">
                                  Cette page rassemble l&apos;ensemble du lore pour etre lu comme un roman chronologique. Chaque chapitre garde l&apos;elegance du recit original
                                  tout en offrant des reperes visuels et temporels afin que rien ne rompe la fluidite de la lecture.
                                </p>
                              </div>
                            </section>

                            <motion.div className="mt-12 grid gap-6" variants={listParent} initial="hidden" animate="visible">
                              <motion.div variants={listItem}>
                                <Card className="border-white/5 bg-dark-900/70">
                                  <CardHeader>
                                    <CardTitle className="text-2xl text-white">Prologue - Le Japon n&apos;a pas toujours ete lumiere</CardTitle>
                                    <CardDescription className="text-base leading-relaxed text-gray-300">
                                      &quot;Le Japon n&apos;a pas toujours ete un empire de lumiere. Il fut un temps ou les Dieux se taisaient et ou les hommes affrontaient des
                                      creatures dont les noms ont ete effaces des chroniques.&quot;
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4 text-gray-300">
                                    <p>
                                      Le clan Washu se distingue des autres par un savoir interdit et une obsession pour la veritable nature humaine. Leur ascension
                                      rapide et brutale est enveloppee de rituels clandestins et de pactes avec des divinites que l&apos;on croyait disparues.
                                    </p>
                                    <p>
                                      Lorsque les seigneurs de guerre s&apos;epuisent, les Washu se tournent vers les forces qui se cachent sous les temples. Certains
                                      pretendent qu&apos;ils ont trouve un moyen de se nourrir autrement que les hommes, d&apos;autres assurent qu&apos;ils conversent avec des
                                      divinites mortes depuis longtemps.
                                    </p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </motion.div>

                            <section className="mt-16">
                              <div className="relative mt-12 pl-6 md:pl-16">
                                <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent md:block" />
                                <motion.div className="space-y-12" variants={listParent} initial="hidden" animate="visible">
                                  {loreChapters.map((chapter) => (
                                    <motion.article key={chapter.chapter} className="relative md:pl-16" variants={listItem}>
                                      <div className="absolute -left-1 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-dark-950/90 md:-left-5">
                                        <div className={`h-3 w-3 rounded-full ${chapter.accent.dot}`} />
                                      </div>
                                      <div className={`relative overflow-hidden rounded-3xl border ${chapter.accent.border} bg-dark-900/70 p-6`}>
                                        <div className={`pointer-events-none absolute inset-0 opacity-70 bg-gradient-to-br ${chapter.accent.glow}`} />
                                        <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
                                          <div className="md:w-1/3">
                                            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-gray-400">
                                              <chapter.icon className="h-5 w-5 text-white" />
                                              <span>{chapter.era}</span>
                                            </div>
                                            <h3 className="mt-3 text-2xl font-semibold text-white">{chapter.chapter}</h3>
                                            <p className="text-primary-200">{chapter.subtitle}</p>
                                            <p className="mt-4 leading-relaxed text-gray-300">{chapter.summary}</p>
                                          </div>
                                          <div className="space-y-4 md:w-2/3">
                                            {chapter.events.map((event) => (
                                              <motion.div
                                                key={`${chapter.chapter}-${event.year}-${event.title}`}
                                                className={`rounded-2xl border ${chapter.accent.eventBorder} ${chapter.accent.eventBg} p-4`}
                                                variants={scaleVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true, amount: 0.2 }}
                                              >
                                                <p className="text-sm font-semibold text-primary-200">{event.year}</p>
                                                <h4 className="text-xl text-white">{event.title}</h4>
                                                <p className="mt-2 leading-relaxed text-gray-200">{event.description}</p>
                                              </motion.div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.article>
                                  ))}
                                </motion.div>
                              </div>
                            </section>

                            <section className="mt-16">
                              <Card className="border-primary-500/40 bg-dark-900/80">
                                <CardHeader>
                                  <CardTitle className="text-2xl text-white">{presentDay.title}</CardTitle>
                                  <CardDescription className="text-base leading-relaxed text-gray-300">
                                    Suite aux expeditions du CCG et d&apos;allies clandestins, Shinjuku renait lentement. Mais sous la surface, chaque faction guette le
                                    retour du Roi Souterrain.
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="leading-relaxed text-gray-200">{presentDay.description}</p>
                                </CardContent>
                              </Card>
                            </section>
                          </motion.div>
                        )}
                      </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/80"
              aria-label="Fermer l'image en plein ecran"
              onClick={() => setModalImage(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/10 bg-dark-950/90 p-4 shadow-2xl"
              variants={scaleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalImage(null)}
                  className="rounded-full border border-white/20 px-4 py-1 text-sm font-semibold text-white transition hover:border-primary-300"
                >
                  Fermer
                </button>
              </div>
              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={modalImage.src}
                  alt={modalImage.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
