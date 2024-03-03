export default class Jogo extends Phaser.Scene {

    //criando as variaveis necessárias
    janelas;
    cadeiras;
    menino;
    pombo;
    teclado;
    velocidadesX = [-530, -350, -530]
    jogoComecou = false;
    celular;
    pegouCelular = false;
    pena;
    placar;
    pontuacao = 0;
    bordasVerticais;
    fimDoJogo = false;
    segundos = 30;
    tempo;

    // construtor da cena
    constructor() {
        super({ key: "Jogo" });
    };
    // Função para carregar os recursos do jogo
    preload() {
        //carrega os assets
        this.load.image("background", "./assets/jogo/background.png");
        this.load.image("cadeiras", "./assets/jogo/cadeiras.png");
        this.load.image("janela", "./assets/jogo/janelas.png");
        this.load.spritesheet("menino", "./assets/jogo/menino.png", { frameWidth: 224, frameHeight: 203});
        this.load.spritesheet("pombo", "./assets/jogo/pombo.png", { frameWidth: 224, frameHeight: 224});
        this.load.image("janelas", "./assets/jogo/janelas.png");
        this.load.image("celular", "./assets/jogo/celular.png")
        this.load.image("pena", "./assets/jogo/ponto.png");
    }
    create() {
        //adiciona o fundo
        this.add.image(400, 300, "background");

        //adiciona as janelas sem gravidade
        this.janelas = this.physics.add.image(800, 300, "janela").setOrigin(1, 0.5).setAlpha(0.6);
        this.janelas.body.setAllowGravity(false);

        //adiciona as cadeiras sem gravidade
        this.cadeiras = this.physics.add.image(1300, 450, "cadeiras").setOrigin(1, 0.5).setSize(360, 150);
        this.cadeiras.body.setAllowGravity(false);
        this.cadeiras.body.setImmovable(true);

        //adiciona o menino e faz o menino colidir com as cadeiras
        this.menino = this.physics.add.sprite(100, 450, "menino").setScale(1.5).setSize(112, 203);
        this.physics.add.collider(this.cadeiras, this.menino);

        //adiciona retangulos para colidirem com o menino nas bordas verticais
        this.bordasVerticais = [this.add.rectangle(400, 600, 800, 2, 0x00000), this.add.rectangle(400, 0, 800, 2, 0x00000), ];     

        //para cada borda...
        for (let i = 0; i < 2; i++) {
            //faz com que os retangulos sejam considerados corpos fisicos   
            this.physics.add.existing(this.bordasVerticais[i], true);
            //adiciona colisões entre as bordas, as cadeiras e o menino
            this.physics.add.collider(this.bordasVerticais[i], this.menino);
        }

        //adiciona o teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        //adiciona o celular sem gravidade
        this.celular = this.physics.add.sprite(150, 470, "celular").setScale(0.33).setSize(224/3, 224/3).setAngle(10);
        this.celular.body.setAllowGravity(false);

        //adiciona o pombo sem gravidade, mas com velocidade inicial
        this.pombo = this.physics.add.sprite(0, 0, "pombo");
        this.pombo.body.setAllowGravity(false);
        this.pombo.setVelocity(50, 400);

        //adiciona a animação do pombo
        this.anims.create({
            key: 'voar',
            frames: this.anims.generateFrameNumbers('pombo', { start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1
        });

        //toca a animação de voo
        this.pombo.anims.play('voar', true);

        //adiciona a animação do menino que perdeu o celular
        this.anims.create({
            key: 'olhar',
            frames: this.anims.generateFrameNumbers('menino', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: 0
        });
        //toca a animação do menino de olhar depois de 2,5 segundos
        setTimeout(() => {this.menino.anims.play('olhar', true);}, 2500);

        //adiciona a pena sem gravidade, a qual será a pontuação
        this.pena = this.physics.add.image(1500, 100, "pena").setScale(0.1);
        this.pena.body.setAllowGravity(false);
        
        //adiciona o placar
        this.placar = this.add.text(40, 60, 'Pontos: 0', {fontSize:'45px', fill:'#ffffff'});

        //quando o menino e a pena se tocarem...
        this.physics.add.overlap(this.pena, this.menino, () => {
            //pena fica invisivel
            this.pena.setVisible(false);
            //pontuacao aumenta
            this.pontuacao += 10;
            //placar é atualizado
            this.placar.setText('Pontos:' + this.pontuacao);
            //posicao y da moeda é randomizada
            this.pena.setPosition(1400, Phaser.Math.Between(20, 300));           
            //pena fica visivel
            this.pena.setVisible(true);
        });

        //adiciona o tempo restante até a captura do pombo
        this.tempo = this.add.text(500, 60, 'Restam:' + this.segundos + "s", {fontSize:'45px', fill:'#ffffff'});

        //adiciona a animação de corrida do menino
        this.anims.create({
            key: 'correr',
            frames: this.anims.generateFrameNumbers('menino', { start: 3, end: 5 }),
            frameRate: 7,
            repeat: -1
        });
        //toca animação de correr do menino depois de 4 segundos
        setTimeout(() => {
            this.menino.anims.play('correr', true); 
        }, 4000);

        //tempo é atualizado a cada 1 segundo
        this.time.addEvent({
            delay: 1000, // 1 segundo
            callback: this.atualizaTempo,
            callbackScope: this,
            loop: true
        });

        //jogo acaba depois de 30 segundos (30 + 5 da ceninha)
            this.time.addEvent({
                delay: 35000,
                callback: () => {
                    this.pombo.setVelocity(-500, 0)
                    this.fimDoJogo = true;
                },
                callbackScope: this,
                loop: false
            });

    }
    update() {

        //incrementadores de velocidade da cadeira, das janelas e dos pontos
        this.velocidadesX[0] -= 0.6;
        this.velocidadesX[1] -= 0.5;
        this.velocidadesX[2] -= 1;

        
        setTimeout(() => {
            //incrementa a velocidade da cadeira, das janelas e dos pontos se o jogo não acabou
            if (!this.fimDoJogo) {
                this.janelas.setVelocityX(this.velocidadesX[1]);
                this.cadeiras.setVelocityX(this.velocidadesX[0]); 
                this.pena.setVelocityX(this.velocidadesX[2]);
            }
            else {
                this.janelas.setVelocityX(0);
                this.cadeiras.setVelocityX(0); 
                this.pena.setVelocityX(0);                
            }
            //define o começo do jogo
            this.jogoComecou = true;
        }, 4000)

        //depois de os objetos chegarem no canto do mundo, voltam do começo
        if(this.janelas.x < 0) {
            this.janelas.setPosition(1600, 300);
        }
        if(this.cadeiras.x < 0) {
            this.cadeiras.setPosition(1400, 450);
        }
        if(this.pena.x < 0) {
            //no caso da pena, posição y randomizada
            this.pena.setPosition(1400, Phaser.Math.Between(20, 300));
        }

        //controles do personagem
        //pulo do personagem
         if (this.teclado.up.isDown && this.menino.y >= 446 && this.jogoComecou) {
            this.menino.setVelocityY(-1500);
        }

        //tecla pra baixo é apertada, então desce rápido
        if (this.teclado.down.isDown) {
            this.menino.setVelocityY(1500);
        }

        //se o menino está depois do canto esquerdo e o jogo não acabou, dá fim do jogo
        if (this.menino.x <= 0 && !this.fimDoJogo) {
            this.fimDoJogo = true;
            this.gameOver();
        }

        //se o pombo está depois de y=500 e o jogo não acabou
        if (this.pombo.y > 500 && !this.fimDoJogo){
            //muda a velocidade do pombo
            this.pombo.setVelocity(500, -200);
            //pombo pega o celular
            this.pegouCelular = true;
        }

        //se o pombo pegou o celular, então o celular fica no bico dele
        if (this.pegouCelular) {
            this.celular.setPosition(this.pombo.x + 100, this.pombo.y - 50);
            //depois que o pombo passou de x = 600 e o jogo não acabou...
            if (this.pombo.x > 600 && !this.fimDoJogo) {
                //passarinho fica parado
                this.pombo.setVelocity(0, 0);

            }
        }
        if(this.jogoComecou) {
            //quando o pombo e o menino se tocarem...
            this.physics.overlap(this.pombo, this.menino, () => {
                //quando o jogador ganha, o pombo é 'pego'
                this.pombo.setVelocity(-20, 0);
                //a camera vai desligando em 250 milissegundos
                this.cameras.main.fadeOut(250);
                //depois de 1,5 segundo, vá para a tela de ganhou, transmitindo para ela a pontuação final
                setTimeout(() => {
                    this.scene.stop("Jogo");
                    this.scene.start("Ganhou", {"message": this.pontuacao});
                }, 2500);
            });
        }

    }
    //função de fim de jogo
    gameOver() {
        //quando o jogador perde, o pombo sai 'correndo'
        this.pombo.setVelocity(400, 0);
        //a camera vai desligando em 250 milissegundos
        setTimeout(() => {
            this.cameras.main.fadeOut(250);
        }, 1000)
        //e a cena de game over começa
        setTimeout(() => {
            this.scene.stop("Jogo");
            this.scene.start("GameOver");
        }, 1500)
    }
    //função de atualizar o tempo
    atualizaTempo() {
        //se o jogo comecou e o tempo não acabou
        if (this.jogoComecou && this.segundos != 0) {
            //decrementa os segundos
            this.segundos -= 1;
            //atualiza o tempo
            this.tempo.setText("Restam:" + this.segundos + "s");
        }
    }

}

