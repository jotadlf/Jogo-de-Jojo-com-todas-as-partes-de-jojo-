# Jogo-de-Jojo-com-todas-as-partes-de-jojo-
Jogo para a eletiva sobre Jojo e todos as suas partes

## Eternal Destiny

Protótipo jogável de combate top-down feito com Phaser 3, física Arcade, Vite, CSS e JavaScript. Phaser controla a cena, a escala responsiva, o teclado, os corpos de colisão e o ciclo de atualização; o renderizador 2D em pixel art existente foi preservado como textura da cena. O repositório original só continha este README, então não havia engine ou sistemas anteriores a substituir.

Requisitos: Node.js 20.19+ e npm. Execute `npm install` e `npm run dev`; abra o endereço local apresentado pelo Vite. Para gerar a versão de produção, execute `npm run build`. Execute `npm test` para verificar o catálogo e as regras de progressão.

### Controles

- `W`, `A`, `S`, `D` ou setas: movimentar
- `J` ou espaço: ataque básico na direção do movimento
- `1` a `4`: ativar os poderes mostrados na interface
- `F`: interagir com a pista quando estiver perto do marcador
- Botão **CONTINUAR**: avançar cenas, exploração, objetivos e consequências
- `E` ou o botão **ASSISTÊNCIA**: chamar aliado durante a fase 2 da batalha secreta
- Botão `♪`: ativar ou silenciar efeitos sonoros

### Progressão

As campanhas de Jonathan, Joseph, Jotaro, Josuke, Giorno, Jolyne, Johnny, Gappy e Jodio são definidas em `campaigns.js`. As fases têm objetivos investigáveis, oponentes, paletas e obstáculos próprios, diálogos de entrada/encontro/vitória, rotas, consequências e recompensas. O progresso percorre `INTRO`, exploração, objetivo, encontro, combate, pós-batalha, mudança ambiental e desbloqueio; objetivos e vitórias fora da fase atual não avançam a história.

Concluir uma campanha libera a seguinte. The JOJOLands termina nos capítulos representados e permanece aberta, sem inventar um final oficial. Completar as nove campanhas libera a história secreta, que apresenta uma revanche por Parte em ordem, com 50% a mais de vida e dano no chefe. Depois das nove revanches, Jotaro, Kakyoin e Jolyne enfrentam DIO Over Heaven e Pucci. A segunda fase aumenta vida e dano dos chefes para três vezes os atributos-base, desperta Star Platinum: Over Heaven e libera os poderes supremos. Kakyoin tem as assistências próprias Emerald Splash e Hierophant Green · Barrier.

Vitórias, inimigos derrotados, objetivos, diálogos vistos, caminhos, recompensas e capítulo atual são registrados no `localStorage`. Reabrir o jogo retoma a etapa salva. Transições e eventos são idempotentes. O botão **REINICIAR PROGRESSO** apaga o progresso e desbloqueios deste navegador.

O Phaser Arcade movimenta protagonista e inimigos com hitboxes reais, apresenta golpes telegrafados por padrões, limita o movimento à arena e testa os ataques contra os corpos físicos. A renderização pixel-art atual usa uma textura Canvas no ciclo de cena Phaser.

### Limites do protótipo

Esta é uma primeira versão jogável das campanhas: as fases são missões resumidas com diálogos escritos, não adaptações completas cena a cena. Personagens, obstáculos e efeitos ainda são formas pixeladas desenhadas em código, sem sprites quadro a quadro, trilha sonora, cooperativo local ou mapas completos. Conteúdo original do jogo deve ser entendido como não oficial.
