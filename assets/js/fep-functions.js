/*

Sommary functions:

0 - Load Panel Position
1 - Load Settings FEP
2 - Draggable Panel
3 - Collaspe Vertical Panel
4 - Collaspe Categories
5 - Draggable Categories
6 - Display / Hide switcher
7 - Collaspe Horizontal Panel
8 - Reset Panel
9 - Collaspe Horizontal Panel Key

*/

var $ = jQuery.noConflict();

/*--------------------------------------------------------------------------------------

0 - Load Panel Position

--------------------------------------------------------------------------------------*/
function LoadPanelPosition() {

    var panel_size_width = localStorage.getItem('elementor-panel-size-width');
    var panel_size_height = localStorage.getItem('elementor-panel-size-height');

    var panel_pos_top = localStorage.getItem('elementor-panel-pos-top');
    var panel_pos_left = localStorage.getItem('elementor-panel-pos-left');
    var panel_pos_right = localStorage.getItem('elementor-panel-pos-right');

    var in_move = localStorage.getItem('in-move');

    //check if all vars exist
    if (!panel_size_width) {
        // clean all vars for be sure
        localStorage.removeItem('elementor-panel-size-width'); //remove
        localStorage.removeItem('elementor-panel-size-height'); //remove
        localStorage.removeItem('elementor-panel-pos-top'); //remove
        localStorage.removeItem('elementor-panel-pos-left'); //remove
        localStorage.removeItem('elementor-panel-pos-right'); //remove
        localStorage.removeItem('in-move'); //remove

        // then return for stop function
        return false;
    }

    // do it, if fep is already drag
    if (in_move === '1') {

        //console.log('do it');


        // check if the panel is oversize of windows height and panel more up of top windows
        if (panel_size_height >= $(window).height() || panel_pos_top < 0) {

            $("#elementor-panel").css({
                'top': 0,
                'left': panel_pos_left + 'px',
                'right': 0, //unset
            }); // move the panel at the save position but force top 0
            $("#elementor-panel").css("height", $(window).height() - parseInt($("#elementor-panel").css("top"))); // remove the force height

            // set var panel size with special height
            panel_size = {
                width: panel_size_width + 'px',
                height: $(window).height() + 'px'
            };

        } else {

            $("#elementor-panel").css({
                'top': panel_pos_top + 'px',
                'left': panel_pos_left + 'px',
                'right': 0,
            }); // move the panel at the save position

            // set var panel size
            panel_size = {
                width: panel_size_width + 'px',
                height: panel_size_height + 'px'
            };

        }

        $('#elementor-preview').css('right', 0); // full preview size when panel is in drag to load
        $('#elementor-preview').css('left', 0); // full preview size when panel is in drag to load

        $("#elementor-panel").addClass("in-move"); // add class to panel for say he is in drag

        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // remove resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // remove resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-all"); // add resizable all panel editor

        elementor_switcher_display_none(); // hide the switcher

        $("#elementor-panel").css(panel_size); //set the height and width of panel editor

        //console.log('in move')


    } else {

        $("#elementor-panel").css('width', panel_size_width + 'px'); //set the width of panel editor

        //check if the panel is in the corner left side to load
        if (panel_pos_left == 0) {

            //console.log('left side')

            $('#elementor-preview').animate({
                'left': panel_size_width + 'px',
            }, 150);

            $('#elementor-preview').css('right', 0); // full preview size when panel is in drag to load
            $("#elementor-preview-iframe").contents().find("html").attr('dir', ''); // move the scroll bar to right side
            elementor_switcher_display_block('left'); // show button right side resize preview
            $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e").removeClass("ui-resizable-w"); // resize right side

            $("#elementor-panel").css({
                'top': 0,
                'left': 0,
                'right': 'auto',
            }); // move the panel at the save position


            // like 1920 === 1920, this is right side
        } else if (panel_pos_right == window.innerWidth) {

            //console.log('right side')

            $('#elementor-preview').animate({
                'right': panel_size_width + 'px',
            }, 150);

            $('#elementor-preview').css('left', 0); // full preview size when panel is in drag to load
            $("#elementor-preview-iframe").contents().find("html").attr('dir', 'rtl'); // move the scroll bar to left side
            elementor_switcher_display_block('right'); // show button left side resize preview
            $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-w").removeClass("ui-resizable-e"); // resize left side

            $("#elementor-panel").css({
                'top': 0,
                'left': 'auto',
                'right': 0,
            }); // move the panel at the save position

        }
    }



}

/*--------------------------------------------------------------------------------------

1 - Load Settings FEP

--------------------------------------------------------------------------------------*/

// Load the settings FEP
function loadFepSettings() {

    //console.log(fepConfig); // for debugging

    //add exit icon
    if (fepConfig.display_exit_icon == 'yes') {
        if ($("#fep-exit").length == 0) {
            exit_panel = '<a id="fep-exit" target="_self" href="#" title="' + fep.exit_tooltip + '" class="fep-exit-link elementor-panel-footer-tool elementor-leave-open fep-tooltip"><i class="fa fa-sign-out"></i></a>';
            $("#elementor-panel-footer-saver-preview").after(exit_panel);
        }
    }
    if (fepConfig.display_exit_icon == 'no') {
        $("#fep-exit").remove();
    }


    //add collapse icon
    if (fepConfig.display_vertical_collaspe_icon == 'yes') {
        if ($("#fep-collapse-vertical").length == 0) {
            collapse_vertical_panel = '<div id="fep-collapse-vertical"><i class="fa fa-arrows-v fep-toggle-panel-icon"></i></div>';
            $("#elementor-panel-header-menu-button").after(collapse_vertical_panel);
        }
    }
    if (fepConfig.display_vertical_collaspe_icon == 'no') {
        $("#fep-collapse-vertical").remove();
    }


    //add reset panel icon
    if (fepConfig.display_reset_icon == 'yes') {
        if ($("#fep-reset-panel").length == 0) {
            fep_reset_panel = '<div id="fep-reset-panel" class="reset-fep"><i class="fa fa-arrows-alt tooltip-target"></i></div>';
            $("#elementor-panel-header-title").after(fep_reset_panel);
        }
    }
    if (fepConfig.display_reset_icon == 'no') {
        $("#fep-reset-panel").remove();
    }

    if (fepConfig.draggable_panel == 'yes') {
        $("#elementor-panel").draggable("enable");
        $("#elementor-panel-header-title").on('touchstart mousedown', mousedownHeaderTitle);
        $(document).on('touchend mouseup', mouseupHeaderTitle);
        $("#elementor-panel-header-title").css("cursor", "move"); // add cursor to the title editor panel
    }
    if (!fepConfig.draggable_panel || fepConfig.draggable_panel == 'no') {
        $("#elementor-panel").draggable("disable");
        $("#elementor-panel-header-title").off('touchstart mousedown', mousedownHeaderTitle);
        //$("#elementor-panel-header-title").off('touchend mouseup', mouseupHeaderTitle); //useless
        $("#elementor-panel-header-title").css("cursor", ""); // remove special cursor to the title editor panel
    }
    if (fepConfig.minimize_category_space == 'yes') {
        $('body').addClass("fep-minimize-category");
    }
    if (fepConfig.minimize_category_space == 'no') {
        $('body').removeClass("fep-minimize-category");
    }
    if (fepConfig.use_grid_ruler == 'yes') {
        $('body').addClass("fep-elementor-grid-ruler");
    }
    if (fepConfig.use_grid_ruler == 'no') {
        $('body').removeClass("fep-elementor-grid-ruler");
    }
    if (fepConfig.editor_skin == 'dark_pink') {
        $('body').removeClass("nightmode nightmode-orange");
        $('body').addClass("nightmode nightmode-pink");
    }
    if (fepConfig.editor_skin == 'dark_orange') {
        $('body').removeClass("nightmode nightmode-pink");
        $('body').addClass("nightmode nightmode-orange");
    }
    if (fepConfig.editor_skin == 'default' || !fepConfig.editor_skin) {
        $('body').removeClass("nightmode nightmode-pink nightmode-orange");
    }
    if (fepConfig.exit_link_new_tab == 'yes') {
        $(".fep-exit-link").attr("target", "_blank");
    }
    if (fepConfig.exit_link_new_tab == 'no') {
        $(".fep-exit-link").attr("target", "_self");
    }
    if (fepConfig.exit_link_point == 'front' || !fepConfig.exit_link_point) {
        $(".fep-exit-link").attr("href", FEP.Permalink);
    }
    if (fepConfig.exit_link_point == 'edit') {
        $(".fep-exit-link").attr("href", window.location.href.replace("&action=elementor", "&action=edit"));
    }
    if (fepConfig.exit_link_point == 'list') {
        $(".fep-exit-link").attr("href", window.location.href.split('wp-admin')[0] + 'wp-admin/edit.php?post_type=' + FEP.PostType);
    }
    if (fepConfig.exit_link_point == 'elementor_library') {
        $(".fep-exit-link").attr("href", window.location.href.split('wp-admin')[0] + 'wp-admin/edit.php?post_type=elementor_library');
    }
    if (fepConfig.exit_link_point == 'admin_dashboard') {
        $(".fep-exit-link").attr("href", window.location.href.split('wp-admin')[0] + 'wp-admin/');
    }
    if (fepConfig.accordion_options == 'yes') {
        $("#elementor-preview-iframe").contents().find('.elementor-tab-title[data-tab="1"]').removeClass('elementor-active');
        $("#elementor-preview-iframe").contents().find('.elementor-tab-content[data-tab="1"]').css('display', 'none').removeClass('elementor-active');
    } else {
        $("#elementor-preview-iframe").contents().find('.elementor-tab-title[data-tab="1"]').addClass('elementor-active');
        $("#elementor-preview-iframe").contents().find('.elementor-tab-content[data-tab="1"]').css('display', 'block').removeClass('elementor-active');
    }
    if (fepConfig.hide_elements_responsive == 'yes') {
        $("#elementor-preview-iframe").contents().find("body").addClass("hide-elements-responsive");

        $("body").addClass("disable-option-fep-disable_obscured_elements_responsive");
        $("body").addClass("disable-option-fep-maintain_obscured_elements_responsive");
        $("body").addClass("disable-option-fep-alternative_responsive_indicator");

    } else {
        $("#elementor-preview-iframe").contents().find("body").removeClass("hide-elements-responsive");

        $("body").removeClass("disable-option-fep-disable_obscured_elements_responsive");
        $("body").removeClass("disable-option-fep-maintain_obscured_elements_responsive");
        $("body").removeClass("disable-option-fep-alternative_responsive_indicator");
    }
    if (fepConfig.disable_obscured_elements_responsive == 'yes') {
        $("#elementor-preview-iframe").contents().find("body").addClass("disable-obscured-elements-responsive");
    } else {
        $("#elementor-preview-iframe").contents().find("body").removeClass("disable-obscured-elements-responsive");
    }
    if (fepConfig.maintain_obscured_elements_responsive == 'yes') {
        $("#elementor-preview-iframe").contents().find("body").addClass("maintain-obscured-elements-responsive");
    } else {
        $("#elementor-preview-iframe").contents().find("body").removeClass("maintain-obscured-elements-responsive");
    }
    if (fepConfig.alternative_responsive_indicator == 'yes') {
        $("#elementor-preview-iframe").contents().find("body").addClass("alternative-responsive-indicator-enabled");
    } else {
        $("#elementor-preview-iframe").contents().find("body").removeClass("alternative-responsive-indicator-enabled");
    }
}


/*--------------------------------------------------------------------------------------

2 - Draggable Panel

--------------------------------------------------------------------------------------*/
// Make Elementor Panel draggable
function draggablePanel() {

    $("#elementor-panel").resizable({
        minWidth: 280,
        minHeight: 360,
        //delay: 0,
        //handles: "all",
        resize: function(event, ui) {
            event.preventDefault();

            $("#elementor-preview").css("pointer-events", "none"); // disable pointer on the preview elementor

            //if panel is in not in move
            if (!$("#elementor-panel").hasClass("in-move")) {
                panelWidth = $("#elementor-panel").width();

                //check if the panel is in the corner left / top
                if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

                    $("#elementor-preview").css('left', panelWidth); // set

                } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {

                    $("#elementor-preview").css('right', panelWidth); // set

                }

            }

        },
        stop: function(event, ui) {
            event.preventDefault();

            $("#elementor-preview").css("pointer-events", "auto"); // active pointer on the preview elementor

            panelWidth = $("#elementor-panel").width();
            panelHeight = $("#elementor-panel").height();

            //if panel is in not in move
            if (!$("#elementor-panel").hasClass("in-move")) {

                //check if the panel is in the corner left / top
                if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

                    $("#elementor-preview").css('left', panelWidth); // set

                } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {

                    $("#elementor-preview").css('right', panelWidth); // set

                }

            }

            localStorage.setItem('elementor-panel-size-width', panelWidth); //save
            localStorage.setItem('elementor-panel-size-height', panelHeight); //save

        }
    });

    //console.log( panel_size_height + '-' + $(window).height() ); // for debugging

    // draggable panel !! al right ;)
    $("#elementor-panel").draggable({
        handle: "#elementor-panel-header-title",
        snap: "#elementor-preview",
        opacity: 0.7,
        cancel: ".not-draggable",
        addClasses: false,
        containment: "window",
        snapMode: "inner",
        snapTolerance: 25,
        start: function() {

            $('#elementor-preview').animate({
                'left': 0,
                'right': 0,
            }, 150);

        },
        stop: function(event, ui) {


            //check if the panel is in the corner left / top
            if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

                // remove class "in-move" when panel back in origine position
                $("#elementor-panel").removeClass("in-move"); // remove
                localStorage.setItem('in-move', 0); //save

                $("#elementor-panel").css({
                    'top': 0,
                    'left': 0,
                    'right': 'auto',
                }); // move the panel at the save position

            } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {

                // remove class "in-move" when panel back in origine position
                $("#elementor-panel").removeClass("in-move"); // remove
                localStorage.setItem('in-move', 0); //save

                $("#elementor-panel").css({
                    'top': 0,
                    'left': 'auto',
                    'right': 0,
                }); // move the panel at the save position

            } else {

                // add class "in-move" when panel is in move
                $("#elementor-panel").addClass("in-move");
                localStorage.setItem('in-move', 1);

            }

            localStorage.setItem('elementor-panel-pos-top', ui.position.top);
            localStorage.setItem('elementor-panel-pos-left', ui.position.left);

            var panelWidth = $("#elementor-panel").width();
            var UiPositionRight = ui.position.left + panelWidth;

            localStorage.setItem('elementor-panel-pos-right', UiPositionRight);

            // save the width and height size
            localStorage.setItem('elementor-panel-size-width', $("#elementor-panel").width()); //save
            localStorage.setItem('elementor-panel-size-height', $("#elementor-panel").height()); //save

            //alert(UiPositionRight);

        }
    });

    //$("#elementor-panel-content-wrapper").addClass("not-draggable"); // add class for disable the draggable at wrapper area
    //$("#elementor-panel-footer").addClass("not-draggable"); // add class for disable the draggable at footer area
    //$("#elementor-mode-switcher").addClass("not-draggable"); // add class for disable the draggable at mode switcher area

}


// MOUSEDOWN (at the click mouse)
function mousedownHeaderTitle() {

    $("#elementor-preview").css("pointer-events", "none"); // disable pointer on the preview elementor

    // when start to draggable, do it if the panel still in corner top left
    if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

        $("#elementor-panel").css("height", "65%"); // set panel height 65% of windows
        $("#elementor-panel-content-wrapper").slideDown(150); // transition
        $("#elementor-panel-footer").slideDown(150); // transition

        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // remove resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // remove resizable the left side of panel editor
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-all"); // add resizable all panel editor

        elementor_switcher_display_none(); // remove switcher preview mode

        // clean height size for exclude conflict with vertical callapse
        var panelHeight = $("#elementor-panel").height(); // get
        localStorage.setItem('elementor-panel-size-height', panelHeight); //save
        $('#elementor-panel').removeClass('vertical_elementor_panel_toggle-on'); // collapse is off

    } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {

        $("#elementor-panel").css("height", "65%"); // set panel height 65% of windows
        $("#elementor-panel-content-wrapper").slideDown(150); // transition
        $("#elementor-panel-footer").slideDown(150); // transition

        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // remove resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // remove resizable the left side of panel editor
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-all"); // add resizable all panel editor

        elementor_switcher_display_none(); // remove switcher preview mode

        // clean height size for exclude conflict with vertical callapse
        var panelHeight = $("#elementor-panel").height(); // get
        localStorage.setItem('elementor-panel-size-height', panelHeight); //save
        $('#elementor-panel').removeClass('vertical_elementor_panel_toggle-on'); // collapse is off

    }

}

// MOUSEUP (at leave the click mouse)
function mouseupHeaderTitle() {

    $("#elementor-preview").css("pointer-events", "auto"); // active pointer on the preview elementor

    // reset position panel to origin when click on title if he is on corner top left
    if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

        // make scroll bar right side
        $("#elementor-preview-iframe").contents().find("html").attr('dir', '');

        $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview

        $("#elementor-panel").css("height", $(window).height() + 'px'); // resize full height panel

        $("#elementor-panel-content-wrapper").slideDown(150); // transiton
        $("#elementor-panel-footer").slideDown(150); // transiton

        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

        elementor_switcher_display_block('left'); // show button resize preview

        // remove class "in-move" when panel back in origine position
        $("#elementor-panel").removeClass("in-move");
        localStorage.setItem('in-move', 0);

        // replace the preview
        panelWidth = $("#elementor-panel").width(); // get size panel
        $('#elementor-preview').animate({
            'left': panelWidth + 'px',
        }, 150);

    } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {

        // make scroll bar left side
        $("#elementor-preview-iframe").contents().find("html").attr('dir', 'rtl'); // disable preview

        $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview

        $("#elementor-panel").css("height", $(window).height() + 'px'); // resize full height panel

        $("#elementor-panel-content-wrapper").slideDown(150); // transiton
        $("#elementor-panel-footer").slideDown(150); // transiton

        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-w"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

        elementor_switcher_display_block('right'); // show button resize preview

        // remove class "in-move" when panel back in origine position
        $("#elementor-panel").removeClass("in-move");
        localStorage.setItem('in-move', 0);

        // replace the preview
        panelWidth = $("#elementor-panel").width(); // get size panel
        $('#elementor-preview').animate({
            'right': panelWidth + 'px',
        }, 150);

    }

}

/*--------------------------------------------------------------------------------------

3 - Collaspe Vertical Panel

--------------------------------------------------------------------------------------*/
// FUNCTION VERTICAL COLLAPSE/EXPAND ELEMENTOR PANEL
function vertical_elementor_panel_toggle() {

    // if has class vertical_elementor_panel_toggle-on, dont resize
    if ($('#elementor-panel').hasClass('vertical_elementor_panel_toggle-on')) {

        $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("#elementor-preview-iframe").contents().find("#elementor").removeClass('elementor-edit-area-preview').addClass('elementor-edit-area-active'); // disable preview

        $('#elementor-panel').removeClass('vertical_elementor_panel_toggle-on'); // Important, remove class to panel for understand the collapse is off

        // if panel is not in drag
        if (!$('#elementor-panel').hasClass('in-move')) {

            $("#elementor-panel").animate({
                height: $(window).height() + 'px'
            }, 0); // add the height px minus the top px

            //$(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e"); // add resizable the right side of panel editor
            $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

            // set normal preview with panel
            panelWidth = $("#elementor-panel").width(); // get size panel

            // reset position panel to origin when click on title if he is on corner top left
            if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

                $("#elementor-preview-iframe").contents().find("html").attr('dir', ''); // move the scroll bar to left side

                elementor_switcher_display_block('left'); // show switcher

                $('#elementor-preview').animate({
                    'left': panelWidth + 'px',
                    'right': 0,
                }, 150);

            } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {


                $("#elementor-preview-iframe").contents().find("html").attr('dir', 'rtl'); // move the scroll bar to left side

                elementor_switcher_display_block('right'); // show switcher

                $('#elementor-preview').animate({
                    'left': 0,
                    'right': panelWidth + 'px',
                }, 150);

            }


        } else {


            $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // add resizable the right side of panel editor
            $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // add resizable the right side of panel editor
            $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-all"); // remove resizable all panel editor

            var panel_size_height = localStorage.getItem('elementor-panel-size-height');

            if (panel_size_height >= parseInt($("#elementor-panel").css("top"))) {
                $("#elementor-panel").animate({
                    height: panel_size_height
                }, 150); // add the height px minus the top px
            } else {
                $("#elementor-panel").animate({
                    height: $(window).height() - parseInt($("#elementor-panel").css("top"))
                }, 150); // add the height px minus the top px
            }

        }

        //alert('resize off');

    } else {

        //save height
        var panelHeight = $("#elementor-panel").height();
        localStorage.setItem('elementor-panel-size-height', panelHeight);

        $("#elementor-preview-iframe").contents().find("body").addClass('elementor-editor-preview').removeClass('elementor-editor-active'); // active preview
        $("body").addClass('elementor-editor-preview').removeClass('elementor-editor-active'); // active preview
        $("#elementor-preview-iframe").contents().find("#elementor").removeClass('elementor-edit-area-active').addClass('elementor-edit-area-preview'); // active preview

        $('#elementor-panel').addClass('vertical_elementor_panel_toggle-on'); // Important, add class to panel for understand the collapse is on


        //get left position
        //var position = $( "#elementor-panel" ).position();
        $("#elementor-panel").animate({
            height: "40px",
            //left: position.left,
        }, 150); // resize the panel to height 40px

        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

        elementor_switcher_display_none(); // remove swicther


        // set full preview
        $('#elementor-preview').animate({
            'left': 0,
            'right': 0,
        }, 150);


        //alert('resize on');

    }

}

/*--------------------------------------------------------------------------------------

4 - Collaspe Categories

--------------------------------------------------------------------------------------*/
// Close all categories in panel with the right click
function collapseCategories(delay) {

    if (delay) {
        delay = 0; // remove transition
    } else {
        delay = 280; // add delay for smoothing
    }

    //alert(localStorage.getItem("cat-closed")); // for debugging

    // remove window click right chrome
    $("#elementor-panel-elements-categories").on("contextmenu", function() {
        return false;
    });

    $('#elementor-panel-elements-categories').mousedown(function(event) {

        if (event.which == 3) { // right click

            if (localStorage.getItem('cat-closed') == 0) {

                $(".elementor-panel-category-items").slideUp(280);
                $(".elementor-panel-category").removeClass("elementor-active");
                $('.elementor-panel-category-items')
                    .delay(280)
                    .queue(function(next) {
                        $(this).css('display', 'none');
                        next();
                    });

                localStorage.setItem('cat-closed', '1');
                //console.log(localStorage.getItem("cat-closed")); // for debugging

            } else {
                $(".elementor-panel-category").addClass("elementor-active");
                $(".elementor-panel-category-items").slideDown(280);
                $(".elementor-panel-category-items").css("display", "block");

                localStorage.setItem('cat-closed', '0');
                //console.log(localStorage.getItem("cat-closed")); // for debugging
            }
        }
    });


    // load conditionnal if the save collapse is "closed"
    if (localStorage.getItem('cat-closed') == 1) {
        $(".elementor-panel-category-items").slideUp(delay);
        $(".elementor-panel-category").removeClass("elementor-active");
        $('.elementor-panel-category-items')
            .delay(delay)
            .queue(function(next) {
                $(this).css('display', 'none');
                next();
            });
    }

}


/*--------------------------------------------------------------------------------------

5 - Draggable Categories

--------------------------------------------------------------------------------------*/
// Make Categories in elementor panel draggable
function draggableCategories() {

    $("#elementor-panel-categories").sortable({
        cursor: "move",
        axis: "y",
        opacity: 0.5,
        cancel: ".elementor-element-wrapper",
        create: createPositionsCategories,
        update: refreshPositionsCategories
    });

}

function refreshPositionsCategories() {

    // refresh tabindex number by order categorie
    $('.elementor-panel-category').each(function(i) {

        $(this).attr('tabindex', i + 1); // reload tabindex to all single category

        var idCategory = this.id; // get id
        var tabindexCategory = $(this).attr('tabindex'); // get tabindex

        var i = i + 1; // add first number 1

        localStorage.setItem('cat-position-' + tabindexCategory, idCategory); // save position

    });

}

function createPositionsCategories() {

    // did action by number of category
    $(".elementor-panel-category").each(function(i) {
        var i = i + 1;

        if (localStorage.getItem('cat-position-' + i)) {
            $("#" + localStorage.getItem('cat-position-' + i)).appendTo("#elementor-panel-categories"); // clear and put the new order with appendTo
        }
    });

}


/*--------------------------------------------------------------------------------------

6 - Display / Hide switcher

--------------------------------------------------------------------------------------*/

// Show the arrow of switcher elementor editor
function elementor_switcher_display_block(side) {

    //alert(side);
    if (side == 'left') {
        $("#elementor-mode-switcher").addClass('right').removeClass('left'); // make switcher mode to right side
    } else if (side == 'right') {
        $("#elementor-mode-switcher").addClass('left').removeClass('right'); // make switcher mode to left side
    }

    $("#elementor-mode-switcher").css("display", "block"); // all side

}
// Hide the arrow of switcher elementor editor
function elementor_switcher_display_none() {

    $("#elementor-mode-switcher").css("display", "none"); // all side

}


/*--------------------------------------------------------------------------------------

7 - Collaspe Horizontal Panel

--------------------------------------------------------------------------------------*/
function elementor_horizontal_panel() {

    switcher_checkbox = $('#elementor-mode-switcher-preview-input').is(':checked'); // get value checkbox
    //console.log( switcher_checkbox );

    panelWidth = $("#elementor-panel").width(); // get size panel

    //elementor-editor-active = panel open
    //elementor-editor-preview = panel close

    // false = panel open
    if (switcher_checkbox == false) {

        // reset position panel to origin when click on title if he is on corner top left
        if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

            $('#elementor-preview').animate({
                'left': 0,
            }, 150);

            $('#elementor-panel').animate({
                'left': '-' + panelWidth + 'px',
            }, 150);

        } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {

            $('#elementor-preview').animate({
                'right': 0,
            }, 150);

            $('#elementor-panel').animate({
                'right': '-' + panelWidth + 'px',
            }, 150);

        }


        $('#elementor-mode-switcher-preview-input').prop('checked', true); // check

        $("#elementor-preview-iframe").contents().find("body").addClass('elementor-editor-preview').removeClass('elementor-editor-active'); // active preview
        $("body").addClass('elementor-editor-preview').removeClass('elementor-editor-active'); // active preview
        $("#elementor-preview-iframe").contents().find("#elementor").addClass('elementor-edit-area-preview').removeClass('elementor-edit-area-active'); // active preview

    } else {

        // reset position panel to origin when click on title if he is on corner top left
        if ($('#elementor-panel').css('left') === '-' + panelWidth + 'px' && $('#elementor-panel').css('top') === '0px') {

            $('#elementor-preview').animate({
                'left': panelWidth + 'px',
            }, 150);
            $('#elementor-panel').animate({
                'left': 0,
            }, 150);

        } else if ($('#elementor-panel').css('right') === '-' + panelWidth + 'px' && $('#elementor-panel').css('top') === '0px') {

            $('#elementor-preview').animate({
                'right': panelWidth + 'px',
            }, 150);
            $('#elementor-panel').animate({
                'right': 0,
            }, 150);

        }


        $('#elementor-mode-switcher-preview-input').prop('checked', false); //uncheck

        $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("#elementor-preview-iframe").contents().find("#elementor").removeClass('elementor-edit-area-preview').addClass('elementor-edit-area-active'); // disable preview

    }

}


/*--------------------------------------------------------------------------------------

8 - Reset Panel

--------------------------------------------------------------------------------------*/
function reset_fep_panel() {

    //console.log('ok');

    $("#elementor-preview").css("pointer-events", "auto"); // active pointer on the preview elementor

    //$("#elementor-panel").removeAttr('style'); // remove

    if (FEP.rtl) {
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-w"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // remove resizable all panel editor
        $("#elementor-preview-iframe").contents().find("html").attr('dir', 'rtl'); // move the scroll bar to left side
    } else {
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // remove resizable all panel editor
        $("#elementor-preview-iframe").contents().find("html").attr('dir', ''); // move the scroll bar to right side
    }

    $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

    $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
    $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview

    $('#elementor-panel').removeClass('vertical_elementor_panel_toggle-on'); // collapse is off

    $('#elementor-mode-switcher-preview-input').prop("disabled", false); // uncheck

    // remove class "in-move" when panel back in origine position
    $("#elementor-panel").removeClass("in-move"); // remove
    localStorage.setItem('in-move', 0); //save

    if (FEP.rtl) {
        elementor_switcher_display_block('right'); // show button resize preview
    } else {
        elementor_switcher_display_block('left'); // show button resize preview
    }

    // replace the preview
    //panelWidth = $("#elementor-panel").width(); // get size panel


    if (fepConfig.minimize_category_space == 'yes') {
        panelWidth = 280; // this is the size with made to the load by Elementor
    } else {
        panelWidth = 362; // this is the size with made to the load by Elementor
    }


    // mode rtl
    if (FEP.rtl) {
        $('#elementor-preview').animate({
            'right': panelWidth + 'px',
            'left': 0,
        }, 150);
        // of normal
    } else {
        $('#elementor-preview').animate({
            'left': panelWidth + 'px',
            'right': 0,
        }, 150);

    }

    $('#elementor-panel').animate({
        'width': panelWidth + 'px',
    }, 150);

    // clean style
    var elementor_panel = document.getElementById("elementor-panel");

    elementor_panel.style.height = null;
    elementor_panel.style.opacity = null;
    elementor_panel.style.right = null;
    elementor_panel.style.bottom = null;
    elementor_panel.style.left = null;
    elementor_panel.style.top = null;


    // clean all vars
    localStorage.removeItem('elementor-panel-size-width'); //remove
    localStorage.removeItem('elementor-panel-size-height'); //remove
    localStorage.removeItem('elementor-panel-pos-top'); //remove
    localStorage.removeItem('elementor-panel-pos-left'); //remove
    localStorage.removeItem('elementor-panel-pos-right'); //remove
    localStorage.removeItem('in-move'); //remove

}


/*--------------------------------------------------------------------------------------

9 - Collaspe Horizontal Panel Key

--------------------------------------------------------------------------------------*/
function elementor_horizontal_panel_key() {

    // if has class vertical_elementor_panel_toggle-on, dont resize
    if ($('#elementor-panel').hasClass('vertical_elementor_panel_toggle-on')) {
        //do nothing
        return false;
    }

    switcher_checkbox = $('#elementor-mode-switcher-preview-input').is(':checked'); // get value checkbox
    //console.log( switcher_checkbox );

    panelWidth = $("#elementor-panel").width(); // get size panel

    //elementor-editor-active = panel open
    //elementor-editor-preview = panel close

    // false = panel open
    if (switcher_checkbox == false) {

        // if panel is not in drag
        if (!$('#elementor-panel').hasClass('in-move')) {
            $('#elementor-preview').animate({
                'left': 0,
                'right': 0,
            }, 150);

            // reset position panel to origin when click on title if he is on corner top left
            if ($('#elementor-panel').css('left') === '0px' && $('#elementor-panel').css('top') === '0px') {

                $('#elementor-panel').animate({
                    'left': '-' + panelWidth + 'px',
                    'width': panelWidth + 'px',
                }, 150);

            } else if ($('#elementor-panel').css('right') === '0px' && $('#elementor-panel').css('top') === '0px') {

                $('#elementor-panel').animate({
                    'right': '-' + panelWidth + 'px',
                    'width': panelWidth + 'px',
                }, 150);

            }


        } else {

            $('#elementor-panel').animate({
                'width': panelWidth + 'px',
            }, 150);
            $('#elementor-panel').hide(150);

        }

        $('#elementor-mode-switcher-preview-input').prop('checked', true); // check

        $("#elementor-preview-iframe").contents().find("body").addClass('elementor-editor-preview').removeClass('elementor-editor-active'); // active preview
        $("body").addClass('elementor-editor-preview').removeClass('elementor-editor-active'); // active preview
        $("#elementor-preview-iframe").contents().find("#elementor").addClass('elementor-edit-area-preview').removeClass('elementor-edit-area-active'); // active preview

    } else {

        // if panel is not in drag
        if (!$('#elementor-panel').hasClass('in-move')) {



            // reset position panel to origin when click on title if he is on corner top left
            if ($('#elementor-panel').css('left') === '-' + panelWidth + 'px' && $('#elementor-panel').css('top') === '0px') {

                $('#elementor-preview').animate({
                    'left': panelWidth + 'px',
                }, 150);
                $('#elementor-panel').animate({
                    'left': 0,
                    'width': panelWidth + 'px',
                }, 150);

            } else if ($('#elementor-panel').css('right') === '-' + panelWidth + 'px' && $('#elementor-panel').css('top') === '0px') {

                $('#elementor-preview').animate({
                    'right': panelWidth + 'px',
                }, 150);
                $('#elementor-panel').animate({
                    'right': 0,
                    'width': panelWidth + 'px',
                }, 150);

            }





        } else {

            $('#elementor-preview').animate({
                'left': 0,
                'right': 0,
            }, 150);

            $('#elementor-panel').animate({
                'width': panelWidth + 'px',
            }, 150);
            $('#elementor-panel').show(150);

        }


        $('#elementor-mode-switcher-preview-input').prop('checked', false); //uncheck

        $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("#elementor-preview-iframe").contents().find("#elementor").removeClass('elementor-edit-area-preview').addClass('elementor-edit-area-active'); // disable preview

    }

}
