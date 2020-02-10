/*

Sommary functions:


1 - Reset Panel Admin

*/

/*--------------------------------------------------------------------------------------

1 - Reset Panel Admin

--------------------------------------------------------------------------------------*/
function reset_fep_panel_by_admin() {

    $('.reset-fep-admin-notice').animate({opacity:1},300)

    // clean all vars for make sure
    localStorage.removeItem('elementor-panel-size-width'); //remove
    localStorage.removeItem('elementor-panel-size-height'); //remove
    localStorage.removeItem('elementor-panel-pos-top'); //remove
    localStorage.removeItem('elementor-panel-pos-left'); //remove
    localStorage.removeItem('elementor-panel-pos-right'); //remove
    localStorage.removeItem('in-move'); //remove

    setTimeout( function() {
        $('.reset-fep-admin-notice').animate({opacity:0}, 300)
    }, 5000 );

}
