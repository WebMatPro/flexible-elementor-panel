/*

Only in frontend

*/



jQuery(document).ready(function($) {

    $(".elementor-accordion").init( function() {
        var wait = 300; setTimeout(function() {
            $('.elementor-tab-title[data-tab="1"]').removeClass('elementor-active');
            $('.elementor-tab-content[data-tab="1"]').slideUp().removeClass('elementor-active');
        }, wait);
    })

});
