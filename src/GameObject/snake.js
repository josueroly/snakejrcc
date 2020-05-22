//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var Snake = new Phaser.Class({

    initialize:

        function Snake(scene, x, y) {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'header');
            this.body1 = this.body.create(x * 16, y * 16, 'body1');
            this.cola = this.body.create(x * 16, y * 16, 'cola');

            this.head.setOrigin(0);
            this.body1.setOrigin(0);
            this.cola.setOrigin(0);
            this.head.flipX = true;
            this.cola.flipX = true;
            this.alive = true;

            this.speed = 100;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

    update: function (time) {
        if (time >= this.moveTime) {

            return this.move(time);
        }
    },

    faceLeft: function () {
        if (this.direction === UP || this.direction === DOWN) {

            this.body.children.iterate((x) => {
                x.setRotation(0);
                x.setOrigin(0);
                x.flipX = false;
            });

            this.heading = LEFT;
        }
    },

    faceRight: function () {
        if (this.direction === UP || this.direction === DOWN) {
            this.body.children.iterate((x) => {
                x.setRotation(0);
                x.setOrigin(0);
                x.flipX = true;
            });

            this.heading = RIGHT;
        }
    },

    faceUp: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {

            this.body.children.iterate((x) => {
                x.setRotation(4.8);
                x.setOrigin(0);
                x.flipX = true;
            });

            this.heading = UP;
        }
    },

    faceDown: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.body.children.iterate((x) => {
                x.setRotation(-4.8);
                x.setOrigin(1);
                x.flipX = true;
            });
            this.heading = DOWN;
        }
    },

    move: function (time) {
        /**
         * Basado en la propiedad de encabezado (que es la dirección en la que presionó pgroup)
         * Actualizamos el valor de headPosition en consecuencia.
         * *
         * La llamada Math.wrap permite que la serpiente se enrolle alrededor de la pantalla, así que cuando
         * sale de cualquiera de los lados y vuelve a aparecer en el otro.
         */
        switch (this.heading) {
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                break;

            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                break;

            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 27);
                break;

            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 27);
                break;
        }

        this.direction = this.heading;


        // Actualiza los segmentos del cuerpo y coloca la última coordenada en this.tail
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

        // Verifica si alguna de las piezas del cuerpo tiene la misma x / y que la cabeza
        // Si lo hacen, la cabeza chocó con el cuerpo

        var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), {x: this.head.x, y: this.head.y}, 1);

        if (hitBody) {
            console.log('dead');

            this.alive = false;

            return false;
        } else {

            // Actualiza el temporizador listo para el próximo movimiento
            this.moveTime = time + this.speed;

            return true;
        }
    },

    grow: function () {
        // this.body.killAndHide(this.body.children.size-1);
        this.cola.destroy();
        var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
        newPart.setOrigin(0);
        this.cola = this.body.create(this.tail.x, this.tail.y, 'cola');

        switch (this.direction) {
            case 0:
                this.body.children.iterate((x) => {
                    x.setRotation(4.8);
                    x.setOrigin(0);
                    x.flipX = true;
                });
                break;
            case 1:
                this.body.children.iterate((x) => {
                    x.setRotation(-4.8);
                    x.setOrigin(1);
                    x.flipX = true;
                });
                break;
            case 2:
                this.body.children.iterate((x) => {
                    x.setRotation(4.8);
                    x.setOrigin(0);
                    x.flipX = false;
                });
                break;
            case 3:
                this.body.children.iterate((x) => {
                    x.setRotation(0);
                    x.setOrigin(0);
                    x.flipX = true;
                });
                break;
        }

    },

    collideWithFood: function (food) {
        if (this.head.x === food.x && this.head.y === food.y) {
            this.grow();

            food.eat();

            // Por cada 5 alimentos consumidos, aumentaremos un poco la velocidad de la serpiente
            if (this.speed > 20 && food.total % 5 === 0) {
                this.speed -= 5;
            }

            return true;
        } else {
            return false;
        }
    },

    collideWithBlock: function (block) {
        let c = false;
        block.children.iterate((x) => {
            if (this.head.x === x.x && this.head.y === x.y) {
                c = true;
            }
        });
        return c;
    },
    updateGrid: function (grid, pared1, pared2, pared3, pared4, pared5, pared6) {
        // Eliminar todas las piezas del cuerpo de la lista de posiciones válidas
        //recorremos todo el cuerpo de la serpiente
        this.body.children.each(function (segment) {
            var bx = segment.x / 16;
            var by = segment.y / 16;
            grid[by][bx] = false;

        });
        if (pared1!=false){
            pared1.children.iterate((x) => {
                var bx = x.x / 16;
                var by = x.y / 16;

                grid[by][bx] = false;
            });
            pared2.children.iterate((x) => {
                var bx = x.x / 16;
                var by = x.y / 16;

                grid[by][bx] = false;
            });
            pared3.children.iterate((x) => {
                var bx = x.x/16;
                var by = x.y/16;
                grid[by][bx] = false;
            });
            pared4.children.iterate((x) => {
                var bx = x.x / 16;
                var by = x.y / 16;
                grid[by][bx] = false;
            });
            pared5.children.iterate((x) => {
                var bx = x.x / 16;
                var by = x.y / 16;
                grid[by][bx] = false;
            });
            pared6.children.iterate((x) => {
                var bx = x.x / 16;
                var by = x.y / 16;
                grid[by][bx] = false;
            });
        }



        return grid;
    }

});
export default Snake;