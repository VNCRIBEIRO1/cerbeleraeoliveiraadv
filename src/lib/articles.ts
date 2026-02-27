// ============================================================
// CONTEÚDO DOS ARTIGOS — CERBELERA & OLIVEIRA ADVOGADOS
// ============================================================
// Artigos informativos em conformidade com o Provimento 205/2021 da OAB.
// Prefixo "## " indica título de seção (h2).

export interface Article {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}

export const articles: Record<string, Article> = {
  'demissao-justa-causa': {
    title: 'Demissão por Justa Causa: Conheça Seus Direitos',
    category: 'Direito Trabalhista',
    date: '20 Fev 2026',
    readTime: '6 min',
    content: [
      'A demissão por justa causa é a penalidade máxima aplicável ao empregado no âmbito da relação de trabalho. Prevista no artigo 482 da Consolidação das Leis do Trabalho (CLT), ela encerra o contrato de trabalho quando o empregado comete uma falta grave que torna inviável a continuidade do vínculo empregatício. Trata-se de uma medida extrema que deve ser aplicada com cautela pelo empregador, pois retira do trabalhador direitos rescisórios significativos.',

      '## O Que Caracteriza a Justa Causa',
      'A justa causa está vinculada a condutas graves do empregado, taxativamente previstas no artigo 482 da CLT. Entre as principais hipóteses estão: ato de improbidade (como furto, apropriação indébita ou fraude), incontinência de conduta ou mau procedimento, negociação habitual por conta própria sem permissão do empregador quando constituir ato de concorrência, condenação criminal do empregado transitada em julgado (quando não houver suspensão da pena), desídia no desempenho das respectivas funções, embriaguez habitual ou em serviço, e violação de segredo da empresa.',
      'Outras hipóteses incluem: indisciplina ou insubordinação, abandono de emprego (geralmente caracterizado pela ausência injustificada por mais de 30 dias consecutivos), ato lesivo da honra ou boa fama praticado no serviço contra qualquer pessoa, ofensas físicas nas mesmas condições, prática constante de jogos de azar, perda da habilitação profissional e atos atentatórios à segurança nacional.',

      '## Direitos Perdidos e Direitos Mantidos',
      'Na demissão por justa causa, o trabalhador perde importantes direitos rescisórios. Ele não terá direito ao aviso prévio (trabalhado ou indenizado), à multa de 40% sobre o saldo do FGTS, ao saque dos valores depositados no FGTS, nem ao seguro-desemprego. São perdas financeiras consideráveis que podem afetar significativamente o planejamento do trabalhador.',
      'Contudo, mesmo na justa causa, o empregado mantém alguns direitos irrenunciáveis: o saldo de salário pelos dias efetivamente trabalhados no mês da demissão, as férias vencidas acrescidas do terço constitucional (se houver períodos completos não gozados) e eventuais salários ou benefícios em atraso. O 13º salário proporcional, segundo entendimento mais recente da jurisprudência, também pode ser devido dependendo do caso.',

      '## Princípios Que Regem a Justa Causa',
      'A aplicação da justa causa deve obedecer a princípios rigorosos, sob pena de ser considerada nula pela Justiça do Trabalho. O princípio da imediatidade exige que a punição seja aplicada logo após o empregador tomar conhecimento da falta — a demora injustificada pode ser interpretada como perdão tácito.',
      'O princípio da proporcionalidade determina que a penalidade deve ser proporcional à gravidade da falta cometida. Para faltas leves, espera-se que o empregador aplique inicialmente advertência e suspensão antes de recorrer à justa causa. O princípio do non bis in idem proíbe a aplicação de duas penalidades para a mesma falta. Já o princípio da gradação das penalidades recomenda a progressividade: advertência verbal, advertência escrita, suspensão e, somente por último, a justa causa.',

      '## Como Se Defender de Uma Justa Causa Indevida',
      'Se o trabalhador entende que a justa causa foi aplicada de forma irregular, injusta ou desproporcional, ele pode ingressar com uma reclamação trabalhista perante a Vara do Trabalho competente para requerer a reversão da modalidade de demissão. O prazo prescricional para ajuizar a ação é de dois anos após o término do contrato de trabalho, podendo pleitear verbas referentes aos últimos cinco anos de contrato.',
      'É fundamental que o trabalhador reúna provas que demonstrem a irregularidade da justa causa: e-mails, mensagens, testemunhas, registros de advertências anteriores (ou a falta delas), entre outros documentos. A reversão judicial da justa causa obriga o empregador a pagar todas as verbas rescisórias como se a demissão fosse sem justa causa, incluindo a multa de 40% do FGTS e a liberação do seguro-desemprego.',

      '## Obrigações do Empregador',
      'O empregador tem o ônus de provar a justa causa na Justiça do Trabalho. Isso significa que ele deve documentar adequadamente os motivos, apresentar provas concretas da falta grave e demonstrar que os princípios aplicáveis foram respeitados. A mera alegação, sem prova robusta, leva à reversão da justa causa com condenação ao pagamento integral das verbas rescisórias, podendo ainda gerar indenização por danos morais ao trabalhador.',

      '## Considerações Finais',
      'A demissão por justa causa é um tema delicado que exige análise cuidadosa tanto por parte do empregador quanto do empregado. Se você foi demitido por justa causa e acredita que a medida foi injusta, procure orientação jurídica especializada para avaliar a viabilidade de uma ação trabalhista. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'crimes-contra-honra': {
    title: 'Crimes Contra a Honra: Calúnia, Difamação e Injúria',
    category: 'Direito Criminal',
    date: '15 Fev 2026',
    readTime: '5 min',
    content: [
      'Os crimes contra a honra estão previstos nos artigos 138 a 140 do Código Penal brasileiro e protegem dois aspectos fundamentais da dignidade humana: a honra objetiva (a reputação que a pessoa possui perante a sociedade) e a honra subjetiva (o sentimento de dignidade e autoestima da própria pessoa). Compreender as diferenças entre calúnia, difamação e injúria é essencial para saber como agir caso você seja vítima.',

      '## Calúnia (Artigo 138, CP)',
      'A calúnia consiste em atribuir falsamente a alguém a prática de um fato definido como crime. Para que se configure a calúnia, é necessário que o fato imputado seja especificamente um crime (e não uma simples ofensa), que a imputação seja falsa e que o agente tenha ciência da falsidade. Por exemplo: afirmar que determinada pessoa cometeu estelionato quando isso jamais ocorreu configura calúnia.',
      'A pena prevista para a calúnia é de detenção de seis meses a dois anos, além de multa. Aquele que propala ou divulga a calúnia incorre na mesma pena. Importante destacar que, na calúnia, é admitida a exceção da verdade — ou seja, se o acusado provar que o fato imputado é verdadeiro, ele não será condenado, salvo quando a ofensa for dirigida ao Presidente da República ou chefe de governo estrangeiro.',

      '## Difamação (Artigo 139, CP)',
      'A difamação é a atribuição a alguém de fato ofensivo à sua reputação, mas que não constitui crime. Diferencia-se da calúnia justamente pelo fato imputado: na difamação, o fato não é criminoso, mas é desonroso ou ofensivo à imagem pública da pessoa. Exemplo: dizer que um profissional é incompetente e irresponsável no exercício de suas funções.',
      'A pena para a difamação é de detenção de três meses a um ano, e multa. Na difamação, em regra, não se admite a exceção da verdade — ou seja, mesmo que o fato atribuído seja verdadeiro, o crime de difamação pode se configurar. A exceção ocorre apenas quando o ofendido é funcionário público e a ofensa é relativa ao exercício de suas funções.',

      '## Injúria (Artigo 140, CP)',
      'A injúria consiste na ofensa à dignidade ou ao decoro de alguém, sem a atribuição de um fato específico. Trata-se de xingamentos, insultos e ofensas genéricas que agridem a honra subjetiva da vítima. Exemplos incluem chamar alguém de "ladrão", "vagabundo" ou utilizar termos depreciativos.',
      'A pena-base da injúria é de detenção de um a seis meses, ou multa. Entretanto, a injúria racial — quando a ofensa utiliza elementos referentes à raça, cor, etnia, religião, origem ou condição de pessoa idosa ou com deficiência — é tratada com maior rigor, com pena de reclusão de um a três anos e multa, conforme alteração trazida pela Lei nº 14.532/2023, que equiparou a injúria racial ao crime de racismo.',

      '## Ação Penal e Prazos',
      'Os crimes contra a honra são, em regra, de ação penal privada, o que significa que a própria vítima deve tomar a iniciativa de processar o ofensor por meio de queixa-crime. O prazo decadencial para apresentar a queixa é de seis meses, contados a partir do momento em que a vítima toma conhecimento da autoria do crime. Após esse prazo, o direito de ação se extingue.',
      'Além da esfera criminal, a vítima pode buscar reparação por danos morais na esfera cível, ajuizando ação de indenização. Os tribunais brasileiros têm condenado ofensores a indenizações significativas, especialmente quando as ofensas são praticadas em ambiente virtual e redes sociais, dado o potencial de viralização e ampliação do dano.',

      '## Crimes Contra a Honra na Internet',
      'Com a popularização das redes sociais, os crimes contra a honra praticados no ambiente digital ganharam enorme relevância. Publicações difamatórias, caluniosas ou injuriosas em plataformas como Facebook, Instagram, Twitter e WhatsApp são plenamente puníveis. A identificação do autor pode ser obtida por meio de medida judicial de quebra de sigilo de dados junto aos provedores de internet.',

      '## Considerações Finais',
      'Se você foi vítima de calúnia, difamação ou injúria, é fundamental preservar todas as provas (prints de tela, gravações, mensagens) e buscar orientação jurídica o mais rápido possível, dado o prazo decadencial de seis meses. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'contratos-empresariais': {
    title: 'Contratos Empresariais: Como Proteger Seu Negócio',
    category: 'Direito Empresarial',
    date: '10 Fev 2026',
    readTime: '7 min',
    content: [
      'Os contratos empresariais são instrumentos jurídicos fundamentais para regular as relações comerciais entre empresas, fornecedores, clientes e parceiros de negócios. Uma redação contratual bem elaborada é a primeira e mais eficiente linha de defesa do empresário, prevenindo litígios, reduzindo riscos e estabelecendo expectativas claras entre as partes envolvidas.',

      '## Elementos Essenciais de Um Contrato Empresarial',
      'Para que um contrato empresarial seja válido e eficaz, ele deve conter alguns elementos fundamentais: a qualificação completa das partes contratantes (razão social, CNPJ, endereço, representante legal), a descrição clara e precisa do objeto do contrato, o preço e as condições de pagamento, o prazo de vigência e eventuais renovações, as obrigações específicas de cada parte, as cláusulas de rescisão e as penalidades aplicáveis, o foro de eleição para resolução de conflitos e as assinaturas das partes e testemunhas.',
      'Além desses elementos obrigatórios, contratos mais sofisticados podem incluir cláusulas de confidencialidade (NDA), cláusulas de não concorrência, cláusulas de propriedade intelectual, mecanismos de resolução alternativa de conflitos (mediação e arbitragem) e condições suspensivas ou resolutivas.',

      '## Principais Tipos de Contratos Empresariais',
      'O universo empresarial abrange uma grande variedade de contratos. O contrato de prestação de serviços é um dos mais comuns, regulando a execução de atividades específicas por uma parte em favor da outra. O contrato de compra e venda mercantil disciplina a transferência de mercadorias entre empresas, com cláusulas sobre entrega, qualidade e garantias.',
      'Outros tipos relevantes incluem: o contrato de distribuição (que regula a revenda de produtos em determinada região), o contrato de franquia (regulado pela Lei nº 13.966/2019, que exige a entrega da Circular de Oferta de Franquia), o contrato de representação comercial (Lei nº 4.886/65), o acordo de confidencialidade (NDA), o contrato de parceria comercial (joint venture) e o contrato de licenciamento de marcas e patentes.',

      '## Cláusulas Abusivas: O Que Evitar',
      'Cláusulas abusivas são disposições contratuais que colocam uma das partes em desvantagem excessiva, desequilibrando a relação contratual. Entre os exemplos mais comuns estão: multas rescisórias desproporcionais (que excedem amplamente o valor do contrato), renúncia prévia a direitos fundamentais, exclusividade sem contrapartida financeira adequada, limitação excessiva ou exclusão total de responsabilidade por danos, cláusulas que permitam alteração unilateral das condições do contrato e prazos de vigência excessivos sem possibilidade de rescisão.',
      'A presença de cláusulas abusivas pode levar à nulidade da cláusula específica ou, em casos extremos, de todo o contrato, conforme previsto no Código Civil (artigos 421 e seguintes) e no Código de Defesa do Consumidor (quando aplicável às relações empresariais).',

      '## Assessoria Jurídica Preventiva',
      'A assessoria jurídica na elaboração e revisão de contratos é um investimento estratégico fundamental para qualquer empresa. O custo de uma consultoria preventiva é infinitamente menor do que os prejuízos causados por um contrato mal redigido ou por uma disputa judicial prolongada. O advogado empresarialista analisa os riscos envolvidos, propõe cláusulas protetivas e garante que o contrato esteja em conformidade com a legislação vigente.',
      'Recomenda-se que todos os contratos relevantes para o negócio sejam revisados por um advogado antes da assinatura, independentemente do grau de confiança entre as partes. Relações comerciais sólidas se constroem sobre bases jurídicas claras e equilibradas.',

      '## Descumprimento Contratual e Remédios Jurídicos',
      'Em caso de descumprimento contratual (inadimplência), a parte prejudicada pode adotar diversas medidas. A notificação extrajudicial é o primeiro passo recomendado, formalizando a cobrança e estabelecendo prazo para regularização. Se não houver resolução amigável, as partes podem recorrer à mediação, à arbitragem (se prevista no contrato) ou ao Poder Judiciário.',
      'Na esfera judicial, é possível pleitear a execução forçada do contrato (obrigação de fazer ou não fazer), a resolução do contrato com restituição das partes ao estado anterior e a indenização por perdas e danos (danos emergentes e lucros cessantes). A cláusula penal previamente pactuada funciona como pré-fixação de perdas e danos.',

      '## Considerações Finais',
      'Contratos empresariais bem elaborados são a base de relações comerciais saudáveis e duradouras. Não economize na assessoria jurídica contratual — o investimento em prevenção é sempre mais vantajoso do que o custo de um litígio. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'assedio-moral-trabalho': {
    title: 'Assédio Moral no Trabalho: Como Identificar e Agir',
    category: 'Direito Trabalhista',
    date: '05 Fev 2026',
    readTime: '6 min',
    content: [
      'O assédio moral no trabalho é uma das formas mais insidiosas de violência no ambiente laboral. Caracteriza-se pela exposição repetitiva e prolongada do trabalhador a situações humilhantes, vexatórias e constrangedoras durante o exercício de suas funções. Trata-se de uma conduta que atenta contra a dignidade da pessoa humana e pode causar danos graves à saúde física e psicológica do trabalhador.',

      '## O Que Caracteriza o Assédio Moral',
      'Para que se configure o assédio moral, é necessário que a conduta ofensiva seja repetitiva e prolongada no tempo — episódios isolados, embora possam configurar outros ilícitos, não caracterizam assédio moral. As condutas mais comuns incluem: críticas constantes e injustificadas ao trabalho do empregado, isolamento proposital do trabalhador em relação aos colegas, atribuição de tarefas humilhantes ou incompatíveis com a função, ameaças frequentes de demissão, vigilância excessiva e desproporcional, tratamento diferenciado e hostil sem justificativa e sabotagem do trabalho realizado.',
      'O assédio moral pode ainda se manifestar por meio de piadas ofensivas direcionadas ao trabalhador, exposição pública de erros, negativa de comunicação direta (ignorar o trabalhador), transferências punitivas de setor e imposição de metas inatingíveis com o objetivo de constranger.',

      '## Tipos de Assédio Moral',
      'O assédio moral pode ser classificado em diferentes modalidades conforme a relação hierárquica entre assediador e vítima. O assédio vertical descendente é o mais comum e ocorre quando o superior hierárquico assedia o subordinado, utilizando sua posição de poder para humilhar e constranger. O assédio vertical ascendente, embora menos frequente, ocorre quando subordinados assediam seu superior, geralmente por meio de boicotes, desobediência coordenada e difamação.',
      'O assédio horizontal ocorre entre colegas de mesmo nível hierárquico, frequentemente motivado por competitividade, inveja ou preconceito. Há ainda o assédio moral organizacional, que se caracteriza por uma cultura institucional de pressão abusiva, metas desumanas e gestão pelo medo, afetando o coletivo de trabalhadores.',

      '## Consequências Para a Saúde do Trabalhador',
      'As consequências do assédio moral são devastadoras e podem se manifestar tanto na esfera psicológica quanto física. Entre os efeitos mais comuns estão: depressão, ansiedade, síndrome de burnout, insônia, crises de pânico, dores de cabeça crônicas, distúrbios gastrointestinais, isolamento social, queda na autoestima e, em casos extremos, ideação suicida. Laudos médicos e psicológicos que documentem essas consequências são provas importantes em eventual ação judicial.',

      '## Direitos da Vítima e Caminhos Jurídicos',
      'A vítima de assédio moral possui diversos caminhos jurídicos para buscar reparação. A rescisão indireta do contrato de trabalho (artigo 483 da CLT) é uma das principais ferramentas: o empregado pode considerar rescindido o contrato por culpa do empregador, garantindo todos os direitos como se fosse demitido sem justa causa, incluindo aviso prévio, multa de 40% do FGTS, saque do FGTS e seguro-desemprego.',
      'Além da rescisão indireta, o trabalhador pode pleitear indenização por danos morais e, se houver prejuízos financeiros comprovados (como tratamentos médicos), também por danos materiais. Os valores de indenização por assédio moral no trabalho têm variado nos tribunais brasileiros, podendo alcançar valores significativos conforme a gravidade do caso, a duração do assédio e a capacidade econômica do empregador.',

      '## Como Reunir Provas',
      'A produção de provas é essencial para o sucesso de uma ação judicial por assédio moral. O trabalhador deve preservar e-mails, mensagens de texto e áudio, comunicados escritos, gravações de conversas (desde que o trabalhador participe da conversa — a gravação é lícita nesse caso), testemunhos de colegas que presenciaram os episódios, laudos médicos e psicológicos com descrição dos sintomas e registros de afastamentos por motivos de saúde relacionados ao trabalho.',
      'Recomenda-se que o trabalhador mantenha um diário detalhado dos episódios de assédio, anotando datas, horários, locais, testemunhas e a descrição exata dos fatos ocorridos.',

      '## Responsabilidade da Empresa',
      'As empresas têm o dever legal de manter um ambiente de trabalho saudável e seguro. Para prevenir o assédio moral, recomenda-se a implementação de políticas internas de compliance e ética, canais de denúncia anônimos, treinamentos regulares para lideranças sobre gestão humanizada, procedimentos de apuração céleres e imparciais e medidas disciplinares efetivas contra assediadores.',

      '## Considerações Finais',
      'O assédio moral é uma violação grave aos direitos fundamentais do trabalhador. Se você está sofrendo assédio no trabalho, não se cale — procure orientação jurídica especializada para conhecer seus direitos e as medidas cabíveis. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'habeas-corpus': {
    title: 'Habeas Corpus: Quando e Como Utilizar Este Instrumento',
    category: 'Direito Criminal',
    date: '01 Fev 2026',
    readTime: '5 min',
    content: [
      'O habeas corpus é um dos mais importantes remédios constitucionais do ordenamento jurídico brasileiro. Previsto no artigo 5º, inciso LXVIII, da Constituição Federal, ele existe para proteger o direito fundamental de liberdade de locomoção contra qualquer ato de ilegalidade ou abuso de poder. Sua origem remonta à Magna Carta inglesa de 1215 e, desde então, tornou-se um pilar da proteção dos direitos individuais em todo o mundo.',

      '## Modalidades de Habeas Corpus',
      'O habeas corpus pode ser dividido em duas modalidades principais. O habeas corpus liberatório (ou repressivo) é utilizado quando a pessoa já se encontra presa de forma ilegal ou abusiva, buscando sua imediata soltura. Já o habeas corpus preventivo é impetrado quando existe uma ameaça concreta e iminente de prisão ilegal, tendo como objetivo obter um salvo-conduto que impeça a efetivação da prisão.',
      'Existe ainda o habeas corpus suspensivo, utilizado em situações em que há ameaça de constrangimento ilegal decorrente de ato judicial ou administrativo que, embora ainda não consumado, mostra-se provável e iminente.',

      '## Quem Pode Impetrar',
      'Uma das características mais democráticas do habeas corpus é que qualquer pessoa pode impetrá-lo, seja em favor próprio ou de terceiro. Não é necessário ser advogado, não há exigência de capacidade postulatória e o instrumento é gratuito — não há custas processuais para sua impetração. Podem impetrar habeas corpus: o próprio preso, familiares, amigos, advogados, o Ministério Público e até mesmo o juiz de ofício.',
      'Essa amplitude no direito de impetração reflete a importância que o ordenamento jurídico confere à liberdade individual, reconhecendo-a como um direito fundamental que não pode ser restringido sem base legal adequada.',

      '## Hipóteses de Cabimento',
      'O habeas corpus é cabível em diversas situações de ilegalidade ou abuso de poder que afetem a liberdade de locomoção. As hipóteses mais comuns incluem: prisão em flagrante realizada de forma irregular (sem as formalidades legais), excesso de prazo na prisão preventiva (quando o preso aguarda julgamento além do razoável), ausência de fundamentação adequada na decisão judicial que decretou a prisão, prisão por dívida civil (proibida pela Constituição, com exceção da pensão alimentícia), e cerceamento do direito de defesa.',
      'Outras situações que ensejam habeas corpus são: prisão decretada por autoridade incompetente, ausência de justa causa para o inquérito policial ou ação penal (quando não há indícios mínimos de autoria ou materialidade), e qualquer constrangimento ilegal que, direta ou indiretamente, afete o direito de ir e vir.',

      '## Competência Para Julgamento',
      'A competência para julgar o habeas corpus segue uma regra hierárquica vinculada à autoridade responsável pelo ato coator. Se a autoridade coatora é um delegado de polícia ou juiz de primeiro grau, a competência é do Tribunal de Justiça (TJ) ou do Tribunal Regional Federal (TRF). Se a autoridade coatora é um desembargador ou membro do TRF, a competência é do Superior Tribunal de Justiça (STJ). Se a autoridade coatora é um ministro de tribunal superior, a competência é do Supremo Tribunal Federal (STF).',

      '## Procedimento e Tramitação',
      'O habeas corpus possui tramitação prioritária e célere, dada a natureza do direito protegido. A petição deve conter a identificação do paciente (pessoa cuja liberdade está ameaçada ou cerceada), a identificação da autoridade coatora, a descrição detalhada do ato ilegal ou abusivo e os documentos que comprovem a ilegalidade. O juiz ou tribunal pode conceder liminar (medida urgente) para a imediata soltura do paciente, antes mesmo do julgamento definitivo.',
      'Após o recebimento da petição, a autoridade coatora é intimada a prestar informações, e o Ministério Público se manifesta como fiscal da lei. O julgamento é realizado em sessão plenária ou colegiada, conforme o tribunal.',

      '## Considerações Finais',
      'O habeas corpus é uma garantia fundamental e inviolável em um Estado Democrático de Direito. Se você ou alguém próximo está sofrendo constrangimento ilegal à liberdade de locomoção, procure imediatamente orientação jurídica. A rapidez na impetração pode ser determinante para a proteção da liberdade. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'responsabilidade-civil': {
    title: 'Responsabilidade Civil: Danos Morais e Materiais',
    category: 'Direito Civil',
    date: '28 Jan 2026',
    readTime: '7 min',
    content: [
      'A responsabilidade civil é um dos pilares do Direito Civil brasileiro e consiste na obrigação de reparar o dano causado a outra pessoa, seja por ação ou omissão, dolosa ou culposa. Fundamentada nos artigos 186, 187 e 927 do Código Civil, ela garante que toda pessoa que causar prejuízo a outrem tem o dever de indenizar. Compreender as nuances desse instituto é fundamental para saber quando e como buscar reparação.',

      '## Requisitos da Responsabilidade Civil',
      'Para que se configure a responsabilidade civil e nasça o dever de indenizar, quatro elementos devem estar presentes simultaneamente. Primeiro, a conduta humana — uma ação (fazer algo) ou omissão (deixar de fazer algo que deveria ter feito). Segundo, a culpa do agente (na responsabilidade subjetiva) — que pode se manifestar como imprudência, negligência ou imperícia. Terceiro, o dano efetivo — a lesão a um interesse jurídico protegido, que pode ser patrimonial ou extrapatrimonial. Quarto, o nexo de causalidade — a relação de causa e efeito entre a conduta e o dano sofrido.',
      'A ausência de qualquer um desses elementos impede a configuração da responsabilidade civil. Por isso, a análise de cada caso concreto é fundamental para avaliar a viabilidade de uma ação indenizatória.',

      '## Dano Material: Danos Emergentes e Lucros Cessantes',
      'O dano material (ou dano patrimonial) compreende o prejuízo financeiro efetivamente sofrido pela vítima, sendo dividido em duas categorias complementares. Os danos emergentes representam aquilo que a vítima efetivamente perdeu — por exemplo, o custo de reparo de um veículo danificado em um acidente, despesas médicas, gastos com medicamentos e tratamentos.',
      'Os lucros cessantes, por sua vez, representam aquilo que a vítima razoavelmente deixou de ganhar em razão do dano — por exemplo, o salário que um profissional deixou de receber durante o período de afastamento para tratamento, ou o faturamento que uma empresa perdeu por ter seu equipamento danificado. A comprovação dos lucros cessantes exige demonstração razoável do que seria ganho, com base em documentos como contracheques, declarações de imposto de renda e contratos.',

      '## Dano Moral: Conceito e Caracterização',
      'O dano moral consiste na lesão aos direitos da personalidade, atingindo bens como a honra, a imagem, a intimidade, a privacidade e a dignidade da pessoa humana. Diferentemente do dano material, o dano moral não necessita de comprovação de prejuízo financeiro — trata-se do chamado dano in re ipsa, ou seja, é presumido a partir da própria violação do direito.',
      'São exemplos comuns de situações que geram dano moral: inscrição indevida em cadastros de inadimplentes (SPC/Serasa), negativação indevida, cobranças abusivas, erros médicos, ofensas à honra e à imagem, acidentes com lesões corporais, demora injustificada na prestação de serviços essenciais, violação de dados pessoais e falhas graves em produtos ou serviços.',

      '## Responsabilidade Subjetiva e Objetiva',
      'A responsabilidade civil pode ser subjetiva ou objetiva, dependendo da necessidade ou não de comprovação de culpa. Na responsabilidade subjetiva, a vítima deve provar que o causador do dano agiu com culpa (imprudência, negligência ou imperícia) ou dolo (intenção). Esta é a regra geral do Código Civil.',
      'Na responsabilidade objetiva, por outro lado, não se exige a comprovação de culpa — basta demonstrar a conduta, o dano e o nexo causal. A responsabilidade objetiva é aplicada em casos específicos previstos em lei, como nas relações de consumo (Código de Defesa do Consumidor), atividades de risco (parágrafo único do artigo 927 do Código Civil), responsabilidade do Estado por atos de seus agentes (artigo 37, §6º, da Constituição Federal) e responsabilidade por danos ambientais.',

      '## Critérios Para Fixação da Indenização',
      'Os valores de indenização por danos morais são fixados pelo juiz com base em critérios que buscam equilibrar a reparação à vítima e a função pedagógica da condenação. Os principais critérios considerados são: a gravidade e extensão do dano, a intensidade do sofrimento da vítima, a condição econômica das partes (tanto do ofensor quanto do ofendido), o grau de culpa do causador do dano, o caráter pedagógico e preventivo da condenação (para desestimular condutas semelhantes) e os precedentes jurisprudenciais do tribunal para casos análogos.',
      'Não existe uma tabela fixa de valores para danos morais no Brasil. Cada caso é analisado individualmente pelo juiz, que tem ampla liberdade para fixar o quantum indenizatório dentro dos parâmetros da razoabilidade e proporcionalidade.',

      '## Prazo Prescricional',
      'O prazo prescricional para ajuizar ação de responsabilidade civil varia conforme a natureza da relação. A regra geral do Código Civil estabelece prazo de três anos (artigo 206, §3º, inciso V). Nas relações de consumo, o prazo é de cinco anos (artigo 27 do CDC). É fundamental que a vítima não ultrapasse esses prazos, sob pena de perder o direito de pleitear a indenização.',

      '## Considerações Finais',
      'A responsabilidade civil é um mecanismo essencial para a reparação de injustiças e a proteção dos direitos fundamentais. Se você sofreu danos morais ou materiais, procure orientação jurídica para avaliar seus direitos e a viabilidade de uma ação indenizatória. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'licitacoes-publicas': {
    title: 'Licitações Públicas: Direitos dos Participantes',
    category: 'Direito Administrativo',
    date: '25 Jan 2026',
    readTime: '8 min',
    content: [
      'As licitações públicas são procedimentos administrativos obrigatórios para as contratações realizadas pela Administração Pública direta e indireta, conforme determina o artigo 37, inciso XXI, da Constituição Federal. Seu objetivo é garantir a isonomia entre os participantes, assegurar a competitividade e selecionar a proposta mais vantajosa para o interesse público, promovendo o desenvolvimento nacional sustentável.',

      '## A Nova Lei de Licitações (Lei nº 14.133/2021)',
      'A Nova Lei de Licitações e Contratos Administrativos (Lei nº 14.133/2021), que substituiu integralmente a Lei nº 8.666/93, trouxe mudanças significativas ao marco regulatório das contratações públicas. Entre as principais inovações estão a unificação das normas sobre licitações (absorvendo também o pregão e o Regime Diferenciado de Contratações), a criação do diálogo competitivo como nova modalidade, a obrigatoriedade do Portal Nacional de Contratações Públicas (PNCP) e a ampliação dos instrumentos de transparência e controle.',
      'As modalidades licitatórias previstas na nova lei são: pregão (obrigatório para bens e serviços comuns), concorrência (para obras, serviços especiais e demais contratações que não se enquadrem nas outras modalidades), concurso (para seleção de trabalhos técnicos, científicos ou artísticos), leilão (para alienação de bens) e diálogo competitivo (para contratações complexas que exigem soluções inovadoras).',

      '## Princípios Norteadores',
      'As licitações são regidas por princípios constitucionais e legais que visam garantir a lisura e eficiência do processo. Os princípios fundamentais incluem: legalidade (o procedimento deve seguir estritamente o que prevê a lei), impessoalidade (tratamento igualitário a todos os participantes), moralidade (conduta ética e íntegra), publicidade (ampla divulgação de todos os atos), eficiência (busca do melhor resultado com menor custo), igualdade (vedação de tratamento discriminatório), e vinculação ao instrumento convocatório (o edital é a lei da licitação).',
      'A violação de qualquer desses princípios pode ensejar a nulidade do ato ou de todo o procedimento licitatório, cabendo impugnação, recurso administrativo ou ação judicial para sua correção.',

      '## Direitos dos Participantes',
      'Os licitantes possuem direitos fundamentais que devem ser respeitados pela Administração Pública durante todo o certame. Entre os principais direitos estão: acesso integral às informações do certame e aos documentos do processo, prazo adequado e razoável para elaboração das propostas, direito de recurso contra decisões da comissão de licitação, tratamento isonômico sem privilégios ou discriminações, transparência nos critérios de julgamento e habilitação, ampla defesa e contraditório em caso de inabilitação ou desclassificação, e direito à adjudicação do objeto quando vencedor do certame.',
      'A Nova Lei de Licitações também garantiu ao participante o direito de solicitar esclarecimentos sobre o edital e a obrigação da Administração de respondê-los em prazo razoável, assegurando que todos os licitantes tenham acesso às mesmas informações.',

      '## Impugnação do Edital',
      'A impugnação do edital é o instrumento pelo qual qualquer pessoa pode questionar cláusulas ilegais, restritivas ou que comprometam a competitividade do certame. Conforme a Nova Lei de Licitações, qualquer cidadão pode impugnar o edital até três dias úteis antes da data de abertura da licitação. Para licitantes, o prazo também é de três dias úteis.',
      'A impugnação deve ser fundamentada, apontando especificamente quais dispositivos são ilegais ou abusivos e apresentando os argumentos jurídicos e fáticos que sustentam o pedido. A Administração tem o dever de analisar e responder a impugnação em até três dias úteis. A impugnação não possui efeito suspensivo automático, mas pode levar à modificação do edital ou à anulação do certame.',

      '## Recursos Administrativos',
      'Os recursos administrativos são instrumentos essenciais para a defesa dos direitos dos licitantes durante o processo. A Nova Lei de Licitações prevê que os recursos devem ser apresentados no prazo de três dias úteis, contados da data de intimação ou de lavratura da ata, para impugnar: o julgamento das propostas, a habilitação ou inabilitação de licitante, a anulação ou revogação da licitação, e a rescisão do contrato.',
      'O recurso tem efeito suspensivo em relação ao ato recorrido e deve ser apreciado pela autoridade superior em prazo razoável. A decisão do recurso deve ser fundamentada e comunicada a todos os participantes.',

      '## Fiscalização e Controle',
      'Em caso de irregularidades graves no processo licitatório que não sejam sanadas na esfera administrativa, os participantes podem recorrer a órgãos de controle externo. O Tribunal de Contas (da União, dos Estados ou dos Municípios) é responsável pela fiscalização dos atos administrativos e pode determinar a sustação do procedimento. O Ministério Público pode propor ação civil pública para anular licitações fraudulentas. E o Poder Judiciário pode ser acionado por meio de mandado de segurança ou ação ordinária para garantir os direitos dos licitantes.',
      'A Nova Lei de Licitações também fortaleceu os mecanismos de controle interno, exigindo que os órgãos públicos mantenham sistemas de integridade e programas de compliance para prevenir fraudes e irregularidades nas contratações.',

      '## Considerações Finais',
      'Participar de licitações públicas é um direito de toda empresa que atenda aos requisitos legais. Conhecer seus direitos como licitante é fundamental para garantir um tratamento justo e competitivo. Se você identificar irregularidades em processos licitatórios, procure orientação jurídica especializada. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'acidente-trabalho': {
    title: 'Acidente de Trabalho: Direitos e Procedimentos',
    category: 'Direito Trabalhista',
    date: '20 Jan 2026',
    readTime: '5 min',
    content: [
      'O acidente de trabalho é aquele que ocorre pelo exercício do trabalho a serviço da empresa ou pelo exercício do trabalho dos segurados especiais, provocando lesão corporal, perturbação funcional ou doença que cause morte, perda ou redução, permanente ou temporária, da capacidade para o trabalho. A matéria é regulada pelo artigo 19 e seguintes da Lei nº 8.213/91 e pelo artigo 7º, inciso XXVIII, da Constituição Federal.',

      '## O Que Se Equipara ao Acidente de Trabalho',
      'Além do acidente típico (que ocorre durante a execução das atividades laborais), a legislação brasileira equipara outras situações ao acidente de trabalho. As doenças profissionais são aquelas desencadeadas pelo exercício peculiar de determinada atividade (como a silicose em trabalhadores de mineração). As doenças do trabalho são adquiridas em razão das condições especiais em que o trabalho é realizado (como a LER/DORT — Lesão por Esforço Repetitivo).',
      'O acidente de trajeto, ocorrido no percurso entre a residência e o local de trabalho, também é equiparado ao acidente de trabalho. Da mesma forma, agressões sofridas no local de trabalho, contaminação acidental durante o serviço e acidentes ocorridos em viagens a serviço da empresa são considerados acidentes de trabalho para todos os efeitos legais.',

      '## A Comunicação de Acidente de Trabalho (CAT)',
      'A CAT (Comunicação de Acidente de Trabalho) é um documento obrigatório que formaliza a ocorrência do acidente perante o INSS. O empregador é obrigado a emitir a CAT até o primeiro dia útil seguinte ao acidente, independentemente de afastamento do trabalhador. Em caso de morte, a comunicação deve ser imediata.',
      'Se o empregador se recusar a emitir a CAT, podem fazê-lo o próprio acidentado, seus dependentes, o sindicato da categoria, o médico que prestou atendimento ou qualquer autoridade pública. A omissão do empregador na emissão da CAT constitui infração administrativa sujeita a multa e pode configurar prova contra ele em eventual ação judicial.',

      '## Direitos do Trabalhador Acidentado',
      'O trabalhador que sofre acidente de trabalho possui um conjunto amplo de direitos. A estabilidade provisória é um dos mais importantes: o empregado que se afastou por acidente de trabalho tem garantia de emprego de 12 meses após o retorno ao trabalho, conforme artigo 118 da Lei nº 8.213/91 e Súmula 378 do TST. Durante esse período, não pode ser demitido sem justa causa.',
      'Outros direitos incluem: manutenção dos depósitos do FGTS durante todo o período de afastamento, auxílio-doença acidentário (benefício B91 do INSS, que não exige carência mínima de contribuições), auxílio-acidente (indenização paga pelo INSS quando houver redução permanente da capacidade laborativa) e, em caso de incapacidade total e permanente, a aposentadoria por invalidez acidentária.',

      '## Indenização Civil por Acidente de Trabalho',
      'Além dos benefícios previdenciários pagos pelo INSS, o trabalhador pode pleitear indenização por danos morais e materiais contra o empregador. Para isso, é necessário comprovar a culpa do empregador na ocorrência do acidente — seja por negligência na manutenção de equipamentos, descumprimento de normas de segurança, ausência de treinamento adequado ou não fornecimento de Equipamentos de Proteção Individual (EPIs).',
      'A indenização por danos materiais pode incluir despesas médicas, medicamentos, próteses, reabilitação e pensão mensal vitalícia (quando há redução permanente da capacidade de trabalho). A indenização por danos morais leva em conta a gravidade das lesões, o sofrimento da vítima, as condições econômicas das partes e o caráter pedagógico da condenação.',

      '## Prevenção de Acidentes',
      'A prevenção é sempre o melhor caminho. As obrigações do empregador em matéria de segurança do trabalho incluem: fornecimento gratuito e fiscalização do uso de EPIs adequados, realização de treinamentos de segurança periódicos, manutenção da CIPA (Comissão Interna de Prevenção de Acidentes) ativa, cumprimento rigoroso das Normas Regulamentadoras (NRs) do Ministério do Trabalho, elaboração e implementação do PPRA/PGR e PCMSO, e manutenção de um ambiente de trabalho seguro e salubre.',

      '## Considerações Finais',
      'O acidente de trabalho gera consequências graves tanto para o trabalhador quanto para o empregador. Conhecer seus direitos é o primeiro passo para garantir a proteção adequada. Se você sofreu um acidente de trabalho, procure orientação jurídica especializada para assegurar todos os seus direitos. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },

  'recuperacao-judicial': {
    title: 'Recuperação Judicial: Salvando Sua Empresa da Falência',
    category: 'Direito Empresarial',
    date: '15 Jan 2026',
    readTime: '6 min',
    content: [
      'A recuperação judicial é um instrumento jurídico previsto na Lei nº 11.101/2005, profundamente atualizado pela Lei nº 14.112/2020, que tem como objetivo viabilizar a superação da crise econômico-financeira do devedor empresário. O instituto busca preservar a atividade empresarial, manter os postos de trabalho, proteger os interesses dos credores e promover a função social da empresa.',

      '## Quem Pode Requerer a Recuperação Judicial',
      'Nem todo empresário em dificuldades financeiras pode recorrer à recuperação judicial. A lei estabelece requisitos específicos: o devedor deve exercer atividade empresarial regular há mais de dois anos (comprovada pelo registro na Junta Comercial), não pode ser falido (ou, se já foi, deve ter suas obrigações declaradas extintas por sentença transitada em julgado), não pode ter obtido concessão de recuperação judicial nos últimos cinco anos e não pode ter sido condenado por crimes falimentares.',
      'Além disso, o devedor não pode ter obtido recuperação judicial com base no plano especial para microempresas e empresas de pequeno porte nos últimos oito anos. O não atendimento de qualquer desses requisitos impede o deferimento do pedido.',

      '## O Processo de Recuperação Judicial',
      'O processo se inicia com a apresentação de petição ao juízo competente (Vara de Falências e Recuperações Judiciais), acompanhada de extensa documentação contábil e financeira: demonstrações contábeis dos últimos três exercícios, relação completa de credores (com valores e classificação), relação de empregados, certidões de protesto, balanço patrimonial e informações sobre bens e direitos.',
      'Uma vez deferido o processamento da recuperação judicial pelo juiz, a empresa tem o prazo improrrogável de 60 dias para apresentar o plano de recuperação. O juiz também nomeia um administrador judicial, que fiscaliza as atividades do devedor e os interesses dos credores durante todo o processo.',

      '## O Plano de Recuperação',
      'O plano de recuperação é o documento central do processo, no qual o devedor apresenta as medidas que pretende adotar para superar a crise. A lei permite uma ampla variedade de estratégias, incluindo: concessão de prazos e condições especiais para pagamento das dívidas (parcelamento, deságio, carência), cisão, incorporação, fusão ou transformação da sociedade empresária, venda parcial de bens do ativo permanente, substituição total ou parcial dos administradores, aumento de capital social, trespasse ou arrendamento do estabelecimento, e modificação dos estatutos sociais.',
      'O plano deve ser economicamente viável e demonstrar que a empresa tem condições reais de superar a crise. Um plano mal elaborado ou irrealista tende a ser rejeitado pelos credores ou pelo juiz.',

      '## O Stay Period (Período de Suspensão)',
      'Uma das principais vantagens da recuperação judicial é o chamado stay period — a suspensão de todas as ações e execuções contra o devedor pelo prazo de 180 dias, contados do deferimento do processamento. Durante esse período, nenhuma execução individual pode ser movida ou prosseguida contra o devedor, o que permite que a empresa reorganize suas finanças, renegocie contratos e implemente as medidas previstas no plano.',
      'O stay period é essencial para dar fôlego financeiro à empresa em crise, impedindo que execuções individuais de credores inviabilizem a tentativa de recuperação. Após o prazo de 180 dias, caso o plano não tenha sido aprovado, as ações e execuções podem ser retomadas.',

      '## Assembleia de Credores e Aprovação do Plano',
      'Os credores são classificados em quatro classes para fins de votação do plano de recuperação: classe I (créditos trabalhistas), classe II (créditos com garantia real), classe III (créditos quirografários — sem garantia) e classe IV (créditos de microempresas e empresas de pequeno porte). Cada classe vota separadamente na Assembleia Geral de Credores.',
      'Para que o plano seja aprovado, ele deve obter aprovação de todas as classes. Na classe I, a aprovação se dá pela maioria simples dos presentes. Nas classes II e III, exige-se a aprovação de credores que representem mais da metade do valor total dos créditos presentes e, cumulativamente, a maioria simples dos credores presentes. Se o plano for aprovado, o juiz o homologa; se rejeitado, o juiz pode decretar a falência do devedor.',

      '## Efeitos da Recuperação Judicial',
      'Uma vez homologado o plano de recuperação, o devedor permanece em recuperação judicial até o cumprimento de todas as obrigações previstas no plano que se vencerem nos dois anos seguintes à homologação. Durante esse período, o descumprimento de qualquer obrigação pode levar à convolação da recuperação em falência.',
      'A recuperação judicial é encerrada quando o devedor cumpre todas as obrigações previstas no plano dentro do prazo de dois anos, momento em que o juiz decreta o encerramento e o devedor retorna à plena normalidade empresarial.',

      '## Considerações Finais',
      'A recuperação judicial é um instrumento complexo, mas extremamente valioso para empresas em crise que ainda possuem viabilidade econômica. O sucesso depende de planejamento adequado, assessoria jurídica e contábil especializada e comprometimento do devedor com o plano apresentado. Se sua empresa enfrenta dificuldades financeiras, procure orientação profissional para avaliar a melhor estratégia. Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
    ],
  },
};

export const defaultArticle: Article = {
  title: 'Artigo Informativo',
  category: 'Direito',
  date: 'Fev 2026',
  readTime: '5 min',
  content: [
    'Este é um artigo informativo sobre temas jurídicos relevantes. O conteúdo completo será disponibilizado em breve.',
    'Para mais informações, entre em contato com Cerbelera & Oliveira Advogados.',
    'Este artigo tem caráter meramente informativo e não constitui aconselhamento jurídico.',
  ],
};
