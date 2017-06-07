/* ------------------------------------------------------------
ALJS Init
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