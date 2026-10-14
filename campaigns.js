const palette = (wall, ground, floor, accent) => ({ wall, ground, floor, accent });

const stage = (id, title, location, colors, enemyName, enemyHp, pattern, objective, dialogue, environmentChange, options = {}) => ({
  id,
  title,
  location,
  palette: colors,
  objective: { id: `${id}-objective`, kind: 'investigate', label: objective, x: 810, y: 330 },
  enemies: (Array.isArray(enemyName) ? enemyName : [enemyName]).map((name, index) => ({
    id: `${id}-enemy-${index + 1}`,
    name,
    x: 715 + index * 92,
    y: 240 + (index % 2) * 116,
    hp: Math.round(enemyHp / (Array.isArray(enemyName) ? enemyName.length : 1)),
    color: options.enemyColor || '#bd6852',
    size: index === 0 ? 1.08 : 0.98,
    pattern,
    attackRange: options.attackRange || (pattern === 'ranged' ? 230 : pattern === 'hazard' ? 170 : 88),
    attackDamage: options.attackDamage || (pattern === 'heavy' ? 12 : 8),
    attackInterval: options.attackInterval || (pattern === 'rapid' ? 0.92 : 1.35),
    approachSpeed: options.approachSpeed || (pattern === 'heavy' ? 38 : 48),
  })),
  dialogue: { intro: dialogue[0], encounter: dialogue[1], victory: dialogue[2] },
  environmentChange,
  pathId: `${id}-path`,
  openEndedChapter: options.openEndedChapter === true,
  allyAfterVictory: options.allyAfterVictory || null,
  reward: options.reward || null,
});

export const campaigns = [
  {
    id: 'jonathan', part: 1, title: 'Phantom Blood', protagonist: 'Jonathan Joestar', secretBoss: 'Dio Brando',
    stages: [
      stage('p1-estate', 'A rivalidade na propriedade Joestar', 'Propriedade Joestar', palette('#39473b', '#687354', '#4b5d4b', '#d6c580'), 'Dio Brando', 330, 'duelist', 'Investigue a mesa de estudos de Jonathan.', ['Uma rivalidade toma conta da propriedade enquanto a familia tenta manter a paz.', 'Dio transforma a disputa pessoal em uma luta pela casa.', 'A propriedade muda de dono, mas a suspeita sobre Dio permanece.'], 'O caminho para o patio se abre. Uma pista da mascara fica para tras.', { reward: 'rivalry-seen' }),
      stage('p1-stone-mask', 'O misterio da Mascara de Pedra', 'Arquivo da propriedade', palette('#343b3b', '#615f50', '#454c42', '#c29368'), 'Dio Brando', 380, 'trickster', 'Examine as notas e a mascara de pedra.', ['A investigacao liga a mascara aos acontecimentos recentes.', 'Dio usa o poder vampirico revelado para impedir que Jonathan alcance o arquivo.', 'A mascara e o caminho de Dio deixam de ser um misterio.'], 'As prateleiras tombam e revelam uma saida antes oculta.'),
      stage('p1-hamon-training', 'O treinamento de Hamon', 'Estrada para a montanha', palette('#465142', '#708259', '#586c4e', '#e2cb76'), 'Will A. Zeppeli', 285, 'duelist', 'Fale com Zeppeli para iniciar o treinamento.', ['Zeppeli oferece a Jonathan uma nova forma de enfrentar vampiros.', 'O treinamento se transforma em um teste de controle do Hamon.', 'Jonathan compreende como conduzir Hamon sem perder o ritmo.'], 'As pedras do caminho se movem e revelam uma trilha de subida.', { allyAfterVictory: 'zeppeli', reward: 'hamon-training' }),
      stage('p1-jack', 'A neblina de Londres', 'Rua de Londres', palette('#394345', '#626457', '#444c48', '#b5aa7b'), 'Jack, o Estripador', 410, 'rapid', 'Siga os rastros ate a viela.', ['Uma rua coberta por neblina esconde um atacante rapido.', 'Jack tenta manter Jonathan longe das saidas da viela.', 'A rua volta a ficar acessivel e os moradores indicam o proximo caminho.'], 'A barricada cede e abre a passagem para o cemiterio.'),
      stage('p1-knights', 'Os cavaleiros do cemiterio', 'Cemiterio sob o castelo', palette('#34393d', '#5c5a50', '#3d4441', '#adb5a0'), ['Bruford', 'Tarkus'], 660, 'heavy', 'Investigue as inscricoes entre os tumulos.', ['A passagem desperta dois cavaleiros com estilos diferentes.', 'Bruford controla a aproximacao; Tarkus pressiona com ataques pesados.', 'O caminho ate o castelo fica livre e Jonathan segue em frente.'], 'Os portoes do castelo se abrem apos a batalha.', { attackDamage: 11, allyAfterVictory: 'zeppeli' }),
      stage('p1-final-dio', 'Jonathan contra Dio', 'Castelo em chamas', palette('#44383a', '#704e48', '#594340', '#efb566'), 'Dio Brando', 690, 'vampire', 'Atravesse o salao ate o confronto final.', ['O castelo cede enquanto Dio concentra o poder vampirico.', 'Dio alterna investidas diretas com ataques que cobrem o salao.', 'A ameaca desta jornada termina, e a campanha de Jonathan e concluida.'], 'O salao desaba; a trilha seguinte leva a uma nova geracao.', { attackDamage: 13, attackInterval: 1.15, reward: 'scarlet-overdrive', chapterEnd: true }),
    ],
  },
  {
    id: 'joseph', part: 2, title: 'Battle Tendency', protagonist: 'Joseph Joestar', secretBoss: 'Kars',
    stages: [
      stage('p2-investigation', 'A investigacao dos Homens do Pilar', 'Nova York, 1938', palette('#4a4440', '#776b52', '#605842', '#e4bc65'), 'Patrulha da mascara', 340, 'rapid', 'Examine as marcas na coluna de pedra.', ['Joseph encontra sinais de uma ameaca muito mais antiga.', 'Um guardiao tenta impedir a investigacao.', 'O registro recuperado aponta para a instalacao seguinte.'], 'A passagem para a instalacao fica acessivel.'),
      stage('p2-santana', 'Santana desperta', 'Instalacao subterranea', palette('#373b38', '#665d4d', '#4e4c42', '#c5a875'), 'Santana', 520, 'trickster', 'Ative o painel de contencao.', ['Uma instalacao estreita foi construida para conter algo que voltou a se mover.', 'Santana usa os corredores para encurtar a distancia e surpreender Joseph.', 'A contencao muda de estado e os pesquisadores conseguem evacuar.'], 'As luzes de emergencia se acendem e uma porta de manutencao destranca.', { attackRange: 76, reward: 'ripple-trap' }),
      stage('p2-esidisi', 'A pressao de Esidisi', 'Passagem vulcanica', palette('#59453c', '#80543c', '#65483c', '#f29a57'), 'Esidisi', 575, 'hazard', 'Localize a fonte de calor.', ['A temperatura da passagem sobe a cada investida.', 'Esidisi cerca Joseph com rajadas de calor e exige movimento constante.', 'A fonte de calor esfria e o grupo pode prosseguir.'], 'Vapor libera uma passagem lateral para a crista.'),
      stage('p2-wamuu', 'O duelo com Wamuu', 'Arena do deserto', palette('#786147', '#a88755', '#8c704b', '#ead087'), 'Wamuu', 640, 'duelist', 'Marque o local do duelo.', ['Wamuu propoe um confronto em que observar vale tanto quanto atacar.', 'Seus sinais anunciam ataques direcionais e abrem janelas curtas de contra-ataque.', 'O duelo termina, e Wamuu revela a rota para o confronto seguinte.'], 'Os espectadores deixam a arena e uma nova rota fica visivel.', { attackDamage: 10 }),
      stage('p2-kars', 'Kars e a forma suprema', 'Ilha vulcanica', palette('#4b3c3a', '#785044', '#5c4940', '#e9b563'), 'Kars', 780, 'vampire', 'Alcance o centro da cratera.', ['Kars muda de forma e transforma o terreno em parte do confronto.', 'Ataques mais rapidos e zonas de perigo pressionam Joseph a se reposicionar.', 'A ameaca dos Homens do Pilar termina sem apagar o caminho de Joseph.'], 'O fluxo da lava abre a saida da cratera.', { attackDamage: 13, reward: 'ultimate-counter', chapterEnd: true }),
    ],
  },
  {
    id: 'jotaro', part: 3, title: 'Stardust Crusaders', protagonist: 'Jotaro Kujo', secretBoss: 'DIO',
    stages: [
      stage('p3-stand-awakening', 'O despertar de Star Platinum', 'Toquio, 1988', palette('#464456', '#737052', '#545749', '#d78a83'), 'Agente de DIO', 350, 'duelist', 'Observe o Stand que aparece ao lado de Jotaro.', ['Um Stand se manifesta sem que Jotaro saiba como controla-lo.', 'O agente de DIO ataca enquanto o novo poder ainda e instavel.', 'A origem da ameaca aponta para um antigo aliado da familia.'], 'O portao da escola se abre e a jornada comeca.'),
      stage('p3-alliance', 'Aliados sob suspeita', 'Clinica em Toquio', palette('#445153', '#6d7164', '#505d55', '#8cc1ca'), 'Noriaki Kakyoin', 395, 'ranged', 'Encontre a origem do sinal de Stand.', ['Kakyoin esta sob a influencia de uma forca que nao controla.', 'Seus ataques a distancia obrigam Jotaro a atravessar a sala.', 'Livre da influencia, Kakyoin passa a acompanhar o grupo.'], 'Os equipamentos medicos revelam a localizacao de Avdol.', { allyAfterVictory: 'kakyoin' }),
      stage('p3-avdol-polnareff', 'Uma alianca improvavel', 'Rota para o Egito', palette('#775f43', '#9b8051', '#786544', '#dbaf6a'), ['Avdol', 'Jean Pierre Polnareff'], 570, 'ranged', 'Intercepte o comboio antes da fronteira.', ['Avdol e Polnareff testam os limites da equipe antes de confiar em Jotaro.', 'Os dois alternam ataques a distancia e aproximacoes diretas.', 'A equipe reconhece os novos aliados e libera a rota para o Egito.'], 'O comboio segue para o porto com a equipe reunida.', { allyAfterVictory: 'avdol-polnareff' }),
      stage('p3-ndoul', 'A ameaca de N Doul', 'Margem do deserto egipcio', palette('#816747', '#a48a58', '#90734e', '#cdb66e'), 'N Doul', 470, 'ranged', 'Rastreie o som das ondas no deserto.', ['Um atacante distante se esconde fora da linha de visao.', 'N Doul controla o espaco e pune movimentos previsiveis.', 'O rastro leva a um posto avancado de DIO.'], 'Uma duna desaba e revela o caminho ao posto.'),
      stage('p3-darby', 'Os jogos dos irmaos D Arby', 'Mansao no Cairo', palette('#4c4541', '#796e5a', '#5e5549', '#d8bf87'), 'Daniel J. D Arby', 520, 'trickster', 'Investigue os objetos sobre a mesa.', ['Uma aposta suspeita envolve a equipe em vez de um duelo convencional.', 'D Arby tenta distrair o jogador antes de cada investida.', 'A pista conquistada revela a passagem para o esconderijo.'], 'As portas da mansao destrancam e liberam os companheiros.'),
      stage('p3-vanilla-dio', 'Vanilla Ice e o encontro com DIO', 'Mansao de DIO', palette('#403e48', '#635a58', '#4d484d', '#e0c46c'), ['Vanilla Ice', 'DIO'], 920, 'temporal', 'Localize a sala central da mansao.', ['A equipe chega a DIO depois de atravessar corredores desfeitos.', 'Vanilla Ice distorce o alcance; DIO alterna investidas com breves paradas temporais.', 'A equipe sobrevive ao confronto e Holly pode finalmente descansar.'], 'A mansao perde sua protecao temporal.', { attackDamage: 14, reward: 'star-finger', chapterEnd: true }),
    ],
  },
  {
    id: 'josuke4', part: 4, title: 'Diamond Is Unbreakable', protagonist: 'Josuke Higashikata', secretBoss: 'Yoshikage Kira',
    stages: [
      stage('p4-morioh', 'Uma manha em Morioh', 'Morioh, 1999', palette('#49544b', '#74785a', '#5a674d', '#d58d80'), 'Yukako Yamagishi', 355, 'rapid', 'Investigue a sala alterada na escola.', ['A cidade parece tranquila, mas os Stands deixam marcas por toda parte.', 'Yukako transforma o corredor em uma armadilha de fios.', 'Os estudantes apontam uma nova ocorrencia na cidade.'], 'O corredor bloqueado e liberado.', { reward: 'crazy-diamond-rush' }),
      stage('p4-angelo', 'A pista de Angelo', 'Rua perto do rio', palette('#435050', '#6c735f', '#536257', '#7fb5ad'), 'Angelo', 480, 'trickster', 'Examine o hidrante danificado.', ['Uma trilha de objetos restaurados leva ate o rio.', 'Angelo usa a agua e as esquinas para atacar fora de vista.', 'A evidencia encontrada indica que a cidade esconde outros usuarios de Stand.'], 'Crazy Diamond restaura a ponte e revela a margem oposta.'),
      stage('p4-keicho-akira', 'Flechas e sons eletricos', 'Deposito de Morioh', palette('#454e50', '#686f62', '#4e5d57', '#dfb16c'), ['Keicho Nijimura', 'Akira Otoishi'], 610, 'ranged', 'Desative o amplificador no deposito.', ['A flecha e a energia eletrica conectam dois conflitos da cidade.', 'Keicho tenta manter distancia; Akira transforma os cabos em zonas perigosas.', 'O equipamento e recuperado e um novo morador aceita conversar.'], 'A corrente desliga e o portao lateral se abre.'),
      stage('p4-stand-users', 'Pistas na rua das lojas', 'Centro comercial de Morioh', palette('#665249', '#8b7655', '#706047', '#c994b0'), ['Yukako', 'Rohan', 'Shigechi'], 690, 'trickster', 'Siga as anotacoes deixadas perto das lojas.', ['Pistas cruzadas levam a encontros com usuarios de Stand muito diferentes.', 'O adversario muda o ritmo conforme os objetos ao redor.', 'Uma testemunha reconhece o habito que liga os incidentes.'], 'As vitrines se abrem e o mapa da cidade ganha uma nova rota.'),
      stage('p4-kira', 'A identidade de Yoshikage Kira', 'Morioh depois do anoitecer', palette('#383f49', '#626354', '#434d4e', '#df7d69'), 'Yoshikage Kira', 760, 'trickster', 'Restaure os vestigios perto da estacao.', ['A investigacao aponta para um morador que tenta passar despercebido.', 'Kira usa bombas e armadilhas; objetos destruidos guardam pistas de sua passagem.', 'Morioh pode voltar a noite comum, e a campanha de Josuke se encerra.'], 'A rua e reconstruida apos a fuga de Kira.', { attackDamage: 13, reward: 'restoration-field', chapterEnd: true }),
    ],
  },
  {
    id: 'giorno', part: 5, title: 'Golden Wind', protagonist: 'Giorno Giovanna', secretBoss: 'Diavolo',
    stages: [
      stage('p5-bucciarati', 'O encontro com Bucciarati', 'Napoles, Italia', palette('#655248', '#92714e', '#745941', '#d7c276'), 'Bruno Bucciarati', 370, 'duelist', 'Encontre Bucciarati perto da estacao.', ['Giorno explica seu objetivo a alguem que conhece as ruas de Napoles.', 'Bruno avalia Gold Experience em um confronto controlado.', 'Bruno aceita levar Giorno ate a equipe.'], 'O acesso ao esconderijo da equipe e revelado.', { allyAfterVictory: 'bruno-bucciarati' }),
      stage('p5-polpo', 'A provacao de Polpo', 'Prisao de seguranca', palette('#3e4b47', '#666f60', '#4b5d53', '#d49967'), 'Polpo', 465, 'trickster', 'Complete a tarefa da chama sem apaga-la.', ['Uma tarefa simples esconde uma regra dificil de perceber.', 'Polpo pressiona com ataques que punem a aproximacao descuidada.', 'A equipe recebe uma missao e confia em Giorno.'], 'O elevador da prisao se abre para a proxima missao.'),
      stage('p5-formaggio-illuso', 'A equipe de assassinato', 'Viela de Roma', palette('#584a46', '#7c6852', '#5c574c', '#c2a66c'), ['Formaggio', 'Illuso'], 620, 'trickster', 'Compare os objetos no mapa e na viela.', ['Um ataque muda de escala, depois tenta separar Giorno do grupo.', 'Formaggio encurta distancias; Illuso explora superficies refletoras.', 'As duas pistas apontam para a rota da equipe de assassinato.'], 'O espelho se parte e revela uma saida escondida.'),
      stage('p5-prosciutto-pesci', 'A perseguição no trem', 'Trem noturno', palette('#44484a', '#746b59', '#515951', '#ddaa72'), ['Prosciutto', 'Pesci'], 700, 'rapid', 'Alcance o vagao da frente.', ['A equipe fica presa em um trem que nao pode parar.', 'Um adversario envelhece quem se aproxima; o outro persegue a equipe pelo corredor.', 'O trem para e o destino da entrega volta a ficar sob controle.'], 'As portas entre os vagoes destrancam.', { attackDamage: 12 }),
      stage('p5-ghiacchio', 'O frio de Ghiaccio', 'Estrada alpina', palette('#46545c', '#798a8c', '#52686a', '#b0d8d3'), 'Ghiaccio', 610, 'hazard', 'Alcance o abrigo antes que o caminho congele.', ['O caminho se torna cada vez mais escorregadio e estreito.', 'Ghiaccio cobre o terreno com ataques gelados e restringe rotas.', 'A equipe chega ao abrigo com a missao intacta.'], 'O gelo cede e deixa visivel o caminho para a costa.', { enemyColor: '#88c4cd' }),
      stage('p5-diavolo', 'Giorno contra Diavolo', 'Coliseu em Roma', palette('#544544', '#786155', '#594e4a', '#d99071'), 'Diavolo', 810, 'temporal', 'Suba ate a arena do coliseu.', ['O chefe da organizacao aparece por tras de uma sequencia de missoes.', 'King Crimson antecipa a ameaca; marcas no chao indicam onde o tempo sera cortado.', 'Gold Experience Requiem muda o rumo do confronto e a campanha termina.'], 'O coliseu se abre para a cidade ao amanhecer.', { attackDamage: 15, reward: 'enhanced-life-creation', chapterEnd: true }),
    ],
  },
  {
    id: 'jolyne', part: 6, title: 'Stone Ocean', protagonist: 'Jolyne Cujoh', secretBoss: 'Enrico Pucci',
    stages: [
      stage('p6-gwess', 'Regras da cela', 'Green Dolphin Street', palette('#485154', '#677269', '#505e59', '#b889ae'), 'Gwess', 390, 'trickster', 'Investigue a cela ao lado.', ['A prisao esconde regras que mudam quando ninguem esta olhando.', 'Gwess reduz o espaco de luta e tenta manter Jolyne presa.', 'A cela e liberada e Jolyne encontra um contato confiavel.'], 'A porta da cela permanece aberta.'),
      stage('p6-johngalli', 'O tiro que nao devia existir', 'Enfermaria da prisao', palette('#445257', '#69766c', '#4e625c', '#b3ca8a'), 'Johngalli A', 485, 'ranged', 'Encontre a origem do disparo na enfermaria.', ['A trajetoria do tiro parece impossivel de rastrear.', 'Johngalli A pressiona de longe enquanto Stone Free costura uma rota de aproximacao.', 'A equipe reconhece o plano de fuga de Pucci.'], 'Uma passagem de servico liga a enfermaria ao patio.'),
      stage('p6-foo-sportsmaxx', 'Aliados improvaveis', 'Setor subterraneo', palette('#39454b', '#63695e', '#475953', '#7fc0ae'), ['Foo Fighters', 'Sports Maxx'], 610, 'rapid', 'Localize a saida junto ao encanamento.', ['Um encontro com uma nova aliada divide a equipe entre confianca e cautela.', 'Sports Maxx usa o espaco fechado; F.F. muda o curso do encontro.', 'A alianca altera os objetivos da fuga e abre outro setor.'], 'A tubulacao quebrada deixa passar luz do patio.', { allyAfterVictory: 'foo-fighters' }),
      stage('p6-rikiel-versus', 'O rastro dos filhos de DIO', 'Estrada para a Florida', palette('#6f5947', '#997954', '#766247', '#cc986c'), ['Rikiel', 'Versus'], 680, 'hazard', 'Siga as marcas de calor ate a estrada.', ['Os rastros de dois inimigos conduzem a caminhos diferentes.', 'Rikiel ataca em sequencias; Versus transforma o terreno em uma armadilha.', 'Jolyne alcanca o grupo de Pucci.'], 'A barreira da estrada cai e libera o veiculo da equipe.'),
      stage('p6-pucci', 'O plano de Pucci', 'Cape Canaveral', palette('#465050', '#71806c', '#526657', '#d0b578'), 'Enrico Pucci', 800, 'temporal', 'Alcance a plataforma antes do proximo ciclo.', ['O plano de Pucci altera a percepcao de tempo e distancia.', 'Made in Heaven acelera o ritmo; zonas temporais antecipam as investidas.', 'A jornada de Jolyne termina, sem apagar as escolhas de seus aliados.'], 'A plataforma se abre e o ciclo da campanha e encerrado.', { attackDamage: 14, reward: 'string-trap', chapterEnd: true }),
    ],
  },
  {
    id: 'johnny', part: 7, title: 'Steel Ball Run', protagonist: 'Johnny Joestar', secretBoss: 'Funny Valentine',
    stages: [
      stage('p7-start-race', 'A largada da Steel Ball Run', 'Oeste americano', palette('#765c43', '#a27e4d', '#826546', '#e4bd72'), 'Diego Brando', 420, 'rusher', 'Alcance o marco da primeira etapa.', ['Johnny e Gyro entram em uma corrida que muda o terreno a cada trecho.', 'Diego disputa a frente e obriga Johnny a equilibrar movimento e precisao.', 'O mapa da corrida marca o proximo ponto de controle.'], 'A cerca da corrida cai para a proxima etapa.', { reward: 'tusk-act-1' }),
      stage('p7-blackmore', 'Chuva no vale', 'Vale sob chuva', palette('#49504d', '#717562', '#545e57', '#94b7af'), 'Blackmore', 520, 'ranged', 'Rastreie as pegadas interrompidas.', ['A chuva esconde uma trilha que so aparece por instantes.', 'Blackmore controla as rotas e pune quem para no meio do vale.', 'Os sinais indicam onde Gyro encontrou os restos sagrados.'], 'O nevoeiro abre uma trilha entre as rochas.'),
      stage('p7-ringo', 'O momento de Ringo Roadagain', 'Fazenda abandonada', palette('#605046', '#887452', '#6e5b46', '#c59569'), 'Ringo Roadagain', 550, 'temporal', 'Examine o relogio na varanda.', ['O duelo parece reiniciar cada vez que alguem hesita.', 'Ringo usa um pequeno retrocesso temporal; o relogio indica o ciclo.', 'O duelo termina e a equipe consegue seguir sem um atalho temporal.'], 'O portao da fazenda permanece aberto.'),
      stage('p7-valentine', 'D4C e as dimensoes', 'Corredor entre dimensoes', palette('#453f52', '#716453', '#544b57', '#c38496'), 'Funny Valentine', 760, 'spatial', 'Siga as marcas dos restos sagrados.', ['Valentine usa o espaco entre mundos para escapar do confronto.', 'D4C muda a posicao das ameacas e cria rotas que se fecham.', 'O plano de Valentine perde o controle sobre os restos.'], 'As fendas dimensionais se fecham atras de Johnny.', { reward: 'tusk-act-2' }),
      stage('p7-infinite-rotation', 'A rotacao infinita', 'Etapa final da corrida', palette('#735840', '#a1814f', '#806448', '#ebd077'), ['Funny Valentine', 'Diego Brando alternativo'], 960, 'rusher', 'Alcance o marco final da corrida.', ['Johnny e Gyro unem o aprendizado da viagem em uma ultima tentativa.', 'Tusk Act 4 e necessario para atravessar as mudancas dimensionais de D4C.', 'A corrida termina com uma consequencia duradoura para Johnny e Gyro.'], 'A linha de chegada fica marcada como memoria da jornada.', { attackDamage: 14, reward: 'tusk-act-4', chapterEnd: true }),
    ],
  },
  {
    id: 'gappy', part: 8, title: 'JoJolion', protagonist: 'Josuke Higashikata (Gappy)', secretBoss: 'Tooru',
    stages: [
      stage('p8-identity', 'Uma identidade em aberto', 'Morioh, 2011', palette('#46524f', '#75806a', '#596a59', '#d5a978'), 'Yotsuyu Yagiyama', 470, 'trickster', 'Investigue a parede de rocha perto da cidade.', ['Josuke encontra rastros de uma vida que nao consegue recordar.', 'Yotsuyu transforma o terreno em um risco que se aproxima lentamente.', 'A primeira pista aponta para a familia Higashikata.'], 'Uma fenda na rocha expõe um novo caminho.'),
      stage('p8-aisho', 'A busca pelos Rokakaka', 'Distrito comercial', palette('#545249', '#837752', '#6a624a', '#c89c78'), 'Aisho Dainenjiyama', 485, 'ranged', 'Siga os recibos ate o galpao.', ['Recibos e relatos aproximam a equipe de um fruto raro.', 'Aisho protege o galpao com ataques de longa distancia.', 'Os registros identificam outro participante da busca.'], 'A grade do galpao se abre sem destruir as provas.'),
      stage('p8-damo', 'A casa de Tamaki Damo', 'Casa isolada', palette('#454b47', '#726e55', '#545d4e', '#c49475'), 'Tamaki Damo', 610, 'trickster', 'Examine o interruptor fora da sala.', ['A aparente calma da casa esconde uma armadilha para os visitantes.', 'Damo altera a superficie dos objetos e esconde o alcance de seus ataques.', 'A equipe recupera uma prova sobre a busca pelo Rokakaka.'], 'A casa perde o isolamento e a equipe pode sair.'),
      stage('p8-poor-tom', 'Vigilancia sob suspeita', 'Plantacao de Rokakaka', palette('#435045', '#73865a', '#536a4d', '#e0c777'), 'Poor Tom', 640, 'hazard', 'Marque as plantas que ainda estao intactas.', ['A plantacao concentra o valor e o perigo da investigacao.', 'Poor Tom cria uma ameaca ambiental que exige observar o chao.', 'A prova permite reconhecer quem controla as ocorrencias.'], 'As plantas protegidas ficam acessiveis.'),
      stage('p8-tooru', 'Wonder of U', 'Hospital universitario', palette('#4d4c55', '#77755f', '#595c57', '#b5a2c4'), 'Tooru', 790, 'spatial', 'Siga a bolha que nao altera o vento.', ['A perseguicao parece atrair acidentes sempre que alguem se aproxima.', 'Wonder of U transforma a calamidade em ameaca de area.', 'Go Beyond atravessa a defesa e encerra este capitulo de JoJolion.'], 'A calamidade cessa e a rota para fora do hospital se abre.', { attackDamage: 14, reward: 'go-beyond', chapterEnd: true }),
    ],
  },
  {
    id: 'jodio', part: 9, title: 'The JOJOLands', protagonist: 'Jodio Joestar', secretBoss: 'Oponente do capítulo atual', openEnded: true,
    stages: [
      stage('p9-hawaii', 'O cotidiano no Havai', 'Havai, 2023', palette('#40534c', '#78835a', '#556a51', '#8bc7b2'), 'Ameaça da missão', 390, 'rusher', 'Fale com Dragona no ponto de encontro.', ['Jodio e Dragona planejam como conseguir dinheiro sem chamar atencao.', 'Um imprevisto interrompe o acordo e testa o controle de November Rain.', 'A missao continua, mas a equipe precisa rever o plano.'], 'A chuva limpa as marcas e revela a saida da rua.', { reward: 'november-rain' }),
      stage('p9-team', 'Um trabalho para a equipe', 'Estrada na ilha', palette('#43574c', '#7b8858', '#596c4f', '#d7ba76'), 'Seguranca do carregamento', 465, 'rapid', 'Encontre Paco e Usagi no acostamento.', ['Paco e Usagi acompanham Jodio em um trabalho que depende de coordenacao.', 'A seguranca muda o trajeto quando a equipe se aproxima.', 'O carregamento chega ao destino, com novas duvidas sobre seu valor.'], 'A equipe muda o ponto de encontro.', { allyAfterVictory: 'paco-usagi' }),
      stage('p9-diamond', 'O diamante na propriedade', 'Propriedade na ilha', palette('#49604b', '#788754', '#596c50', '#e1c37b'), 'Vigilancia da propriedade', 510, 'spatial', 'Localize a passagem para a propriedade.', ['A equipe investiga uma propriedade sem conhecer todas as ameacas.', 'Rotas de vigilancia e ataques ambientais mudam conforme a aproximacao.', 'O resultado altera o proximo trecho da missao, sem definir o destino final da Parte 9.'], 'O caminho de entrada fica registrado para futuras missoes.'),
      stage('p9-open-chapter', 'Hualalai: continua aberta', 'Hualalai, Havai', palette('#59604a', '#878052', '#686346', '#dbb879'), 'Oponente do capitulo atual', 560, 'trickster', 'Investigue o terreno e acompanhe a equipe.', ['Jodio, Dragona, Paco e Usagi seguem uma pista do capitulo atual.', 'A equipe encontra um obstaculo local; novas etapas podem ser adicionadas sem inventar um final oficial.', 'Este trecho representa o limite atual desta campanha no jogo. A historia de The JOJOLands continua aberta.'], 'Uma trilha fica anotada para o proximo capitulo publicado.', { openEndedChapter: true }),
    ],
  },
];

export function getCampaign(id) {
  return campaigns.find((campaign) => campaign.id === id) || null;
}

export function getCampaignForCharacter(characterId) {
  return getCampaign(characterId);
}