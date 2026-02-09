(function ($) {
    'use strict';

    window.fepConfig = window.fepConfig || {};
    window.fep = window.fep || {};

    function getPreviewDocument() {
        var iframe = document.getElementById('elementor-preview-iframe');
        return iframe && iframe.contentWindow ? iframe.contentWindow.document : null;
    }

    function safeCall(fnName) {
        if (typeof window[fnName] === 'function') {
            window[fnName]();
        }
    }

    function onCtrlP(event) {
        if (event.ctrlKey && event.which === 80) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof window.elementor_horizontal_panel_key === 'function') {
                window.elementor_horizontal_panel_key();
            }
        }
    }

    function bindPreviewKeydown() {
        var previewDoc = getPreviewDocument();
        if (!previewDoc) {
            return;
        }
        $(previewDoc).off('keydown.fep', onCtrlP).on('keydown.fep', onCtrlP);
    }

    function initEditorActions() {
        safeCall('LoadPanelPosition');
        safeCall('DraggablePanel');
        safeCall('LoadFepSettings');

        if ($.fn.tipsy) {
            $('.fep-tooltip').tipsy({
                className: 'fep-content-tooltip',
                gravity: $.fn.tipsy.autoNS,
                html: true,
            });
        }

        bindPreviewKeydown();
    }

    $(window).on('elementor:init', function () {
        if (typeof window.elementor === 'undefined') {
            return;
        }

        elementor.on('document:loaded', initEditorActions);

        $(document)
            .off('click.fep touchstart.fep', '#fep-collapse-vertical')
            .on('click.fep touchstart.fep', '#fep-collapse-vertical', function (event) {
                event.preventDefault();
                if (typeof window.vertical_elementor_panel_toggle === 'function') {
                    window.vertical_elementor_panel_toggle();
                }
            });

        $(document)
            .off('keydown.fep')
            .on('keydown.fep', onCtrlP);

        $(document)
            .off('click.fep touchstart.fep', '#elementor-mode-switcher')
            .on('click.fep touchstart.fep', '#elementor-mode-switcher', function (event) {
                event.preventDefault();
                if (typeof window.elementor_horizontal_panel === 'function') {
                    window.elementor_horizontal_panel();
                }
            });

        $(document)
            .off('click.fep touchstart.fep', '#fep-reset-panel')
            .on('click.fep touchstart.fep', '#fep-reset-panel', function (event) {
                event.preventDefault();
                if (typeof window.reset_fep_panel === 'function') {
                    window.reset_fep_panel();
                }
            });

        $(document)
            .off('click.fep touchstart.fep', '#fep-exit-link')
            .on('click.fep touchstart.fep', '#fep-exit-link', function (event) {
                event.preventDefault();

                var $link = $(this);
                var shouldSave = $link.attr('data-save') === 'yes';
                var href = $link.attr('href') || $link.data('href');
                var target = $link.attr('target') || $link.data('target') || '_self';

                function redirect() {
                    if (!href) {
                        return;
                    }
                    if (target === '_blank') {
                        window.open(href, '_blank');
                    } else {
                        window.location.href = href;
                    }
                }

                if (shouldSave && typeof $e !== 'undefined') {
                    $e.run('document/save/update').then(function () {
                        redirect();
                    }).catch(function (err) {
                        console.error('Save failed:', err);
                        redirect();
                    });
                } else {
                    redirect();
                }
            });

        elementor.hooks.addFilter('panel/elements/regionViews', function (regionViews) {
            setTimeout(function () {
                if (window.fepConfig.minimize_category_space === 'yes' || !window.fepConfig.minimize_category_space) {
                    if (typeof window.collapseCategories === 'function') {
                        window.collapseCategories();
                    }
                }
                if (typeof window.draggableCategories === 'function') {
                    window.draggableCategories();
                }
            }, 100);

            return regionViews;
        });

        $(document)
            .off('change.fep', "input[data-setting='draggable_panel']")
            .on('change.fep', "input[data-setting='draggable_panel']", function () {
                window.fepConfig.draggable_panel = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='use_grid_ruler']")
            .on('change.fep', "input[data-setting='use_grid_ruler']", function () {
                window.fepConfig.use_grid_ruler = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='minimize_category_space']")
            .on('change.fep', "input[data-setting='minimize_category_space']", function () {
                window.fepConfig.minimize_category_space = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "select[data-setting='editor_skin']")
            .on('change.fep', "select[data-setting='editor_skin']", function () {
                window.fepConfig.editor_skin = this.value;
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='display_vertical_collaspe_icon']")
            .on('change.fep', "input[data-setting='display_vertical_collaspe_icon']", function () {
                window.fepConfig.display_vertical_collaspe_icon = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='display_reset_icon']")
            .on('change.fep', "input[data-setting='display_reset_icon']", function () {
                window.fepConfig.display_reset_icon = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='rtl_force_mode']")
            .on('change.fep', "input[data-setting='rtl_force_mode']", function () {
                window.fepConfig.rtl_force_mode = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='display_exit_icon']")
            .on('change.fep', "input[data-setting='display_exit_icon']", function () {
                window.fepConfig.display_exit_icon = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "select[data-setting='exit_link_point']")
            .on('change.fep', "select[data-setting='exit_link_point']", function () {
                window.fepConfig.exit_link_point = this.value;
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='exit_link_new_tab']")
            .on('change.fep', "input[data-setting='exit_link_new_tab']", function () {
                window.fepConfig.exit_link_new_tab = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='exit_save']")
            .on('change.fep', "input[data-setting='exit_save']", function () {
                window.fepConfig.exit_save = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='hide_elements_responsive']")
            .on('change.fep', "input[data-setting='hide_elements_responsive']", function () {
                window.fepConfig.hide_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='disable_obscured_elements_responsive']")
            .on('change.fep', "input[data-setting='disable_obscured_elements_responsive']", function () {
                window.fepConfig.disable_obscured_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='maintain_obscured_elements_responsive']")
            .on('change.fep', "input[data-setting='maintain_obscured_elements_responsive']", function () {
                window.fepConfig.maintain_obscured_elements_responsive = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
        $(document)
            .off('change.fep', "input[data-setting='alternative_responsive_indicator']")
            .on('change.fep', "input[data-setting='alternative_responsive_indicator']", function () {
                window.fepConfig.alternative_responsive_indicator = $(this).is(':checked') ? 'yes' : 'no';
                safeCall('LoadFepSettings');
            });
    });
})(jQuery);
