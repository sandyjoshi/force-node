var $ = require("jquery");
var remote = require("remote");

var App = {
    onReady: null,

    // route to screen
    route: function(screen) {
        $(".screen").addClass("hide");
        $("." + screen + "-screen").removeClass("hide");
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
