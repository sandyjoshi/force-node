var remote = require('remote');
var Phaser = remote.require("phasor");

var w = 600,
        h = 800;

var game = new Phaser.Game(w, h, Phaser.AUTO, 'game',
        { preload: preload, create: create, update: update, render: render });

function preload() {
}

function create() {
}

function update() {
}

function render() {
}