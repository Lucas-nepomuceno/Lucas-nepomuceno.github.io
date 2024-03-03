//importando as cenas
import Inicio from "./cenas/inicio.js";
import Jogo from "./cenas/jogo.js";
import GameOver from "./cenas/game-over.js";
import Ganhou from "./cenas/ganhou.js";


//configuracoes do jogo
var  config = {
    //renderizador
    type: Phaser.AUTO,

    //tamanho da tela
    width: 800,
    height: 600,

    //fisica aplicada no jogo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100},
            debug: false
        }
    },
    //cenas do jogo
    scene: [Inicio, Jogo, GameOver, Ganhou]
}

//criando uma instância do jogo
const game = new Phaser.Game(config);