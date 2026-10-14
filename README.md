# Jogo-de-Jojo-com-todas-as-partes-de-jojo-
Jogo para a eletiva sobre Jojo e todos as suas partes

## Eternal Destiny

Protótipo jogável de combate top-down feito com Phaser 3, física Arcade, Vite, CSS e JavaScript. Phaser controla a cena, a escala responsiva, o teclado, os corpos de colisão e o ciclo de atualização; o renderizador 2D em pixel art existente foi preservado como textura da cena. O repositório original só continha este README, então não havia engine ou sistemas anteriores a substituir.

Requisitos: Node.js 20.19+ e npm. Execute `npm install` e `npm run dev`; abra o endereço local apresentado pelo Vite. Para gerar a versão de produção, execute `npm run build`.

### Controles

- `W`, `A`, `S`, `D` ou setas: movimentar
- `J` ou espaço: ataque básico na direção do movimento
- `1` a `4`: ativar os poderes mostrados na interface
- `E` ou o botão **ASSISTÊNCIA**: chamar aliado durante a fase 2 da batalha secreta
- Botão `♪`: ativar ou silenciar efeitos sonoros

### Progressão

Todos os nove protagonistas estão selecionáveis. No modo história, vencer o chefe da parte desbloqueia o poder avançado correspondente. Na batalha secreta, derrote DIO Over Heaven e Pucci com Made in Heaven para iniciar a segunda fase: ambos retornam com vida e dano triplicados, os poderes supremos são salvos e uma cena apresenta o despertar de Star Platinum: Over Heaven. Essa forma e suas quatro habilidades são exclusivas de Jotaro e existem apenas na batalha secreta, uma vez por batalha. A assistência não se acumula e inicia recarga de 60 segundos depois que o aliado deixa a arena.

Os desbloqueios são guardados no `localStorage` deste navegador. O botão **REINICIAR PROGRESSO** apaga esse registro.

O Phaser Arcade movimenta o protagonista e os chefes com corpos físicos, restringe o movimento à arena e testa os alcances dos ataques contra as hitboxes dos adversários.

### Limites do protótipo

Os personagens, cenários em camadas, indicadores e efeitos são desenhados em código; não há sprites externos, animação quadro a quadro, sistema de campanha narrativa, modo cooperativo local nem conteúdo completo das arenas. Sons são tons sintetizados. A fase secreta, o combate, as habilidades, a assistência e os desbloqueios persistentes já podem ser experimentados nesta versão.
