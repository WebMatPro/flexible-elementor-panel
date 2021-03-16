

jQuery(document).ready(function($) {

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

            DraggablePanel(); // load function draggable panel

            LoadFepSettings(); // load the setting FEP and action function

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

            // delay for load preview
            // that is not great, only used for the first load :/
            var delay = 5000; // 5s
            setTimeout(function() {

                if (fepConfig.accordion_options == 'yes' || !fepConfig.accordion_options) {
                    $("#elementor-preview-iframe").contents().find('.elementor-tab-title[data-tab="1"]').removeClass('elementor-active');
                    $("#elementor-preview-iframe").contents().find('.elementor-tab-content[data-tab="1"]').slideUp();
                }

            }, delay);

        });


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

    });

});

$(window).on('elementor:init', function() {
    elementor.hooks.addFilter('panel/elements/regionViews', function( regionViews ) {

        var delay = 100; // 100 ms
        setTimeout(function() {

            // if option checked
            if (fepConfig.minimize_category_space == 'yes' || !fepConfig.minimize_category_space ) {
                collapseCategories(); // load function collapse categories
            }
            draggableCategories(); // load function draggable categories

        }, delay);

        //elementor.enterPreviewMode(true); // that set the preview mode

        return regionViews;
    });
});
