var remote = require('remote');

var width = 600, height = 800, emitter;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game-container', {
    preload: preload, create: create, update: update, render: render
});

function preload() {
    game.load.image('background', './assets/images/bg.png');
    game.load.spritesheet('veggies', './assets/images/fruits_dummy.png', 32, 32);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var background = game.add.sprite(0,0,'background');
    background.scale.y = 2;

    emitter = game.add.emitter(game.world.centerX, 0, 250);
    emitter.makeParticles('veggies', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 200, true, true);
    emitter.minParticleSpeed.setTo(-200, -300);
    emitter.maxParticleSpeed.setTo(200, -400);
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);
    emitter.angularDrag = 30;
    emitter.start(false, 8000, 400);
}

function update() {
}

function render() {
}

module.exports = exports = game;
