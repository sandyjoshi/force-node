var remote = require('remote');
var Phaser = remote.require("phasor");

var width = 600, height = 800;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', {
    preload: preload, create: create, update: update, render: render
});

function preload() {
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
}

function update() {
}

function render() {
}
