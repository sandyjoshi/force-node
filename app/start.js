var remote = require('remote');
var app = remote.require('app');
var $ = require("jquery");
var App = require('./app');

var Hinge = remote.getGlobal("rootRequire")("hinge");
var hinge = new Hinge({
    groupLeader: true,
    onDeviceConnect: function(){
        App.route("game");
        game.state.start('Game');
    },
    onDeviceData: function(data) {
        if( data.event == "replay"){
            game.state.start('Game');
        }
        else{
            console.log(data);
            Game.sendData(data);
        }
    },
    onDeviceDisconnect: function() {
        console.log('Disconnected');
        App.route("start");
    }
});

// Add qr code
hinge.qrCode(function(err, qr){
    $(".qr-code").html(qr);
});

App.onReady = function() {
    hinge.startDeviceServer();
};
App.init();
