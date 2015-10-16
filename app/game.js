var remote = require('remote');

var width = 600, height = 800, emitter;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game-container', {
    preload: preload, create: create, update: update, render: render
});

function preload() {
    game.load.spritesheet('veggies', './assets/images/fruits_dummy.png', 32, 32);
}

 var slashes , points = [];

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    emitter = game.add.emitter(game.world.centerX, 0, 250);
    emitter.makeParticles('veggies', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 200, true, true);
    emitter.minParticleSpeed.setTo(-200, -300);
    emitter.maxParticleSpeed.setTo(200, -400);
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);
    emitter.angularDrag = 30;
    emitter.start(false, 8000, 400);

	slashes = game.add.graphics(0, 0);


}

function update() {

	points.push({
		x: game.input.x,
		y: game.input.y
	});
	points = points.splice(points.length-10, points.length);

	slashes.clear();
	slashes.beginFill(0xFFFFFF);
	slashes.alpha = .5;
	slashes.moveTo(points[0].x, points[0].y);
	for (var i=1; i<points.length; i++) {
	slashes.lineTo(points[i].x, points[i].y);
	}
	slashes.endFill();

}

function render() {
}

module.exports = exports = game;
