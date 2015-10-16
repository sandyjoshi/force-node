var remote = require('remote');
var app = remote.require('app');
var $ = require("jquery");
var App = require('./app');

var Hinge = remote.getGlobal("rootRequire")("hinge");
var hinge = new Hinge({
    groupLeader: true,
    onDeviceConnect: function(){
        App.route("game");
    },
    onDeviceData: function(data) {
		console.log(data);
    }


});

// Add qr code
hinge.qrCode(function(err, qr){
    $(".qr-code").html(qr);
});

App.onReady = function() {
    // hinge.startDeviceServer();
};
App.init();
