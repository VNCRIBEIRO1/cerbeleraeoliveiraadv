'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Scale,
  Bot,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';

// ============================================================
// TIPOS
// ============================================================
type Mensagem = {
  id: number;
  tipo: 'bot' | 'user';
  texto: string;
  opcoes?: Opcao[];
  timestamp: Date;
};

type Opcao = {
  label: string;
  valor: string;
};

type DadosTriagem = {
  area: string;
  subarea: string;
  urgencia: string;
  detalhes: string[];
  nome: string;
  telefone: string;
};

// ============================================================
// FLUXOS POR ÁREA — PERGUNTAS CONVERSACIONAIS COMPLETAS
// ============================================================
type Pergunta = {
  id: string;
  texto: string;
  opcoes?: Opcao[];
  livre?: boolean;
  campo?: keyof DadosTriagem;
  campoArray?: boolean;
};

type Fluxo = {
  saudacao: string;
  perguntas: Pergunta[];
};

// ============================================================
// PERGUNTA DE URGÊNCIA (reutilizada em todos os fluxos)
// ============================================================
const PERGUNTA_URGENCIA: Pergunta = {
  id: 'urgencia',
  texto: 'Qual o nível de urgência da sua situação?',
  opcoes: [
    { label: '🔴 Urgente — preciso de atendimento imediato', valor: 'URGENTE' },
    { label: '🟡 Moderado — preciso resolver em breve', valor: 'MODERADO' },
    { label: '🟢 Consulta — quero entender meus direitos', valor: 'CONSULTA' },
  ],
  campo: 'urgencia',
};

const FLUXOS: Record<string, Fluxo> = {
  // ============================================================
  // TRABALHISTA
  // ============================================================
  trabalhista: {
    saudacao:
      'Entendi! Vamos conversar sobre sua questão *trabalhista*. Vou fazer algumas perguntas para entender melhor sua situação e direcionar seu atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual situação melhor descreve o que você está passando?',
        opcoes: [
          { label: '🔴 Fui demitido(a) por justa causa', valor: 'Demissão por justa causa' },
          { label: '💰 Não recebi verbas rescisórias', valor: 'Verbas rescisórias não pagas' },
          { label: '⏰ Horas extras não pagas', valor: 'Horas extras não pagas' },
          { label: '😰 Assédio moral ou sexual no trabalho', valor: 'Assédio moral/sexual no trabalho' },
          { label: '🤕 Acidente de trabalho / doença ocupacional', valor: 'Acidente de trabalho / doença ocupacional' },
          { label: '📋 Desvio ou acúmulo de função', valor: 'Desvio ou acúmulo de função' },
          { label: '🚫 Trabalho sem registro (CLT)', valor: 'Trabalho sem registro em carteira' },
          { label: '⚖️ Rescisão indireta (quero sair com direitos)', valor: 'Rescisão indireta' },
          { label: '🔒 Estabilidade (gestante, CIPA, acidente)', valor: 'Estabilidade provisória' },
          { label: '📋 Outro assunto trabalhista', valor: 'Outro assunto trabalhista' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'tempo',
        texto: 'Há quanto tempo ocorreu ou está ocorrendo essa situação?',
        opcoes: [
          { label: '📅 Menos de 30 dias', valor: 'Menos de 30 dias' },
          { label: '📅 Entre 1 e 6 meses', valor: 'Entre 1 e 6 meses' },
          { label: '📅 Entre 6 meses e 1 ano', valor: 'Entre 6 meses e 1 ano' },
          { label: '📅 Entre 1 e 2 anos', valor: 'Entre 1 e 2 anos' },
          { label: '⚠️ Mais de 2 anos (atenção ao prazo prescricional)', valor: 'Mais de 2 anos' },
        ],
        campoArray: true,
      },
      {
        id: 'vinculo',
        texto: 'Qual era/é o vínculo empregatício?',
        opcoes: [
          { label: '✅ Carteira assinada (CLT)', valor: 'CLT — carteira assinada' },
          { label: '❌ Sem registro em carteira', valor: 'Sem registro em carteira' },
          { label: '📄 Contrato temporário / terceirizado', valor: 'Contrato temporário / terceirizado' },
          { label: '🏠 Trabalho doméstico', valor: 'Empregado(a) doméstico(a)' },
          { label: '🚗 Motorista de aplicativo / PJ', valor: 'Motorista de app / PJ' },
          { label: '📋 Outro tipo de vínculo', valor: 'Outro tipo de vínculo' },
        ],
        campoArray: true,
      },
      {
        id: 'documentos',
        texto: 'Você tem documentos ou provas da situação?',
        opcoes: [
          { label: '✅ Sim, tenho documentos e comprovantes', valor: 'Possui documentos/comprovantes' },
          { label: '📱 Tenho conversas (WhatsApp, e-mail)', valor: 'Possui conversas digitais como prova' },
          { label: '👥 Tenho testemunhas', valor: 'Possui testemunhas' },
          { label: '❌ Não tenho provas no momento', valor: 'Sem provas no momento' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente o que aconteceu. Quanto mais detalhes, melhor poderemos orientá-lo(a):',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // CRIMINAL
  // ============================================================
  criminal: {
    saudacao:
      'Compreendo. Vamos tratar da sua questão na área *criminal* com total sigilo e seriedade. Preciso de algumas informações para direcionar o atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual situação mais se aproxima do seu caso?',
        opcoes: [
          { label: '🔒 Fui preso(a) ou alguém próximo foi preso', valor: 'Prisão / flagrante' },
          { label: '📋 Estou respondendo a processo criminal', valor: 'Processo criminal em andamento' },
          { label: '🔍 Estou sendo investigado(a) (inquérito policial)', valor: 'Investigação / inquérito policial' },
          { label: '🗣️ Sofri calúnia, difamação ou injúria', valor: 'Crimes contra a honra' },
          { label: '⚖️ Preciso de habeas corpus', valor: 'Habeas corpus' },
          { label: '🛡️ Fui vítima de crime', valor: 'Vítima de crime' },
          { label: '💊 Questão envolvendo drogas', valor: 'Questão envolvendo drogas / Lei de Drogas' },
          { label: '🚗 Crime de trânsito', valor: 'Crime de trânsito' },
          { label: '👨‍👩‍👧 Violência doméstica (Lei Maria da Penha)', valor: 'Violência doméstica / Maria da Penha' },
          { label: '💻 Crime cibernético / estelionato digital', valor: 'Crime cibernético / estelionato digital' },
          { label: '📋 Outro assunto criminal', valor: 'Outro assunto criminal' },
        ],
        campo: 'subarea',
      },
      {
        id: 'urgencia',
        texto: 'Qual o nível de urgência?',
        opcoes: [
          { label: '🔴 Urgente — pessoa presa ou em risco imediato', valor: 'URGENTE' },
          { label: '🟡 Moderado — preciso de orientação em breve', valor: 'MODERADO' },
          { label: '🟢 Consulta — quero entender meus direitos', valor: 'CONSULTA' },
        ],
        campo: 'urgencia',
      },
      {
        id: 'posicao',
        texto: 'Qual sua posição na situação?',
        opcoes: [
          { label: '🛡️ Sou a vítima / ofendido(a)', valor: 'Vítima / ofendido(a)' },
          { label: '⚖️ Sou o(a) acusado(a) / investigado(a)', valor: 'Acusado(a) / investigado(a)' },
          { label: '👨‍👩‍👧 Familiar de envolvido(a)', valor: 'Familiar de envolvido(a)' },
          { label: '📋 Outro', valor: 'Outra posição' },
        ],
        campoArray: true,
      },
      {
        id: 'inquerito',
        texto: 'Já existe boletim de ocorrência, inquérito policial ou processo?',
        opcoes: [
          { label: '📄 Sim, já tem B.O. registrado', valor: 'B.O. já registrado' },
          { label: '🔍 Sim, inquérito policial em andamento', valor: 'Inquérito policial em andamento' },
          { label: '⚖️ Sim, processo criminal em curso', valor: 'Processo criminal em curso' },
          { label: '❌ Não, nenhum registro ainda', valor: 'Sem registro / B.O.' },
          { label: '❓ Não sei informar', valor: 'Não sabe informar' },
        ],
        campoArray: true,
      },
      {
        id: 'advogado',
        texto: 'Já teve ou tem advogado(a) atuando no caso?',
        opcoes: [
          { label: '✅ Sim, mas quero trocar', valor: 'Já tem advogado, deseja trocar' },
          { label: '⚖️ Estou com defensor público', valor: 'Com defensor público' },
          { label: '❌ Não, ainda não consultei ninguém', valor: 'Sem advogado' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente a situação (todas as informações são tratadas com *total sigilo*):',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // CIVIL
  // ============================================================
  civil: {
    saudacao:
      'Certo! Vamos conversar sobre sua questão de *Direito Civil*. Me conte um pouco mais para que possamos direcionar o melhor atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual desses temas se relaciona com sua situação?',
        opcoes: [
          { label: '💔 Danos morais ou materiais', valor: 'Responsabilidade civil / danos' },
          { label: '📝 Problemas com contratos', valor: 'Questões contratuais' },
          { label: '🏠 Questão imobiliária (compra, venda, locação)', valor: 'Direito imobiliário' },
          { label: '👨‍👩‍👧 Divórcio / separação', valor: 'Divórcio / separação' },
          { label: '👶 Guarda de filhos / regulamentação de visitas', valor: 'Guarda / regulamentação de visitas' },
          { label: '💰 Pensão alimentícia', valor: 'Pensão alimentícia' },
          { label: '📜 Inventário / herança / testamento', valor: 'Sucessões / inventário / testamento' },
          { label: '🛒 Direito do consumidor', valor: 'Direito do consumidor' },
          { label: '🏥 Erro médico / hospitalar', valor: 'Responsabilidade médica / hospitalar' },
          { label: '🚗 Acidente de trânsito (indenização)', valor: 'Acidente de trânsito (indenização)' },
          { label: '📋 Outro assunto cível', valor: 'Outro assunto cível' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'situacao_atual',
        texto: 'Qual a situação atual do caso?',
        opcoes: [
          { label: '🆕 Ainda não tomei nenhuma medida', valor: 'Nenhuma medida tomada ainda' },
          { label: '🤝 Tentei resolver amigavelmente sem sucesso', valor: 'Tentou resolver amigavelmente sem sucesso' },
          { label: '📨 Recebi notificação / intimação', valor: 'Recebeu notificação ou intimação' },
          { label: '⚖️ Já tenho processo judicial em andamento', valor: 'Processo judicial já em andamento' },
          { label: '📋 Preciso apenas de orientação / consulta', valor: 'Busca orientação / consulta' },
        ],
        campoArray: true,
      },
      {
        id: 'valor',
        texto: 'Existe valor financeiro envolvido na questão?',
        opcoes: [
          { label: '💲 Até R$ 10.000', valor: 'Valor até R$ 10.000' },
          { label: '💲💲 De R$ 10.000 a R$ 50.000', valor: 'Valor entre R$ 10.000 e R$ 50.000' },
          { label: '💲💲💲 Acima de R$ 50.000', valor: 'Valor acima de R$ 50.000' },
          { label: '❓ Não sei estimar / não se aplica', valor: 'Valor não estimado / não se aplica' },
        ],
        campoArray: true,
      },
      {
        id: 'documentos',
        texto: 'Você tem documentos relacionados ao caso?',
        opcoes: [
          { label: '✅ Sim, tenho documentos e contratos', valor: 'Possui documentos/contratos' },
          { label: '📱 Tenho conversas e registros digitais', valor: 'Possui conversas/registros digitais' },
          { label: '❌ Não tenho documentos no momento', valor: 'Sem documentos no momento' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Conte brevemente o que aconteceu e o que você busca:',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // EMPRESARIAL
  // ============================================================
  empresarial: {
    saudacao:
      'Perfeito! Vamos tratar da sua questão de *Direito Empresarial*. Me ajude a entender o cenário para direcionarmos o atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual é a principal necessidade?',
        opcoes: [
          { label: '📝 Elaboração ou revisão de contrato', valor: 'Contratos empresariais' },
          { label: '🏢 Abertura de empresa (constituição societária)', valor: 'Abertura de empresa' },
          { label: '🔄 Alteração contratual / societária', valor: 'Alteração contratual / societária' },
          { label: '⚠️ Recuperação judicial / extrajudicial', valor: 'Recuperação judicial / extrajudicial' },
          { label: '❌ Encerramento / dissolução de empresa', valor: 'Encerramento / dissolução' },
          { label: '🤝 Disputa entre sócios', valor: 'Conflitos societários' },
          { label: '📊 Compliance e governança corporativa', valor: 'Compliance e governança' },
          { label: '🔒 LGPD / proteção de dados', valor: 'LGPD / proteção de dados' },
          { label: '📋 Cobranças / execução de títulos', valor: 'Cobranças / execução de títulos' },
          { label: '⚖️ Ação judicial contra ou da empresa', valor: 'Ação judicial empresarial' },
          { label: '📋 Outro assunto empresarial', valor: 'Outro assunto empresarial' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'porte',
        texto: 'Qual o porte da empresa?',
        opcoes: [
          { label: '🏪 MEI (Microempreendedor Individual)', valor: 'MEI' },
          { label: '🏬 ME (Microempresa)', valor: 'ME — Microempresa' },
          { label: '🏢 EPP (Empresa de Pequeno Porte)', valor: 'EPP' },
          { label: '🏗️ Média ou Grande Empresa', valor: 'Média/Grande empresa' },
          { label: '🆕 Ainda não tenho empresa', valor: 'Empresa ainda não constituída' },
        ],
        campoArray: true,
      },
      {
        id: 'funcionarios',
        texto: 'A empresa possui funcionários registrados?',
        opcoes: [
          { label: '👤 Não, sou só eu', valor: 'Sem funcionários' },
          { label: '👥 1 a 5 funcionários', valor: '1 a 5 funcionários' },
          { label: '👥👥 6 a 20 funcionários', valor: '6 a 20 funcionários' },
          { label: '🏢 Mais de 20 funcionários', valor: 'Mais de 20 funcionários' },
          { label: '❓ Não se aplica', valor: 'Não se aplica' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente sua necessidade ou situação empresarial:',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // ADMINISTRATIVO
  // ============================================================
  administrativo: {
    saudacao:
      'Entendido! Vamos conversar sobre *Direito Administrativo*. Me conte mais sobre sua demanda para direcionarmos o atendimento adequado.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual tema se aplica ao seu caso?',
        opcoes: [
          { label: '📋 Licitações e contratos públicos', valor: 'Licitações e contratos públicos' },
          { label: '👨‍💼 Concurso público (nomeação, recurso)', valor: 'Concurso público' },
          { label: '⚖️ Processo administrativo disciplinar (PAD)', valor: 'Processo administrativo disciplinar' },
          { label: '🏛️ Ação contra órgão público', valor: 'Ação contra a Administração Pública' },
          { label: '📑 Mandado de segurança', valor: 'Mandado de segurança' },
          { label: '💼 Servidor público (direitos e vantagens)', valor: 'Direitos do servidor público' },
          { label: '🏗️ Desapropriação', valor: 'Desapropriação' },
          { label: '🔒 Improbidade administrativa', valor: 'Improbidade administrativa' },
          { label: '📋 Outro assunto administrativo', valor: 'Outro assunto administrativo' },
        ],
        campo: 'subarea',
      },
      {
        id: 'urgencia',
        texto: 'Existe prazo correndo (recurso, defesa, impugnação)?',
        opcoes: [
          { label: '🔴 Sim, prazo urgente (menos de 5 dias)', valor: 'URGENTE' },
          { label: '🟡 Sim, mas ainda tenho alguns dias/semanas', valor: 'MODERADO' },
          { label: '🟢 Não tenho prazo imediato', valor: 'CONSULTA' },
          { label: '❓ Não sei informar sobre prazos', valor: 'CONSULTA' },
        ],
        campo: 'urgencia',
      },
      {
        id: 'esfera',
        texto: 'Em qual esfera da Administração Pública está o caso?',
        opcoes: [
          { label: '🏛️ Federal', valor: 'Esfera Federal' },
          { label: '🏢 Estadual', valor: 'Esfera Estadual' },
          { label: '🏠 Municipal', valor: 'Esfera Municipal' },
          { label: '❓ Não tenho certeza', valor: 'Esfera não identificada' },
        ],
        campoArray: true,
      },
      {
        id: 'posicao',
        texto: 'Qual a sua posição na situação?',
        opcoes: [
          { label: '👨‍💼 Sou servidor público', valor: 'Servidor público' },
          { label: '🏢 Sou empresário / licitante', valor: 'Empresário / licitante' },
          { label: '👤 Sou cidadão afetado', valor: 'Cidadão afetado' },
          { label: '📋 Outro', valor: 'Outra posição' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente a situação:',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // CÁLCULOS JUDICIAIS
  // ============================================================
  calculos: {
    saudacao:
      'Entendi! Vamos falar sobre *Cálculos Judiciais*. Esse serviço é essencial para garantir que seus direitos sejam corretamente quantificados.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Que tipo de cálculo você precisa?',
        opcoes: [
          { label: '💰 Cálculos trabalhistas (rescisão, horas extras, etc.)', valor: 'Cálculos trabalhistas' },
          { label: '📊 Liquidação de sentença', valor: 'Liquidação de sentença' },
          { label: '🔄 Atualização monetária de valores', valor: 'Atualização monetária de valores' },
          { label: '📈 Cálculos previdenciários', valor: 'Cálculos previdenciários' },
          { label: '🏠 Cálculos imobiliários / locatícios', valor: 'Cálculos imobiliários / locatícios' },
          { label: '📋 Conferência / impugnação de cálculos', valor: 'Conferência / impugnação de cálculos' },
          { label: '📋 Outro tipo de cálculo', valor: 'Outro tipo de cálculo judicial' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'processo',
        texto: 'Já existe processo judicial em andamento?',
        opcoes: [
          { label: '✅ Sim, com número de processo', valor: 'Processo judicial em andamento' },
          { label: '📋 Não, é para ajuizar ação futura', valor: 'Cálculo para ação futura' },
          { label: '🔍 É para conferência / impugnação', valor: 'Conferência / impugnação de cálculos' },
          { label: '📊 É para negociação extrajudicial', valor: 'Para negociação extrajudicial' },
        ],
        campoArray: true,
      },
      {
        id: 'periodo',
        texto: 'Qual o período que precisa ser calculado?',
        opcoes: [
          { label: '📅 Até 1 ano', valor: 'Período de até 1 ano' },
          { label: '📅 De 1 a 5 anos', valor: 'Período de 1 a 5 anos' },
          { label: '📅 Mais de 5 anos', valor: 'Período superior a 5 anos' },
          { label: '❓ Não sei precisar', valor: 'Período não identificado' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente o que precisa ser calculado:',
        livre: true,
        campoArray: true,
      },
    ],
  },
};

// ============================================================
// ÁREAS DO MENU INICIAL
// ============================================================
const AREAS: Opcao[] = [
  { label: '⚖️ Direito Trabalhista', valor: 'trabalhista' },
  { label: '🔒 Direito Criminal', valor: 'criminal' },
  { label: '📜 Direito Civil', valor: 'civil' },
  { label: '🏢 Direito Empresarial', valor: 'empresarial' },
  { label: '🏛️ Direito Administrativo', valor: 'administrativo' },
  { label: '📊 Cálculos Judiciais', valor: 'calculos' },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '5518996101884';

// ============================================================
// HELPERS DE URGÊNCIA
// ============================================================
const getUrgenciaMarcador = (nivel: string) => {
  switch (nivel) {
    case 'URGENTE':
      return '[!!!]';
    case 'MODERADO':
      return '[!!]';
    case 'CONSULTA':
      return '[!]';
    default:
      return '[-]';
  }
};

const getUrgenciaTexto = (nivel: string) => {
  switch (nivel) {
    case 'URGENTE':
      return 'URGENTE — Atendimento imediato';
    case 'MODERADO':
      return 'MODERADO — Resolver em breve';
    case 'CONSULTA':
      return 'CONSULTA — Orientação';
    default:
      return 'Não informado';
  }
};

const getUrgenciaCor = (nivel: string) => {
  switch (nivel) {
    case 'URGENTE':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'MODERADO':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'CONSULTA':
      return 'text-green-700 bg-green-50 border-green-200';
    default:
      return 'text-secondary-600 bg-secondary-50 border-secondary-200';
  }
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputTexto, setInputTexto] = useState('');
  const [etapa, setEtapa] = useState<'inicio' | 'fluxo' | 'nome' | 'telefone' | 'resumo'>('inicio');
  const [areaAtual, setAreaAtual] = useState('');
  const [perguntaIdx, setPerguntaIdx] = useState(0);
  const [dados, setDados] = useState<DadosTriagem>({
    area: '',
    subarea: '',
    urgencia: '',
    detalhes: [],
    nome: '',
    telefone: '',
  });
  const [digitando, setDigitando] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  const nextId = () => ++idCounter.current;

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens, digitando]);

  // Focus input
  useEffect(() => {
    if (aberto && inputRef.current) {
      inputRef.current.focus();
    }
  }, [aberto, etapa, mensagens]);

  // Mensagem inicial
  const iniciar = useCallback(() => {
    idCounter.current = 0;
    setMensagens([]);
    setEtapa('inicio');
    setAreaAtual('');
    setPerguntaIdx(0);
    setDados({ area: '', subarea: '', urgencia: '', detalhes: [], nome: '', telefone: '' });

    setTimeout(() => {
      setDigitando(true);
      setTimeout(() => {
        setDigitando(false);
        setMensagens([
          {
            id: nextId(),
            tipo: 'bot',
            texto:
              'Olá! 👋 Sou o assistente virtual do escritório *Cerbelera & Oliveira Advogados*.\n\nEstou aqui para entender sua situação e direcionar seu atendimento. Em qual área do Direito posso ajudá-lo(a)?',
            opcoes: AREAS,
            timestamp: new Date(),
          },
        ]);
      }, 800);
    }, 300);
  }, []);

  useEffect(() => {
    if (aberto && mensagens.length === 0) {
      iniciar();
    }
  }, [aberto, mensagens.length, iniciar]);

  // Adicionar mensagem do bot com delay de digitação
  const addBotMsg = (texto: string, opcoes?: Opcao[]) => {
    setDigitando(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setDigitando(false);
        setMensagens((prev) => [
          ...prev,
          { id: nextId(), tipo: 'bot', texto, opcoes, timestamp: new Date() },
        ]);
        resolve();
      }, 600 + Math.random() * 400);
    });
  };

  const addUserMsg = (texto: string) => {
    setMensagens((prev) => [
      ...prev,
      { id: nextId(), tipo: 'user', texto, timestamp: new Date() },
    ]);
  };

  // ============================================================
  // HANDLERS
  // ============================================================

  // Selecionar área
  const selecionarArea = async (valor: string) => {
    const areaLabel = AREAS.find((a) => a.valor === valor)?.label || valor;
    addUserMsg(areaLabel);

    const fluxo = FLUXOS[valor];
    if (!fluxo) return;

    setAreaAtual(valor);
    setDados((prev) => ({ ...prev, area: areaLabel.replace(/^[^\s]+\s/, '') }));
    setPerguntaIdx(0);
    setEtapa('fluxo');

    await addBotMsg(fluxo.saudacao);
    const primeiraPergunta = fluxo.perguntas[0];
    await addBotMsg(primeiraPergunta.texto, primeiraPergunta.opcoes);
  };

  // Responder pergunta do fluxo
  const responderPergunta = async (resposta: string, label?: string) => {
    addUserMsg(label || resposta);

    const fluxo = FLUXOS[areaAtual];
    if (!fluxo) return;

    const perguntaAtual = fluxo.perguntas[perguntaIdx];

    // Gravar dados
    if (perguntaAtual.campo) {
      setDados((prev) => ({ ...prev, [perguntaAtual.campo!]: resposta }));
    }
    if (perguntaAtual.campoArray) {
      setDados((prev) => ({
        ...prev,
        detalhes: [...prev.detalhes, `${perguntaAtual.texto}\n→ ${resposta}`],
      }));
    }

    const nextIdx = perguntaIdx + 1;

    if (nextIdx < fluxo.perguntas.length) {
      // Próxima pergunta
      setPerguntaIdx(nextIdx);
      const prox = fluxo.perguntas[nextIdx];
      await addBotMsg(prox.texto, prox.opcoes);
    } else {
      // Fim do fluxo → pedir nome
      setEtapa('nome');
      await addBotMsg(
        'Obrigado pelas informações! Para finalizar, qual o seu *nome completo*?'
      );
    }
  };

  // Coletar nome
  const enviarNome = async (nome: string) => {
    addUserMsg(nome);
    setDados((prev) => ({ ...prev, nome }));
    setEtapa('telefone');
    await addBotMsg(
      `Prazer, ${nome.split(' ')[0]}! Agora me informe seu *telefone* para contato:`
    );
  };

  // Coletar telefone → gerar resumo
  const enviarTelefone = async (telefone: string) => {
    addUserMsg(telefone);
    setDados((prev) => ({ ...prev, telefone }));
    setEtapa('resumo');

    await addBotMsg(
      'Perfeito! Preparei o resumo da sua consulta. Ao clicar no botão abaixo, voce sera redirecionado(a) ao *WhatsApp* com a mensagem pronta — basta enviar.'
    );

    // Mensagem especial de resumo com botão
    setDigitando(true);
    setTimeout(() => {
      setDigitando(false);
      setMensagens((prev) => [
        ...prev,
        {
          id: nextId(),
          tipo: 'bot',
          texto: '__RESUMO__',
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  // ============================================================
  // GERAR MENSAGEM WHATSAPP — FORMATAÇÃO PROFISSIONAL
  // ============================================================
  const gerarMensagemWhatsApp = () => {
    const d = dados;
    const urgMarcador = getUrgenciaMarcador(d.urgencia);
    const urgTexto = getUrgenciaTexto(d.urgencia);
    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Formatar detalhes como lista limpa
    const detalhesFormatados = d.detalhes
      .map((item, idx) => {
        const parts = item.split('\n→ ');
        if (parts.length === 2) {
          return `${idx + 1}. _${parts[0]}_\n   > *${parts[1]}*`;
        }
        return `${idx + 1}. ${item}`;
      })
      .join('\n\n');

    const linha = '________________________________';

    return `${urgMarcador} *${urgTexto.toUpperCase()}*
${linha}

*NOVA CONSULTA — Cerbelera & Oliveira*
${linha}

*Area:* ${d.area}
*Assunto:* ${d.subarea}
*Urgencia:* ${urgMarcador} ${urgTexto}
${linha}

*DETALHES DA TRIAGEM*
${linha}

${detalhesFormatados}
${linha}

*DADOS DO CLIENTE*
${linha}

*Nome:* ${d.nome}
*Telefone:* ${d.telefone}
${linha}

*Data/Hora:* ${dataHora}
_Enviado via Assistente Virtual do site_`.trim();
  };

  const abrirWhatsApp = () => {
    const msg = encodeURIComponent(gerarMensagemWhatsApp());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  // Submit input de texto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = inputTexto.trim();
    if (!texto) return;
    setInputTexto('');

    if (etapa === 'nome') {
      enviarNome(texto);
    } else if (etapa === 'telefone') {
      enviarTelefone(texto);
    } else if (etapa === 'fluxo') {
      const fluxo = FLUXOS[areaAtual];
      const pAtual = fluxo?.perguntas[perguntaIdx];
      if (pAtual?.livre) {
        responderPergunta(texto);
      }
    }
  };

  // ============================================================
  // VERIFICAÇÃO: campo de texto ativo?
  // ============================================================
  const inputAtivo =
    etapa === 'nome' ||
    etapa === 'telefone' ||
    (etapa === 'fluxo' &&
      FLUXOS[areaAtual]?.perguntas[perguntaIdx]?.livre === true);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* Botão Flutuante do Chatbot — acima do WhatsApp */}
      <AnimatePresence>
        {!aberto && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
            onClick={() => setAberto(true)}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-gold-500/40 transition-shadow group"
            aria-label="Abrir assistente virtual"
            title="Assistente Virtual"
          >
            <Scale className="w-7 h-7 text-white" />

            {/* Pulse */}
            <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-20" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 bg-white text-secondary-700 text-sm px-4 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Assistente Virtual
            </span>

            {/* Badge de notificação */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Painel do Chat */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-secondary-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0e1810] via-[#1a2e1f] to-[#0e1810] px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                <Scale className="w-5 h-5 text-gold-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">
                  Cerbelera & Oliveira
                </h3>
                <p className="text-primary-300 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Assistente online
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={iniciar}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-primary-300 hover:text-white"
                  title="Reiniciar conversa"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAberto(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-primary-300 hover:text-white"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Linha dourada */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent flex-shrink-0" />

            {/* Corpo do chat */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-secondary-50 to-white"
            >
              {mensagens.map((msg) => (
                <div key={msg.id}>
                  {/* Mensagem especial: RESUMO */}
                  {msg.texto === '__RESUMO__' ? (
                    <div className="bg-gradient-to-br from-primary-50 to-gold-50 border border-gold-200 rounded-xl p-4 space-y-3">
                      <p className="font-semibold text-sm text-secondary-800 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-gold-600" />
                        Resumo da Consulta
                      </p>

                      {/* Badge de urgência */}
                      {dados.urgencia && (
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getUrgenciaCor(dados.urgencia)}`}
                        >
                          {dados.urgencia === 'URGENTE' && <AlertTriangle className="w-3 h-3" />}
                          {dados.urgencia === 'MODERADO' && <Clock className="w-3 h-3" />}
                          {dados.urgencia === 'CONSULTA' && <CheckCircle className="w-3 h-3" />}
                          {getUrgenciaMarcador(dados.urgencia)} {getUrgenciaTexto(dados.urgencia)}
                        </div>
                      )}

                      <div className="text-xs text-secondary-600 space-y-1">
                        <p>
                          <strong>Área:</strong> {dados.area}
                        </p>
                        <p>
                          <strong>Assunto:</strong> {dados.subarea}
                        </p>
                        <p>
                          <strong>Cliente:</strong> {dados.nome}
                        </p>
                        <p>
                          <strong>Telefone:</strong> {dados.telefone}
                        </p>
                      </div>
                      <button
                        onClick={abrirWhatsApp}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Enviar para o Advogado
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[10px] text-secondary-400 text-center flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Ao clicar, você será redirecionado ao WhatsApp
                      </p>
                    </div>
                  ) : msg.tipo === 'bot' ? (
                    /* Mensagem do bot */
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a2e1f] to-[#2d4a35] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-gold-400" />
                      </div>
                      <div className="max-w-[85%] space-y-2">
                        <div className="bg-white border border-secondary-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
                          <p
                            className="text-sm text-secondary-700 leading-relaxed whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                              __html: msg.texto
                                .replace(
                                  /\*([^*]+)\*/g,
                                  '<strong class="text-secondary-800">$1</strong>'
                                ),
                            }}
                          />
                        </div>

                        {/* Opções */}
                        {msg.opcoes && msg.id === mensagens[mensagens.length - 1]?.id && (
                          <div className="space-y-1.5">
                            {msg.opcoes.map((op) => (
                              <button
                                key={op.valor}
                                onClick={() => {
                                  if (etapa === 'inicio') {
                                    selecionarArea(op.valor);
                                  } else {
                                    responderPergunta(op.valor, op.label);
                                  }
                                }}
                                className="block w-full text-left text-sm px-3 py-2 rounded-xl bg-gold-50 hover:bg-gold-100 border border-gold-200 hover:border-gold-300 text-secondary-700 transition-all hover:shadow-sm"
                              >
                                {op.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Mensagem do usuário */
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-gradient-to-br from-[#1a2e1f] to-[#2d4a35] text-white px-3.5 py-2.5 rounded-2xl rounded-tr-sm shadow-sm">
                        <p className="text-sm leading-relaxed">{msg.texto}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Indicador de digitação */}
              {digitando && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a2e1f] to-[#2d4a35] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                  <div className="bg-white border border-secondary-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-secondary-300 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-secondary-300 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-secondary-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-secondary-100 p-3 flex-shrink-0 bg-white">
              {etapa === 'resumo' ? (
                <div className="flex gap-2">
                  <button
                    onClick={abrirWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar via WhatsApp
                  </button>
                  <button
                    onClick={iniciar}
                    className="px-3 py-2.5 rounded-xl border border-secondary-200 hover:bg-secondary-50 text-secondary-600 text-sm transition-colors"
                    title="Nova consulta"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputTexto}
                    onChange={(e) => setInputTexto(e.target.value)}
                    placeholder={
                      inputAtivo
                        ? etapa === 'nome'
                          ? 'Digite seu nome completo...'
                          : etapa === 'telefone'
                          ? '(18) 99999-9999'
                          : 'Digite sua resposta...'
                        : 'Selecione uma opção acima'
                    }
                    disabled={!inputAtivo}
                    className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-secondary-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none disabled:bg-secondary-50 disabled:text-secondary-400 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputAtivo || !inputTexto.trim()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 text-white disabled:opacity-40 transition-opacity hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Rodapé legal */}
            <div className="px-3 pb-2 flex-shrink-0 bg-white">
              <p className="text-[9px] text-secondary-400 text-center leading-tight">
                Assistente informativo. Não constitui aconselhamento jurídico nem
                estabelece relação advogado-cliente. Provimento 205/2021 OAB.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
