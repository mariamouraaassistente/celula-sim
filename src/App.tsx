import { useEffect, useMemo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Atom,
  BookOpen,
  CheckCircle2,
  Droplets,
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
import { create } from 'zustand'

import './index.css'

type CellType = 'animal' | 'plant'

type Organelle = {
  id: string
  name: string
  short: string
  functionText: string
  x: number
  y: number
  size: number
  color: string
  glow: string
  motion: 'float' | 'pulse' | 'orbit' | 'drift'
  icon: string
}

type CellScene = {
  id: string
  title: string
  type: CellType
  ageLabel: string
  intro: string
  environment: string
  teachingPoint: string
  note: string
  gradient: string
  accent: string
  backgroundOrbs: string[]
  organelles: Organelle[]
  shape: 'animal-health' | 'animal-metabolism' | 'plant-health' | 'plant-stress'
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

type MicroscopyState = {
  sceneId: string
  selectedOrganelleId: string
  running: boolean
  labels: boolean
  zoom: number
  focus: number
  light: number
  tick: number
  quizAnswers: Record<number, number | undefined>
  answered: Record<number, boolean>
  setScene: (sceneId: string) => void
  setSelectedOrganelle: (organelleId: string) => void
  toggleRunning: () => void
  toggleLabels: () => void
  setZoom: (zoom: number) => void
  setFocus: (focus: number) => void
  setLight: (light: number) => void
  setAnswer: (index: number, answer: number) => void
  nextQuiz: () => void
  prevQuiz: () => void
}

const scenes: CellScene[] = [
  {
    id: 'animal-health',
    title: 'Célula animal saudável',
    type: 'animal',
    ageLabel: '1º ano • célula e membrana',
    intro: 'Observe uma célula animal com circulação intensa de vesículas, mitocôndrias ativas e membrana flexível.',
    environment: 'Temperatura estável · nutrientes disponíveis · oxigênio moderado',
    teachingPoint: 'As células animais não possuem parede celular nem cloroplastos, mas têm membrana, núcleo e mitocôndrias.',
    note: 'Ótima para começar a comparar com a célula vegetal.',
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.9), rgba(14,165,233,0.35) 40%, rgba(8,47,73,0.9))',
    accent: '#7dd3fc',
    backgroundOrbs: ['rgba(56,189,248,0.25)', 'rgba(168,85,247,0.22)', 'rgba(34,197,94,0.18)'],
    shape: 'animal-health',
    organelles: [
      { id: 'nucleus', name: 'Núcleo', short: 'guarda o DNA e coordena a célula', functionText: 'O núcleo armazena o material genético e orienta a produção de proteínas.', x: 50, y: 38, size: 58, color: '#e9d5ff', glow: 'rgba(196,181,253,0.45)', motion: 'pulse', icon: '◎' },
      { id: 'mito-a', name: 'Mitocôndria', short: 'produz ATP para energia', functionText: 'As mitocôndrias transformam energia dos nutrientes em ATP, combustível da célula.', x: 22, y: 58, size: 28, color: '#f59e0b', glow: 'rgba(245,158,11,0.38)', motion: 'orbit', icon: '⚡' },
      { id: 'mito-b', name: 'Mitocôndria', short: 'energia para o metabolismo', functionText: 'Quando a célula está ativa, as mitocôndrias aparecem mais “acesas” no simulador.', x: 76, y: 62, size: 24, color: '#fb7185', glow: 'rgba(251,113,133,0.35)', motion: 'orbit', icon: '⚡' },
      { id: 'golgi', name: 'Complexo de Golgi', short: 'empacota e envia substâncias', functionText: 'O Golgi modifica, empacota e distribui moléculas produzidas na célula.', x: 68, y: 26, size: 32, color: '#fda4af', glow: 'rgba(253,164,175,0.35)', motion: 'drift', icon: '◖' },
      { id: 'vesicles', name: 'Vesículas', short: 'transportam materiais', functionText: 'As vesículas fazem o transporte interno e ajudam na secreção de substâncias.', x: 35, y: 70, size: 18, color: '#38bdf8', glow: 'rgba(56,189,248,0.25)', motion: 'drift', icon: '•' },
    ],
  },
  {
    id: 'animal-metabolism',
    title: 'Célula animal em atividade',
    type: 'animal',
    ageLabel: '1º ano • metabolismo e troca de substâncias',
    intro: 'Aqui a célula está com grande demanda de energia: mais movimento, mais vesículas e membrana vibrando.',
    environment: 'Glicose alta · respiração celular intensa · membrana em dinâmica constante',
    teachingPoint: 'A membrana plasmática controla a entrada e saída de substâncias e ajuda a manter o equilíbrio celular.',
    note: 'Perfeita para mostrar metabolismo e transporte.',
    gradient: 'linear-gradient(135deg, rgba(244,114,182,0.9), rgba(239,68,68,0.35) 40%, rgba(69,10,24,0.9))',
    accent: '#f9a8d4',
    backgroundOrbs: ['rgba(251,113,133,0.28)', 'rgba(168,85,247,0.18)', 'rgba(250,204,21,0.16)'],
    shape: 'animal-metabolism',
    organelles: [
      { id: 'nucleus', name: 'Núcleo', short: 'controle da célula', functionText: 'O núcleo coordena as funções e contém o DNA.', x: 49, y: 36, size: 56, color: '#ddd6fe', glow: 'rgba(221,214,254,0.45)', motion: 'pulse', icon: '◎' },
      { id: 'mito-a', name: 'Mitocôndria', short: 'mais ATP quando a célula trabalha', functionText: 'Em atividades intensas, a mitocôndria trabalha mais e aparece pulsando.', x: 20, y: 32, size: 30, color: '#f59e0b', glow: 'rgba(245,158,11,0.45)', motion: 'orbit', icon: '⚡' },
      { id: 'mito-b', name: 'Mitocôndria', short: 'energia constante', functionText: 'A célula usa ATP para transporte, síntese e movimento de organelas.', x: 72, y: 58, size: 30, color: '#fb7185', glow: 'rgba(251,113,133,0.38)', motion: 'orbit', icon: '⚡' },
      { id: 'lysosome', name: 'Lisossomo', short: 'digestão intracelular', functionText: 'Lisossomos ajudam a degradar materiais e reciclar componentes da célula.', x: 26, y: 72, size: 18, color: '#f97316', glow: 'rgba(249,115,22,0.28)', motion: 'drift', icon: '◍' },
      { id: 'membrane', name: 'Membrana', short: 'flexível e seletiva', functionText: 'A membrana é seletivamente permeável e regula o que entra e sai da célula.', x: 58, y: 76, size: 14, color: '#67e8f9', glow: 'rgba(103,232,249,0.22)', motion: 'float', icon: '⋯' },
    ],
  },
  {
    id: 'plant-health',
    title: 'Célula vegetal saudável',
    type: 'plant',
    ageLabel: '1º ano • parede celular e fotossíntese',
    intro: 'A célula vegetal mostra parede celular rígida, vacúolo grande e cloroplastos captando luz.',
    environment: 'Boa iluminação · água disponível · fotossíntese ativa',
    teachingPoint: 'Plantas têm parede celular, cloroplastos e vacúolo central — três diferenças-chave em relação às células animais.',
    note: 'Ótima para destacar a parede celular e a fotossíntese.',
    gradient: 'linear-gradient(135deg, rgba(74,222,128,0.9), rgba(22,163,74,0.35) 42%, rgba(12,44,19,0.92))',
    accent: '#86efac',
    backgroundOrbs: ['rgba(34,197,94,0.25)', 'rgba(163,230,53,0.18)', 'rgba(59,130,246,0.14)'],
    shape: 'plant-health',
    organelles: [
      { id: 'nucleus', name: 'Núcleo', short: 'comanda a célula vegetal', functionText: 'O núcleo também existe na célula vegetal e controla as atividades celulares.', x: 50, y: 42, size: 52, color: '#e9d5ff', glow: 'rgba(196,181,253,0.40)', motion: 'pulse', icon: '◎' },
      { id: 'vacuole', name: 'Vacúolo central', short: 'armazenamento e turgor', functionText: 'O vacúolo armazena água e solutos, ajudando a manter a rigidez da planta.', x: 51, y: 63, size: 70, color: '#60a5fa', glow: 'rgba(96,165,250,0.22)', motion: 'pulse', icon: '◌' },
      { id: 'chloroplast-a', name: 'Cloroplasto', short: 'faz fotossíntese', functionText: 'Os cloroplastos captam luz e ajudam a produzir glicose na fotossíntese.', x: 24, y: 28, size: 30, color: '#4ade80', glow: 'rgba(74,222,128,0.45)', motion: 'orbit', icon: '◔' },
      { id: 'chloroplast-b', name: 'Cloroplasto', short: 'clorofila e energia da luz', functionText: 'A clorofila presente no cloroplasto dá a cor verde e absorve luz.', x: 74, y: 28, size: 30, color: '#22c55e', glow: 'rgba(34,197,94,0.42)', motion: 'orbit', icon: '◔' },
      { id: 'cell-wall', name: 'Parede celular', short: 'protege e sustenta', functionText: 'A parede celular é rígida, protege e ajuda a dar forma à célula vegetal.', x: 50, y: 12, size: 96, color: '#fbbf24', glow: 'rgba(251,191,36,0.16)', motion: 'drift', icon: '▢' },
    ],
  },
  {
    id: 'plant-stress',
    title: 'Célula vegetal sob estresse hídrico',
    type: 'plant',
    ageLabel: '1º ano • água, luz e turgescência',
    intro: 'Neste cenário a planta recebeu pouca água. O vacúolo diminui e a membrana parece mais “solta” dentro da parede.',
    environment: 'Pouca água · calor alto · fotossíntese reduzida',
    teachingPoint: 'Quando falta água, a célula vegetal perde turgor e a planta murcha. Isso ajuda a discutir transporte de água.',
    note: 'Bom para explicar murcha, turgor e adaptação.',
    gradient: 'linear-gradient(135deg, rgba(250,204,21,0.92), rgba(249,115,22,0.35) 42%, rgba(59,39,8,0.92))',
    accent: '#fde68a',
    backgroundOrbs: ['rgba(251,191,36,0.25)', 'rgba(251,146,60,0.2)', 'rgba(34,197,94,0.14)'],
    shape: 'plant-stress',
    organelles: [
      { id: 'nucleus', name: 'Núcleo', short: 'continua controlando a célula', functionText: 'Mesmo em estresse, o núcleo segue coordenando processos vitais.', x: 50, y: 36, size: 50, color: '#e9d5ff', glow: 'rgba(196,181,253,0.35)', motion: 'pulse', icon: '◎' },
      { id: 'vacuole', name: 'Vacúolo central', short: 'menor por falta de água', functionText: 'Com pouca água, o vacúolo perde volume e a pressão interna cai.', x: 52, y: 58, size: 52, color: '#7dd3fc', glow: 'rgba(125,211,252,0.22)', motion: 'pulse', icon: '◌' },
      { id: 'chloroplast-a', name: 'Cloroplasto', short: 'fotossíntese reduzida', functionText: 'Com menos água, a fotossíntese fica limitada e o cloroplasto “brilha” menos.', x: 28, y: 28, size: 28, color: '#84cc16', glow: 'rgba(132,204,22,0.24)', motion: 'orbit', icon: '◔' },
      { id: 'chloroplast-b', name: 'Cloroplasto', short: 'menos atividade', functionText: 'A planta continua viva, mas a atividade metabólica diminui para economizar energia.', x: 72, y: 28, size: 28, color: '#22c55e', glow: 'rgba(34,197,94,0.22)', motion: 'orbit', icon: '◔' },
      { id: 'wall', name: 'Parede celular', short: 'segue rígida', functionText: 'A parede celular não some; ela segue dando forma e proteção à célula.', x: 50, y: 12, size: 96, color: '#f59e0b', glow: 'rgba(245,158,11,0.16)', motion: 'drift', icon: '▢' },
    ],
  },
]

const lessons: Lesson[] = [
  {
    title: '1. Comece pela membrana',
    body: 'A membrana plasmática funciona como um filtro. Ela seleciona o que entra e o que sai da célula.',
    icon: '🧫',
  },
  {
    title: '2. Compare animal e vegetal',
    body: 'A célula vegetal tem parede celular, cloroplastos e vacúolo grande. A animal é mais flexível e não faz fotossíntese.',
    icon: '🌿',
  },
  {
    title: '3. Energia e movimento',
    body: 'Mitocôndrias produzem ATP. Quando a célula “trabalha”, elas aparecem mais ativas no simulador.',
    icon: '⚡',
  },
  {
    title: '4. Água e turgor',
    body: 'Na célula vegetal, o vacúolo ajuda na firmeza. Sem água, a célula perde pressão e a planta murcha.',
    icon: '💧',
  },
]

const quiz: QuizQuestion[] = [
  {
    question: 'Qual estrutura existe na célula vegetal e não existe na célula animal?',
    options: ['Mitocôndria', 'Parede celular', 'Membrana plasmática', 'Núcleo'],
    correctIndex: 1,
    hint: 'Pense na estrutura rígida que sustenta a célula da planta.',
  },
  {
    question: 'Qual organela está mais ligada à produção de ATP?',
    options: ['Lisossomo', 'Cloroplasto', 'Mitocôndria', 'Vacúolo'],
    correctIndex: 2,
    hint: 'É a “usina de energia” da célula.',
  },
  {
    question: 'O que acontece com a célula vegetal quando falta água?',
    options: ['Ela ganha cloroplastos', 'Perde turgor', 'Vira célula animal', 'Para de ter membrana'],
    correctIndex: 1,
    hint: 'A dica está no cenário de estresse hídrico.',
  },
]

const useMicroscopyStore = create<MicroscopyState>((set) => ({
  sceneId: scenes[0].id,
  selectedOrganelleId: scenes[0].organelles[0].id,
  running: true,
  labels: true,
  zoom: 1,
  focus: 0.76,
  light: 0.7,
  tick: 0,
  quizAnswers: {},
  answered: {},
  setScene: (sceneId) =>
    set((state) => ({
      sceneId,
      selectedOrganelleId: scenes.find((scene) => scene.id === sceneId)?.organelles[0].id ?? state.selectedOrganelleId,
    })),
  setSelectedOrganelle: (selectedOrganelleId) => set({ selectedOrganelleId }),
  toggleRunning: () => set((state) => ({ running: !state.running })),
  toggleLabels: () => set((state) => ({ labels: !state.labels })),
  setZoom: (zoom) => set({ zoom }),
  setFocus: (focus) => set({ focus }),
  setLight: (light) => set({ light }),
  setAnswer: (index, answer) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [index]: answer },
      answered: { ...state.answered, [index]: true },
    })),
  nextQuiz: () => undefined,
  prevQuiz: () => undefined,
}))

function App() {
  const {
    sceneId,
    selectedOrganelleId,
    running,
    labels,
    zoom,
    focus,
    light,
    tick,
    quizAnswers,
    answered,
    setScene,
    setSelectedOrganelle,
    toggleRunning,
    toggleLabels,
    setZoom,
    setFocus,
    setLight,
    setAnswer,
  } = useMicroscopyStore()

  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(() => {
      useMicroscopyStore.setState((state) => ({ tick: state.tick + 1 }))
    }, 40)
    return () => window.clearInterval(interval)
  }, [running])

  const scene = useMemo(() => scenes.find((item) => item.id === sceneId) ?? scenes[0], [sceneId])
  const selectedOrganelle = useMemo(
    () => scene.organelles.find((organelle) => organelle.id === selectedOrganelleId) ?? scene.organelles[0],
    [scene, selectedOrganelleId],
  )
  const score = Object.entries(quizAnswers).reduce((acc, [index, answer]) => {
    if (answer === undefined) return acc
    return acc + (answer === quiz[Number(index)].correctIndex ? 1 : 0)
  }, 0)

  return (
    <div className="min-h-screen text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                <Microscope size={14} /> Simulador de microscópio biológico
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Células em foco: animal e vegetal, do jeito que o aluno vê e entende.
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Explore quatro cenários, toque nas organelas e compare as diferenças entre células animais e vegetais.
                O simulador foi pensado para *1º ano* com visual mobile-first e explicações curtas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
              <StatPill icon={<Sparkles size={16} />} label="Cenários" value="4" />
              <StatPill icon={<Trees size={16} />} label="Vegetais" value="2" />
              <StatPill icon={<Atom size={16} />} label="Animais" value="2" />
              <StatPill icon={<ScanSearch size={16} />} label="Interativo" value="100%" />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/15 backdrop-blur sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Microscópio</p>
                  <h2 className="font-display text-2xl font-semibold text-white">{scene.title}</h2>
                  <p className="mt-1 text-sm text-slate-300">{scene.intro}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="soft-btn" onClick={toggleRunning} type="button">
                    {running ? <Pause size={16} /> : <Play size={16} />} {running ? 'Pausar' : 'Rodar'}
                  </button>
                  <button className="soft-btn" onClick={toggleLabels} type="button">
                    <BookOpen size={16} /> {labels ? 'Ocultar rótulos' : 'Mostrar rótulos'}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <MicroscopeViewport
                  scene={scene}
                  running={running}
                  tick={tick}
                  labels={labels}
                  selectedOrganelleId={selectedOrganelleId}
                  zoom={zoom}
                  focus={focus}
                  light={light}
                  onSelect={setSelectedOrganelle}
                />

                <div className="flex flex-col gap-3">
                  <ControlPanel
                    scene={scene}
                    zoom={zoom}
                    focus={focus}
                    light={light}
                    onZoom={setZoom}
                    onFocus={setFocus}
                    onLight={setLight}
                  />
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Dica de aula</p>
                        <h3 className="mt-1 font-display text-lg font-semibold text-white">{scene.teachingPoint}</h3>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">
                        <Focus size={18} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{scene.note}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ScenePicker current={sceneId} onPick={setScene} />
              <OrganelleCard scene={scene} organelle={selectedOrganelle} />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Roteiro da aula</p>
                  <h3 className="font-display text-xl font-semibold text-white">Percurso guiado</h3>
                </div>
                <div className="rounded-2xl bg-emerald-400/15 p-2 text-emerald-200">
                  <SunMedium size={18} />
                </div>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <motion.article
                    key={lesson.title}
                    className="rounded-[22px] border border-white/10 bg-white/5 p-4"
                    initial={{ opacity: 0, y: 12 }}
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

            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-fuchsia-950/10 backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Quiz rápido</p>
                  <h3 className="font-display text-xl font-semibold text-white">Teste de aprendizado</h3>
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
                  Dica: compare o cenário animal com o vegetal e toque nos organelos para revisar as funções.
                </span>
              </div>
            </div>
          </aside>
        </section>

        <footer className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4 text-xs leading-6 text-slate-400 backdrop-blur">
          Feito para ser usado no celular e na lousa digital. Se quiser, depois eu também posso transformar isso em
          versão com login de turma, salvar progresso e painel do professor.
        </footer>
      </main>
    </div>
  )
}

function MicroscopeViewport({
  scene,
  running,
  tick,
  labels,
  selectedOrganelleId,
  zoom,
  focus,
  light,
  onSelect,
}: {
  scene: CellScene
  running: boolean
  tick: number
  labels: boolean
  selectedOrganelleId: string
  zoom: number
  focus: number
  light: number
  onSelect: (id: string) => void
}) {
  const blur = Math.max(0, (1 - focus) * 6)
  const saturation = 0.7 + light * 0.65
  const brightness = 0.55 + light * 0.55
  const cellScale = 0.95 + zoom * 0.35

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-3 shadow-inner shadow-black/40">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/10 bg-[#03101f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.16),_rgba(9,13,28,0.6)_45%,_rgba(2,6,23,0.96)_78%)]" />
        {scene.backgroundOrbs.map((orb, index) => (
          <div
            key={orb}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${180 + index * 30}px`,
              height: `${180 + index * 30}px`,
              background: orb,
              left: `${8 + index * 22}%`,
              top: `${10 + index * 18}%`,
              transform: `translate3d(${Math.sin((tick + index * 33) / 36) * 8}px, ${Math.cos((tick + index * 19) / 42) * 8}px, 0)`,
            }}
          />
        ))}

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: running ? [0, 0.2, -0.2, 0] : 0 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ filter: `blur(${blur}px) saturate(${saturation}) brightness(${brightness})` }}
        >
          <div
            className="relative"
            style={{
              transform: `scale(${cellScale})`,
              width: '84%',
              height: '82%',
            }}
          >
            <CellShape scene={scene} tick={tick} running={running} light={light} />
            {scene.organelles.map((organelle, index) => {
              const active = organelle.id === selectedOrganelleId
              const left = organelleMotionX(organelle, tick)
              const top = organelleMotionY(organelle, tick)
              return (
                <motion.button
                  key={organelle.id}
                  type="button"
                  aria-label={organelle.name}
                  onClick={() => onSelect(organelle.id)}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[12px] font-bold transition ${
                    active ? 'ring-2 ring-white/90' : 'ring-0'
                  }`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${organelle.size}px`,
                    height: `${organelle.size}px`,
                    color: '#031018',
                    borderColor: organelle.color,
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.92), ${organelle.color} 72%)`,
                    boxShadow: active
                      ? `0 0 0 8px ${organelle.glow}, 0 0 32px ${organelle.glow}`
                      : `0 0 0 0 ${organelle.glow}`,
                    transform: `translate(-50%, -50%) scale(${active ? 1.16 : 1})`,
                  }}
                  animate={
                    organelle.motion === 'pulse'
                      ? { scale: active ? [1.08, 1.2, 1.08] : [1, 1.08, 1] }
                      : organelle.motion === 'orbit'
                        ? { scale: active ? 1.15 : 1 }
                        : organelle.motion === 'drift'
                          ? { scale: active ? 1.08 : 1 }
                          : { scale: active ? 1.08 : 1 }
                  }
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 }}
                >
                  <span>{organelle.icon}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <div className="scope-grain" />
        <div className="scope-vignette" />

        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-200 backdrop-blur">
          {scene.type === 'plant' ? 'Célula vegetal' : 'Célula animal'} · {scene.environment}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="max-w-[70%] rounded-2xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Zoom / foco</p>
            <p className="mt-1 text-sm leading-5 text-slate-100">
              Toque em uma organela para ver a função. O simulador está{' '}
              {running ? 'em movimento' : 'pausado'}.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-cyan-200 backdrop-blur">
            {labels ? 'Rótulos ligados' : 'Rótulos desligados'}
          </div>
        </div>
      </div>
    </div>
  )
}

function CellShape({ scene, tick, running, light }: { scene: CellScene; tick: number; running: boolean; light: number }) {
  const pulse = running ? 0.5 + Math.sin(tick / 14) * 0.06 : 0.5
  const plantGlow = 0.35 + light * 0.4
  const organelleDrift = running ? Math.sin(tick / 22) * 2 : 0

  if (scene.shape === 'animal-health' || scene.shape === 'animal-metabolism') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_0_30px_rgba(56,189,248,0.12)]">
        <defs>
          <radialGradient id="animalCore" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.72)" />
            <stop offset="45%" stopColor={scene.shape === 'animal-metabolism' ? 'rgba(251,113,133,0.38)' : 'rgba(125,211,252,0.34)'} />
            <stop offset="100%" stopColor={scene.shape === 'animal-metabolism' ? 'rgba(23,13,29,0.95)' : 'rgba(8,47,73,0.95)'} />
          </radialGradient>
        </defs>
        <path
          d="M17,45 C14,28 27,15 45,14 C61,13 72,18 84,28 C92,35 88,49 86,59 C84,71 77,84 63,87 C52,89 40,89 28,83 C17,77 11,62 17,45 Z"
          fill={scene.shape === 'animal-metabolism' ? 'url(#animalCore)' : 'url(#animalCore)'}
          stroke={scene.shape === 'animal-metabolism' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.18)'}
          strokeWidth="1.6"
        />
        <path
          d="M19,46 C15,30 27,17 44,16 C60,15 71,20 82,29 C90,36 87,48 85,58 C83,69 76,82 62,85 C51,87 40,87 29,81 C18,76 12,62 19,46"
          fill="none"
          stroke={scene.shape === 'animal-metabolism' ? 'rgba(251,113,133,0.22)' : 'rgba(148,163,184,0.18)'}
          strokeWidth="2"
          strokeDasharray="2 3"
          strokeLinecap="round"
        />
        <ellipse cx="50" cy="48" rx={16 + pulse * 3} ry={13 + pulse * 2} fill="rgba(255,255,255,0.05)" />
        <g opacity="0.7">
          <circle cx={25 + organelleDrift} cy="28" r="4" fill="rgba(255,255,255,0.2)" />
          <circle cx="74" cy="30" r="3" fill="rgba(255,255,255,0.16)" />
          <circle cx="28" cy="72" r="3.5" fill="rgba(255,255,255,0.18)" />
          <circle cx="69" cy="70" r="2.8" fill="rgba(255,255,255,0.15)" />
        </g>
      </svg>
    )
  }

  if (scene.shape === 'plant-stress') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_0_34px_rgba(250,204,21,0.12)]">
        <rect x="10" y="10" width="80" height="80" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.20)" strokeWidth="2.2" />
        <rect x="12.5" y="12.5" width="75" height="75" rx="6" fill="none" stroke="rgba(251,191,36,0.22)" strokeWidth="2" />
        <rect x="29" y="28" width="40" height="46" rx="20" fill={`rgba(125,211,252,${0.15 + plantGlow * 0.2})`} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <ellipse cx="50" cy="49" rx={16 + pulse * 2} ry={20 + pulse} fill="rgba(125,211,252,0.18)" />
        <circle cx="38" cy="36" r={3.5 + pulse * 0.8} fill="rgba(132,204,22,0.92)" />
        <circle cx="61" cy="38" r={3.6 + pulse * 0.7} fill="rgba(34,197,94,0.90)" />
        <circle cx="37" cy="59" r={3 + pulse * 0.6} fill="rgba(132,204,22,0.88)" />
        <circle cx="62" cy="57" r={3.2 + pulse * 0.7} fill="rgba(34,197,94,0.90)" />
        <circle cx="50" cy="48" r={12 + pulse * 2} fill="rgba(233,213,255,0.14)" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_0_34px_rgba(34,197,94,0.10)]">
      <rect x="8" y="8" width="84" height="84" rx="7" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.8" />
      <rect x="12" y="12" width="76" height="76" rx="5" fill="rgba(16,185,129,0.08)" stroke="rgba(74,222,128,0.36)" strokeWidth="1.2" />
      <rect x="15" y="15" width="70" height="70" rx="18" fill="rgba(8,47,73,0.24)" stroke="rgba(34,197,94,0.20)" strokeWidth="1" />
      <rect x="27" y="24" width="46" height="52" rx="18" fill="rgba(59,130,246,0.12)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <ellipse cx="50" cy="50" rx={18 + pulse * 1.5} ry={18 + pulse * 1.5} fill="rgba(125,211,252,0.18)" />
      <circle cx="50" cy="42" r={12 + pulse} fill="rgba(233,213,255,0.16)" />
      <circle cx="35" cy="28" r={3.3 + pulse * 0.5} fill={`rgba(74,222,128,${0.9 * plantGlow})`} />
      <circle cx="66" cy="30" r={3.1 + pulse * 0.5} fill={`rgba(34,197,94,${0.9 * plantGlow})`} />
      <circle cx="38" cy="60" r={3 + pulse * 0.4} fill={`rgba(132,204,22,${0.8 * plantGlow})`} />
      <circle cx="64" cy="58" r={3.2 + pulse * 0.5} fill={`rgba(74,222,128,${0.85 * plantGlow})`} />
      <circle cx="50" cy="50" r={26} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  )
}

function organelleMotionX(organelle: Organelle, tick: number) {
  const base = organelle.x
  switch (organelle.motion) {
    case 'orbit':
      return base + Math.sin((tick + organelle.x) / 18) * 2.6
    case 'drift':
      return base + Math.cos((tick + organelle.y) / 32) * 1.8
    case 'pulse':
      return base + Math.sin((tick + organelle.size) / 30) * 1.1
    case 'float':
    default:
      return base + Math.sin((tick + organelle.x + organelle.y) / 40) * 1.2
  }
}

function organelleMotionY(organelle: Organelle, tick: number) {
  const base = organelle.y
  switch (organelle.motion) {
    case 'orbit':
      return base + Math.cos((tick + organelle.size) / 20) * 2.1
    case 'drift':
      return base + Math.sin((tick + organelle.x) / 28) * 1.7
    case 'pulse':
      return base + Math.cos((tick + organelle.y) / 34) * 1.1
    case 'float':
    default:
      return base + Math.cos((tick + organelle.x + organelle.y) / 42) * 1.1
  }
}

function ScenePicker({ current, onPick }: { current: string; onPick: (sceneId: string) => void }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/10 backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Cenas</p>
          <h3 className="font-display text-lg font-semibold text-white">Escolha o tipo de célula</h3>
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
                <div className="rounded-2xl bg-white/15 p-2 text-lg shadow-md shadow-black/20">
                  {scene.type === 'plant' ? '🌿' : '🧬'}
                </div>
              </div>
              <p className="mt-3 text-left text-sm leading-5 text-white/85">{scene.ageLabel}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OrganelleCard({ scene, organelle }: { scene: CellScene; organelle: Organelle }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-fuchsia-950/10 backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Detalhe da organela</p>
          <h3 className="font-display text-lg font-semibold text-white">{organelle.name}</h3>
        </div>
        <div className="rounded-2xl bg-fuchsia-400/15 p-2 text-fuchsia-200">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border"
            style={{ borderColor: organelle.color, background: organelle.glow }}
          >
            <span className="text-xl">{organelle.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{scene.type === 'plant' ? 'Célula vegetal' : 'Célula animal'}</p>
            <p className="text-xs text-slate-400">Toque nos pontos luminosos para trocar a organela</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{organelle.functionText}</p>
        <div className="mt-4 rounded-2xl bg-slate-900/70 p-3 text-sm text-slate-200">
          <strong className="block text-white">Resumo rápido</strong>
          <span className="mt-1 block text-slate-300">{organelle.short}</span>
        </div>
      </div>
    </div>
  )
}

function ControlPanel({
  scene,
  zoom,
  focus,
  light,
  onZoom,
  onFocus,
  onLight,
}: {
  scene: CellScene
  zoom: number
  focus: number
  light: number
  onZoom: (value: number) => void
  onFocus: (value: number) => void
  onLight: (value: number) => void
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Controles</p>
          <h3 className="font-display text-lg font-semibold text-white">Ajuste o microscópio</h3>
        </div>
        <div className="rounded-2xl bg-cyan-400/15 p-2 text-cyan-200">
          <Microscope size={18} />
        </div>
      </div>

      <div className="space-y-4">
        <RangeControl
          label="Ampliação"
          value={zoom}
          min={0.8}
          max={1.4}
          step={0.01}
          icon={<ScanSearch size={14} />}
          onChange={onZoom}
        />
        <RangeControl
          label="Foco"
          value={focus}
          min={0}
          max={1}
          step={0.01}
          icon={<Focus size={14} />}
          onChange={onFocus}
        />
        <RangeControl
          label="Luz"
          value={light}
          min={0.15}
          max={1}
          step={0.01}
          icon={<SunMedium size={14} />}
          onChange={onLight}
        />
      </div>

      <div className="mt-4 grid gap-2 rounded-[22px] border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200">
        <div className="flex items-center gap-2 text-white">
          <Droplets size={15} /> {scene.type === 'plant' ? 'História da célula vegetal' : 'História da célula animal'}
        </div>
        <p className="leading-6 text-slate-300">
          {scene.type === 'plant'
            ? 'A parede celular ajuda na sustentação, o cloroplasto capta luz e o vacúolo mantém a turgescência.'
            : 'A membrana é flexível, o núcleo coordena as funções e as mitocôndrias fornecem energia para o trabalho celular.'}
        </p>
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
    <label className="block">
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
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

export default App
