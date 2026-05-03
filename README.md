# Simulador de Microscópio de Células

Um app educacional em **React + TypeScript + Vite** para estudantes do 1º ano explorarem, no celular ou no computador, células animais e vegetais com uma experiência de microscópio interativa.

## O que ele faz

- Mostra **4 cenários** de células:
  - célula animal saudável
  - célula animal em alta atividade metabólica
  - célula vegetal saudável
  - célula vegetal com estresse hídrico
- Permite **zoom, foco e intensidade de luz**
- Tem **modo play/pause** para observar o comportamento das organelas
- Possui **pontos clicáveis** com explicação das organelas
- Inclui **roteiro de aula** e **quiz rápido**
- Foi pensado para uso **mobile-first** e sala de aula

## Tecnologias

- React 19
- TypeScript
- Vite
- Framer Motion
- Zustand
- Lucide React

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy no Vercel

```bash
npx vercel login
npx vercel
npx vercel deploy --prod
```

## Deploy no GitHub

```bash
git init
git add .
git commit -m "feat: simulador de microscópio celular"
```

Depois crie o repositório no GitHub e envie o push.

## Observação pedagógica

Este projeto não tenta ser uma simulação científica de laboratório, e sim uma **ferramenta didática visual**, com comportamento plausível para ajudar os alunos a entenderem as diferenças entre células animais e vegetais.
