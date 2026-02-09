(function($) {

    "use strict";

    $(window).on('load', function() {

        //console.log('windows load'); // for debugging

        // reset panel admin
        $(document).on('click touchstart', 'button.fep-reset-panel', function(event) {
            event.preventDefault(); // cancel other actions

            var be_okay = confirm(text_var.confirm);
            if (be_okay != true) {
                return false; //stop there
            }
            
            fep_reset_panel_by_admin(); // run function

            //if div exist, check again
            if ( $('.fep-check-options-notice').css('opacity') == 1 ) {

                setTimeout( function() {
                    fep_check_options_by_admin(); // run function
                }, 1000 ); // remove after 5 secs

            }
        });

        // reset options admin
        $(document).on('click touchstart', 'button.fep-reset-options', function(event) {
            event.preventDefault(); // cancel other actions

            var be_okay = confirm(text_var.confirm);
            if (be_okay != true) {
                return false; //stop there
            }

            fep_reset_options_by_admin(); // run function

            //if div exist, check again
            if ( $('.fep-check-options-notice').css('opacity') == 1 ) {

                setTimeout( function() {
                    fep_check_options_by_admin(); // run function
                }, 1000 ); // remove after 5 secs

            }
        });

        // check options admin
        $(document).on('click touchstart', 'button.fep-check-options', function(event) {
            event.preventDefault(); // cancel other actions
            fep_check_options_by_admin(); // run function
        });


    }); // end load

})(jQuery);
