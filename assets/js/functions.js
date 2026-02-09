/*

Summary functions:

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
10 - RTL Mode
11 - Navigator action when Mouse Up

*/

var $ = jQuery.noConflict();
var panel_size;
var panelWidth;
var panelHeight;
var switcher_checkbox;
var fepResizeRafId;
var fepResizePending;
var fepDomCache = {
    panel: null,
    preview: null,
    responsiveBar: null,
    headerTitle: null,
    panelContent: null,
    panelFooter: null,
    modeSwitcher: null
};

function getPanel() {
    if (!fepDomCache.panel || !fepDomCache.panel.length) {
        fepDomCache.panel = $("#elementor-panel");
    }
    return fepDomCache.panel;
}

function getPreview() {
    if (!fepDomCache.preview || !fepDomCache.preview.length) {
        fepDomCache.preview = $("#elementor-preview");
    }
    return fepDomCache.preview;
}

function getResponsiveBar() {
    if (!fepDomCache.responsiveBar || !fepDomCache.responsiveBar.length) {
        fepDomCache.responsiveBar = $(".e-responsive-bar");
    }
    return fepDomCache.responsiveBar;
}

function getPreviewElements() {
    return getPreview().add(getResponsiveBar());
}

function getPanelHeaderTitle() {
    if (!fepDomCache.headerTitle || !fepDomCache.headerTitle.length) {
        fepDomCache.headerTitle = $("#elementor-panel-header-title");
    }
    return fepDomCache.headerTitle;
}

function getPanelContentWrapper() {
    if (!fepDomCache.panelContent || !fepDomCache.panelContent.length) {
        fepDomCache.panelContent = $("#elementor-panel-content-wrapper");
    }
    return fepDomCache.panelContent;
}

function getPanelFooter() {
    if (!fepDomCache.panelFooter || !fepDomCache.panelFooter.length) {
        fepDomCache.panelFooter = $("#elementor-panel-footer");
    }
    return fepDomCache.panelFooter;
}

function getModeSwitcher() {
    if (!fepDomCache.modeSwitcher || !fepDomCache.modeSwitcher.length) {
        fepDomCache.modeSwitcher = $("#elementor-mode-switcher");
    }
    return fepDomCache.modeSwitcher;
}

function setPreviewOffsets(left, right, animate) {
    var $targets = getPreviewElements();
    var offsets = {
        left: left,
        right: right
    };

    if (animate) {
        $targets.stop(true, true).animate(offsets, 150);
        return;
    }

    $targets.css(offsets);
}

function getPreviewContents() {
    var $iframe = $("#elementor-preview-iframe");
    return $iframe.length ? $iframe.contents() : null;
}

function getPreviewBody() {
    var $contents = getPreviewContents();
    return $contents ? $contents.find("body") : null;
}

function getEditorHeaderOffset() {
    var $header = $("header.MuiAppBar-root").first();
    if (!$header.length) {
        return 0;
    }

    return Math.max(0, $header.outerHeight() || 0);
}

function getDockedTop() {
    return getEditorHeaderOffset();
}

function getDockedPanelHeight() {
    return Math.max(0, $(window).height() - getEditorHeaderOffset());
}

function getPanelTopValue() {
    return parseInt($("#elementor-panel").css('top'), 10) || 0;
}

function isPanelDockedTop() {
    var top = getPanelTopValue();
    var dockedTop = getDockedTop();
    return top === 0 || top === dockedTop;
}

function isPanelDockedLeft() {
    return $("#elementor-panel").css('left') === '0px' && isPanelDockedTop();
}

function isPanelDockedRight() {
    return $("#elementor-panel").css('right') === '0px' && isPanelDockedTop();
}

function getHistoryInsertTarget() {
    var $header = $("header.MuiAppBar-root");
    if ($header.length) {
        var $historyButton = $header.find('button[aria-label="History"]').first();
        if ($historyButton.length) {
            return $historyButton.closest('.MuiBox-root');
        }

        var $toolbar = $header.find(".MuiToolbar-root").first();
        var $grid = $toolbar.find(".MuiGrid-root.MuiGrid-container").first();
        var $stack = $grid.find(".MuiStack-root").first();
        if ($stack.length) {
            return $stack;
        }
    }

    return $("button[value=Notes]").parent();
}

function getDividerTemplate() {
    var $header = $("header.MuiAppBar-root");
    var $divider = $header.find("hr.MuiDivider-root.MuiDivider-vertical").first();
    if ($divider.length) {
        return $divider;
    }

    return $('<hr class="MuiDivider-root MuiDivider-fullWidth MuiDivider-vertical">');
}

function getFepHeaderGroup() {
    var $group = $('.fep-header-group').first();
    if ($group.length) {
        return $group;
    }

    var $anchor = getHistoryInsertTarget();
    if (!$anchor.length) {
        return $();
    }

    var $dividerBefore = getDividerTemplate().clone(false, false)
        .addClass('fep-header-divider fep-header-divider-before');
    var $dividerAfter = getDividerTemplate().clone(false, false)
        .addClass('fep-header-divider fep-header-divider-after');

    $group = $('<span class="MuiBox-root eui-0 fep-header-group"></span>');

    $anchor.after($dividerBefore);
    $dividerBefore.after($group);
    $group.after($dividerAfter);

    return $group;
}

function cleanupFepHeaderGroup() {
    var $group = $('.fep-header-group').first();
    if (!$group.length) {
        return;
    }

    if ($group.find('.fep-header-item').length) {
        return;
    }

    $group.prev('.fep-header-divider').remove();
    $group.next('.fep-header-divider').remove();
    $group.remove();
}

function ensureExitLast() {
    var $group = $('.fep-header-group').first();
    if (!$group.length) {
        return;
    }

    var $exit = $group.find('#fep-exit-link').closest('.fep-header-item');
    if ($exit.length) {
        $group.append($exit);
    }
}

function addHeaderButton($button) {
    var $group = getFepHeaderGroup();
    if (!$group.length) {
        return;
    }

    $group.append($button);
}

function buildHeaderButton(id, title, iconClass, extraAttrs) {
    var $template = getHistoryInsertTarget();
    var $wrapper = $template.length
        ? $template.clone(false, false)
        : $('<span class="MuiBox-root eui-0"></span>');

    $wrapper.addClass('fep-header-item');

    var $button = $wrapper.find('button').first();
    if (!$button.length) {
        $button = $('<button type="button"></button>');
        $wrapper.empty().append($button);
    }

    var tooltipPlacement = $button.attr('data-tooltip-placement') || 'bottom';

    $button
        .attr('id', id)
        .attr('type', 'button')
        .attr('title', title)
        .attr('aria-label', title)
        .attr('aria-pressed', 'false')
        .attr('data-tooltip', title)
        .attr('data-tooltip-placement', tooltipPlacement)
        .addClass('fep-header-button')
        .removeAttr('value');

    if (extraAttrs) {
        Object.keys(extraAttrs).forEach(function (key) {
            $button.attr(key, extraAttrs[key]);
        });
    }

    $button.empty().append(
        $('<i>')
            .addClass('MuiSvgIcon-root')
            .addClass('MuiSvgIcon-fontSizeMedium')
            .addClass('fep-header-icon')
            .addClass(iconClass)
    );

    return $wrapper;
}


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


        var dockedHeight = getDockedPanelHeight();
        var dockedTop = getDockedTop();

        // check if the panel is oversize of windows height and panel more up of top windows
        if (panel_size_height >= dockedHeight || panel_pos_top < 0) {

            $("#elementor-panel").css({
                'top': dockedTop,
                'left': panel_pos_left + 'px',
                'right': 0, //unset
            }); // move the panel at the save position but force top 0
            $("#elementor-panel").css("height", dockedHeight); // remove the force height

            // set var panel size with special height
            panel_size = {
                width: panel_size_width + 'px',
                height: dockedHeight + 'px'
            };

        } else {

            $("#elementor-panel").css({
                'top': panel_pos_top + 'px',
                'left': panel_pos_left + 'px',
                'right': 'auto', // change to auto for help the rtl mode
            }); // move the panel at the save position

            // set var panel size
            panel_size = {
                width: panel_size_width + 'px',
                height: panel_size_height + 'px'
            };

        }

        $('#elementor-preview, .e-responsive-bar').css('right', 0); // full preview size when panel is in drag to load
        $('#elementor-preview, .e-responsive-bar').css('left', 0); // full preview size when panel is in drag to load

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
            var dockedTop = getDockedTop();

            //console.log('left side')

            $('#elementor-preview, .e-responsive-bar').animate({
                'left': panel_size_width + 'px',
            }, 150);

            $('#elementor-preview, .e-responsive-bar').css('right', 0); // full preview size when panel is in drag to load

            rtl_mode(false); // run normal mode

            elementor_switcher_display_block('left'); // show button right side resize preview

            $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e").removeClass("ui-resizable-w"); // resize right side

            $("#elementor-panel").css({
                'top': dockedTop,
                'left': 0,
                'right': 'auto',
            }); // move the panel at the save position


            // like 1920 === 1920, this is right side
        } else if (panel_pos_right == window.innerWidth) {
            var dockedTop = getDockedTop();

            //console.log('right side')

            $('#elementor-preview, .e-responsive-bar').animate({
                'right': panel_size_width + 'px',
            }, 150);

            $('#elementor-preview, .e-responsive-bar').css('left', 0); // full preview size when panel is in drag to load

            rtl_mode(true); // run rtl mode

            elementor_switcher_display_block('right'); // show button left side resize preview
            $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-w").removeClass("ui-resizable-e"); // resize left side

            $("#elementor-panel").css({
                'top': dockedTop,
                'left': 'auto',
                'right': 0,
            }); // move the panel at the save position

        }
    }

    setTimeout(MouseUpHeaderNavigator, 1000); // load after 1 second for prevent issue position preview
    //MouseUpHeaderNavigator(); // run
}

/*--------------------------------------------------------------------------------------

1 - Load Settings FEP

--------------------------------------------------------------------------------------*/

// Load the settings FEP
function LoadFepSettings() {

    if (typeof fepConfig === 'undefined') {
        return;
    }

    //console.log(fepConfig); // for debugging

    //add exit icon
    if (fepConfig.display_exit_icon == 'yes' || !fepConfig.display_exit_icon) {
        if ($("#fep-exit-link").length == 0) {
            exit_panel_new = buildHeaderButton(
                'fep-exit-link',
                fep.exit_tooltip,
                'eicon-editor-external-link',
                {
                    'data-save': 'no'
                }
            );
            addHeaderButton(exit_panel_new);
        }

        // add attr save when use the exit button
        if (fepConfig.exit_save === 'yes') {
            $("#fep-exit-link").attr("data-save", "yes");
        } else {
            $("#fep-exit-link").attr("data-save", "no");
        }
    }
    if (fepConfig.display_exit_icon == 'no' || fepConfig.display_exit_icon == '') {
        $("#fep-exit-link").remove();
        cleanupFepHeaderGroup();
    }


    //add collapse icon
    if (fepConfig.display_vertical_collaspe_icon == 'yes' || !fepConfig.display_vertical_collaspe_icon) {
        if ($("#fep-collapse-vertical").length == 0) {
            collapse_vertical_panel_new = buildHeaderButton(
                'fep-collapse-vertical',
                fep.collapse_vertical,
                'eicon-v-align-middle'
            );
            addHeaderButton(collapse_vertical_panel_new);
        }
    }
    if (fepConfig.display_vertical_collaspe_icon == 'no' || fepConfig.display_vertical_collaspe_icon == '') {
        $("#fep-collapse-vertical").remove();
        cleanupFepHeaderGroup();
    }


    //add reset panel icon
    if (fepConfig.display_reset_icon == 'yes' || !fepConfig.display_reset_icon) {
        if ($("#fep-reset-panel").length == 0) {
            fep_reset_panel_new = buildHeaderButton(
                'fep-reset-panel',
                fep.reset_panel,
                'eicon-undo'
            );
            addHeaderButton(fep_reset_panel_new);
        }
    }
    if (fepConfig.display_reset_icon == 'no' || fepConfig.display_reset_icon == '') {
        $("#fep-reset-panel").remove();
        cleanupFepHeaderGroup();
    }


    if (fepConfig.draggable_panel == 'yes' || !fepConfig.draggable_panel) {
        getPanel().draggable("enable");
        getPanelHeaderTitle().on('touchstart mousedown', mousedownHeaderTitle);
        $(document).on('touchend mouseup', mouseupHeaderTitle);
        getPanelHeaderTitle().css("cursor", "move"); // add cursor to the title editor panel
    }
    if (fepConfig.draggable_panel == 'no' || fepConfig.draggable_panel == '') {
        getPanel().draggable("disable");
        getPanelHeaderTitle().off('touchstart mousedown', mousedownHeaderTitle);
        //$("#elementor-panel-header-title").off('touchend mouseup', mouseupHeaderTitle); //useless
        getPanelHeaderTitle().css("cursor", ""); // remove special cursor to the title editor panel
    }
    if (fepConfig.minimize_category_space == 'yes' || !fepConfig.minimize_category_space) {
        $('body').addClass("fep-minimize-category");
    }
    if (fepConfig.minimize_category_space == 'no' || fepConfig.minimize_category_space == '') {
        $('body').removeClass("fep-minimize-category");
    }
    if (fepConfig.use_grid_ruler == 'yes' || !fepConfig.use_grid_ruler) {
        $('body').addClass("fep-elementor-grid-ruler");
    }
    if (fepConfig.use_grid_ruler == 'no' || fepConfig.use_grid_ruler == '') {
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
    if (fepConfig.exit_link_new_tab == 'yes' || !fepConfig.exit_link_new_tab) {
        $("#fep-exit-link").attr("target", "_blank").attr("data-target", "_blank");
    }
    if (fepConfig.exit_link_new_tab == 'no' || fepConfig.exit_link_new_tab == '') {
        $("#fep-exit-link").attr("target", "_self").attr("data-target", "_self");
    }
    if (fepConfig.exit_link_point == 'front' || !fepConfig.exit_link_point) {
        $("#fep-exit-link").attr("href", FEP.Permalink).attr("data-href", FEP.Permalink);
    }
    if (fepConfig.exit_link_point == 'edit') {
        var editHref = window.location.href.replace("&action=elementor", "&action=edit");
        $("#fep-exit-link").attr("href", editHref).attr("data-href", editHref);
    }
    if (fepConfig.exit_link_point == 'list') {
        var listHref = window.location.href.split('wp-admin')[0] + 'wp-admin/edit.php?post_type=' + FEP.PostType;
        $("#fep-exit-link").attr("href", listHref).attr("data-href", listHref);
    }
    if (fepConfig.exit_link_point == 'elementor_library') {
        var libraryHref = window.location.href.split('wp-admin')[0] + 'wp-admin/edit.php?post_type=elementor_library';
        $("#fep-exit-link").attr("href", libraryHref).attr("data-href", libraryHref);
    }
    if (fepConfig.exit_link_point == 'admin_dashboard') {
        var adminHref = window.location.href.split('wp-admin')[0] + 'wp-admin/';
        $("#fep-exit-link").attr("href", adminHref).attr("data-href", adminHref);
    }
    if (fepConfig.exit_save === 'yes') {
        $("#fep-exit-link").attr("data-save", "yes");
    }

    ensureExitLast();

    var $previewContents = getPreviewContents();
    var $previewBody = getPreviewBody();

    if (fepConfig.hide_elements_responsive == 'yes') {
        if ($previewBody) {
            $previewBody.addClass("hide-elements-responsive");
        }

        $("body").addClass("disable-option-fep-disable_obscured_elements_responsive");
        $("body").addClass("disable-option-fep-maintain_obscured_elements_responsive");
        $("body").addClass("disable-option-fep-alternative_responsive_indicator");

    } else {
        if ($previewBody) {
            $previewBody.removeClass("hide-elements-responsive");
        }

        $("body").removeClass("disable-option-fep-disable_obscured_elements_responsive");
        $("body").removeClass("disable-option-fep-maintain_obscured_elements_responsive");
        $("body").removeClass("disable-option-fep-alternative_responsive_indicator");
    }
    if (fepConfig.disable_obscured_elements_responsive == 'yes') {
        if ($previewBody) {
            $previewBody.addClass("disable-obscured-elements-responsive");
        }
    } else if ($previewBody) {
        $previewBody.removeClass("disable-obscured-elements-responsive");
    }
    if (fepConfig.maintain_obscured_elements_responsive == 'yes') {
        if ($previewBody) {
            $previewBody.addClass("maintain-obscured-elements-responsive");
        }
    } else if ($previewBody) {
        $previewBody.removeClass("maintain-obscured-elements-responsive");
    }
    if (fepConfig.alternative_responsive_indicator == 'yes') {
        if ($previewBody) {
            $previewBody.addClass("alternative-responsive-indicator-enabled");
        }
    } else if ($previewBody) {
        $previewBody.removeClass("alternative-responsive-indicator-enabled");
    }

    //$("#elementor-navigator__header").on('touchstart mousedown', mousedownHeaderTitleNavigator);
    $(document)
        .off('touchend.fep mouseup.fep')
        .on('touchend.fep mouseup.fep', MouseUpHeaderNavigator); // load
}


/*--------------------------------------------------------------------------------------

2 - Draggable Panel

--------------------------------------------------------------------------------------*/
// Make Elementor Panel draggable
function DraggablePanel() {

    getPanel().resizable({
        minWidth: 300,
        minHeight: 360,
        //delay: 0,
        //handles: "all",
        resize: function (event, ui) {
            event.preventDefault();

            getPreview().css("pointer-events", "none"); // disable pointer on the preview elementor

            if (getPanel().hasClass("in-move")) {
                return;
            }

            if (fepResizeRafId) {
                fepResizePending = {
                    width: ui.size.width,
                    dockedLeft: isPanelDockedLeft(),
                    dockedRight: isPanelDockedRight()
                };
                return;
            }

            fepResizePending = {
                width: ui.size.width,
                dockedLeft: isPanelDockedLeft(),
                dockedRight: isPanelDockedRight()
            };

            fepResizeRafId = window.requestAnimationFrame(function () {
                var data = fepResizePending;
                fepResizePending = null;
                fepResizeRafId = null;

                if (!data) {
                    return;
                }

                if (data.dockedLeft) {
                    getPreview().css('left', data.width);
                } else if (data.dockedRight) {
                    getPreview().css('right', data.width);
                }
            });

        },
        stop: function (event, ui) {
            event.preventDefault();

            getPreview().css("pointer-events", "auto"); // active pointer on the preview elementor

            panelWidth = ui.size.width;
            panelHeight = ui.size.height;

            //if panel is in not in move
            if (!getPanel().hasClass("in-move")) {

                //check if the panel is in the corner left / top
                if (isPanelDockedLeft()) {

                    getPreview().css('left', panelWidth); // set

                } else if (isPanelDockedRight()) {

                    getPreview().css('right', panelWidth); // set

                }

            }

            localStorage.setItem('elementor-panel-size-width', panelWidth); //save
            localStorage.setItem('elementor-panel-size-height', panelHeight); //save

        }
    });

    //console.log( panel_size_height + '-' + $(window).height() ); // for debugging

    // draggable panel !! al right ;)
    getPanel().draggable({
        handle: "#elementor-panel-header-title",
        snap: "#elementor-preview",
        opacity: 0.7,
        cancel: ".not-draggable",
        addClasses: false,
        containment: "window",
        snapMode: "inner",
        snapTolerance: 25,
        start: function () {

            setPreviewOffsets(0, 0, true);

            if (FEP.rtl) {
                // force right:auto with <html dir="rtl">
                getPanel().css({
                    'right': 'auto',
                });
            }


        },
        stop: function (event, ui) {


            //check if the panel is in the corner left / top
            if (isPanelDockedLeft()) {

                // remove class "in-move" when panel back in origine position
                getPanel().removeClass("in-move"); // remove
                localStorage.setItem('in-move', 0); //save

                getPanel().css({
                    'top': getDockedTop(),
                    'left': 0,
                    'right': 'auto',
                }); // move the panel at the save position

            } else if (isPanelDockedRight()) {

                // remove class "in-move" when panel back in origine position
                getPanel().removeClass("in-move"); // remove
                localStorage.setItem('in-move', 0); //save

                getPanel().css({
                    'top': getDockedTop(),
                    'left': 'auto',
                    'right': 0,
                }); // move the panel at the save position

            } else {

                // add class "in-move" when panel is in move
                getPanel().addClass("in-move");
                localStorage.setItem('in-move', 1);

            }

            localStorage.setItem('elementor-panel-pos-top', ui.position.top);
            localStorage.setItem('elementor-panel-pos-left', ui.position.left);

            var panelWidth = getPanel().width();
            var UiPositionRight = ui.position.left + panelWidth;

            localStorage.setItem('elementor-panel-pos-right', UiPositionRight);

            // save the width and height size
            localStorage.setItem('elementor-panel-size-width', panelWidth); //save
            localStorage.setItem('elementor-panel-size-height', getPanel().height()); //save

            //alert(UiPositionRight);

        }
    });

    //$("#elementor-panel-content-wrapper").addClass("not-draggable"); // add class for disable the draggable at wrapper area
    //$("#elementor-panel-footer").addClass("not-draggable"); // add class for disable the draggable at footer area
    //$("#elementor-mode-switcher").addClass("not-draggable"); // add class for disable the draggable at mode switcher area

}


// MOUSEDOWN (at the click mouse)
function mousedownHeaderTitle() {

    getPreview().css("pointer-events", "none"); // disable pointer on the preview elementor

    // when start to draggable, do it if the panel still in corner top left
    if (isPanelDockedLeft()) {

        getPanel().css("height", "65%"); // set panel height 65% of windows
        getPanelContentWrapper().slideDown(150); // transition
        getPanelFooter().slideDown(150); // transition

        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // remove resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // remove resizable the left side of panel editor
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-all"); // add resizable all panel editor

        elementor_switcher_display_none(); // remove switcher preview mode

        // clean height size for exclude conflict with vertical callapse
        var panelHeight = getPanel().height(); // get
        localStorage.setItem('elementor-panel-size-height', panelHeight); //save
        getPanel().removeClass('vertical_elementor_panel_toggle-on'); // collapse is off

    } else if (isPanelDockedRight()) {

        getPanel().css("height", "65%"); // set panel height 65% of windows
        getPanelContentWrapper().slideDown(150); // transition
        getPanelFooter().slideDown(150); // transition

        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // remove resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // remove resizable the left side of panel editor
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-all"); // add resizable all panel editor

        elementor_switcher_display_none(); // remove switcher preview mode

        // clean height size for exclude conflict with vertical callapse
        var panelHeight = getPanel().height(); // get
        localStorage.setItem('elementor-panel-size-height', panelHeight); //save
        getPanel().removeClass('vertical_elementor_panel_toggle-on'); // collapse is off

    }

}

// MOUSEUP (at leave the click mouse)
function mouseupHeaderTitle() {

    getPreview().css("pointer-events", "auto"); // active pointer on the preview elementor

    // reset position panel to origin when click on title if he is on corner top left
    if (isPanelDockedLeft()) {

        rtl_mode(false); // run normal mode

        $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview

        getPanel().css({
            'top': getDockedTop(),
            'height': getDockedPanelHeight() + 'px'
        }); // resize full height panel

        getPanelContentWrapper().slideDown(150); // transiton
        getPanelFooter().slideDown(150); // transiton

        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

        elementor_switcher_display_block('left'); // show button resize preview

        // remove class "in-move" when panel back in origine position
        getPanel().removeClass("in-move");
        localStorage.setItem('in-move', 0);

        // replace the preview
        panelWidth = getPanel().width(); // get size panel
        setPreviewOffsets(panelWidth + 'px', 0, true);

    } else if (isPanelDockedRight()) {

        rtl_mode(true); // run rtl mode

        $("#elementor-preview-iframe").contents().find("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview
        $("body").removeClass('elementor-editor-preview').addClass('elementor-editor-active'); // disable preview

        getPanel().css({
            'top': getDockedTop(),
            'height': getDockedPanelHeight() + 'px'
        }); // resize full height panel

        getPanelContentWrapper().slideDown(150); // transiton
        getPanelFooter().slideDown(150); // transiton

        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-w"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

        elementor_switcher_display_block('right'); // show button resize preview

        // remove class "in-move" when panel back in origine position
        getPanel().removeClass("in-move");
        localStorage.setItem('in-move', 0);

        // replace the preview
        panelWidth = getPanel().width(); // get size panel
        setPreviewOffsets(0, panelWidth + 'px', true);

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
                height: getDockedPanelHeight() + 'px'
            }, 0); // add the height px minus the top px

            //$(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e"); // add resizable the right side of panel editor
            $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-all"); // remove resizable all panel editor

            // set normal preview with panel
            panelWidth = $("#elementor-panel").width(); // get size panel

            // reset position panel to origin when click on title if he is on corner top left
            if (isPanelDockedLeft()) {

                elementor_switcher_display_block('left'); // show switcher

                setPreviewOffsets(panelWidth + 'px', 0, true);

            } else if (isPanelDockedRight()) {

                elementor_switcher_display_block('right'); // show switcher

                setPreviewOffsets(0, panelWidth + 'px', true);

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
        setPreviewOffsets(0, 0, true);


        //alert('resize on');

    }

}

/*--------------------------------------------------------------------------------------

4 - Collaspe Categories

--------------------------------------------------------------------------------------*/
// Toggle all categories with a dedicated button (no right-click conflict)
function collapseCategories() {
    var $categories = $("#elementor-panel-categories").first();
    if (!$categories.length) {
        return;
    }

    var labelText = (window.fep && fep.collapse_categories) ? fep.collapse_categories : 'Collapse categories';
    var $toggle = $('.fep-categories-toggle').first();

    if (!$toggle.length) {
        var $button = $('<button type="button" class="fep-categories-toggle-button elementor-button elementor-button-default" aria-pressed="false"></button>');
        $button.append(
            $('<span class="fep-categories-toggle-text"></span>').text(labelText)
        );

        $toggle = $('<div class="fep-categories-toggle"></div>').append($button);
        $categories.before($toggle);
    } else {
        $toggle.find('.fep-categories-toggle-text').text(labelText);
    }

    function applyCategoriesState(isCollapsed) {
        var $items = $(".elementor-panel-category-items");
        var $categories = $(".elementor-panel-category");

        if (isCollapsed) {
            $items.stop(true, true).slideUp(280);
            $categories.removeClass("elementor-active");
            localStorage.setItem('cat-closed', '1');
        } else {
            $categories.addClass("elementor-active");
            $items.stop(true, true).slideDown(280);
            localStorage.setItem('cat-closed', '0');
        }

        var $button = $('.fep-categories-toggle-button');
        $button
            .toggleClass('is-collapsed', isCollapsed)
            .attr('aria-pressed', isCollapsed ? 'true' : 'false');
    }

    applyCategoriesState(localStorage.getItem('cat-closed') === '1');

    $(document)
        .off('click.fep', '.fep-categories-toggle-button')
        .on('click.fep', '.fep-categories-toggle-button', function (event) {
            event.preventDefault();
            var shouldCollapse = localStorage.getItem('cat-closed') !== '1';
            applyCategoriesState(shouldCollapse);
        });

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
    $('.elementor-panel-category').each(function (i) {

        $(this).attr('tabindex', i + 1); // reload tabindex to all single category

        var idCategory = this.id; // get id
        var tabindexCategory = $(this).attr('tabindex'); // get tabindex

        var i = i + 1; // add first number 1

        localStorage.setItem('cat-position-' + tabindexCategory, idCategory); // save position

    });

}

function createPositionsCategories() {

    // did action by number of category
    $(".elementor-panel-category").each(function (i) {
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
    var $modeSwitcher = getModeSwitcher();

    if (side == 'left') {
        $modeSwitcher.addClass('right').removeClass('left'); // make switcher mode to right side
    } else if (side == 'right') {
        $modeSwitcher.addClass('left').removeClass('right'); // make switcher mode to left side
    }

    $modeSwitcher.css("display", "block"); // all side

}
// Hide the arrow of switcher elementor editor
function elementor_switcher_display_none() {

    getModeSwitcher().css("display", "none"); // all side

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
        if ($('#elementor-panel').css('left') === '0px' && isPanelDockedTop()) {

            setPreviewOffsets(0, 0, true);

            $('#elementor-panel').animate({
                'left': '-' + panelWidth + 'px',
            }, 150);

        } else if ($('#elementor-panel').css('right') === '0px' && isPanelDockedTop()) {

            setPreviewOffsets(0, 0, true);

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
        if ($('#elementor-panel').css('left') === '-' + panelWidth + 'px' && isPanelDockedTop()) {

            setPreviewOffsets(panelWidth + 'px', 0, true);
            $('#elementor-panel').animate({
                'left': 0,
            }, 150);

        } else if ($('#elementor-panel').css('right') === '-' + panelWidth + 'px' && isPanelDockedTop()) {

            setPreviewOffsets(0, panelWidth + 'px', true);
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

    $("#elementor-preview").css("pointer-events", "auto"); // active pointer on the preview elementor

    //$("#elementor-panel").removeAttr('style'); // remove

    if (FEP.rtl) {
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-w"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-e"); // remove resizable all panel editor
        rtl_mode(true); // set rtl mode
    } else {
        $(".elementor-panel > .ui-resizable-handle").addClass("ui-resizable-e"); // add resizable the right side of panel editor
        $(".elementor-panel > .ui-resizable-handle").removeClass("ui-resizable-w"); // remove resizable all panel editor
        rtl_mode(false); // set norml mode
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


    if (fepConfig.minimize_category_space == 'yes' || !fepConfig.minimize_category_space) {
        panelWidth = 300; // this is the size with made to the load by Elementor
    } else {
        panelWidth = 382; // this is the size with made to the load by Elementor
    }


    // mode rtl
    if (FEP.rtl) {
        setPreviewOffsets(0, panelWidth + 'px', true);
        // of normal
    } else {
        setPreviewOffsets(panelWidth + 'px', 0, true);

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
            setPreviewOffsets(0, 0, true);

            // reset position panel to origin when click on title if he is on corner top left
            if ($('#elementor-panel').css('left') === '0px' && isPanelDockedTop()) {

                $('#elementor-panel').animate({
                    'left': '-' + panelWidth + 'px',
                    'width': panelWidth + 'px',
                }, 150);

            } else if ($('#elementor-panel').css('right') === '0px' && isPanelDockedTop()) {

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
            if ($('#elementor-panel').css('left') === '-' + panelWidth + 'px' && isPanelDockedTop()) {

                setPreviewOffsets(panelWidth + 'px', 0, true);
                $('#elementor-panel').animate({
                    'left': 0,
                    'width': panelWidth + 'px',
                }, 150);

            } else if ($('#elementor-panel').css('right') === '-' + panelWidth + 'px' && isPanelDockedTop()) {

                setPreviewOffsets(0, panelWidth + 'px', true);
                $('#elementor-panel').animate({
                    'right': 0,
                    'width': panelWidth + 'px',
                }, 150);

            }





        } else {

            setPreviewOffsets(0, 0, true);

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


/*--------------------------------------------------------------------------------------

10 - RTL Mode

--------------------------------------------------------------------------------------*/

function rtl_mode(mode) {

    // var = true/false

    //console.log(mode); // debug
    //console.log(fepConfig.rtl_force_mode);

    if (mode == true) {
        var forceRtl = (fepConfig.rtl_force_mode == 'yes' || fepConfig.rtl_force_mode == null);
        var targetDir = forceRtl ? 'rtl' : (FEP.rtl ? 'rtl' : 'ltr');

        $("#elementor-preview-iframe").contents().find("html").attr('dir', targetDir); // set the global direction for scroll bar

        if (targetDir === 'rtl') {
            $('#elementor-preview-iframe').contents().find('body').addClass('rtl').removeClass('ltr');
            $('#elementor-preview-iframe').contents().find('header').css('direction', 'rtl');
            $('#elementor-preview-iframe').contents().find('main').css('direction', 'rtl');
        } else {
            $('#elementor-preview-iframe').contents().find('body').addClass('ltr').removeClass('rtl');
            $('#elementor-preview-iframe').contents().find('header').css('direction', 'ltr');
            $('#elementor-preview-iframe').contents().find('main').css('direction', 'ltr');
        }

    } else {

        // // core wodpress rtl
        //if ( FEP.rtl ) {
        $("#elementor-preview-iframe").contents().find("html").attr('dir', 'ltr');

        if (FEP.rtl) {
            $('#elementor-preview-iframe').contents().find('body').addClass('rtl').removeClass('ltr');
            $('#elementor-preview-iframe').contents().find('header').css('direction', 'rtl');
            $('#elementor-preview-iframe').contents().find('main').css('direction', 'rtl');
        } else {
            $('#elementor-preview-iframe').contents().find('body').addClass('ltr').removeClass('rtl');
            $('#elementor-preview-iframe').contents().find('header').css('direction', 'ltr');
            $('#elementor-preview-iframe').contents().find('main').css('direction', 'ltr');
        }


    }


}





/*--------------------------------------------------------------------------------------

11 - Navigator action when Mouse Up

--------------------------------------------------------------------------------------*/
// MOUSEUP (at leave the click mouse)
function MouseUpHeaderNavigator() {

    var $element_navigator = $('#elementor-navigator');
    var navigator_right = ($(window).width() - ($element_navigator.offset().left + $element_navigator.outerWidth()));

    //console.log( navigator_right );

    if (navigator_right <= 0) {
        //console.log($element_navigator.outerWidth());
        $('#elementor-preview').css('right', $element_navigator.outerWidth());
    } else {
        $('#elementor-preview').css('right', 0);
    }

}
