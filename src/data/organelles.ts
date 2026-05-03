import type { OrganelleDef, OrganelleId } from '../types';

export const ORGANELLES: Record<OrganelleId, OrganelleDef> = {
  nucleo: {
    id: 'nucleo',
    nome: 'Núcleo',
    apelido: 'a central de comando',
    cor: '#a78bfa',
    funcao:
      'Guarda o DNA, que é o "manual de instruções" da célula. Controla o que ela produz e quando se divide.',
    curiosidade:
      'Quase todas as células do nosso corpo têm um núcleo — as hemácias (glóbulos vermelhos) são exceções!',
  },
  nucleolo: {
    id: 'nucleolo',
    nome: 'Nucléolo',
    apelido: 'fábrica de ribossomos',
    cor: '#7c3aed',
    funcao:
      'Estrutura dentro do núcleo que monta os ribossomos, peças que depois saem para produzir proteínas.',
    curiosidade:
      'Quando a célula precisa crescer ou se reparar, o nucléolo fica maior e mais ativo.',
  },
  membrana: {
    id: 'membrana',
    nome: 'Membrana plasmática',
    apelido: 'porteiro da célula',
    cor: '#22d3ee',
    funcao:
      'Camada fina que envolve a célula. Decide o que entra e o que sai, protegendo o interior.',
    curiosidade:
      'É feita de duas camadas de gordura (lipídios) com proteínas encaixadas, como bóias em um lago.',
  },
  parede: {
    id: 'parede',
    nome: 'Parede celular',
    apelido: 'armadura vegetal',
    cor: '#bef264',
    funcao:
      'Camada rígida feita de celulose, presente apenas em células vegetais. Dá forma e sustentação.',
    curiosidade:
      'A madeira de uma árvore é, basicamente, paredes celulares empilhadas há anos!',
  },
  mitocondria: {
    id: 'mitocondria',
    nome: 'Mitocôndria',
    apelido: 'usina de energia',
    cor: '#fb7185',
    funcao:
      'Transforma o açúcar dos alimentos em ATP, a energia que a célula usa para tudo.',
    curiosidade:
      'Mitocôndrias têm o próprio DNA e provavelmente vieram de bactérias que viraram parceiras das nossas células.',
  },
  cloroplasto: {
    id: 'cloroplasto',
    nome: 'Cloroplasto',
    apelido: 'painel solar verde',
    cor: '#34d399',
    funcao:
      'Faz a fotossíntese: usa luz, água e CO₂ para produzir açúcar e liberar oxigênio.',
    curiosidade:
      'O verde das folhas vem da clorofila, o pigmento que mora dentro dos cloroplastos.',
  },
  'reticulo-rugoso': {
    id: 'reticulo-rugoso',
    nome: 'Retículo Endoplasmático Rugoso',
    apelido: 'linha de montagem',
    cor: '#f59e0b',
    funcao:
      'Cheio de ribossomos grudados, monta proteínas que depois serão exportadas ou usadas em outras organelas.',
    curiosidade:
      'O "rugoso" vem da aparência granulada dos ribossomos colados na sua superfície.',
  },
  'reticulo-liso': {
    id: 'reticulo-liso',
    nome: 'Retículo Endoplasmático Liso',
    apelido: 'laboratório de gorduras',
    cor: '#fbbf24',
    funcao:
      'Produz lipídios (gorduras) e ajuda a desativar substâncias tóxicas.',
    curiosidade:
      'Em células do fígado, ele é gigante — porque o fígado é um campeão da desintoxicação.',
  },
  golgi: {
    id: 'golgi',
    nome: 'Complexo de Golgi',
    apelido: 'expedição',
    cor: '#f472b6',
    funcao:
      'Recebe proteínas, embala em pequenas vesículas e envia para o lugar certo, dentro ou fora da célula.',
    curiosidade:
      'Foi descoberto pelo médico italiano Camillo Golgi em 1898, que ganhou o Nobel por isso.',
  },
  lisossomo: {
    id: 'lisossomo',
    nome: 'Lisossomo',
    apelido: 'esquadrão de limpeza',
    cor: '#fb923c',
    funcao:
      'Bolsa cheia de enzimas que digere restos e organelas velhas para reciclar.',
    curiosidade:
      'Quase só existe em células animais. Se vazar, pode digerir a própria célula!',
  },
  vacuolo: {
    id: 'vacuolo',
    nome: 'Vacúolo',
    apelido: 'caixa d’água',
    cor: '#60a5fa',
    funcao:
      'Em células vegetais, é gigante e armazena água, sais e pigmentos. Mantém a célula firme.',
    curiosidade:
      'O vacúolo cheio empurra as outras organelas contra a parede — por isso a alface fica murcha quando perde água.',
  },
  citoplasma: {
    id: 'citoplasma',
    nome: 'Citoplasma',
    apelido: 'gelatina viva',
    cor: '#67e8f9',
    funcao:
      'Material gelatinoso onde as organelas ficam e onde acontecem muitas reações químicas.',
    curiosidade:
      'É 70% água! Boa parte da química da vida acontece dissolvida nele.',
  },
  centriolo: {
    id: 'centriolo',
    nome: 'Centríolo',
    apelido: 'guia da divisão',
    cor: '#c084fc',
    funcao:
      'Par de cilindros que organiza os fios usados quando a célula animal vai se dividir.',
    curiosidade:
      'Plantas não têm centríolos — elas se dividem de outro jeito.',
  },
  ribossomo: {
    id: 'ribossomo',
    nome: 'Ribossomo',
    apelido: 'mini-fábrica de proteínas',
    cor: '#facc15',
    funcao:
      'Lê a receita do RNA mensageiro e monta proteínas, aminoácido por aminoácido.',
    curiosidade:
      'São tão pequenos que só dá para vê-los com microscópio eletrônico.',
  },
};

export const ORGANELLE_LIST = Object.values(ORGANELLES);
