var $ = require("jquery");
var remote = require("remote");
var game = require("./game/game");

var App = {
    onReady: null,

    // route to screen
    route: function(screen) {
        $(".container").addClass("hide");
        $("." + screen + "-container").removeClass("hide");
    },

    // init
    init: function() {
        // Route to mingle screen
        setTimeout(function(){
            this.onReady && this.onReady();
        }.bind(this), 1000);
    },
};

module.exports = exports = App;
