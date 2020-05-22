import Food from "../GameObject/food.js";
import Snake from "../GameObject/snake.js";
import Pared from "../GameObject/pared.js";
let snake;//el cuerpo de la serpiente
let food;//la comida de la serpiente
let pared1;//las paredes
let pared2;
let pared3;
let pared4;

let pared5;
let pared6;

let cursors;//cursores del teclado

let puntos =0; //cantidad de comida que comió
let Mipuntaje=0;
class Scene2 extends Phaser.Scene{
    constructor(punto) {
        super({key:'Scene2'});
        puntos=punto;
    }
    create(){
        food = new Food(this, 3, 4,12);//creamos la comida
        snake = new Snake(this, 10, 10,12);//creamos a la serpiente

        // creamos las paredes
        pared1= new Pared(this,2,2,5);
        pared2= new Pared(this,37,2,5);

        pared3= new Pared(this,2,18,5);
        pared4= new Pared(this,37,18,5);

        pared5= new Pared(this,8,8,10);
        pared6= new Pared(this,31,8,10);
        var graphics = this.add.graphics();
        graphics.lineStyle(70, 0x070707);
        graphics.strokeRect(0,452,640,64);

        // textos
        Mipuntaje = this.add.text(10, 440, '0', {
            font: '30px Arial', fill: '#1aff53'
        });

        //  creamos los controles del teclado
        cursors = this.input.keyboard.createCursorKeys();

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
        if (cursors.left.isDown) snake.faceLeft();
        else if (cursors.right.isDown)  snake.faceRight();
        else if (cursors.up.isDown) snake.faceUp();
        else if (cursors.down.isDown) snake.faceDown();


        if (snake.update(time))
        {
            //  si la serpinete choca con la comida
            if (snake.collideWithFood(food))this.repositionFood(),puntos++;

            if (snake.collideWithBlock(pared1.block))snake.alive=false;
            if (snake.collideWithBlock(pared2.block))snake.alive=false;
            if (snake.collideWithBlock(pared3.block))snake.alive=false;
            if (snake.collideWithBlock(pared4.block))snake.alive=false;
            if (snake.collideWithBlock(pared5.block))snake.alive=false;
            if (snake.collideWithBlock(pared6.block))snake.alive=false;
        }
    }

    /**
     *Podemos colocar la comida en cualquier lugar de nuestra cuadrícula de 40x26
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

        snake.updateGrid(testGrid,pared1.block,pared2.block,pared3.block,pared4.block,pared5.block,pared6.block);


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
export default Scene2;