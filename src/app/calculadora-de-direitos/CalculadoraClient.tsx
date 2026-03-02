'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Scale,
  Phone,
  Mail,
  User,
  HardHat,
  Zap,
  Flame,
  Droplets,
  Volume2,
  Radiation,
  ThermometerSun,
  ShieldAlert,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

// ============================================================
// TIPOS E DADOS
// ============================================================
type Step = 'setor' | 'condicoes' | 'epi' | 'tempo' | 'dados' | 'resultado';

interface FormData {
  setor: string;
  condicoes: string[];
  epiForecido: string;
  epiAdequado: string;
  tempoExposicao: string;
  tempoTrabalho: string;
  nome: string;
  telefone: string;
  email: string;
}

interface Resultado {
  temDireito: boolean;
  tipo: 'insalubridade' | 'periculosidade' | 'ambos' | 'nenhum';
  grau?: 'minimo' | 'medio' | 'maximo';
  percentual?: string;
  detalhes: string[];
  recomendacao: string;
}

const SETORES = [
  { label: '🏗️ Construção Civil', value: 'construcao', icon: HardHat },
  { label: '🏭 Indústria / Fábrica', value: 'industria', icon: HardHat },
  { label: '🏥 Saúde / Hospitalar', value: 'saude', icon: Shield },
  { label: '⚡ Elétrica / Energia', value: 'eletrica', icon: Zap },
  { label: '🧪 Química / Laboratório', value: 'quimica', icon: Droplets },
  { label: '⛏️ Mineração / Petróleo', value: 'mineracao', icon: HardHat },
  { label: '🔥 Segurança / Bombeiro', value: 'seguranca', icon: Flame },
  { label: '🚛 Transporte / Logística', value: 'transporte', icon: HardHat },
  { label: '🌾 Agricultura / Rural', value: 'agricultura', icon: ThermometerSun },
  { label: '🔧 Manutenção / Limpeza', value: 'manutencao', icon: HardHat },
  { label: '📋 Outro setor', value: 'outro', icon: Scale },
];

const CONDICOES = [
  { label: 'Ruído excessivo / barulho intenso', value: 'ruido', icon: Volume2, tipo: 'insalubridade' },
  { label: 'Calor intenso / temperatura elevada', value: 'calor', icon: ThermometerSun, tipo: 'insalubridade' },
  { label: 'Produtos químicos / poeira / fumaça', value: 'quimico', icon: Droplets, tipo: 'insalubridade' },
  { label: 'Agentes biológicos (vírus, bactérias)', value: 'biologico', icon: Shield, tipo: 'insalubridade' },
  { label: 'Radiação (ionizante ou não)', value: 'radiacao', icon: Radiation, tipo: 'insalubridade' },
  { label: 'Umidade / frio excessivo', value: 'umidade', icon: Droplets, tipo: 'insalubridade' },
  { label: 'Eletricidade / alta tensão', value: 'eletricidade', icon: Zap, tipo: 'periculosidade' },
  { label: 'Explosivos / inflamáveis', value: 'explosivos', icon: Flame, tipo: 'periculosidade' },
  { label: 'Segurança pessoal / patrimonial', value: 'seguranca_p', icon: ShieldAlert, tipo: 'periculosidade' },
  { label: 'Motocicleta no trabalho', value: 'moto', icon: ShieldAlert, tipo: 'periculosidade' },
  { label: 'Nenhuma condição acima', value: 'nenhuma', icon: CheckCircle2, tipo: 'nenhum' },
];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function CalculadoraClient() {
  const [step, setStep] = useState<Step>('setor');
  const [formData, setFormData] = useState<FormData>({
    setor: '',
    condicoes: [],
    epiForecido: '',
    epiAdequado: '',
    tempoExposicao: '',
    tempoTrabalho: '',
    nome: '',
    telefone: '',
    email: '',
  });
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [enviando, setEnviando] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Calcular resultado
  const calcularResultado = (): Resultado => {
    const condicoesInsalubres = formData.condicoes.filter(
      (c) => CONDICOES.find((x) => x.value === c)?.tipo === 'insalubridade'
    );
    const condicoesPerigosas = formData.condicoes.filter(
      (c) => CONDICOES.find((x) => x.value === c)?.tipo === 'periculosidade'
    );

    const temInsalubridade = condicoesInsalubres.length > 0;
    const temPericulosidade = condicoesPerigosas.length > 0;
    const semCondicoes = formData.condicoes.includes('nenhuma') || (!temInsalubridade && !temPericulosidade);

    if (semCondicoes) {
      return {
        temDireito: false,
        tipo: 'nenhum',
        detalhes: [
          'Com base nas informações fornecidas, não foram identificadas condições que caracterizem insalubridade ou periculosidade.',
          'Porém, cada caso possui particularidades que precisam ser analisadas por um especialista.',
        ],
        recomendacao: 'Recomendamos uma consulta com nosso especialista para uma análise detalhada do seu caso.',
      };
    }

    const detalhes: string[] = [];
    let grau: 'minimo' | 'medio' | 'maximo' = 'medio';
    let tipo: 'insalubridade' | 'periculosidade' | 'ambos' = 'insalubridade';

    if (temInsalubridade && temPericulosidade) {
      tipo = 'ambos';
      detalhes.push('Foram identificadas condições tanto de insalubridade quanto de periculosidade no seu ambiente de trabalho.');
      detalhes.push('Importante: pela CLT, o trabalhador deve optar pelo adicional mais vantajoso — não é possível acumular os dois.');
    } else if (temPericulosidade) {
      tipo = 'periculosidade';
      detalhes.push('Foram identificadas condições de periculosidade no seu ambiente de trabalho.');
      detalhes.push('O adicional de periculosidade é de 30% sobre o salário-base (Art. 193, CLT).');
    } else {
      tipo = 'insalubridade';
    }

    // Determinar grau da insalubridade
    if (temInsalubridade) {
      if (condicoesInsalubres.includes('radiacao') || condicoesInsalubres.includes('biologico')) {
        grau = 'maximo';
        detalhes.push('Grau máximo de insalubridade identificado (40% do salário mínimo) — NR-15.');
      } else if (condicoesInsalubres.includes('quimico') || condicoesInsalubres.includes('calor')) {
        grau = 'medio';
        detalhes.push('Grau médio de insalubridade identificado (20% do salário mínimo) — NR-15.');
      } else {
        grau = 'minimo';
        detalhes.push('Grau mínimo de insalubridade identificado (10% do salário mínimo) — NR-15.');
      }
    }

    // EPI
    if (formData.epiForecido === 'nao') {
      detalhes.push('⚠️ A não fornecimento de EPI pelo empregador reforça o direito ao adicional.');
    } else if (formData.epiAdequado === 'nao') {
      detalhes.push('⚠️ EPI inadequado ou em mau estado não elimina a condição insalubre/perigosa.');
    }

    // Tempo
    if (formData.tempoTrabalho === 'mais2') {
      detalhes.push('⚠️ Atenção: o prazo prescricional para reclamação trabalhista é de 2 anos após o desligamento. É importante agir rapidamente.');
    }

    const percentuais: Record<string, string> = {
      minimo: '10% do salário mínimo',
      medio: '20% do salário mínimo',
      maximo: '40% do salário mínimo',
    };

    return {
      temDireito: true,
      tipo,
      grau: temInsalubridade ? grau : undefined,
      percentual: temPericulosidade
        ? '30% do salário-base'
        : percentuais[grau],
      detalhes,
      recomendacao:
        'Para confirmar seu direito e calcular valores precisos, agende uma consulta gratuita com o Me. Diogo Cerbelera, Mestre em Direito Trabalhista.',
    };
  };

  // Enviar lead para a API
  const enviarLead = async () => {
    setEnviando(true);
    try {
      await fetch('/api/triagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          telefone: formData.telefone,
          area: 'Direito Trabalhista',
          subarea: `Calculadora: ${formData.condicoes.map(c => CONDICOES.find(x => x.value === c)?.label).filter(Boolean).join(', ')}`,
          urgencia: 'media',
          detalhes: JSON.stringify({
            setor: formData.setor,
            condicoes: formData.condicoes,
            epiForecido: formData.epiForecido,
            epiAdequado: formData.epiAdequado,
            tempoExposicao: formData.tempoExposicao,
            tempoTrabalho: formData.tempoTrabalho,
            email: formData.email,
            origem: 'calculadora-de-direitos',
          }),
        }),
      });
    } catch {
      // Silencioso
    }

    const res = calcularResultado();
    setResultado(res);
    setStep('resultado');
    setEnviando(false);
    scrollToTop();
  };

  const handleNext = () => {
    scrollToTop();
    const steps: Step[] = ['setor', 'condicoes', 'epi', 'tempo', 'dados', 'resultado'];
    const currentIdx = steps.indexOf(step);
    if (step === 'dados') {
      enviarLead();
      return;
    }
    if (currentIdx < steps.length - 1) {
      setStep(steps[currentIdx + 1]);
    }
  };

  const handleBack = () => {
    scrollToTop();
    const steps: Step[] = ['setor', 'condicoes', 'epi', 'tempo', 'dados'];
    const currentIdx = steps.indexOf(step);
    if (currentIdx > 0) {
      setStep(steps[currentIdx - 1]);
    }
  };

  const toggleCondicao = (value: string) => {
    if (value === 'nenhuma') {
      setFormData((prev) => ({ ...prev, condicoes: ['nenhuma'] }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      condicoes: prev.condicoes.includes(value)
        ? prev.condicoes.filter((c) => c !== value)
        : [...prev.condicoes.filter((c) => c !== 'nenhuma'), value],
    }));
  };

  // Validação de cada step
  const canProceed = () => {
    switch (step) {
      case 'setor': return formData.setor !== '';
      case 'condicoes': return formData.condicoes.length > 0;
      case 'epi': return formData.epiForecido !== '';
      case 'tempo': return formData.tempoExposicao !== '' && formData.tempoTrabalho !== '';
      case 'dados': return formData.nome.trim() !== '' && formData.telefone.trim() !== '';
      default: return false;
    }
  };

  const stepNumber = ['setor', 'condicoes', 'epi', 'tempo', 'dados'].indexOf(step) + 1;
  const totalSteps = 5;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* Hero */}
      <section
        ref={topRef}
        className="pt-32 pb-16 bg-gradient-to-br from-[#050905] via-[#0e1810] to-[#1a2e1f] relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              Ferramenta Gratuita
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              Calculadora de{' '}
              <span className="text-gold-400">Direitos Trabalhistas</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl mb-2">
              Descubra se você tem direito a adicional de{' '}
              <strong className="text-white">insalubridade</strong> ou{' '}
              <strong className="text-white">periculosidade</strong>.
              Responda algumas perguntas e receba uma análise prévia gratuita.
            </p>
            <p className="text-primary-400 text-sm">
              Ferramenta informativa • Análise por Me. Diogo Cerbelera, Mestre em Direito •{' '}
              <Link href="/sobre" className="text-gold-400 hover:text-gold-300 underline">
                Cerbelera & Oliveira Advogados
              </Link>{' '}
              — Presidente Prudente/SP
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Calculadora */}
      <section className="py-12 bg-secondary-50 min-h-[60vh]">
        <div className="container-custom max-w-2xl">
          {/* Progress bar */}
          {step !== 'resultado' && (
            <div className="mb-8">
              <div className="flex justify-between text-xs text-secondary-500 mb-2">
                <span>Etapa {stepNumber} de {totalSteps}</span>
                <span>{Math.round((stepNumber / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-gold-500 to-gold-400 h-2 rounded-full"
                  animate={{ width: `${(stepNumber / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Setor ── */}
            {step === 'setor' && (
              <motion.div
                key="setor"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100"
              >
                <h2 className="text-xl font-serif font-bold text-primary-500 mb-2">
                  Em qual setor você trabalha (ou trabalhava)?
                </h2>
                <p className="text-secondary-500 text-sm mb-6">
                  Selecione o setor que mais se aproxima da sua atividade profissional.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SETORES.map((setor) => {
                    const Icon = setor.icon;
                    return (
                      <button
                        key={setor.value}
                        onClick={() => setFormData((p) => ({ ...p, setor: setor.value }))}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                          formData.setor === setor.value
                            ? 'border-gold-500 bg-gold-50 shadow-sm'
                            : 'border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${formData.setor === setor.value ? 'text-gold-600' : 'text-secondary-400'}`} />
                        <span className={`text-sm font-medium ${formData.setor === setor.value ? 'text-gold-700' : 'text-secondary-700'}`}>
                          {setor.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Condições ── */}
            {step === 'condicoes' && (
              <motion.div
                key="condicoes"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100"
              >
                <h2 className="text-xl font-serif font-bold text-primary-500 mb-2">
                  Quais condições você enfrenta no trabalho?
                </h2>
                <p className="text-secondary-500 text-sm mb-6">
                  Selecione todas as condições que se aplicam ao seu caso.
                </p>

                <div className="space-y-3">
                  {CONDICOES.map((cond) => {
                    const Icon = cond.icon;
                    const selected = formData.condicoes.includes(cond.value);
                    return (
                      <button
                        key={cond.value}
                        onClick={() => toggleCondicao(cond.value)}
                        className={`flex items-center gap-3 w-full p-4 rounded-xl border-2 text-left transition-all ${
                          selected
                            ? cond.tipo === 'periculosidade'
                              ? 'border-red-400 bg-red-50'
                              : cond.tipo === 'insalubridade'
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-green-400 bg-green-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selected ? 'bg-gold-500 border-gold-500' : 'border-secondary-300'
                        }`}>
                          {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <Icon className={`w-5 h-5 flex-shrink-0 ${selected ? 'text-gold-600' : 'text-secondary-400'}`} />
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${selected ? 'text-secondary-800' : 'text-secondary-700'}`}>
                            {cond.label}
                          </span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            cond.tipo === 'periculosidade'
                              ? 'bg-red-100 text-red-700'
                              : cond.tipo === 'insalubridade'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {cond.tipo === 'nenhum' ? 'N/A' : cond.tipo}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: EPI ── */}
            {step === 'epi' && (
              <motion.div
                key="epi"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100"
              >
                <h2 className="text-xl font-serif font-bold text-primary-500 mb-2">
                  Equipamento de Proteção Individual (EPI)
                </h2>
                <p className="text-secondary-500 text-sm mb-6">
                  O fornecimento e uso correto de EPI pode influenciar no seu direito ao adicional.
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-secondary-700 mb-3">
                      A empresa fornece EPI adequado?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Sim, fornece', value: 'sim' },
                        { label: 'Não fornece', value: 'nao' },
                        { label: 'Às vezes / parcial', value: 'parcial' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData((p) => ({ ...p, epiForecido: opt.value }))}
                          className={`p-4 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                            formData.epiForecido === opt.value
                              ? 'border-gold-500 bg-gold-50 text-gold-700'
                              : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.epiForecido === 'sim' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <p className="font-medium text-secondary-700 mb-3">
                        O EPI está em bom estado e é adequado à atividade?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: 'Sim, adequado', value: 'sim' },
                          { label: 'Não, inadequado', value: 'nao' },
                          { label: 'Não sei dizer', value: 'nao_sei' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFormData((p) => ({ ...p, epiAdequado: opt.value }))}
                            className={`p-4 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                              formData.epiAdequado === opt.value
                                ? 'border-gold-500 bg-gold-50 text-gold-700'
                                : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Tempo ── */}
            {step === 'tempo' && (
              <motion.div
                key="tempo"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100"
              >
                <h2 className="text-xl font-serif font-bold text-primary-500 mb-2">
                  Tempo de Exposição e Vínculo
                </h2>
                <p className="text-secondary-500 text-sm mb-6">
                  Essas informações ajudam a avaliar o período e urgência do seu caso.
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-secondary-700 mb-3">
                      Qual o tempo de exposição diária às condições?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Jornada inteira (8h+)', value: 'integral' },
                        { label: 'Parte da jornada (4-8h)', value: 'parcial' },
                        { label: 'Ocasional (menos de 4h)', value: 'ocasional' },
                        { label: 'Intermitente / esporádico', value: 'intermitente' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData((p) => ({ ...p, tempoExposicao: opt.value }))}
                          className={`p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                            formData.tempoExposicao === opt.value
                              ? 'border-gold-500 bg-gold-50 text-gold-700'
                              : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-secondary-700 mb-3">
                      Você ainda trabalha nessa função ou já saiu?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Ainda trabalho', value: 'ativo' },
                        { label: 'Saí há menos de 2 anos', value: 'menos2' },
                        { label: 'Saí há mais de 2 anos', value: 'mais2' },
                        { label: 'Não sei precisar', value: 'nao_sei' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData((p) => ({ ...p, tempoTrabalho: opt.value }))}
                          className={`p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                            formData.tempoTrabalho === opt.value
                              ? 'border-gold-500 bg-gold-50 text-gold-700'
                              : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: Dados do Lead ── */}
            {step === 'dados' && (
              <motion.div
                key="dados"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100"
              >
                <h2 className="text-xl font-serif font-bold text-primary-500 mb-2">
                  Quase lá! Seus dados para o resultado
                </h2>
                <p className="text-secondary-500 text-sm mb-6">
                  Preencha para receber sua análise personalizada. Seus dados são protegidos pela LGPD.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-1.5">
                      <User className="w-4 h-4" />
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData((p) => ({ ...p, nome: e.target.value }))}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-sm"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-1.5">
                      <Phone className="w-4 h-4" />
                      WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData((p) => ({ ...p, telefone: e.target.value }))}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-sm"
                      placeholder="(18) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-1.5">
                      <Mail className="w-4 h-4" />
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <p className="text-xs text-secondary-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Dados protegidos pela LGPD. Usados exclusivamente para contato jurídico.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── RESULTADO ── */}
            {step === 'resultado' && resultado && (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Card principal do resultado */}
                <div className={`rounded-2xl p-8 border-2 ${
                  resultado.temDireito
                    ? 'bg-gradient-to-br from-green-50 to-gold-50 border-green-300'
                    : 'bg-gradient-to-br from-secondary-50 to-white border-secondary-200'
                }`}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                      resultado.temDireito ? 'bg-green-500' : 'bg-secondary-400'
                    }`}>
                      {resultado.temDireito ? (
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      ) : (
                        <AlertTriangle className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-primary-500 mb-1">
                        {resultado.temDireito
                          ? 'Você Pode Ter Direito!'
                          : 'Análise Preliminar'}
                      </h2>
                      {resultado.temDireito && resultado.tipo !== 'nenhum' && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(resultado.tipo === 'insalubridade' || resultado.tipo === 'ambos') && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                              ⚠️ INSALUBRIDADE{resultado.grau ? ` — Grau ${resultado.grau}` : ''}
                            </span>
                          )}
                          {(resultado.tipo === 'periculosidade' || resultado.tipo === 'ambos') && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800">
                              🔴 PERICULOSIDADE — 30%
                            </span>
                          )}
                        </div>
                      )}
                      {resultado.percentual && (
                        <p className="text-lg font-bold text-gold-600 mt-3">
                          Adicional estimado: {resultado.percentual}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="space-y-3 mb-6">
                    {resultado.detalhes.map((detalhe, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-secondary-700">{detalhe}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recomendação */}
                  <div className="bg-white/80 rounded-xl p-4 border border-gold-200">
                    <p className="text-sm text-secondary-700 font-medium">
                      💡 {resultado.recomendacao}
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100 space-y-4">
                  <h3 className="font-serif font-bold text-primary-500 text-lg">
                    Próximos Passos
                  </h3>

                  <a
                    href={`https://wa.me/5518996101884?text=${encodeURIComponent(
                      `Olá! Fiz a Calculadora de Direitos no site e gostaria de uma consulta. Nome: ${formData.nome}. Resultado: possível ${resultado.tipo}. Setor: ${formData.setor}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Falar com Advogado no WhatsApp
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    href={`/agendamento?tipo=Direito+Trabalhista&nome=${encodeURIComponent(formData.nome)}&telefone=${encodeURIComponent(formData.telefone)}&assunto=${encodeURIComponent(`Calculadora: ${resultado.tipo}`)}`}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg"
                  >
                    <Scale className="w-5 h-5" />
                    Agendar Consulta Online Gratuita
                  </Link>

                  <button
                    onClick={() => {
                      setStep('setor');
                      setResultado(null);
                      setFormData({
                        setor: '', condicoes: [], epiForecido: '', epiAdequado: '',
                        tempoExposicao: '', tempoTrabalho: '', nome: '', telefone: '', email: '',
                      });
                      scrollToTop();
                    }}
                    className="w-full text-center text-sm text-secondary-500 hover:text-secondary-700 py-2 transition-colors"
                  >
                    Refazer a calculadora
                  </button>
                </div>

                {/* Disclaimer legal */}
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                  <p className="text-xs text-secondary-500 leading-relaxed">
                    <strong>Aviso Legal:</strong> Esta ferramenta tem caráter meramente informativo e educativo,
                    não constituindo aconselhamento jurídico. O resultado apresentado é uma análise preliminar
                    baseada nas informações fornecidas. Cada caso possui particularidades que devem ser avaliadas
                    por um advogado. A confirmação do direito depende de perícia técnica e análise documental.
                    Cerbelera & Oliveira Advogados Associados — OAB/SP — Provimento 205/2021.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botões de navegação */}
          {step !== 'resultado' && (
            <div className="flex justify-between mt-6">
              {step !== 'setor' ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed() || enviando}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
              >
                {enviando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Calculando...
                  </>
                ) : step === 'dados' ? (
                  <>
                    Ver Resultado
                    <Calculator className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-serif font-bold text-primary-500 mb-6">
              Advogado Trabalhista em Presidente Prudente — Insalubridade e Periculosidade
            </h2>
            <div className="prose prose-sm max-w-none text-secondary-600 space-y-4">
              <p>
                Se você trabalha ou trabalhou em condições que colocam sua saúde ou vida em risco,
                pode ter direito a <strong>adicional de insalubridade</strong> (10%, 20% ou 40% do
                salário mínimo) ou <strong>adicional de periculosidade</strong> (30% sobre o salário-base).
              </p>
              <p>
                O <strong>escritório Cerbelera & Oliveira</strong>, localizado em <strong>Presidente Prudente/SP</strong>,
                é especializado em <strong>Direito Trabalhista</strong> e oferece análise detalhada do seu caso.
                Liderado pelo <strong>Me. Diogo Ramos Cerbelera Neto</strong>, Mestre em Direito, o escritório
                garante uma atuação técnica e humanizada.
              </p>
              <h3 className="text-lg font-serif font-bold text-primary-500 mt-6">
                O que é insalubridade?
              </h3>
              <p>
                Insalubridade é a exposição do trabalhador a agentes nocivos à saúde acima dos limites
                tolerados, conforme a <strong>NR-15</strong> (Norma Regulamentadora). Exemplos incluem
                ruído excessivo, calor, produtos químicos, agentes biológicos e radiação.
              </p>
              <h3 className="text-lg font-serif font-bold text-primary-500 mt-6">
                O que é periculosidade?
              </h3>
              <p>
                Periculosidade envolve atividades que colocam a vida do trabalhador em risco iminente,
                conforme a <strong>NR-16</strong>. Inclui trabalho com inflamáveis, explosivos,
                energia elétrica de alta tensão, segurança pessoal e uso de motocicleta.
              </p>
              <h3 className="text-lg font-serif font-bold text-primary-500 mt-6">
                Direitos do trabalhador em Presidente Prudente
              </h3>
              <p>
                Se você está em Presidente Prudente ou região e precisa de um <strong>advogado trabalhista</strong>,
                entre em contato. Oferecemos atendimento presencial em nosso escritório na
                R. Francisco Machado de Campos, 393 — Vila Nova, com estacionamento próprio.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
