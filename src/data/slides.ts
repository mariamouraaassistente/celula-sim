import { SLIDE_DIMENSIONS } from './slide-dimensions'

export type SlideId = keyof typeof SLIDE_DIMENSIONS
export type CellType = 'animal' | 'plant'

export type Hotspot = {
  id: string
  label: string
  details: string
  summary: string
  /** Normalized coordinates in [0, 1], relative to the full pyramid. */
  x: number
  y: number
  /** Normalized radius in [0, 1], relative to the slide width. */
  radius: number
  color: string
  icon: string
}

export type SlideAttribution = {
  source: string
  author?: string
  sourcePageUrl: string
  rawImageUrl: string
  license: string
  licenseUrl: string
}

export type SlideImage = {
  /** Public URL of the DZI descriptor served from /public. */
  dziUrl: string
  /** Pixel size of the highest-resolution level. */
  width: number
  height: number
}

export type Slide = {
  id: SlideId
  title: string
  subtitle: string
  type: CellType
  intro: string
  environment: string
  teachingPoint: string
  note: string
  accent: string
  gradient: string
  symbol: string
  hotspotHint: string
  image: SlideImage
  attribution: SlideAttribution
  hotspots: Hotspot[]
}

const slideImage = (id: SlideId): SlideImage => ({
  dziUrl: `/slides/${id}/${id}.dzi`,
  width: SLIDE_DIMENSIONS[id].width,
  height: SLIDE_DIMENSIONS[id].height,
})

export const SLIDES: Slide[] = [
  {
    id: 'onion-fresh',
    title: 'Lâmina de cebola fresca',
    subtitle: 'Célula vegetal em corte fino, sem muita coloração',
    type: 'plant',
    intro:
      'A lâmina mostra várias células da epiderme da cebola, com paredes bem marcadas e um aspecto “de tijolinhos”.',
    environment: 'boa iluminação · água disponível · célula túrgida',
    teachingPoint:
      'A cebola é ótima para começar porque mostra parede celular, vacúolo e núcleo com clareza didática.',
    note: 'Use esta cena para explicar o formato geométrico da célula vegetal.',
    accent: '#86efac',
    gradient:
      'linear-gradient(135deg, rgba(34,197,94,0.95), rgba(14,116,144,0.42) 45%, rgba(11,31,19,0.96))',
    symbol: '🧅',
    hotspotHint: 'Passe o dedo pela lâmina e toque nas estruturas mais nítidas da cebola.',
    image: slideImage('onion-fresh'),
    attribution: {
      source: 'Wikimedia Commons',
      author: 'Frolicsomepl',
      sourcePageUrl:
        'https://commons.wikimedia.org/wiki/File:Onion_Epidermis_Cells_W.M._40x_-_294.jpg',
      rawImageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/3/30/Onion_Epidermis_Cells_W.M._40x_-_294.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
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
        details:
          'A membrana fica logo abaixo da parede celular e controla a entrada e saída de substâncias.',
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
    title: 'Estômatos de chicória',
    subtitle: 'Poros e células-guarda visíveis em uma lâmina vegetal real',
    type: 'plant',
    intro: 'Aqui vemos a superfície da folha, com estômatos e células-guarda bem definidos.',
    environment: 'folha em corte superficial · contraste alto · estômatos nítidos',
    teachingPoint: 'Os estômatos controlam a troca de gases e a perda de água na planta.',
    note: 'Boa para discutir transpiração, respiração e fotossíntese.',
    accent: '#c4b5fd',
    gradient:
      'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(14,165,233,0.36) 46%, rgba(28,12,53,0.96))',
    symbol: '🧪',
    hotspotHint: 'Toque no poro e nas células-guarda para ver como a folha regula trocas.',
    image: slideImage('onion-stained'),
    attribution: {
      source: 'Wikimedia Commons',
      author: 'Sustainla',
      sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Chicory_Stomata.jpg',
      rawImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Chicory_Stomata.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    hotspots: [
      {
        id: 'pore',
        label: 'Estômato',
        details: 'O estômato é o poro por onde acontecem as trocas de gases.',
        summary: 'Entrada e saída de gases e vapor de água.',
        x: 0.34,
        y: 0.34,
        radius: 0.032,
        color: '#fda4af',
        icon: '◉',
      },
      {
        id: 'guard-cells',
        label: 'Células-guarda',
        details: 'Elas controlam a abertura e o fechamento do estômato.',
        summary: 'Regulam o poro da folha.',
        x: 0.58,
        y: 0.48,
        radius: 0.03,
        color: '#d8b4fe',
        icon: '◎',
      },
      {
        id: 'epidermis',
        label: 'Epiderme foliar',
        details: 'A epiderme reveste a folha e ajuda na proteção.',
        summary: 'Camada protetora da folha.',
        x: 0.47,
        y: 0.58,
        radius: 0.024,
        color: '#93c5fd',
        icon: '◍',
      },
      {
        id: 'opening',
        label: 'Abertura do poro',
        details: 'Quando o poro abre, a folha consegue trocar gases com o ambiente.',
        summary: 'Entrada/saída de ar e vapor.',
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
    intro:
      'Nesta lâmina de célula animal, as bordas são menos rígidas e a forma fica mais arredondada e irregular.',
    environment: 'saliva · baixa coloração · membrana flexível',
    teachingPoint:
      'A célula animal não tem parede celular nem cloroplastos, então o contorno é mais flexível.',
    note: 'Boa para mostrar as diferenças mais rápidas entre animal e vegetal.',
    accent: '#f9a8d4',
    gradient:
      'linear-gradient(135deg, rgba(244,114,182,0.95), rgba(251,146,60,0.34) 46%, rgba(52,16,34,0.96))',
    symbol: '🧫',
    hotspotHint: 'Toque nas células mais arredondadas e compare com a lâmina da cebola.',
    image: slideImage('cheek-fresh'),
    attribution: {
      source: 'Wikimedia Commons',
      author: 'Department of Histology, Jagiellonian University Medical College',
      sourcePageUrl:
        'https://commons.wikimedia.org/wiki/File:Human_cheek_cells_from_science_class.jpg',
      rawImageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Human_cheek_cells_from_science_class.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    hotspots: [
      {
        id: 'membrane',
        label: 'Membrana plasmática',
        details:
          'Na célula animal, a membrana é o principal limite externo — não existe parede celular rígida.',
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
        details:
          'As células animais podem ficar bem próximas, mas sem a parede rígida das plantas.',
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
    title: 'Esfregaço de sangue',
    subtitle: 'Hemácias e outras células sanguíneas em alta ampliação',
    type: 'animal',
    intro: 'Uma lâmina animal com hemácias espalhadas e forte contraste.',
    environment: 'esfregaço sanguíneo · alta ampliação · células bem contrastadas',
    teachingPoint: 'O sangue ajuda a mostrar células sem parede celular e com formatos variados.',
    note: 'Ótimo para comparar com a lâmina vegetal.',
    accent: '#fca5a5',
    gradient:
      'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(168,85,247,0.30) 46%, rgba(44,14,18,0.96))',
    symbol: '🩵',
    hotspotHint: 'Toque nas hemácias e no leucócito para comparar os elementos do sangue.',
    image: slideImage('cheek-stained'),
    attribution: {
      source: 'Wikimedia Commons',
      author: 'Anand2202',
      sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Blood_under_microscope.jpg',
      rawImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Blood_under_microscope.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    hotspots: [
      {
        id: 'rbc',
        label: 'Hemácia',
        details: 'As hemácias transportam oxigênio e costumam aparecer como discos claros no esfregaço.',
        summary: 'Célula vermelha do sangue.',
        x: 0.42,
        y: 0.36,
        radius: 0.028,
        color: '#7dd3fc',
        icon: '◉',
      },
      {
        id: 'wbc',
        label: 'Leucócito',
        details: 'O leucócito é a célula de defesa do organismo.',
        summary: 'Participa da imunidade.',
        x: 0.6,
        y: 0.52,
        radius: 0.032,
        color: '#e9d5ff',
        icon: '◎',
      },
      {
        id: 'plasma',
        label: 'Plasma',
        details: 'É a parte líquida do sangue, onde as células ficam suspensas.',
        summary: 'Meio líquido do sangue.',
        x: 0.5,
        y: 0.6,
        radius: 0.024,
        color: '#fda4af',
        icon: '◍',
      },
      {
        id: 'cluster',
        label: 'Agrupamento de hemácias',
        details: 'No esfregaço, várias hemácias aparecem próximas umas das outras.',
        summary: 'Campos cheios de células do sangue.',
        x: 0.69,
        y: 0.38,
        radius: 0.03,
        color: '#fb7185',
        icon: '⬢',
      },
    ],
  },
]

export const SLIDES_BY_ID: Record<SlideId, Slide> = SLIDES.reduce((acc, slide) => {
  acc[slide.id] = slide
  return acc
}, {} as Record<SlideId, Slide>)
