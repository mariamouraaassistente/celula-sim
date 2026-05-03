import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import OpenSeadragon from 'openseadragon'
import {
  Atom,
  BookOpen,
  CheckCircle2,
  Focus,
  Microscope,
  Pause,
  Play,
  ScanSearch,
  Sparkles,
  SunMedium,
  Trees,
  Wind,
} from 'lucide-react'

import './index.css'

type CellType = 'animal' | 'plant'
type SlideKind = 'onion-fresh' | 'onion-stained' | 'cheek-fresh' | 'cheek-stained'

type Hotspot = {
  id: string
  label: string
  details: string
  summary: string
  x: number
  y: number
  radius: number
  color: string
  icon: string
}

type Scene = {
  id: string
  title: string
  subtitle: string
  type: CellType
  slide: SlideKind
  intro: string
  environment: string
  teachingPoint: string
  note: string
  accent: string
  gradient: string
  symbol: string
  hotpotHint: string
  hotspots: Hotspot[]
}

type Lesson = {
  title: string
  body: string
  icon: string
}

type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  hint: string
}

type MarkerPosition = {
  x: number
  y: number
  visible: boolean
}

const SLIDE_WIDTH = 4096
const SLIDE_HEIGHT = 3072

const scenes: Scene[] = [
  {
    id: 'onion-fresh',
    title: 'Lâmina de cebola fresca',
    subtitle: 'Célula vegetal em corte fino, sem muita coloração',
    type: 'plant',
    slide: 'onion-fresh',
    intro: 'A lâmina mostra várias células da epiderme da cebola, com paredes bem marcadas e um aspecto “de tijolinhos”.',
    environment: 'boa iluminação · água disponível · célula túrgida',
    teachingPoint: 'A cebola é ótima para começar porque mostra parede celular, vacúolo e núcleo com clareza didática.',
    note: 'Use esta cena para explicar o formato geométrico da célula vegetal.',
    accent: '#86efac',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.95), rgba(14,116,144,0.42) 45%, rgba(11,31,19,0.96))',
    symbol: '🧅',
    hotpotHint: 'Passe o dedo pela lâmina e toque nas estruturas mais nítidas da cebola.',
    hotspots: [
      {
        id: 'wall',
        label: 'Parede celular',
        details: 'A parede celular é rígida, sustenta a célula e dá aquele formato de “tijolo”.',
        summary: 'Protege, sustenta e define a forma da célula vegetal.',
        x: 0.37,
        y: 0.31,
        radius: 0.034,
        color: '#fbbf24',
        icon: '▢',
      },
      {
        id: 'vacuole',
        label: 'Vacúolo',
        details: 'O vacúolo ocupa grande espaço interno e ajuda a manter a turgescência da planta.',
        summary: 'Armazena água e ajuda a manter a célula firme.',
        x: 0.53,
        y: 0.52,
        radius: 0.042,
        color: '#60a5fa',
        icon: '◌',
      },
      {
        id: 'nucleus',
        label: 'Núcleo',
        details: 'O núcleo guarda o DNA e coordena o funcionamento celular.',
        summary: 'Centro de comando da célula.',
        x: 0.62,
        y: 0.43,
        radius: 0.029,
        color: '#e9d5ff',
        icon: '◎',
      },
      {
        id: 'membrane',
        label: 'Membrana plasmática',
        details: 'A membrana fica logo abaixo da parede celular e controla a entrada e saída de substâncias.',
        summary: 'Barreira seletiva da célula.',
        x: 0.43,
        y: 0.58,
        radius: 0.028,
        color: '#67e8f9',
        icon: '⋯',
      },
    ],
  },
  {
    id: 'onion-stained',
    title: 'Cebola corada no microscópio',
    subtitle: 'A coloração deixa núcleo e paredes ainda mais fáceis de enxergar',
    type: 'plant',
    slide: 'onion-stained',
    intro: 'Aqui a lâmina está corada. O contraste aumenta e fica mais fácil perceber o núcleo e o contorno das células.',
    environment: 'coloração morna · contraste alto · estrutura bem visível',
    teachingPoint: 'Colorantes ajudam a destacar estruturas internas que seriam difíceis de notar na lâmina sem cor.',
    note: 'Perfeita para comparar com a cebola fresca e discutir preparo de lâmina.',
    accent: '#c4b5fd',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(14,165,233,0.36) 46%, rgba(28,12,53,0.96))',
    symbol: '🧪',
    hotpotHint: 'Com a coração, o núcleo ganha destaque — e a parede fica muito mais nítida.',
    hotspots: [
      {
        id: 'wall',
        label: 'Parede celular corada',
        details: 'A parede celular permanece rígida e aparece muito bem com a coloração.',
        summary: 'Mantém a forma da célula vegetal.',
        x: 0.34,
        y: 0.34,
        radius: 0.032,
        color: '#fda4af',
        icon: '▣',
      },
      {
        id: 'nucleus',
        label: 'Núcleo corado',
        details: 'Em lâminas coradas, o núcleo costuma ficar mais evidente para estudo.',
        summary: 'Organela ligada ao controle e ao DNA.',
        x: 0.58,
        y: 0.48,
        radius: 0.03,
        color: '#d8b4fe',
        icon: '◎',
      },
      {
        id: 'cytoplasm',
        label: 'Citoplasma',
        details: 'É a região “gelatinosa” onde as organelas ficam suspensas.',
        summary: 'Meio interno da célula.',
        x: 0.47,
        y: 0.58,
        radius: 0.024,
        color: '#93c5fd',
        icon: '◍',
      },
      {
        id: 'vacuole',
        label: 'Vacúolo central',
        details: 'O vacúolo ocupa boa parte do interior e ajuda na pressão interna da célula.',
        summary: 'Reserva de água e sais.',
        x: 0.52,
        y: 0.52,
        radius: 0.042,
        color: '#38bdf8',
        icon: '◌',
      },
    ],
  },
  {
    id: 'cheek-fresh',
    title: 'Epitélio bucal fresco',
    subtitle: 'Células animais com contorno flexível e núcleo visível',
    type: 'animal',
    slide: 'cheek-fresh',
    intro: 'Nesta lâmina de célula animal, as bordas são menos rígidas e a forma fica mais arredondada e irregular.',
    environment: 'saliva · baixa coloração · membrana flexível',
    teachingPoint: 'A célula animal não tem parede celular nem cloroplastos, então o contorno é mais flexível.',
    note: 'Boa para mostrar as diferenças mais rápidas entre animal e vegetal.',
    accent: '#f9a8d4',
    gradient: 'linear-gradient(135deg, rgba(244,114,182,0.95), rgba(251,146,60,0.34) 46%, rgba(52,16,34,0.96))',
    symbol: '🧫',
    hotpotHint: 'Toque nas células mais arredondadas e compare com a lâmina da cebola.',
    hotspots: [
      {
        id: 'membrane',
        label: 'Membrana plasmática',
        details: 'Na célula animal, a membrana é o principal limite externo — não existe parede celular rígida.',
        summary: 'Barreira flexível da célula animal.',
        x: 0.39,
        y: 0.34,
        radius: 0.028,
        color: '#67e8f9',
        icon: '⋯',
      },
      {
        id: 'nucleus',
        label: 'Núcleo',
        details: 'O núcleo costuma aparecer como uma região mais escura no interior.',
        summary: 'Onde fica o DNA da célula.',
        x: 0.57,
        y: 0.53,
        radius: 0.031,
        color: '#ddd6fe',
        icon: '◎',
      },
      {
        id: 'cytoplasm',
        label: 'Citoplasma',
        details: 'O citoplasma preenche o interior e ajuda no transporte de substâncias.',
        summary: 'Região interna que abriga organelas.',
        x: 0.49,
        y: 0.62,
        radius: 0.025,
        color: '#fcd34d',
        icon: '◍',
      },
      {
        id: 'junction',
        label: 'Contato entre células',
        details: 'As células animais podem ficar bem próximas, mas sem a parede rígida das plantas.',
        summary: 'Conexão e organização do tecido.',
        x: 0.65,
        y: 0.34,
        radius: 0.03,
        color: '#fda4af',
        icon: '⬢',
      },
    ],
  },
  {
    id: 'cheek-stained',
    title: 'Epitélio bucal corado',
    subtitle: 'A coloração ajuda a ver núcleos, membranas e o arranjo do tecido',
    type: 'animal',
    slide: 'cheek-stained',
    intro: 'Com a coloração, o núcleo fica muito mais evidente e a lâmina ganha contraste para estudo básico.',
    environment: 'coloração azulada · maior contraste · observação didática',
    teachingPoint: 'As lâminas coradas ajudam o aluno a reconhecer núcleo, membrana e formato das células animais.',
    note: 'Ótima para fazer a comparação final com a lâmina de cebola.',
    accent: '#fca5a5',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(168,85,247,0.30) 46%, rgba(44,14,18,0.96))',
    symbol: '🩵',
    hotpotHint: 'Nesta versão, o núcleo surge com contraste maior — excelente para revisão rápida.',
    hotspots: [
      {
        id: 'membrane',
        label: 'Membrana plasmática',
        details: 'A membrana continua sendo a fronteira seletiva da célula animal.',
        summary: 'Controle de entrada e saída.',
        x: 0.42,
        y: 0.36,
        radius: 0.028,
        color: '#7dd3fc',
        icon: '⋯',
      },
      {
        id: 'nucleus',
        label: 'Núcleo corado',
        details: 'A coloração destaca o núcleo como área mais escura e fácil de reconhecer.',
        summary: 'Guarda o DNA e coordena as atividades.',
        x: 0.60,
        y: 0.52,
        radius: 0.032,
        color: '#e9d5ff',
        icon: '◎',
      },
      {
        id: 'cytoplasm',
        label: 'Citoplasma',
        details: 'O citoplasma dá sustentação interna e preenche a célula.',
        summary: 'Ambiente interno celular.',
        x: 0.50,
        y: 0.60,
        radius: 0.024,
        color: '#fda4af',
        icon: '◍',
      },
      {
        id: 'cluster',
        label: 'Tecido em conjunto',
        details: 'No tecido bucal, várias células aparecem agrupadas e sobrepostas.',
        summary: 'Organização do tecido epitelial.',
        x: 0.69,
        y: 0.38,
        radius: 0.03,
        color: '#fb7185',
        icon: '⬢',
      },
    ],
  },
]

const lessons: Lesson[] = [
  {
    title: '1. Posicione a lâmina',
    body: 'No microscópio real, o primeiro passo é centralizar a lâmina e procurar a área mais fina e bem corada.',
    icon: '🧊',
  },
  {
    title: '2. Ajuste a ampliação',
    body: 'A ampliação controla quanto da amostra você vê. Comece baixo, depois aumente com calma.',
    icon: '🔍',
  },
  {
    title: '3. Faça o foco fino',
    body: 'O foco muda a nitidez. Quando a imagem “encosta” no ponto certo, a parede celular e o núcleo ficam claros.',
    icon: '🎯',
  },
  {
    title: '4. Compare os tipos de célula',
    body: 'Vegetais têm parede celular e vacúolo grande. Animais têm membrana flexível e formato mais irregular.',
    icon: '🌿',
  },
]

const quiz: QuizQuestion[] = [
  {
    question: 'Qual estrutura é típica da célula vegetal e não aparece na célula animal?',
    options: ['Membrana plasmática', 'Parede celular', 'Núcleo', 'Citoplasma'],
    correctIndex: 1,
    hint: 'Pense na estrutura rígida da cebola.',
  },
  {
    question: 'Qual ajuste do microscópio serve para deixar a imagem mais nítida?',
    options: ['Foco', 'Zoom', 'Luz', 'Amostra'],
    correctIndex: 0,
    hint: 'É o controle que “afina” a imagem.',
  },
  {
    question: 'Na lâmina de cebola, o que costuma se destacar quando a coloração melhora o contraste?',
    options: ['Parede celular e núcleo', 'Cloroplasto e mitocôndria', 'Cílios e flagelos', 'Parede e ribossomo'],
    correctIndex: 0,
    hint: 'A parede da célula e a região do núcleo aparecem bem na cebola.',
  },
]

function App() {
  const [sceneId, setSceneId] = useState(scenes[0].id)
  const [selectedHotspotId, setSelectedHotspotId] = useState(scenes[0].hotspots[0].id)
  const [running, setRunning] = useState(true)
  const [zoom, setZoom] = useState(1.6)
  const [focus, setFocus] = useState(0.9)
  const [light, setLight] = useState(0.84)
  const [tick, setTick] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | undefined>>({})
  const [answered, setAnswered] = useState<Record<number, boolean>>({})
  const [markerPositions, setMarkerPositions] = useState<Record<string, MarkerPosition>>({})
  const [homeZoom, setHomeZoom] = useState(1)
  const viewerHostRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null)
  const markerFrameRef = useRef<number | null>(null)
  const scene = useMemo(() => scenes.find((item) => item.id === sceneId) ?? scenes[0], [sceneId])
  const selectedHotspot = useMemo(
    () => scene.hotspots.find((item) => item.id === selectedHotspotId) ?? scene.hotspots[0],
    [scene, selectedHotspotId],
  )
  const slideUrl = useSlideImageUrl(scene)
  const score = useMemo(
    () =>
      Object.entries(quizAnswers).reduce((acc, [index, answer]) => {
        if (answer === undefined) return acc
        return acc + (answer === quiz[Number(index)].correctIndex ? 1 : 0)
      }, 0),
    [quizAnswers],
  )

  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(() => {
      setTick((value) => value + 1)
    }, 40)
    return () => window.clearInterval(interval)
  }, [running])

  useEffect(() => {
    const host = viewerHostRef.current
    if (!host || viewerRef.current) return

    const viewer = OpenSeadragon({
      element: host,
      showNavigationControl: false,
      showNavigator: false,
      showRotationControl: false,
      showFullPageControl: false,
      maxZoomPixelRatio: 8,
      visibilityRatio: 0.82,
      constrainDuringPan: true,
      animationTime: 0.55,
      blendTime: 0.08,
      preserveViewport: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: false,
        scrollToZoom: true,
        pinchToZoom: true,
        dragToPan: true,
      },
      gestureSettingsTouch: {
        clickToZoom: false,
        dblClickToZoom: false,
        scrollToZoom: false,
        pinchToZoom: true,
        dragToPan: true,
      },
    })

    viewerRef.current = viewer

    const refreshMarkers = () => {
      const instance = viewerRef.current
      if (!instance) return

      const next: Record<string, MarkerPosition> = {}
      const container = instance.container as HTMLElement
      const width = container.clientWidth
      const height = container.clientHeight

      for (const hotspot of scene.hotspots) {
        const imagePoint = new OpenSeadragon.Point(hotspot.x * SLIDE_WIDTH, hotspot.y * SLIDE_HEIGHT)
        const viewerPoint = instance.viewport.imageToViewerElementCoordinates(imagePoint)
        const x = viewerPoint.x
        const y = viewerPoint.y
        next[hotspot.id] = {
          x,
          y,
          visible: x > -40 && y > -40 && x < width + 40 && y < height + 40,
        }
      }

      setMarkerPositions(next)
    }

    const scheduleRefresh = () => {
      if (markerFrameRef.current !== null) return
      markerFrameRef.current = window.requestAnimationFrame(() => {
        markerFrameRef.current = null
        refreshMarkers()
      })
    }

    const handleOpen = () => {
      const instance = viewerRef.current
      if (!instance) return
      const nextHome = instance.viewport.getHomeZoom() || 1
      setHomeZoom(nextHome)
      instance.viewport.goHome(true)
      instance.viewport.zoomTo(nextHome * zoom, undefined, true)
      refreshMarkers()
    }

    viewer.addHandler('open', handleOpen)
    viewer.addHandler('animation', scheduleRefresh)
    viewer.addHandler('animation-finish', scheduleRefresh)
    viewer.addHandler('resize', scheduleRefresh)

    return () => {
      if (markerFrameRef.current !== null) {
        window.cancelAnimationFrame(markerFrameRef.current)
        markerFrameRef.current = null
      }
      viewer.destroy()
      viewerRef.current = null
    }
  }, [scene.hotspots, zoom])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !homeZoom) return
    viewer.viewport.zoomTo(homeZoom * zoom, viewer.viewport.getCenter(), true)
  }, [homeZoom, zoom])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !slideUrl) return
    viewer.open({ type: 'image', url: slideUrl } as unknown as Parameters<typeof viewer.open>[0])
  }, [slideUrl])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    const blur = Math.max(0, (1 - focus) * 8)
    const sat = 0.72 + light * 0.6
    const bright = 0.58 + light * 0.55
    const container = viewer.container as HTMLElement
    container.style.filter = `blur(${blur}px) saturate(${sat}) brightness(${bright})`
  }, [focus, light])

  const selectScene = (nextSceneId: string) => {
    const nextScene = scenes.find((item) => item.id === nextSceneId)
    setSceneId(nextSceneId)
    setSelectedHotspotId(nextScene?.hotspots[0].id ?? nextSceneId)
    setMarkerPositions({})
  }

  const focusHotspot = (hotspotId: string) => {
    const viewer = viewerRef.current
    const hotspot = scene.hotspots.find((item) => item.id === hotspotId)
    setSelectedHotspotId(hotspotId)
    if (!viewer || !hotspot) return

    const imagePoint = new OpenSeadragon.Point(hotspot.x * SLIDE_WIDTH, hotspot.y * SLIDE_HEIGHT)
    const viewportPoint = viewer.viewport.imageToViewportCoordinates(imagePoint)
    viewer.viewport.panTo(viewportPoint, true)
    viewer.viewport.zoomTo(homeZoom * zoom * 1.06, viewportPoint, true)
  }

  const setAnswer = (index: number, answer: number) => {
    setQuizAnswers((current) => ({ ...current, [index]: answer }))
    setAnswered((current) => ({ ...current, [index]: true }))
  }

  const sweep = running ? (tick % 160) / 160 : 0.2

  return (
    <div className="min-h-screen text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                <Microscope size={14} /> Microscópio virtual realista
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Veja a lâmina como num microscópio de verdade.
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  Arraste a lâmina, dê zoom, ajuste o foco e toque nas estruturas. A cena da cebola foi pensada para
                  ficar com cara de lâmina escaneada, como nos arquivos de *whole slide imaging*.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[430px]">
              <StatPill icon={<Trees size={16} />} label="Vegetais" value="2" />
              <StatPill icon={<Atom size={16} />} label="Animais" value="2" />
              <StatPill icon={<ScanSearch size={16} />} label="Zoom real" value="OSD" />
              <StatPill icon={<Sparkles size={16} />} label="Toque" value="Hotspots" />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.95fr]">
          <section className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-[30px] border border-white/10 bg-slate-950/72 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Microscópio</p>
                  <h2 className="font-display text-2xl font-semibold text-white">{scene.title}</h2>
                  <p className="mt-1 text-sm text-slate-300">{scene.intro}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="soft-btn" onClick={() => setRunning((value) => !value)} type="button">
                    {running ? <Pause size={16} /> : <Play size={16} />} {running ? 'Pausar' : 'Rodar'}
                  </button>
                  <button className="soft-btn" onClick={() => setFocus((value) => Math.min(1, value + 0.08))} type="button">
                    <Focus size={16} /> Foco fino
                  </button>
                  <button className="soft-btn" onClick={() => setLight((value) => Math.min(1, value + 0.08))} type="button">
                    <SunMedium size={16} /> Luz
                  </button>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="microscope-shell">
                    <div className="microscope-rim" />
                    <div className="microscope-eyepiece">
                      <div className="microscope-stage">
                        <div className="microscope-glow" />
                        <div
                          className="microscope-view-wrap"
                          style={{
                            transform: `scale(${1 + (zoom - 1) * 0.08})`,
                            transition: 'transform 220ms ease',
                          }}
                        >
                          <div className="microscope-sweep" style={{ transform: `translateY(${(sweep * 130) - 15}%) rotate(-10deg)` }} />
                          <div className="microscope-vignette" />
                          <div className="microscope-grain" />
                          <div ref={viewerHostRef} className="microscope-viewer" />
                          <div className="microscope-overlay">
                            {scene.hotspots.map((hotspot) => {
                              const position = markerPositions[hotspot.id]
                              if (!position || !position.visible) return null
                              const selected = hotspot.id === selectedHotspotId
                              return (
                                <button
                                  key={hotspot.id}
                                  type="button"
                                  className={`hotspot ${selected ? 'hotspot-active' : ''}`}
                                  style={{
                                    left: `${position.x}px`,
                                    top: `${position.y}px`,
                                    width: `${Math.max(34, hotspot.radius * 4100)}px`,
                                    height: `${Math.max(34, hotspot.radius * 4100)}px`,
                                    borderColor: hotspot.color,
                                    boxShadow: selected
                                      ? `0 0 0 8px rgba(255,255,255,0.08), 0 0 30px ${hotspot.color}66`
                                      : `0 0 0 0 transparent`,
                                  }}
                                  onClick={() => focusHotspot(hotspot.id)}
                                  aria-label={hotspot.label}
                                >
                                  <span>{hotspot.icon}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <RangeControl
                      label="Ampliação"
                      value={zoom}
                      min={0.9}
                      max={3.2}
                      step={0.01}
                      icon={<ScanSearch size={14} />}
                      onChange={setZoom}
                    />
                    <RangeControl
                      label="Foco"
                      value={focus}
                      min={0.1}
                      max={1}
                      step={0.01}
                      icon={<Focus size={14} />}
                      onChange={setFocus}
                    />
                    <RangeControl
                      label="Luz"
                      value={light}
                      min={0.2}
                      max={1}
                      step={0.01}
                      icon={<SunMedium size={14} />}
                      onChange={setLight}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Cena atual</p>
                        <h3 className="mt-1 font-display text-lg font-semibold text-white">{scene.subtitle}</h3>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-2 text-2xl">{scene.symbol}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{scene.teachingPoint}</p>
                    <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-3 text-sm text-cyan-50">
                      <strong className="block text-base text-white">{selectedHotspot.label}</strong>
                      <span className="mt-1 block text-cyan-50/85">{selectedHotspot.details}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{scene.note}</p>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Dica de observação</p>
                        <h3 className="font-display text-lg font-semibold text-white">Como usar a lâmina</h3>
                      </div>
                      <div className="rounded-2xl bg-emerald-400/15 p-2 text-emerald-200">
                        <Wind size={18} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Comece com pouca ampliação, ajuste o foco até a parede celular aparecer nítida e depois aumente
                      aos poucos. Em lâminas de cebola, o contraste é o segredo.
                    </p>
                    <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/55 p-3 text-sm text-slate-200">
                      {scene.environment}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ScenePicker current={sceneId} onPick={selectScene} />
              <HotspotCard scene={scene} hotspot={selectedHotspot} onFocus={focusHotspot} />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Roteiro da aula</p>
                  <h3 className="font-display text-xl font-semibold text-white">Passo a passo</h3>
                </div>
                <div className="rounded-2xl bg-emerald-400/15 p-2 text-emerald-200">
                  <BookOpen size={18} />
                </div>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <motion.article
                    key={lesson.title}
                    className="lesson-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-slate-900/80 p-2 text-lg">{lesson.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white">{lesson.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{lesson.body}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5 shadow-2xl shadow-fuchsia-950/10 backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Quiz rápido</p>
                  <h3 className="font-display text-xl font-semibold text-white">Teste de aprendizagem</h3>
                </div>
                <div className="rounded-2xl bg-fuchsia-400/15 p-2 text-fuchsia-200">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <div className="space-y-4">
                {quiz.map((item, index) => {
                  const answer = quizAnswers[index]
                  const correct = answer === item.correctIndex
                  const isAnswered = answered[index]
                  return (
                    <div key={item.question} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">{item.question}</p>
                      <div className="mt-3 grid gap-2">
                        {item.options.map((option, optionIndex) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAnswer(index, optionIndex)}
                            className={`quiz-btn ${answer === optionIndex ? 'quiz-btn-selected' : ''}`}
                          >
                            <span>{String.fromCharCode(65 + optionIndex)}.</span>
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400">
                        <span>{isAnswered ? (correct ? 'Acertou!' : 'Veja a dica e tente outra') : item.hint}</span>
                        {isAnswered && (
                          <span className={correct ? 'text-emerald-300' : 'text-amber-300'}>
                            {correct ? '✓ correto' : '✕ não foi desta vez'}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 rounded-[22px] border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm text-emerald-50">
                <strong className="block text-base">Pontuação atual: {score}/{quiz.length}</strong>
                <span className="mt-1 block text-emerald-100/90">
                  Dica: compare a lâmina de cebola com a de epitélio bucal. A parede celular faz toda a diferença.
                </span>
              </div>
            </div>
          </aside>
        </section>

        <footer className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4 text-xs leading-6 text-slate-400 backdrop-blur">
          Feito para celular e lousa digital. Se você estava pensando naquele arquivo de lâmina escaneada, os nomes
          mais comuns são <span className="text-slate-200">.mrxs</span>, <span className="text-slate-200">.svs</span>,
          <span className="text-slate-200"> .ndpi</span> ou outros formatos de *whole slide imaging*.
        </footer>
      </main>
    </div>
  )
}

function buildSlideSvg(scene: Scene) {
  switch (scene.slide) {
    case 'onion-fresh':
      return buildOnionSlide({ stained: false, label: scene.title })
    case 'onion-stained':
      return buildOnionSlide({ stained: true, label: scene.title })
    case 'cheek-fresh':
      return buildCheekSlide({ stained: false, label: scene.title })
    case 'cheek-stained':
      return buildCheekSlide({ stained: true, label: scene.title })
    default:
      return buildOnionSlide({ stained: false, label: scene.title })
  }
}

function buildOnionSlide({ stained, label }: { stained: boolean; label: string }) {
  const rows = 10
  const cols = 12
  const cellW = 320
  const cellH = 250
  const startX = 110
  const startY = 100
  const bgA = stained ? '#35114f' : '#f7efff'
  const bgB = stained ? '#8b5cf6' : '#f3d7ff'
  const bgC = stained ? '#13071f' : '#ead7ff'
  const walls = stained ? 'rgba(245, 245, 255, 0.88)' : 'rgba(35, 24, 52, 0.82)'
  const inner = stained ? 'rgba(168, 85, 247, 0.22)' : 'rgba(233, 213, 255, 0.2)'
  const nucleus = stained ? 'rgba(20, 184, 166, 0.92)' : 'rgba(129, 140, 248, 0.92)'
  const cells: string[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const n = row * cols + col + 1
      const jitterX = (seeded(n) - 0.5) * 18
      const jitterY = (seeded(n + 13) - 0.5) * 12
      const x = startX + col * cellW + (row % 2 === 0 ? 0 : 20) + jitterX
      const y = startY + row * cellH + jitterY
      const w = cellW - 14 + (seeded(n + 5) - 0.5) * 18
      const h = cellH - 14 + (seeded(n + 9) - 0.5) * 16
      const rx = 10 + seeded(n + 17) * 10
      const showNucleus = stained || n % 3 !== 0
      const nucleusX = w * (0.58 - seeded(n + 21) * 0.08)
      const nucleusY = h * (0.45 + seeded(n + 29) * 0.1)
      const nucleusR = 10 + seeded(n + 31) * 12
      cells.push(`
        <g transform="translate(${x} ${y}) rotate(${(seeded(n + 35) - 0.5) * 2})">
          <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="${stained ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255, 255, 255, 0.58)'}" stroke="${walls}" stroke-width="6"/>
          <rect x="6" y="6" width="${Math.max(1, w - 12)}" height="${Math.max(1, h - 12)}" rx="${Math.max(8, rx - 2)}" fill="${inner}" opacity="0.86"/>
          <ellipse cx="${w * 0.5}" cy="${h * 0.54}" rx="${w * 0.28}" ry="${h * 0.24}" fill="${stained ? 'rgba(125, 211, 252, 0.12)' : 'rgba(255, 255, 255, 0.22)'}"/>
          ${showNucleus ? `<circle cx="${nucleusX}" cy="${nucleusY}" r="${nucleusR}" fill="${nucleus}" opacity="0.96"/>` : ''}
          <circle cx="${w * 0.62}" cy="${h * 0.42}" r="${Math.max(3, nucleusR * 0.2)}" fill="rgba(255,255,255,0.46)" opacity="0.58"/>
        </g>
      `)
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SLIDE_WIDTH} ${SLIDE_HEIGHT}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bgA}"/>
          <stop offset="55%" stop-color="${bgB}"/>
          <stop offset="100%" stop-color="${bgC}"/>
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="46%" r="64%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
          <stop offset="55%" stop-color="rgba(17,24,39,0.04)"/>
          <stop offset="100%" stop-color="rgba(2,6,23,0.7)"/>
        </radialGradient>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0.18"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.1"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="0.16"/>
      ${cells.join('\n')}
      <rect width="100%" height="100%" fill="url(#vignette)"/>
      <text x="160" y="2740" fill="rgba(255,255,255,0.58)" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="700">${escapeXml(label)}</text>
      <text x="160" y="2838" fill="rgba(255,255,255,0.40)" font-family="Inter, Arial, sans-serif" font-size="38">epiderme de cebola • visão microscópica virtual</text>
    </svg>
  `
}

function buildCheekSlide({ stained, label }: { stained: boolean; label: string }) {
  const rows = 9
  const cols = 11
  const cellW = 360
  const cellH = 268
  const startX = 160
  const startY = 130
  const cells: string[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const n = row * cols + col + 1
      const s = seeded(n + 200)
      const x = startX + col * (cellW - 28) + (row % 2 === 0 ? 0 : 54) + Math.sin(n * 0.5) * 8
      const y = startY + row * (cellH - 18) + Math.cos(n * 0.6) * 12
      const rx = 86 + s * 40
      const ry = 64 + seeded(n + 9) * 24
      const w = cellW - 18 + seeded(n + 12) * 38
      const h = cellH - 12 + seeded(n + 17) * 34
      const nucleusX = w * (0.52 + seeded(n + 31) * 0.1)
      const nucleusY = h * (0.44 + seeded(n + 41) * 0.08)
      const nucleusR = 20 + seeded(n + 37) * 18
      cells.push(`
        <g transform="translate(${x} ${y}) rotate(${(seeded(n + 53) - 0.5) * 8})">
          <ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${rx}" ry="${ry}" fill="${stained ? 'rgba(244, 114, 182, 0.22)' : 'rgba(251, 207, 232, 0.16)'}" stroke="rgba(255,255,255,0.22)" stroke-width="2.4"/>
          <ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${rx - 10}" ry="${ry - 7}" fill="${stained ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.06)'}"/>
          <circle cx="${nucleusX}" cy="${nucleusY}" r="${nucleusR}" fill="${stained ? 'rgba(37, 99, 235, 0.7)' : 'rgba(76, 29, 149, 0.56)'}"/>
          <circle cx="${nucleusX + 5}" cy="${nucleusY - 4}" r="${Math.max(4, nucleusR * 0.25)}" fill="rgba(255,255,255,0.42)" opacity="0.55"/>
        </g>
      `)
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SLIDE_WIDTH} ${SLIDE_HEIGHT}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${stained ? '#fee2e2' : '#fff1f2'}"/>
          <stop offset="55%" stop-color="${stained ? '#fda4af' : '#fecdd3'}"/>
          <stop offset="100%" stop-color="${stained ? '#7f1d1d' : '#9d174d'}"/>
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="48%" r="66%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
          <stop offset="70%" stop-color="rgba(17,24,39,0.12)"/>
          <stop offset="100%" stop-color="rgba(2,6,23,0.74)"/>
        </radialGradient>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0.22"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.12"/>
          </feComponentTransfer>
        </filter>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="0.28"/>
      <ellipse cx="2070" cy="1540" rx="1520" ry="1120" fill="${stained ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'}" filter="url(#softBlur)" opacity="0.62"/>
      ${cells.join('\n')}
      <rect width="100%" height="100%" fill="url(#vignette)"/>
      <text x="160" y="2740" fill="rgba(255,255,255,0.58)" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="700">${escapeXml(label)}</text>
      <text x="160" y="2838" fill="rgba(255,255,255,0.40)" font-family="Inter, Arial, sans-serif" font-size="38">epitélio bucal • visão microscópica virtual</text>
    </svg>
  `
}

function useSlideImageUrl(scene: Scene) {
  const slideSvg = useMemo(() => buildSlideSvg(scene), [scene])
  const [url, setUrl] = useState('')

  useEffect(() => {
    let cancelled = false
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(slideSvg)}`
    const image = new Image()

    image.onload = () => {
      if (cancelled) return
      const canvas = document.createElement('canvas')
      canvas.width = SLIDE_WIDTH
      canvas.height = SLIDE_HEIGHT
      const context = canvas.getContext('2d')
      if (!context) {
        setUrl(svgUrl)
        return
      }
      context.drawImage(image, 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
      setUrl(canvas.toDataURL('image/png'))
    }

    image.onerror = () => {
      if (!cancelled) setUrl(svgUrl)
    }

    image.src = svgUrl

    return () => {
      cancelled = true
    }
  }, [slideSvg])

  return url
}

function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function ScenePicker({ current, onPick }: { current: string; onPick: (sceneId: string) => void }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/72 p-4 shadow-xl shadow-cyan-950/10 backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Cenas</p>
          <h3 className="font-display text-lg font-semibold text-white">Escolha a lâmina</h3>
        </div>
        <div className="rounded-2xl bg-cyan-400/15 p-2 text-cyan-200">
          <Wind size={18} />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {scenes.map((scene) => {
          const active = scene.id === current
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onPick(scene.id)}
              className={`scene-card ${active ? 'scene-card-active' : ''}`}
              style={{ background: scene.gradient }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/75">{scene.type === 'plant' ? 'Vegetal' : 'Animal'}</p>
                  <h4 className="mt-1 font-semibold text-white">{scene.title}</h4>
                </div>
                <div className="rounded-2xl bg-white/15 p-2 text-lg shadow-md shadow-black/20">{scene.symbol}</div>
              </div>
              <p className="mt-3 text-left text-sm leading-5 text-white/85">{scene.subtitle}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function HotspotCard({ scene, hotspot, onFocus }: { scene: Scene; hotspot: Hotspot; onFocus: (id: string) => void }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/72 p-4 shadow-xl shadow-fuchsia-950/10 backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Detalhe da lâmina</p>
          <h3 className="font-display text-lg font-semibold text-white">{hotspot.label}</h3>
        </div>
        <div className="rounded-2xl bg-fuchsia-400/15 p-2 text-fuchsia-200">
          <Sparkles size={18} />
        </div>
      </div>
      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ borderColor: hotspot.color, background: `${hotspot.color}22` }}>
            <span className="text-xl">{hotspot.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{scene.type === 'plant' ? 'Célula vegetal' : 'Célula animal'}</p>
            <p className="text-xs text-slate-400">Toque nos pontos de luz para trocar a estrutura</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{hotspot.details}</p>
        <div className="mt-4 rounded-2xl bg-slate-900/70 p-3 text-sm text-slate-200">
          <strong className="block text-white">Resumo rápido</strong>
          <span className="mt-1 block text-slate-300">{hotspot.summary}</span>
        </div>
        <button className="soft-btn mt-4 w-full justify-center" type="button" onClick={() => onFocus(hotspot.id)}>
          <ScanSearch size={16} /> Centralizar ponto
        </button>
      </div>
    </div>
  )
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  icon,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  icon: ReactNode
  onChange: (value: number) => void
}) {
  return (
    <label className="block rounded-[20px] border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-200">
        <span className="flex items-center gap-2 font-medium text-white">
          {icon} {label}
        </span>
        <span className="text-xs text-slate-400">{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
      <div className="flex items-center gap-2 text-cyan-200">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

export default App
