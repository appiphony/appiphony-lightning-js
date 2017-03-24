/* ------------------------------------------------------------
Appiphony Lightning JS Beta

Version: 2.0.0
Website: http://aljs.appiphony.com
GitHub: https://github.com/appiphony/appiphony-lightning-js
License: BSD 2-Clause License
------------------------------------------------------------ */
if (typeof jQuery === "undefined") { throw new Error("Appiphony Lightning JS requires jQuery") }

(function($) {
    if (typeof $.aljs === 'undefined') {
        $.aljs = {
            assetsLocation: '',
            scoped: true,
            scopingClass: 'slds-scope'
        };
        
        $.aljsInit = function(options) {
            $.aljs = options;
        }
    }
})(jQuery);