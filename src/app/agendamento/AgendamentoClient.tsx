'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2, Loader2, MessageCircle, User, Phone, FileText, AlertCircle, Ban, Info } from 'lucide-react';

const TIPOS_CONSULTA = [
  { value: 'trabalhista', label: 'Direito Trabalhista', icon: '⚖️' },
  { value: 'previdenciario', label: 'Direito Previdenciário', icon: '🏛️' },
  { value: 'civil', label: 'Direito Civil', icon: '📜' },
  { value: 'familia', label: 'Direito de Família', icon: '👨‍👩‍👧' },
  { value: 'consumidor', label: 'Direito do Consumidor', icon: '🛒' },
  { value: 'empresarial', label: 'Direito Empresarial', icon: '🏢' },
  { value: 'imobiliario', label: 'Direito Imobiliário', icon: '🏠' },
  { value: 'outro', label: 'Outro Assunto', icon: '📋' },
];

const HORARIOS_DISPONIVEIS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30',
];

interface HorariosData {
  ocupados: Record<string, string[]>;
  diasBloqueados: string[];
  bloqueiosParciais: { data: string; horaInicio: string; horaFim: string; motivo: string }[];
}

// Mapear área do chatbot → tipo do agendamento
const AREA_PARA_TIPO: Record<string, string> = {
  'Direito Trabalhista': 'trabalhista',
  'Direito Previdenciário': 'previdenciario',
  'Direito Civil': 'civil',
  'Direito de Família': 'familia',
  'Direito do Consumidor': 'consumidor',
  'Direito Empresarial': 'empresarial',
  'Direito Imobiliário': 'imobiliario',
  'Direito Criminal': 'outro',
  'Direito Administrativo': 'outro',
};

export default function AgendamentoClient() {
  const searchParams = useSearchParams();

  // Ler dados do ChatBot via URL params
  const paramTipo = searchParams.get('tipo') || searchParams.get('area') || '';
  const paramNome = searchParams.get('nome') || '';
  const paramTelefone = searchParams.get('telefone') || '';
  const paramDescricao = searchParams.get('descricao') || searchParams.get('assunto') || '';

  // Resolver tipo: pode vir como área do chatbot ou como tipo direto
  const resolvedTipo = AREA_PARA_TIPO[paramTipo] || paramTipo || '';

  const [step, setStep] = useState(resolvedTipo ? 2 : 1); // Pular para data se tipo já veio
  const [tipo, setTipo] = useState(resolvedTipo);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [nome, setNome] = useState(paramNome);
  const [telefone, setTelefone] = useState(paramTelefone ? formatPhone(paramTelefone) : '');
  const [descricao, setDescricao] = useState(paramDescricao);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [horariosData, setHorariosData] = useState<HorariosData>({ ocupados: {}, diasBloqueados: [], bloqueiosParciais: [] });
  const [lgpdAceito, setLgpdAceito] = useState(false);

  // Buscar horários via API PÚBLICA (sem dados sensíveis)
  const fetchHorarios = useCallback(async () => {
    try {
      const mes = currentMonth.getMonth() + 1;
      const ano = currentMonth.getFullYear();
      const res = await fetch(`/api/horarios-disponiveis?mes=${mes}&ano=${ano}`);
      if (res.ok) {
        const data: HorariosData = await res.json();
        setHorariosData(data);
      }
    } catch {
      // silently fail
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return false;

    // Verificar bloqueios de dia inteiro
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (horariosData.diasBloqueados.includes(key)) return false;

    return true;
  };

  const isDayBlocked = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return horariosData.diasBloqueados.includes(key);
  };

  const getHorariosDisponiveis = (date: Date) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const ocupadosNoDia = horariosData.ocupados[key] || [];
    const bloqueiosDoDia = horariosData.bloqueiosParciais.filter(b => b.data === key);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return HORARIOS_DISPONIVEIS.filter(h => {
      // Já ocupado
      if (ocupadosNoDia.includes(h)) return false;

      // Bloqueios parciais (ex: manhã bloqueada)
      for (const b of bloqueiosDoDia) {
        if (h >= b.horaInicio && h < b.horaFim) return false;
      }

      // Se é hoje, exigir 1h de antecedência
      if (isToday) {
        const [hh, mm] = h.split(':').map(Number);
        const horaSlot = hh * 60 + mm;
        const horaAgora = now.getHours() * 60 + now.getMinutes() + 60;
        if (horaSlot <= horaAgora) return false;
      }
      return true;
    });
  };

  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const handleSubmit = async () => {
    if (!nome || !telefone || !selectedDate || !selectedHorario || !tipo) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!lgpdAceito) {
      setError('É necessário aceitar a Política de Privacidade para prosseguir.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [hh, mm] = selectedHorario.split(':').map(Number);
      const dataHora = new Date(selectedDate);
      dataHora.setHours(hh, mm, 0, 0);

      const res = await fetch('/api/agendamento-publico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          telefone: telefone.replace(/\D/g, ''),
          tipo,
          descricao,
          dataHora: dataHora.toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao agendar');
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const tipoLabel = TIPOS_CONSULTA.find(t => t.value === tipo)?.label;
    const whatsMsg = `Olá! Acabei de solicitar um agendamento de ${tipoLabel} para ${selectedDate ? formatDate(selectedDate) : ''} às ${selectedHorario}. Meu nome é ${nome}. Aguardo a confirmação.`;

    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-yellow-50 border-2 border-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary-500 mb-3">
          Solicitação Enviada!
        </h2>
        <p className="text-secondary-600 mb-6">
          Seu agendamento está <strong className="text-yellow-600">pendente de confirmação</strong>. 
          Nossa equipe irá analisar e confirmar via WhatsApp.
        </p>

        <div className="bg-secondary-50 rounded-xl p-6 mb-6 text-left space-y-2">
          <p className="text-sm text-secondary-600"><strong>📋 Área:</strong> {tipoLabel}</p>
          <p className="text-sm text-secondary-600"><strong>📅 Data:</strong> {selectedDate && formatDate(selectedDate)}</p>
          <p className="text-sm text-secondary-600"><strong>🕐 Horário:</strong> {selectedHorario}</p>
          <p className="text-sm text-secondary-600"><strong>👤 Nome:</strong> {nome}</p>
          <p className="text-sm text-secondary-600"><strong>📱 Telefone:</strong> {telefone}</p>
          <div className="pt-3 mt-3 border-t border-secondary-200">
            <div className="flex items-center gap-2 text-yellow-600 text-xs font-medium">
              <Info className="w-4 h-4" />
              Aguardando aprovação do escritório
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`https://wa.me/5518996101884?text=${encodeURIComponent(whatsMsg)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors">
            <MessageCircle className="w-5 h-5" />
            Confirmar via WhatsApp
          </a>
          <button onClick={() => { setSuccess(false); setStep(1); setTipo(''); setSelectedDate(null); setSelectedHorario(''); setNome(''); setTelefone(''); setDescricao(''); setLgpdAceito(false); }}
            className="px-6 py-3 border border-secondary-200 text-secondary-600 rounded-xl hover:border-primary-300 hover:text-primary-500 transition-colors">
            Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  // Indicador visual: dados vieram do chatbot
  const vindoDoChatbot = !!(paramNome || paramTelefone || paramTipo);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-500 mb-3">
          Agendamento <span className="text-gold-500">Online</span>
        </h2>
        <p className="text-secondary-600">
          {vindoDoChatbot
            ? 'Seus dados foram preenchidos automaticamente. Escolha data e horário.'
            : 'Siga os passos abaixo para agendar sua consulta'}
        </p>
      </div>

      {vindoDoChatbot && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-green-700 text-sm font-medium">Dados da triagem carregados</p>
            <p className="text-green-600 text-xs">Área: {TIPOS_CONSULTA.find(t => t.value === tipo)?.label} • {nome} • {telefone}</p>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {['Tipo', 'Data', 'Horário', 'Dados'].map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isCompleted ? 'bg-gold-500 text-white' : isActive ? 'bg-primary-500 text-white ring-4 ring-primary-100' : 'bg-secondary-100 text-secondary-400'}`}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary-500' : isCompleted ? 'text-gold-500' : 'text-secondary-400'}`}>{label}</span>
              </div>
              {idx < 3 && <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-5 ${step > stepNum ? 'bg-gold-500' : 'bg-secondary-200'}`} />}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Tipo */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-serif font-bold text-primary-500 mb-4">Qual área do Direito?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIPOS_CONSULTA.map((t) => (
              <button key={t.value} onClick={() => { setTipo(t.value); setStep(2); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md ${tipo === t.value ? 'border-gold-500 bg-gold-50' : 'border-secondary-100 hover:border-gold-300'}`}>
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs font-medium text-secondary-700 text-center">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Data */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-serif font-bold text-primary-500 mb-4">Escolha a data</h3>
          <div className="bg-white border border-secondary-100 rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-secondary-50 rounded-lg">
                <ChevronLeft className="w-5 h-5 text-secondary-500" />
              </button>
              <h4 className="font-serif font-bold text-primary-500 capitalize">
                {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h4>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-secondary-50 rounded-lg">
                <ChevronRight className="w-5 h-5 text-secondary-500" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-secondary-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                const day = i + 1;
                const available = isDateAvailable(day);
                const blocked = isDayBlocked(day);
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button key={day} disabled={!available} onClick={() => { setSelectedDate(date); setSelectedHorario(''); setStep(3); }}
                    title={blocked ? 'Advogado indisponível' : undefined}
                    className={`p-2 text-sm rounded-lg transition-all relative ${isSelected ? 'bg-gold-500 text-white font-bold' : available ? 'hover:bg-gold-50 text-secondary-700 hover:text-gold-600' : blocked ? 'text-red-300 cursor-not-allowed bg-red-50/50' : 'text-secondary-300 cursor-not-allowed'}`}>
                    {day}
                    {blocked && <Ban className="w-3 h-3 absolute top-0.5 right-0.5 text-red-300" />}
                  </button>
                );
              })}
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-secondary-100">
              <div className="flex items-center gap-1.5 text-[10px] text-secondary-500">
                <div className="w-3 h-3 rounded bg-gold-50 border border-gold-200" /> Disponível
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-secondary-500">
                <div className="w-3 h-3 rounded bg-red-50 border border-red-200" /> Indisponível
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-secondary-500">
                <div className="w-3 h-3 rounded bg-secondary-100" /> Fim de semana
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => { setStep(1); }} className="px-4 py-2 text-secondary-500 hover:text-primary-500 transition-colors text-sm">← Voltar</button>
          </div>
        </div>
      )}

      {/* Step 3: Horário */}
      {step === 3 && selectedDate && (
        <div>
          <h3 className="text-lg font-serif font-bold text-primary-500 mb-2">Escolha o horário</h3>
          <p className="text-secondary-500 text-sm mb-6">{formatDate(selectedDate)}</p>

          {/* Bloqueios parciais do dia */}
          {(() => {
            const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
            const bloqueiosDoDia = horariosData.bloqueiosParciais.filter(b => b.data === key);
            if (bloqueiosDoDia.length > 0) {
              return (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-yellow-700 text-xs font-medium flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Alguns horários estão indisponíveis neste dia:
                  </p>
                  {bloqueiosDoDia.map((b, i) => (
                    <p key={i} className="text-yellow-600 text-xs ml-5.5 mt-1">
                      {b.horaInicio} às {b.horaFim}{b.motivo ? ` — ${b.motivo}` : ''}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          })()}

          {(() => {
            const horarios = getHorariosDisponiveis(selectedDate);
            if (horarios.length === 0) {
              return (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
                  <p className="text-secondary-500">Nenhum horário disponível nesta data.</p>
                  <button onClick={() => setStep(2)} className="mt-4 text-gold-500 hover:text-gold-600 font-medium text-sm">Escolher outra data</button>
                </div>
              );
            }
            return (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-lg mx-auto">
                {horarios.map((h) => (
                  <button key={h} onClick={() => { setSelectedHorario(h); setStep(4); }}
                    className={`px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all ${selectedHorario === h ? 'border-gold-500 bg-gold-50 text-gold-600' : 'border-secondary-100 hover:border-gold-300 text-secondary-700'}`}>
                    <Clock className="w-4 h-4 mx-auto mb-1 opacity-50" />
                    {h}
                  </button>
                ))}
              </div>
            );
          })()}
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)} className="px-4 py-2 text-secondary-500 hover:text-primary-500 transition-colors text-sm">← Voltar</button>
          </div>
        </div>
      )}

      {/* Step 4: Dados pessoais */}
      {step === 4 && (
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-serif font-bold text-primary-500 mb-6">Seus dados</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />Nome Completo *
              </label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="Seu nome completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />Telefone/WhatsApp *
              </label>
              <input type="text" value={telefone} onChange={(e) => setTelefone(formatPhone(e.target.value))}
                className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="(18) 99999-9999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                <FileText className="w-4 h-4 inline mr-1" />Descreva brevemente seu caso (opcional)
              </label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3}
                className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Ex: Fui demitido sem justa causa há 3 meses..." />
            </div>

            {/* Resumo */}
            <div className="bg-secondary-50 rounded-xl p-4 space-y-1">
              <h4 className="text-sm font-bold text-primary-500 mb-2">Resumo do Agendamento</h4>
              <p className="text-xs text-secondary-600">📋 {TIPOS_CONSULTA.find(t => t.value === tipo)?.label}</p>
              <p className="text-xs text-secondary-600">📅 {selectedDate && formatDate(selectedDate)}</p>
              <p className="text-xs text-secondary-600">🕐 {selectedHorario}</p>
              <div className="pt-2 mt-2 border-t border-secondary-200">
                <p className="text-[10px] text-yellow-600 font-medium flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Sujeito à confirmação do escritório via WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="lgpd" className="mt-1 accent-gold-500" checked={lgpdAceito} onChange={(e) => setLgpdAceito(e.target.checked)} />
              <label htmlFor="lgpd" className="text-xs text-secondary-500">
                Concordo com o tratamento dos meus dados conforme a <a href="/politica-privacidade" className="text-gold-500 underline">Política de Privacidade</a> e a LGPD. *
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(3)} className="px-6 py-3 border border-secondary-200 text-secondary-600 rounded-xl hover:border-primary-300 transition-colors">
              ← Voltar
            </button>
            <button onClick={handleSubmit} disabled={loading || !lgpdAceito}
              className="flex-1 btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {loading ? 'Enviando...' : 'Solicitar Agendamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
