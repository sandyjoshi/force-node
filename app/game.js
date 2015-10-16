var remote = require('remote');

var width = 600, height = 800, emitter;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game-container', {
    preload: preload, create: create, update: update, render: render
});

function preload() {
    game.load.image('background', './assets/images/bg.png');
    game.load.spritesheet('veggies', './assets/images/fruits_dummy.png', 32, 32);
}

 var slashes , points = [], line, fruits, scoreLabel, score = 0 ;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var background = game.add.sprite(0,0,'background');
    background.scale.y = 2;

    emitter = game.add.emitter(game.world.centerX, 0, 250);
    fruits = emitter.makeParticles('veggies', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 200, true, true);
    emitter.minParticleSpeed.setTo(-200, -300);
    emitter.maxParticleSpeed.setTo(200, -400);
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);
    emitter.angularDrag = 30;
    emitter.start(false, 8000, 400);

	slashes = game.add.graphics(0, 0);

	scoreLabel = game.add.text(10,10,'Tip: Start from here!');
	scoreLabel.fill = 'white';


}

function update() {

	points.push({
		x: game.input.x,
		y: game.input.y
	});
	points = points.splice(points.length-10, points.length);

    if (points.length<1 || points[0].x==0) {
        return;
    }


	slashes.clear();
	slashes.beginFill(0xFFFFFF);
	slashes.alpha = .5;
	slashes.moveTo(points[0].x, points[0].y);
	for (var i=1; i<points.length; i++) {
	slashes.lineTo(points[i].x, points[i].y);
	}
	slashes.endFill();

	for(var i = 1; i< points.length; i++) {
		line = new Phaser.Line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
		game.debug.geom(line);
		fruits.forEachExists(checkIntersects);
	}

}

var contactPoint = new Phaser.Point(0,0);

function checkIntersects(fruit) {
	var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
	var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);

	if(Phaser.Line.intersects(line, l1, true) || Phaser.Line.intersects(line, l2, true)) {
		contactPoint.x = game.input.x;
		contactPoint.y = game.input.y;
		var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));

		if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
			return;
		}

        updateScore(fruit);

	}
}

function render() {
}


function updateScore(fruit) {
	emitter.x = fruit.x;
	emitter.y = fruit.y;
	emitter.start(true, 2000, null, 4);
    fruit.kill();
	points = [];
	score++;
	scoreLabel.text = 'Score: ' + score;
}


module.exports = exports = game;
