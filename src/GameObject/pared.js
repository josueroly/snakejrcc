var Pared = new Phaser.Class({

    initialize:

        function Pared (scene, x, y,r)
        {

            this.block = scene.add.group({
                key:'block',
                repeat:r,
                setXY:{
                    x:x*16,
                    y:y*16,
                    stepY:16

                }
            });

           this.block.children.iterate((x) => {
               x.setOrigin(0);
            })


        },


});
export default Pared;