import { useEffect, useMemo, useRef, useState } from 'react'
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
import { SLIDES, type Hotspot, type Slide, type SlideId } from './data/slides'

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

const PLANT_COUNT = SLIDES.filter((slide) => slide.type === 'plant').length
const ANIMAL_COUNT = SLIDES.filter((slide) => slide.type === 'animal').length

function App() {
  const [sceneId, setSceneId] = useState<SlideId>(SLIDES[0].id)
  const [selectedHotspotId, setSelectedHotspotId] = useState(SLIDES[0].hotspots[0].id)
  const [running, setRunning] = useState(true)
  const [focus, setFocus] = useState(0.9)
  const [light, setLight] = useState(0.84)
  const [tick, setTick] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | undefined>>({})
  const [answered, setAnswered] = useState<Record<number, boolean>>({})
  const [markerPositions, setMarkerPositions] = useState<Record<string, MarkerPosition>>({})
  const viewerHostRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null)
  const markerFrameRef = useRef<number | null>(null)
  const scene = useMemo(() => SLIDES.find((item) => item.id === sceneId) ?? SLIDES[0], [sceneId])
  const selectedHotspot = useMemo(
    () => scene.hotspots.find((item) => item.id === selectedHotspotId) ?? scene.hotspots[0],
    [scene, selectedHotspotId],
  )
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
      maxZoomPixelRatio: 2,
      visibilityRatio: 0.82,
      constrainDuringPan: true,
      animationTime: 0.55,
      blendTime: 0.08,
      preserveViewport: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: false,
        scrollToZoom: false,
        pinchToZoom: false,
        dragToPan: true,
      },
      gestureSettingsTouch: {
        clickToZoom: false,
        dblClickToZoom: false,
        scrollToZoom: false,
        pinchToZoom: false,
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
        const imagePoint = new OpenSeadragon.Point(
          hotspot.x * scene.image.width,
          hotspot.y * scene.image.height,
        )
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
      instance.viewport.goHome(true)
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
  }, [scene])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    viewer.open({ tileSource: scene.image.dziUrl })
  }, [scene.image.dziUrl])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    const blur = Math.max(0, (1 - focus) * 8)
    const sat = 0.72 + light * 0.6
    const bright = 0.58 + light * 0.55
    const container = viewer.container as HTMLElement
    container.style.filter = `blur(${blur}px) saturate(${sat}) brightness(${bright})`
  }, [focus, light])

  const selectScene = (nextSceneId: SlideId) => {
    const nextScene = SLIDES.find((item) => item.id === nextSceneId)
    setSceneId(nextSceneId)
    setSelectedHotspotId(nextScene?.hotspots[0].id ?? SLIDES[0].hotspots[0].id)
    setMarkerPositions({})
  }

  const focusHotspot = (hotspotId: string) => {
    const viewer = viewerRef.current
    const hotspot = scene.hotspots.find((item) => item.id === hotspotId)
    setSelectedHotspotId(hotspotId)
    if (!viewer || !hotspot) return

    const imagePoint = new OpenSeadragon.Point(
      hotspot.x * scene.image.width,
      hotspot.y * scene.image.height,
    )
    const viewportPoint = viewer.viewport.imageToViewportCoordinates(imagePoint)
    viewer.viewport.panTo(viewportPoint, true)
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
                  Arraste a lâmina, ajuste o foco e toque nas estruturas. A cena da cebola foi pensada para
                  ficar com cara de lâmina escaneada, como nos arquivos de *whole slide imaging*.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[430px]">
              <StatPill icon={<Trees size={16} />} label="Vegetais" value={String(PLANT_COUNT)} />
              <StatPill icon={<Atom size={16} />} label="Animais" value={String(ANIMAL_COUNT)} />
              <StatPill icon={<ScanSearch size={16} />} label="Vista real" value="OSD" />
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
                                    borderColor: hotspot.color,
                                  }}
                                  onClick={() => focusHotspot(hotspot.id)}
                                  aria-label={hotspot.label}
                                >
                                  {selected ? <span>{hotspot.icon}</span> : <span aria-hidden="true" />}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <p className="mt-3 text-xs text-slate-400">
                      Fonte: {scene.attribution.source}
                      {scene.attribution.author ? ` · ${scene.attribution.author}` : ''} ·{' '}
                      <a
                        className="text-cyan-200 underline decoration-cyan-300/50 underline-offset-2"
                        href={scene.attribution.sourcePageUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        abrir a imagem original
                      </a>{' '}
                      ·{' '}
                      <a
                        className="text-cyan-200/80 underline decoration-cyan-300/40 underline-offset-2"
                        href={scene.attribution.licenseUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {scene.attribution.license}
                      </a>
                    </p>
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
                    <p className="mt-3 text-sm leading-6 text-slate-300">{scene.hotspotHint}</p>
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
          Feito para celular e lousa digital. O aluno só consome uma lista curada de lâminas reais; se depois quiser abrir
          arquivos <span className="text-slate-200">.mrxs</span>, <span className="text-slate-200">.svs</span>,
          <span className="text-slate-200"> .ndpi</span> ou outros formatos de *whole slide imaging*;
          eles entram convertidos como tiles no servidor.
        </footer>
      </main>
    </div>
  )
}

function ScenePicker({ current, onPick }: { current: SlideId; onPick: (sceneId: SlideId) => void }) {
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
        {SLIDES.map((slide) => {
          const active = slide.id === current
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => onPick(slide.id)}
              className={`scene-card ${active ? 'scene-card-active' : ''}`}
              style={{ background: slide.gradient }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/75">{slide.type === 'plant' ? 'Vegetal' : 'Animal'}</p>
                  <h4 className="mt-1 font-semibold text-white">{slide.title}</h4>
                </div>
                <div className="rounded-2xl bg-white/15 p-2 text-lg shadow-md shadow-black/20">{slide.symbol}</div>
              </div>
              <p className="mt-3 text-left text-sm leading-5 text-white/85">{slide.subtitle}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function HotspotCard({ scene, hotspot, onFocus }: { scene: Slide; hotspot: Hotspot; onFocus: (id: string) => void }) {
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
