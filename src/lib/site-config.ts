// ============================================================
// CONFIGURAÇÃO DO ESCRITÓRIO - CERBELERA & OLIVEIRA ADVOGADOS
// ============================================================

export const SITE_CONFIG = {
  // === DADOS DOS ADVOGADOS / ESCRITÓRIO ===
  nome: 'Cerbelera & Oliveira',
  nomeCompleto: 'Me. Diogo Ramos Cerbelera Neto & Luã Carlos de Oliveira',
  nomeEscritorio: 'Cerbelera & Oliveira Advogados Associados',
  oab: 'OAB/SP', // Número da OAB precisa ser preenchido
  oabNumero: '', // PREENCHER
  oabEstado: 'SP',

  // === SÓCIOS ===
  socios: [
    {
      nome: 'Me. Diogo Ramos Cerbelera Neto',
      titulo: 'Mestre em Direito',
      oab: '', // PREENCHER
    },
    {
      nome: 'Luã Carlos de Oliveira',
      oab: '', // PREENCHER
    },
  ],

  // === CONTATO ===
  telefone: '(18) 99610-1884',
  telefoneLink: '5518996101884',
  whatsapp: '5518996101884',
  email: '', // PREENCHER - e-mail profissional

  // === ENDEREÇO ===
  endereco: {
    rua: 'R. Francisco Machado de Campos, 393',
    complemento: '',
    bairro: 'Vila Nova',
    cidade: 'Presidente Prudente',
    estado: 'SP',
    cep: '19010-300',
    completo:
      'R. Francisco Machado de Campos, 393 - Vila Nova, Presidente Prudente/SP - CEP 19010-300',
  },

  // === HORÁRIO DE ATENDIMENTO ===
  horario: 'Segunda a Sexta, 08:00 às 18:00',

  // === SITE / SEO ===
  dominio: 'https://cerbeleraeoliveiraadv.vercel.app',
  descricaoSite:
    'Cerbelera & Oliveira Advogados Associados em Presidente Prudente, SP. Atuação estratégica e humanizada em Direito Trabalhista, Criminal, Civil, Empresarial e Administrativo.',
  palavrasChave: [
    'advogado Presidente Prudente',
    'advogado em Presidente Prudente',
    'escritório de advocacia Presidente Prudente',
    'advogado trabalhista Presidente Prudente',
    'advogado criminalista Presidente Prudente',
    'direito trabalhista',
    'direito criminal',
    'direito civil',
    'direito empresarial',
    'direito administrativo',
    'calculadora direitos trabalhistas',
    'insalubridade periculosidade',
    'advogado mestre em direito',
    'Cerbelera Oliveira',
    'advogado SP',
  ],

  // === SOBRE O ESCRITÓRIO ===
  sobreResumo:
    'Mais de 5 anos de atuação estratégica e humanizada na defesa dos seus direitos em Presidente Prudente e região.',
  sobreHistoria: [
    'O escritório Cerbelera & Oliveira Advogados Associados nasceu da união de dois profissionais apaixonados pelo Direito e comprometidos com a justiça. Liderado pelo Me. Diogo Ramos Cerbelera Neto, Mestre em Direito, o escritório combina rigor acadêmico com atuação estratégica, humanizada e acessível.',
    'Ao longo de mais de 5 anos de atuação, construímos uma trajetória sólida baseada na ética, transparência e compromisso inabalável com cada pessoa que nos procura.',
    'Nossa atuação é pautada pelo Código de Ética e Disciplina da OAB, pelo Provimento 205/2021 e pela convicção de que o acesso à informação jurídica é um direito de todos.',
    'Contamos com estacionamento próprio e ambiente acolhedor para garantir conforto durante todo o atendimento.',
  ],

  // === FORMAÇÃO ACADÊMICA ===
  formacao: [
    {
      year: '2019',
      title: 'Graduação em Direito',
      institution: 'Universidade do Oeste Paulista - UNOESTE',
    },
    {
      year: '2020',
      title: 'Aprovação na OAB',
      institution: 'Ordem dos Advogados do Brasil - Seccional SP',
    },
    {
      year: '2021',
      title: 'Fundação do Escritório',
      institution: 'Cerbelera & Oliveira Advogados Associados',
    },
    {
      year: '2024',
      title: 'Mestrado em Direito — Me. Diogo Cerbelera',
      institution: 'Especialização acadêmica que reforça a autoridade técnica do escritório',
    },
  ],

  // === AVALIAÇÕES (Google) ===
  avaliacaoGoogle: '4.9',
  totalAvaliacoes: '38',

  // === DEPOIMENTOS ===
  depoimentos: [
    {
      text: 'Atendimento excelente, super bem localizado e com estacionamento próprio. Esclareceram todas as minhas dúvidas com muita paciência e profissionalismo.',
      author: 'Andresa Louzada',
      role: 'Cliente',
    },
    {
      text: 'Excelência no atendimento, profissionalismo, qualidade e confiança. Altamente recomendado para quem procura serviços jurídicos confiáveis.',
      author: 'Raquel Martin Louzada',
      role: 'Cliente',
    },
    {
      text: 'Muito esclarecedor. Prestaram um excelente atendimento e resolveram meu problema por um preço justo. Recomendo a todos.',
      author: 'Julio Prestes',
      role: 'Cliente',
    },
  ],

  // === REDES SOCIAIS ===
  redesSociais: {
    instagram: 'https://instagram.com/cerbelera.oliveira.adv',
    facebook: 'https://facebook.com/cerbeleraoliveira.adv',
    linkedin: '',
    youtube: '',
  },

  // === IMAGENS ===
  imagens: {
    advogado: '/images/cerbelera_oliveira_team_photo.webp',
    hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80',
    escritorio:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    logo: '/images/cerbelera_oliveira_logo_cover.webp',
    logoAlt: '/images/cerbelera_oliveira_profile_photo.webp',
    logoMini: '/images/cerbelera_oliveira_logo_cover.webp',
  },

  // === GOOGLE MAPS ===
  googleMapsApiKey: '',
  googleMapsUrl:
    'https://maps.google.com/?q=R.+Francisco+Machado+de+Campos,+393+-+Vila+Nova,+Presidente+Prudente+-+SP,+19010-300',
};

export default SITE_CONFIG;
