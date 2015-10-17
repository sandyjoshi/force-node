var snake, apple, squareSize, score, speed,
    updateDelay, direction = "right", new_direction,
    addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

var width = screen.width ;
var height = screen.height;

var apples;

var Game = {

    preload : function() {
        // Here we load all the needed resources for the level.
        // In our case, that's just two squares - one for the snake body and one for the apple.
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
    },

    sendData : function(data){

        if (data.isright && direction != 'left' )
        {
            new_direction = 'right';
            console.log("is right");
        }
        else if (data.isleft && direction != 'right' )
        {
            new_direction = 'left';
             console.log("is left")
        }
        else if (data.istop && direction != 'down')
        {
            new_direction = 'up';
             console.log("is top")
        }
        else if (data.isbottom && direction != 'top')
        {
            new_direction = 'down';
            console.log("is down")
        }
        this.update();

    },

    create : function() {

        //Add physics for collision
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // By setting up global variables in the create function, we initialise them on game start.
        // We need them to be globally available so that the update function can alter them.

        snake = [];                     // This will work as a stack, containing the parts of our snake
        apple = {};                     // An object for the apple;
        squareSize = 15;                // The length of a side of the squares. Our image is 15x15 pixels.
        score = 0;                      // Game score.
        speed = 0;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        direction = 'right';            // The direction of our snake.
        new_direction = null;           // A buffer to store the new direction into.
        addNew = false;                 // A variable used when an apple has been eaten.

        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#124184';

        apples = game.add.group();
        apples.enableBody = true;

        // Generate the initial snake stack. Our snake will be 10 elements long.
        for(var i = 0; i < 10; i++){
            snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake');  // Parameters are (X coordinate, Y coordinate, image)
            game.physics.arcade.enable(snake[i]);
        }

        // Genereate the first apple.
        for(var i = 0; i<50; i++) {
            this.generateApple();
        }
        // Add Text to top of game.
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };
        // Score.
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // Speed.
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

    },

    update: function() {
        // Handle arrow key presses, while not allowing illegal direction changes that will kill the player.

        // A formula to calculate game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10;
        speed = Math.max(2, Math.floor(score/10));
        game.physics.arcade.overlap(snake,apples,this.collidedWithApple,null,this);
        // speed = 1;
        // Update speed value on game screen.
        if( !speedTextValue ){
            return;
        }
        speedTextValue.text = '' + speed;

        // Since the update function of Phaser has an update rate of around 60 FPS,
        // we need to slow that down make the game playable.

        // Increase a counter on every update call.
        updateDelay++;

        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster.
        if (updateDelay % (10 - speed) == 0) {
            // Snake movement
            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // If a new direction has been chosen from the keyboard, make it the direction of the snake now.
            if(new_direction && new_direction != direction){
                direction = new_direction;
                new_direction = null;
            }


            // Change the last cell's coordinates relative to the head of the snake, according to the direction.

            if(direction == 'right'){

                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'left'){
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if(direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }

            // Place the last cell in the front of the stack.
            // Mark it as the first cell.

            snake.push(lastCell);
            firstCell = lastCell;

            // End of snake movement.
            // Increase length of snake if an apple had been eaten.
            // Create a block in the back of the snake with the old position of the previous last block (it has moved now along with the rest of the snake).
            if(addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            this.selfCollision(firstCell);

            // Check with collision with wall. Parameter is the head of the snake.
            this.wallCollision(firstCell);
        }


    },

    generateApple: function() {

        // Chose a random place on the grid.
        // X is between 0 and 585 (39*15)
        // Y is between 0 and 435 (29*15)

        var randomX = Math.floor(Math.random() * width/20 ) * squareSize,
            randomY = Math.floor(Math.random() * height/20 ) * squareSize;

        // Add a new apple.
        apple = apples.create(randomX,randomY,'apple')
    },

    //Added by vivek
    collidedWithApple: function(snake,apple) {
        addNew = true;
        apple.kill();
        this.generateApple();
        score++;
        scoreTextValue.text = score.toString();

    },

    selfCollision: function(head) {
        // Check if the head of the snake overlaps with any part of the snake.
        for(var i = 0; i < snake.length - 1; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){
                // If so, go to game over screen.
                console.log(" killing point ");
                game.state.start('Game_Over');
            }
        }

    },
    wallCollision: function(head) {
        // Check if the head of the snake is in the boundaries of the game field.
        if (head.x >= width) {
           snake[snake.length - 1].x = 0;
       } else if(head.x < 0) {
           snake[snake.length - 1].x = width;
       } else if (head.y >= height) {
           snake[snake.length - 1].y = 0;
       } else if (head.y < 0){
           snake[snake.length - 1].y = height;
       }
    }

};
