(function($) {

    "use strict";

    // Load everything when elementor is initialised
    $(window).on('elementor:init', function() {

        $(window).on('load', function() {
            //ControlBaseView.fillEmptyDimensions();

            //console.log('windows load'); // for debugging

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

            LoadPanelPosition(); // Load Position of panel

            draggablePanel(); // load function draggable panel

            loadFepSettings(); // load the setting FEP and action function

            // add action when click on input vertical resize
            $(document).on('click touchstart', '#fep-collapse-vertical', function(event) {
                event.preventDefault(); // cancel other actions
                vertical_elementor_panel_toggle(); // run function
            });

            // add action when click on input switcher panel (horizontal resize)
            $(document).on('click touchstart', '#elementor-mode-switcher', function(event) {
                event.preventDefault(); // cancel other actions
                elementor_horizontal_panel(); // run function
            });


            // use the native lib tipsy from elementor
            $('.fep-tooltip').tipsy({
                className: 'fep-content-tooltip', // add custom class
                gravity: $.fn.tipsy.autoNS, // auto position
                html: true, // allow html inside
            });

            // reset panel
            $(document).on('click touchstart', '.reset-fep', function(event) {
                event.preventDefault(); // cancel other actions
                reset_fep_panel(); // run function
            });


        }); // end load


        // Special load and reload when the div #elementor-panel-categories was recreate by elementor
        //$('#elementor-panel').on('DOMNodeInserted', '#elementor-panel-elements-categories', function () {
        $.onCreate('#elementor-panel-categories', function() {

            //console.log('div #elementor-panel-categories created'); // for debugging

            // if option checked
            if (fepConfig.minimize_category_space == 'yes') {
                collapseCategories(true); // load function collapse categories
            }

            draggableCategories(); // load function draggable categories

        }, true);

        ///////////////////////: Reload function from setting when change option
        $(document).on('change', "input[data-setting='draggable_panel']", function() {
            fepConfig.draggable_panel = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='use_grid_ruler']", function() {
            fepConfig.use_grid_ruler = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='minimize_category_space']", function() {
            fepConfig.minimize_category_space = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "select[data-setting='editor_skin']", function() {
            fepConfig.editor_skin = this.value;
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='display_vertical_collaspe_icon']", function() {
            fepConfig.display_vertical_collaspe_icon = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='display_reset_icon']", function() {
            fepConfig.display_reset_icon = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });

        $(document).on('change', "input[data-setting='display_exit_icon']", function() {
            fepConfig.display_exit_icon = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "select[data-setting='exit_link_point']", function() {
            fepConfig.exit_link_point = this.value;
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='exit_link_new_tab']", function() {
            fepConfig.exit_link_new_tab = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='accordion_options']", function() {
            fepConfig.accordion_options = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });

        $(document).on('change', "input[data-setting='hide_elements_responsive']", function() {
            fepConfig.hide_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='disable_obscured_elements_responsive']", function() {
            fepConfig.disable_obscured_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='maintain_obscured_elements_responsive']", function() {
            fepConfig.maintain_obscured_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        $(document).on('change', "input[data-setting='alternative_responsive_indicator']", function() {
            fepConfig.alternative_responsive_indicator = $(this).is(':checked') ? 'yes' : 'no';
            loadFepSettings();
        });
        /////////////// end reload option

        // Reload function when widget accordion is add
        elementor.hooks.addAction('panel/open_editor/widget/accordion', function(panel, model, view) {
            setTimeout(
                "loadFepSettings()",
                1000
            ); // wait 1 second
        });

    }); // end load fully editor

})(jQuery);


//$(window).on('elementor:init', function() {
//    elementor.hooks.addFilter('panel/elements/regionViews', function( regionViews ) {
//        console.log("load");
//elementor.enterPreviewMode(true);
//        return regionViews;
//    });
//});