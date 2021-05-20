

jQuery(document).ready(function($) {



});

// On "elementor:init" event
$( window ).on( "elementor:init", () => {

	// On "document:loaded" elementor event
	elementor.on( "document:loaded", () => {

        //console.log('windows load'); // for debugging

        LoadPanelPosition(); // Load Position of panel

        DraggablePanel(); // load function draggable panel

        LoadFepSettings(); // load the setting FEP and action function

        // use the native lib tipsy from elementor
        $('.fep-tooltip').tipsy({
            className: 'fep-content-tooltip', // add custom class
            gravity: $.fn.tipsy.autoNS, // auto position
            html: true, // allow html inside
        });

        // delay for load preview
        // that is not great, only used for the first load :/
        var delay = 2000; // 2s
        setTimeout(function() {

            if (fepConfig.accordion_options == 'yes' || !fepConfig.accordion_options) {
                $("#elementor-preview-iframe").contents().find('.elementor-tab-title[data-tab="1"]').removeClass('elementor-active');
                $("#elementor-preview-iframe").contents().find('.elementor-tab-content[data-tab="1"]').slideUp();
            }

        }, delay);



    });

    // when windows is reload
    $(window).on('load', function() {

       // add action when click on input vertical resize
       $(document).on('click touchstart', '#fep-collapse-vertical', function(event) {
           event.preventDefault(); // cancel other actions
           vertical_elementor_panel_toggle(); // run function
       });

       // CTRL + P key event
       $(document).on('keydown', function(event) {
           if (event.ctrlKey && event.which == 80) {
               event.preventDefault(); // cancel other actions
               event.stopPropagation(); // cancel other actions
               elementor_horizontal_panel_key();
           }
       });

       // conflict !! reload keydown after click in iframe preview
       $(document.getElementById('elementor-preview-iframe').contentWindow.document).on('keydown', function(event) {
           if (event.ctrlKey && event.which == 80) {
               event.preventDefault(); // cancel other actions
               event.stopPropagation(); // cancel other actions
               elementor_horizontal_panel_key();
           }
       });

       // add action when click on input switcher panel (horizontal resize)
       $(document).on('click touchstart', '#elementor-mode-switcher', function(event) {
           event.preventDefault(); // cancel other actions
           elementor_horizontal_panel(); // run function
       });

       // reset panel
       $(document).on('click touchstart', '.reset-fep', function(event) {
           event.preventDefault(); // cancel other actions
           reset_fep_panel(); // run function
       });




       // when widget accordion is add
       elementor.hooks.addAction('panel/open_editor/widget/accordion', function(panel, model, view) {
           // delay for load preview
           var delay = 1000; // 1s for smooth and after load html
           setTimeout(function() {
               if (fepConfig.accordion_options == 'yes' || !fepConfig.accordion_options) {
                   $("#elementor-preview-iframe").contents().find('.elementor-tab-title[data-tab="1"]').removeClass('elementor-active');
                   $("#elementor-preview-iframe").contents().find('.elementor-tab-content[data-tab="1"]').css('display', 'none').removeClass('elementor-active');
               }
           }, delay);
       });



       elementor.hooks.addFilter('panel/elements/regionViews', function( regionViews ) {

           var delay = 100; // 100 ms
           setTimeout(function() {

               // if option checked
               if (fepConfig.minimize_category_space == 'yes' || !fepConfig.minimize_category_space ) {
                   collapseCategories(); // load function collapse categories
               }
               draggableCategories(); // load function draggable categories

           }, delay);

           return regionViews;
       });

       // to load opacity panel
       /*if (fepConfig.opacity_editor_panel) {
           $('#elementor-panel').css('opacity', fepConfig.opacity_editor_panel.size + '%');
       }

       // when slider opacity panel change
       $(document).on({
           mousemove: function() {
               opacity_editor_panel_val = $(this).attr('aria-valuetext');
               $('#elementor-panel').css('opacity', opacity_editor_panel_val + '%');
               //console.log(opacity_editor_panel_val);
           },
       }, ".elementor-control-opacity_editor_panel .noUi-active" );*/




       ///////////////////////: Reload function from setting when change option
       $(document).on('change', "input[data-setting='draggable_panel']", function() {
           fepConfig.draggable_panel = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='use_grid_ruler']", function() {
           fepConfig.use_grid_ruler = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='minimize_category_space']", function() {
           fepConfig.minimize_category_space = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "select[data-setting='editor_skin']", function() {
           fepConfig.editor_skin = this.value;
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='display_vertical_collaspe_icon']", function() {
           fepConfig.display_vertical_collaspe_icon = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='display_reset_icon']", function() {
           fepConfig.display_reset_icon = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
	   $(document).on('change', "input[data-setting='rtl_force_mode']", function() {
           fepConfig.rtl_force_mode = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='display_exit_icon']", function() {
           fepConfig.display_exit_icon = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "select[data-setting='exit_link_point']", function() {
           fepConfig.exit_link_point = this.value;
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='exit_link_new_tab']", function() {
           fepConfig.exit_link_new_tab = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='accordion_options']", function() {
           fepConfig.accordion_options = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='hide_elements_responsive']", function() {
           fepConfig.hide_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='disable_obscured_elements_responsive']", function() {
           fepConfig.disable_obscured_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='maintain_obscured_elements_responsive']", function() {
           fepConfig.maintain_obscured_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       $(document).on('change', "input[data-setting='alternative_responsive_indicator']", function() {
           fepConfig.alternative_responsive_indicator = $(this).is(':checked') ? 'yes' : 'no';
           LoadFepSettings();
       });
       /////////////// end reload option


   });

});
