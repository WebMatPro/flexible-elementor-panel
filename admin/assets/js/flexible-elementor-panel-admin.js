(function($) {

    "use strict";

    $(window).on('load', function() {

        //console.log('windows load'); // for debugging

        // reset panel admin
        $(document).on('click touchstart', '.reset-fep-admin', function(event) {
            event.preventDefault(); // cancel other actions
            reset_fep_panel_by_admin(); // run function
        });


    }); // end load

})(jQuery);
