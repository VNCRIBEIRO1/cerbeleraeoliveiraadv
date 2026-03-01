'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2, Loader2, MessageCircle, User, Phone, FileText, AlertCircle } from 'lucide-react';

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

interface AgendamentosOcupados {
  [data: string]: string[];
}

export default function AgendamentoClient() {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [ocupados, setOcupados] = useState<AgendamentosOcupados>({});

  // Buscar horários já ocupados
  const fetchOcupados = useCallback(async () => {
    try {
      const mes = currentMonth.getMonth() + 1;
      const ano = currentMonth.getFullYear();
      const res = await fetch(`/api/agenda?mes=${mes}&ano=${ano}`);
      if (res.ok) {
        const data = await res.json();
        const map: AgendamentosOcupados = {};
        data.forEach((ag: { dataHora: string }) => {
          const dt = new Date(ag.dataHora);
          const key = dt.toISOString().split('T')[0];
          const hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
          if (!map[key]) map[key] = [];
          map[key].push(hora);
        });
        setOcupados(map);
      }
    } catch {
      // silently fail
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchOcupados();
  }, [fetchOcupados]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return false; // sem fins de semana
    return true;
  };

  const getHorariosDisponiveis = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    const ocupadosNoDia = ocupados[key] || [];
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return HORARIOS_DISPONIVEIS.filter(h => {
      if (ocupadosNoDia.includes(h)) return false;
      if (isToday) {
        const [hh, mm] = h.split(':').map(Number);
        const horaSlot = hh * 60 + mm;
        const horaAgora = now.getHours() * 60 + now.getMinutes() + 60; // 1h de antecedência
        if (horaSlot <= horaAgora) return false;
      }
      return true;
    });
  };

  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = async () => {
    if (!nome || !telefone || !selectedDate || !selectedHorario || !tipo) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [hh, mm] = selectedHorario.split(':').map(Number);
      const dataHora = new Date(selectedDate);
      dataHora.setHours(hh, mm, 0, 0);

      // Criar triagem + agendamento
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
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary-500 mb-3">
          Consulta Agendada com Sucesso!
        </h2>
        <div className="bg-secondary-50 rounded-xl p-6 mb-6 text-left space-y-2">
          <p className="text-sm text-secondary-600"><strong>Tipo:</strong> {TIPOS_CONSULTA.find(t => t.value === tipo)?.label}</p>
          <p className="text-sm text-secondary-600"><strong>Data:</strong> {selectedDate && formatDate(selectedDate)}</p>
          <p className="text-sm text-secondary-600"><strong>Horário:</strong> {selectedHorario}</p>
          <p className="text-sm text-secondary-600"><strong>Nome:</strong> {nome}</p>
          <p className="text-sm text-secondary-600"><strong>Telefone:</strong> {telefone}</p>
        </div>
        <p className="text-secondary-600 text-sm mb-6">
          Você receberá uma confirmação via WhatsApp em breve. Nossa equipe entrará em contato para confirmar o agendamento.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`https://wa.me/5518996101884?text=${encodeURIComponent(`Olá! Acabei de agendar uma consulta de ${TIPOS_CONSULTA.find(t => t.value === tipo)?.label} para ${selectedDate ? formatDate(selectedDate) : ''} às ${selectedHorario}. Meu nome é ${nome}.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors">
            <MessageCircle className="w-5 h-5" />
            Confirmar via WhatsApp
          </a>
          <button onClick={() => { setSuccess(false); setStep(1); setTipo(''); setSelectedDate(null); setSelectedHorario(''); setNome(''); setTelefone(''); setDescricao(''); }}
            className="px-6 py-3 border border-secondary-200 text-secondary-600 rounded-xl hover:border-primary-300 hover:text-primary-500 transition-colors">
            Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-500 mb-3">
          Agendamento <span className="text-gold-500">Online</span>
        </h2>
        <p className="text-secondary-600">Siga os passos abaixo para agendar sua consulta</p>
      </div>

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
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button key={day} disabled={!available} onClick={() => { setSelectedDate(date); setSelectedHorario(''); setStep(3); }}
                    className={`p-2 text-sm rounded-lg transition-all ${isSelected ? 'bg-gold-500 text-white font-bold' : available ? 'hover:bg-gold-50 text-secondary-700 hover:text-gold-600' : 'text-secondary-300 cursor-not-allowed'}`}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="px-4 py-2 text-secondary-500 hover:text-primary-500 transition-colors text-sm">← Voltar</button>
          </div>
        </div>
      )}

      {/* Step 3: Horário */}
      {step === 3 && selectedDate && (
        <div>
          <h3 className="text-lg font-serif font-bold text-primary-500 mb-2">Escolha o horário</h3>
          <p className="text-secondary-500 text-sm mb-6">{formatDate(selectedDate)}</p>
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
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="lgpd" className="mt-1 accent-gold-500" defaultChecked />
              <label htmlFor="lgpd" className="text-xs text-secondary-500">
                Concordo com o tratamento dos meus dados conforme a <a href="/politica-privacidade" className="text-gold-500 underline">Política de Privacidade</a> e a LGPD.
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(3)} className="px-6 py-3 border border-secondary-200 text-secondary-600 rounded-xl hover:border-primary-300 transition-colors">
              ← Voltar
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 btn-gold flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
