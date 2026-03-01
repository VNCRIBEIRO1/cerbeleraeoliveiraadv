'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, User, Mail, Phone, FileText, MessageSquare } from 'lucide-react';

export default function EmailFormClient() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.mensagem) {
      setError('Preencha os campos obrigatórios (Nome, E-mail e Mensagem).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-serif font-bold text-primary-500 mb-2">Mensagem Enviada!</h3>
        <p className="text-secondary-600 text-sm mb-6">
          Recebemos sua mensagem e responderemos em até 24 horas úteis.
        </p>
        <button onClick={() => { setSuccess(false); setForm({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' }); }}
          className="text-gold-500 hover:text-gold-600 font-medium text-sm">
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            <User className="w-3.5 h-3.5 inline mr-1" />Nome Completo *
          </label>
          <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="Seu nome" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            <Mail className="w-3.5 h-3.5 inline mr-1" />E-mail *
          </label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="seu@email.com" required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            <Phone className="w-3.5 h-3.5 inline mr-1" />Telefone
          </label>
          <input type="text" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: formatPhone(e.target.value) })}
            className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="(18) 99999-9999" />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            <FileText className="w-3.5 h-3.5 inline mr-1" />Assunto
          </label>
          <select value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })}
            className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm bg-white">
            <option value="">Selecione...</option>
            <option value="Consulta Trabalhista">Consulta Trabalhista</option>
            <option value="Consulta Previdenciária">Consulta Previdenciária</option>
            <option value="Consulta Civil">Consulta Civil</option>
            <option value="Consulta Família">Consulta Família</option>
            <option value="Consulta Consumidor">Consulta Consumidor</option>
            <option value="Outro Assunto">Outro Assunto</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          <MessageSquare className="w-3.5 h-3.5 inline mr-1" />Mensagem *
        </label>
        <textarea value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} rows={4}
          className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-secondary-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all resize-none text-sm"
          placeholder="Descreva sua dúvida ou necessidade jurídica..." required />
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" id="email-lgpd" className="mt-0.5 accent-gold-500" required />
        <label htmlFor="email-lgpd" className="text-xs text-secondary-500">
          Concordo com o tratamento dos meus dados conforme a <a href="/politica-privacidade" className="text-gold-500 underline">Política de Privacidade</a> e a LGPD.
        </label>
      </div>

      <button type="submit" disabled={loading}
        className="w-full btn-gold flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        {loading ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </form>
  );
}
