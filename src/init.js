import Scena2 from "./scenes/scena2.js";
import Scena1 from "./scenes/scena1.js";
import Bootloader from "./bootloader.js";
var config = {
    type: Phaser.WEBGL,
    width: 640,//40
    height: 480,//30
    backgroundColor: '#5cf38d',
    parent: 'phaser-example',
    scene:[
        Bootloader,
        Scena1
    ]
};
new Phaser.Game(config);
