var width = screen.width;
var height = screen.height;

var Game_Over = {



    preload : function() {
        // Here we load all the needed resources for the level.
        // In our case, that's just two squares - one for the snake body and one for the apple.
        //game.load.image('gameover', './assets/images/gameover.png');
    },

    create : function() {

        game.stage.backgroundColor = '#000000';

        // Last Score Info.
        game.add.text(width/2 -100 , height/2 - 200, "Game Over, Good Bye.", { font: "bold 36px sans-serif", fill: "#46c0f9", align: "center"});
        game.add.text(width/2 - 50 , height/2 - 150 , "Score : " + score.toString(), { font: "bold 36px sans-serif", fill: "#46c0f9", align: "center" });


    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};