export default class Ganhou extends Phaser.Scene {

    // construtor da cena
    constructor() {
        super({ key: "Ganhou" });
    };

    init (data) {
        this.pontuacao = data.message;
    }
    // Função para carregar os recursos do jogo
    preload() {
        //carrega o fundo
        this.load.image("tela", "./assets/ganhou/background.png");
    }
    create() {
        //adiciona o fundo
        this.add.image(400, 300, "tela");
        //adiciona a pontuação final do jogador
        this.add.text(this.add.text(250, 450, 'PONTOS:' + this.pontuacao, {fontSize:'60px', fill:'#ffffff'}));
    }
}