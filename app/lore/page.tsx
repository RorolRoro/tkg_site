"use client"

import Image, { type StaticImageData } from "next/image"
import { useState } from "react"

import placeholderClanCrest from "@/app/assets/placeholder1.jpg"
import placeholderGenealogy from "@/app/assets/placeholder2.jpg"
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

type LoreView = "clan" | "global"

type ClanLore = {
  id: string
  name: string
  status: "Disponible" | "Bientot"
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
    status: "Disponible",
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
    id: "placeholder",
    name: "Autres clans",
    status: "Bientot",
    description: "Selection en cours de conception. Ajoutez vos prochains clans ici.",
    vigilance: "Espace reserve.",
    lore: "",
    highlights: [],
    timeline: [],
    crestNote: "Ajoutez une illustration pour ce clan.",
    genealogyNote: "Prevoyez ici l'arbre genealogique du clan."
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
    badge: "Placeholder"
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
  const viewLabels: Record<LoreView, string> = {
    clan: "Lore de clan",
    global: "Lore global"
  }
  const activeClanIndex = selectedClan ? clanLoreEntries.findIndex((clan) => clan.id === selectedClan) : -1
  const activeClan = activeClanIndex >= 0 ? clanLoreEntries[activeClanIndex] : null

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

  return (
    <div className="min-h-screen bg-dark-950 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {!activeView && (
          <section className="text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-primary-300">Lore du serveur</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Choisissez votre lecture</h2>
            <p className="mt-3 text-gray-400">Accedez soit au panorama global, soit aux destins particuliers des clans.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {loreEntryOptions.map((option) => (
                <button
                  key={option.title}
                  type="button"
                  onClick={() => setActiveView(option.view)}
                  className="group block text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
                >
                  <Card className="h-full border-white/10 bg-dark-900/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary-400/40">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-white">{option.title}</CardTitle>
                        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-gray-300">
                          {option.badge}
                        </span>
                      </div>
                      <CardDescription className="text-base leading-relaxed text-gray-300">{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-primary-200">
                        <span>{option.cta}</span>
                        <span aria-hidden>→</span>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeView && (
          <div className="mb-8 mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-dark-900/60 px-4 py-3">
            <button
              type="button"
              onClick={() => {
                setActiveView(null)
                setSelectedClan(null)
              }}
              className="text-sm font-semibold text-primary-200 transition hover:text-primary-100"
            >
              ← Retour a la selection
            </button>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Vous consultez : {viewLabels[activeView]}</p>
          </div>
        )}

        {activeView === "clan" && (
          <section id="clan-lore" className="space-y-10">
            {!activeClan && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {clanLoreEntries.map((clan) => (
                    <button
                      key={clan.id}
                      type="button"
                      onClick={() => setSelectedClan(clan.id)}
                      className="group text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
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
                    </button>
                  ))}
                </div>
                <Card className="border-dashed border-white/10 bg-dark-900/60">
                  <CardContent className="py-10 text-center text-gray-400">Choisissez un clan pour afficher ses details.</CardContent>
                </Card>
              </>
            )}

            {activeClan && (
              <div className="space-y-10">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-dark-900/60 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelectedClan(null)}
                    className="text-sm font-semibold text-primary-200 transition hover:text-primary-100"
                  >
                    ← Retour aux clans
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectRelativeClan(-1)}
                      disabled={clanLoreEntries.length < 2}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-primary-300"
                      aria-label="Voir le clan precedent"
                    >
                      ←
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
                      →
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
                      <div className="mt-4 flex h-48 items-center justify-center rounded-xl border border-white/10 bg-dark-900/60 text-gray-500">
                        {activeClan.crestImage ? (
                          <div className="relative h-full w-full overflow-hidden rounded-xl">
                            <Image
                              src={activeClan.crestImage.src}
                              alt={activeClan.crestImage.alt}
                              fill
                              sizes="(min-width: 1024px) 360px, 100vw"
                              className="object-cover"
                              priority
                            />
                          </div>
                        ) : (
                          <span>{activeClan.crestNote ?? "Ajoutez une illustration de clan."}</span>
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
                      <CardDescription className="text-gray-300">Balises pour retracer l'influence du clan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activeClan.timeline.map((step) => (
                        <div key={`${step.year}-${step.title}`} className="rounded-2xl border border-white/10 bg-dark-950/60 p-4">
                          <p className="text-sm font-semibold text-primary-200">{step.year}</p>
                          <p className="text-lg text-white">{step.title}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-primary-400/30 bg-dark-900/70">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Logo du clan</CardTitle>
                      <CardDescription className="text-gray-300">
                        {activeClan.genealogyImage ? "" : activeClan.genealogyNote ?? "Ajoutez l'arbre genealogique."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative flex h-64 items-center justify-center rounded-xl border border-white/10 bg-dark-950/60 text-center text-gray-400 overflow-hidden">
                        {activeClan.genealogyImage ? (
                          <Image
                            src={activeClan.genealogyImage.src}
                            alt={activeClan.genealogyImage.alt}
                            fill
                            sizes="(min-width: 1024px) 420px, 100vw"
                            className="object-cover"
                          />
                        ) : (
                          <span>Zone reservee pour importer ou dessiner l'arbre.</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
            )}
          </section>
        )}

        {activeView === "global" && (
          <>
            <section id="global-lore" className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-dark-900 via-dark-950 to-black p-8 md:p-12">
              <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_55%)]" />
              <div className="relative">
                <p className="mb-4 text-sm uppercase tracking-[0.4em] text-primary-300">Lore officiel du serveur</p>
                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">Lignes de sang, pactes oublies et renaissance du Roi Souterrain.</h1>
                <p className="mt-6 max-w-3xl text-lg text-gray-300">
                  Cette page rassemble l'ensemble du lore pour etre lu comme un roman chronologique. Chaque chapitre garde l'elegance du recit original
                  tout en offrant des reperes visuels et temporels afin que rien ne rompe la fluidite de la lecture.
                </p>
              </div>
            </section>

            <div className="mt-12 grid gap-6">
              <Card className="border-white/5 bg-dark-900/70">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Prologue - Le Japon n'a pas toujours ete lumiere</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-gray-300">
                    "Le Japon n'a pas toujours ete un empire de lumiere. Il fut un temps ou les Dieux se taisaient et ou les hommes affrontaient des
                    creatures dont les noms ont ete effaces des chroniques."
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <p>
                    Le clan Washu se distingue des autres par un savoir interdit et une obsession pour la veritable nature humaine. Leur ascension
                    rapide et brutale est enveloppee de rituels clandestins et de pactes avec des divinites que l'on croyait disparues.
                  </p>
                  <p>
                    Lorsque les seigneurs de guerre s'epuisent, les Washu se tournent vers les forces qui se cachent sous les temples. Certains
                    pretendent qu'ils ont trouve un moyen de se nourrir autrement que les hommes, d'autres assurent qu'ils conversent avec des
                    divinites mortes depuis longtemps.
                  </p>
                </CardContent>
              </Card>
            </div>

            <section className="mt-16">
              <div className="relative mt-12 pl-6 md:pl-16">
                <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent md:block" />
                <div className="space-y-12">
                  {loreChapters.map((chapter, index) => (
                    <article key={chapter.chapter} className="relative md:pl-16">
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
                              <div
                                key={`${chapter.chapter}-${event.year}-${event.title}`}
                                className={`rounded-2xl border ${chapter.accent.eventBorder} ${chapter.accent.eventBg} p-4`}
                              >
                                <p className="text-sm font-semibold text-primary-200">{event.year}</p>
                                <h4 className="text-xl text-white">{event.title}</h4>
                                <p className="mt-2 leading-relaxed text-gray-200">{event.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {index !== loreChapters.length - 1 && (
                        <div className="absolute left-3 top-full hidden h-12 w-px bg-gradient-to-b from-white/10 to-transparent md:block" />
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-16">
              <Card className="border-primary-500/40 bg-dark-900/80">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{presentDay.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-gray-300">
                    Suite aux expeditions du CCG et d'allies clandestins, Shinjuku renait lentement. Mais sous la surface, chaque faction guette le
                    retour du Roi Souterrain.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-gray-200">{presentDay.description}</p>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
