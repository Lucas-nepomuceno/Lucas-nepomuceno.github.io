export default class Inicio extends Phaser.Scene {

    //criando as variaveis necessárias
    botaoInicio;
    imagemBotao;

    // construtor da cena
    constructor() {
        super({ key: "Inicio" });
    };
    // Função para carregar os recursos do jogo
    preload() {
        //carrega o fundo
        this.load.image("fundo", "./assets/inicio/background.png");
        //carrega a imagem do botao de inicio
        this.load.image("botao-inicio", "./assets/inicio/botao-inicio.png");
    }
    create() {
        //adiciona o fundo
        this.add.image(400, 300, "fundo");
        //coloca a variavel botao de inicio como o retangulo que ficará atrás da imagem de botao de inicio e adiciona-o
        this.botaoInicio = this.add.rectangle(400, 370, 354.7, 98);
        //seta o retangulo("botao de inicio") como interativo
        this.botaoInicio.setInteractive({cursor: 'pointer'});
        //adiciona a imagem do botao de inicio que cobrirá o real botao retangular
        this.imagemBotao = this.add.image(400, 370, "botao-inicio");

        //quando o botão é solto, a tela apaga, o botão diminui e o jogo inicia
        this.botaoInicio.on("pointerup", () => {
            this.cameras.main.fadeOut(250);
            this.imagemBotao.setScale(0.95);
            setTimeout(() => {
                this.scene.start("Jogo");
                this.scene.stop("Inicio");
              }, 500);
        });
    }
}