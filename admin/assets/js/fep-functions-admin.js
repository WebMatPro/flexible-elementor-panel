/*

Sommary functions:


1 - Reset Panel Admin

*/

var $ = jQuery.noConflict();

/*--------------------------------------------------------------------------------------

1 - Reset Panel Admin

--------------------------------------------------------------------------------------*/
function fep_reset_panel_by_admin() {

    $('.fep-reset-panel-notice').animate({opacity:1},300)

    // clean all vars for make sure
    localStorage.removeItem('elementor-panel-size-width'); //remove
    localStorage.removeItem('elementor-panel-size-height'); //remove
    localStorage.removeItem('elementor-panel-pos-top'); //remove
    localStorage.removeItem('elementor-panel-pos-left'); //remove
    localStorage.removeItem('elementor-panel-pos-right'); //remove
    localStorage.removeItem('in-move'); //remove

    setTimeout( function() {
        $('.fep-reset-panel-notice').animate({opacity:0}, 300)
    }, 5000 ); // remove after 5 secs

}


/*--------------------------------------------------------------------------------------

2 - Reset Options Admin

--------------------------------------------------------------------------------------*/
function fep_reset_options_by_admin() {

    $('.fep-reset-options-notice').animate({opacity:1},300)

    jQuery.ajax({
        type: 'POST',
        url: ajax_var.url,
        data: {
            "action": "fep_reset_options",
            "nonce": ajax_var.nonce
        },
        success: function (data) {
            setTimeout( function() {
                $('.fep-reset-options-notice').animate({opacity:0}, 300)
            }, 5000 ); // remove after 5 secs
        }
    });

}

/*--------------------------------------------------------------------------------------

3 - Get Options Admin

--------------------------------------------------------------------------------------*/
function fep_check_options_by_admin() {

    $('.fep-check-options-notice').css( "height", "auto" ).animate({opacity:1,'margin-top':20, padding:10},300);


    // get
    var panel_size_width = localStorage.getItem('elementor-panel-size-width');
    var panel_size_height = localStorage.getItem('elementor-panel-size-height');

    var panel_pos_top = localStorage.getItem('elementor-panel-pos-top');
    var panel_pos_left = localStorage.getItem('elementor-panel-pos-left');
    var panel_pos_right = localStorage.getItem('elementor-panel-pos-right');

    var in_move = localStorage.getItem('in-move');

    jQuery.ajax({
        type: 'POST',
        url: ajax_var.url,
        data: {
            'action': "fep_get_options",
            'nonce': ajax_var.nonce,
            'panel_size_width': panel_size_width,
            'panel_size_height': panel_size_height,
            'panel_pos_top': panel_pos_top,
            'panel_pos_left': panel_pos_left,
            'panel_pos_right': panel_pos_right,
            'in_move': in_move,
        },
        success: function (data) {
            $('.fep-check-options-notice').html(data);
        }
    });

}
