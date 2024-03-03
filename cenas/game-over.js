export default class GameOver extends Phaser.Scene {

    // construtor da cena
    constructor() {
        super({ key: "GameOver" });
    };
    // Função para carregar os recursos do jogo
    preload() {
        //carrega o fundo
        this.load.image("back", "./assets/gameOver/background.png");
    }
    create() {
        //adiciona o fundo
        this.add.image(400, 300, "back");

        //apaga a tela em 250 milissegundos
        setTimeout(() => {
            this.cameras.main.fadeOut(250);
        }, 2000)
        //reinicia o jogo
        setTimeout(() => {
            window.location.reload();
            this.scene.stop("GameOver");
        }, 3000)

    }
}