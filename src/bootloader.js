class Bootloader extends Phaser.Scene{
    constructor() {
        super({key:"Bootloader"});
    }
    preload(){
        this.load.on("complete",()=>{
            this.scene.start("Scene1");
        });//este evendo caraga la siguien escena

        this.load.image('food', './assets/food.png');
        this.load.image('body', './assets/cuerpo.png');
        this.load.image('body1', './assets/cuerpo1.png');
        this.load.image('cola', './assets/cola.png');
        this.load.image('header', './assets/cabeza.png');
        this.load.image('block', './assets/body1.png');

    }

}
export default Bootloader;