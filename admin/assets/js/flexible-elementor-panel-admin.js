(function($) {

    "use strict";

    $(window).on('load', function() {

        //console.log('windows load'); // for debugging

        // reset panel admin
        $(document).on('click touchstart', 'button.fep-reset-panel', function(event) {
            event.preventDefault(); // cancel other actions
            fep_reset_panel_by_admin(); // run function
        });

        // reset options admin
        $(document).on('click touchstart', 'button.fep-reset-options', function(event) {
            event.preventDefault(); // cancel other actions
            fep_reset_options_by_admin(); // run function
        });

        // check options admin
        $(document).on('click touchstart', 'button.fep-check-options', function(event) {
            event.preventDefault(); // cancel other actions
            fep_check_options_by_admin(); // run function
        });


    }); // end load

})(jQuery);
