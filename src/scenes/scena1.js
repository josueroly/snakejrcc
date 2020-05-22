import Food from "../GameObject/food.js";
import Snake from "../GameObject/snake.js";
import Scena2 from "./scena2.js";
let snake;

let food;
let cursors;
let puntos =0;
let eventoScena;
//textos
let Mipuntaje;
class Scena1 extends Phaser.Scene{
    constructor() {
        super({key:'Scene1'});
    }
    create(){
        food = new Food(this, 3, 4);
        snake = new Snake(this, 8, 8);
        //  Create our keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
        eventoScena= this.registry.events.on('sceneDos',()=>{
            this.scene.add("Scene2", new Scena2(puntos));//cargamos scene

            this.scene.start("Scene2");//iniciamos escena
        });
        var graphics = this.add.graphics();
        graphics.lineStyle(70, 0x070707);
        graphics.strokeRect(0,452,640,64);

        // textos
        Mipuntaje = this.add.text(10, 440, '0', {
            font: '30px Arial', fill: '#1aff53'
        });

    }
     update (time, delta)
    {

        if (!snake.alive)
        {
            return;
        }
        
        Mipuntaje.setText([
            puntos*10
        ]);

        /**
         * Check which key is pressed, and then change the direction the snake
         * is heading based on that. The checks ensure you don't double-back
         * on yourself, for example if you're moving to the right and you press
         * the LEFT cursor, it ignores it, because the only valid directions you
         * can move in at that time is up and down.
         */
        if (cursors.left.isDown)
        {
            snake.faceLeft();
        }
        else if (cursors.right.isDown)
        {
            snake.faceRight();
        }
        else if (cursors.up.isDown)
        {
            snake.faceUp();
        }
        else if (cursors.down.isDown)
        {
            snake.faceDown();
        }

        if (snake.update(time))
        {
            //  si la serpiente come una manzana

            if (snake.collideWithFood(food))
            {
                puntos++;
               if (puntos===10){
                    eventoScena.emit("sceneDos");
               }
                this.repositionFood();

            }


        }
    }

    /**
     *Podemos colocar la comida en cualquier lugar de nuestra cuadrícula de 40x30
     ** excepto* encima de la serpiente, así que necesitamos
     *para filtrarlos de los posibles lugares de comida.
     *Si no quedan lugares, ¡han ganado!
     **
     * @method repositionFood
     * @return {boolean} true if the food was placed, otherwise false
     */
    repositionFood ()
    {
        var testGrid = [];// Primero crea una matriz que asume todas las posiciones
        // son válidos para la nueva pieza de comida
        // Una cuadrícula que usaremos para reposicionar la comida cada vez que se come
        for (var y = 0; y < 26; y++)
        {
            testGrid[y] = [];

            for (var x = 0; x < 40; x++)
            {
                testGrid[y][x] = true;
            }
        }

        snake.updateGrid(testGrid,false,false,false,false,false,false,);


// Purga posiciones falsas
        var validLocations = [];

        for (var y = 0; y < 26; y++)
        {
            for (var x = 0; x < 40; x++)
            {
                if (testGrid[y][x] === true)
                {
                    // ¿Es esta posición válida para la comida? Si es así, agréguelo aquí ...
                    validLocations.push({ x: x, y: y });
                }
            }
        }

        if (validLocations.length > 0)
        {
            // Usa el RNG para elegir una posición de comida aleatoria
            var pos = Phaser.Math.RND.pick(validLocations);

            // Y colocarlo
            food.setPosition(pos.x * 16, pos.y * 16);

            return true;
        }
        else
        {
            return false;
        }
    }
}
export default Scena1;