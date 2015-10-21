if (typeof jQuery === "undefined") { throw new Error("Appiphony Lightning JS requires jQuery") }

(function($) {
    if (typeof $.aljs === 'undefined') {
        $.aljs = {
            assetsLocation: ''
        };

        $.aljsInit = function(options) {
            $.aljs = options;
        }
    }
})(jQuery);