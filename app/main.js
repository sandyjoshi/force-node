var game;
var width = screen.width;
var height = screen.height;

game = new Phaser.Game(width, height, Phaser.AUTO, '');

game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Game_Over', Game_Over);


game.state.start('Menu');
