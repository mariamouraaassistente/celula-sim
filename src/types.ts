export type OrganelleId =
  | 'nucleo'
  | 'nucleolo'
  | 'membrana'
  | 'parede'
  | 'mitocondria'
  | 'cloroplasto'
  | 'reticulo-rugoso'
  | 'reticulo-liso'
  | 'golgi'
  | 'lisossomo'
  | 'vacuolo'
  | 'citoplasma'
  | 'centriolo'
  | 'ribossomo';

export interface OrganelleDef {
  id: OrganelleId;
  nome: string;
  apelido?: string;
  cor: string;
  funcao: string;
  curiosidade: string;
  icone?: string;
}

export interface CellPreset {
  id: string;
  nome: string;
  tipo: 'animal' | 'vegetal';
  descricao: string;
  habitat: string;
  estado: string;
  shape: 'blob' | 'rect' | 'long' | 'rounded';
  paleta: {
    citoplasma: string;
    citoplasma2: string;
    membrana: string;
  };
  organelas: OrganelleInstance[];
  highlight?: OrganelleId;
  notas: string[];
}

export interface OrganelleInstance {
  ref: OrganelleId;
  cx: number;
  cy: number;
  r?: number;
  rx?: number;
  ry?: number;
  rot?: number;
  scale?: number;
  variant?: number;
  count?: number;
  speed?: number;
}

export type AppMode = 'explorar' | 'aula' | 'quiz';

export interface QuizQuestion {
  id: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

export interface LessonStep {
  titulo: string;
  texto: string;
  destaque?: OrganelleId;
  cellId?: string;
}
