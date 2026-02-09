<?php

/**
 * FEP Controls — Elementor User Preferences integration.
 *
 * Registers all Flexible Editor Panel controls inside the Elementor
 * "User Preferences" panel so they are saved per-user.
 *
 * @package FEP
 * @since   2.2.1
 * @since   2.6.0 Rewritten with PHP 7.4 typed properties and cleaned up.
 */

namespace FEP\Inc\Settings;

use Elementor\Controls_Manager;

if (! defined('ABSPATH')) {
    exit;
}

class FEP_Controls
{

    private const META_KEY = 'elementor_preferences';

    public function __construct()
    {
        add_action(
            'elementor/element/editor-preferences/preferences/after_section_end',
            [$this, 'register_controls'],
            15
        );
    }

	// ─── Settings retrieval ──────────────────────────────────────────

    /**
     * Retrieve the saved FEP settings for the current user.
     *
     * @return array<string, mixed>
     */
    public static function get_settings(): array
    {
        $settings = get_user_meta(get_current_user_id(), self::META_KEY, true);
        return is_array($settings) ? $settings : [];
    }

	// ─── Controls definition ─────────────────────────────────────────

    /**
     * Build the full list of FEP controls.
     *
     * @return array<string, array>
     */
    public static function get_controls_list(): array
    {

        $reset_button_html = sprintf(
            '<button type="button" class="reset-fep elementor-button elementor-button-default">%s</button>',
            __('Reset Panel Position / Size', 'flexible-editor-panel')
        );

        $pro_text = __('The pro version is currently in development.<br>Get more information now on:', 'flexible-editor-panel');
        $pro_html = '<div class="desc-pro-version">'
            . '<img src="' . FEP_URL . '/assets/images/banner-fep-pro.jpg"><br><br>'
            . $pro_text . '<br><br>'
            . '<a href="https://webmat.pro/flexible-elementor-panel-pro/" target="_blank">webmat.pro/flexible-elementor-panel-pro/</a>'
            . '</div>';

        $rtl_note = is_rtl()
            ? '<br>' . __('Note: if you disable this option in RTL mode, it will set LTR mode when the editor is on the right side.', 'flexible-editor-panel')
            : '';

        return [
            Controls_Manager::TAB_SETTINGS => [

                // ── Panel settings ───────────────────────────────
                'fep_settings_panel' => [
                    'label'    => __('FEP - Panel Settings', 'flexible-editor-panel'),
                    'controls' => [
                        'draggable_panel' => [
                            'label'        => __('Draggable Panel', 'flexible-editor-panel'),
                            'description'  => __('Hold left click on the panel title bar to move it. Place it in a corner and click the title to snap it back.', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                        'use_grid_ruler' => [
                            'label'        => __('Compact Widget Grid', 'flexible-editor-panel'),
                            'description'  => __('Reduces the size of widgets in the panel and displays them in a grid layout.', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                        'minimize_category_space' => [
                            'label'        => __('Collapse All Categories Button', 'flexible-editor-panel'),
                            'description'  => __('Adds a button above the category list to toggle all widget categories open/closed.', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                        'editor_skin' => [
                            'label'   => __('Editor Skin', 'flexible-editor-panel'),
                            'type'    => Controls_Manager::SELECT,
                            'options' => [
                                'default'     => __('Default', 'flexible-editor-panel'),
                                'dark_pink'   => __('Dark Pink', 'flexible-editor-panel'),
                                'dark_orange' => __('Dark Orange', 'flexible-editor-panel'),
                            ],
                            'default' => 'default',
                        ],
                        'display_vertical_collaspe_icon' => [
                            'label'        => __('Show Vertical Collapse Icon', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                        'display_reset_icon' => [
                            'label'        => __('Show Reset Panel Icon', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                        'rtl_force_mode' => [
                            'label'        => __('Force RTL Mode', 'flexible-editor-panel'),
                            'description'  => __('Forces RTL mode when the editor panel is on the right side.', 'flexible-editor-panel') . $rtl_note,
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                    ],
                ],

                // ── Exit button ──────────────────────────────────
                'fep_settings_exit' => [
                    'label'    => __('FEP - Exit Button', 'flexible-editor-panel'),
                    'controls' => [
                        'display_exit_icon' => [
                            'label'        => __('Show Exit Icon', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                        'exit_link_point' => [
                            'label'   => __('Exit Destination', 'flexible-editor-panel'),
                            'type'    => Controls_Manager::SELECT,
                            'options' => [
                                'front'             => __('View Page', 'flexible-editor-panel'),
                                'edit'              => __('Edit Page (WP)', 'flexible-editor-panel'),
                                'list'              => __('Post / Page List', 'flexible-editor-panel'),
                                'admin_dashboard'   => __('Admin Dashboard', 'flexible-editor-panel'),
                                'elementor_library'  => __('Elementor Library', 'flexible-editor-panel'),
                            ],
                            'default' => 'front',
                        ],
                        'exit_link_new_tab' => [
                            'label'        => __('Open in New Tab', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'yes',
                        ],
                        'exit_save' => [
                            'label'        => __('Save Before Exit', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'no',
                        ],
                    ],
                ],

                // ── Responsive ───────────────────────────────────
                'fep_settings_responsive' => [
                    'label'    => __('FEP - Responsive Options', 'flexible-editor-panel'),
                    'controls' => [
                        'settings_responsive_note' => [
                            'type'            => Controls_Manager::RAW_HTML,
                            'raw'             => __('These options control how responsive-hidden elements appear inside the Elementor editor for each device mode. Use them carefully.', 'flexible-editor-panel'),
                            'content_classes' => 'elementor-panel-alert elementor-panel-alert-warning',
                        ],
                        'hide_elements_responsive' => [
                            'label'        => __('Hide Responsive Elements', 'flexible-editor-panel'),
                            'description'  => __('Completely hides elements that are set to hide in the current responsive mode.', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'no',
                        ],
                        'maintain_obscured_elements_responsive' => [
                            'label'        => __('Allow Editing Hidden Sections', 'flexible-editor-panel'),
                            'description'  => __('Allow editing of elements inside responsive-hidden Sections without using the Navigator.', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'no',
                        ],
                        'disable_obscured_elements_responsive' => [
                            'label'        => __('Disable Responsive Overlays', 'flexible-editor-panel'),
                            'description'  => __('Remove the grayed-out overlay from responsive-hidden elements.', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'no',
                        ],
                        'alternative_responsive_indicator' => [
                            'label'        => __('Alternative Responsive Indicator', 'flexible-editor-panel'),
                            'description'  => __('Use coloured handles instead of overlays to indicate hidden elements.', 'flexible-editor-panel'),
                            'type'         => Controls_Manager::SWITCHER,
                            'label_on'     => __('On', 'flexible-editor-panel'),
                            'label_off'    => __('Off', 'flexible-editor-panel'),
                            'return_value' => 'yes',
                            'default'      => 'no',
                        ],
                    ],
                ],

                // ── Tools & Info ─────────────────────────────────
                /*'fep_settings_other' => [
                    'label'    => __('Tools & Information', 'flexible-editor-panel'),
                    'controls' => [
                        'reset_panel' => [
                            'type' => Controls_Manager::RAW_HTML,
                            'raw'  => $reset_button_html,
                        ],
                        'note_pro_version' => [
                            'type'            => Controls_Manager::RAW_HTML,
                            'raw'             => $pro_html,
                            'content_classes' => 'ee-raw-html ee-raw-html__warning',
                        ],
                    ],
                ],*/
            ],
        ];
    }

	// ─── Register controls ───────────────────────────────────────────

    /**
     * Hook into the editor-preferences element and register our sections/controls.
     *
     * @param \Elementor\Controls_Stack $stack The preferences stack.
     */
    public function register_controls($stack): void
    {

        $controls_list = self::get_controls_list();

        foreach ($controls_list as $tab_name => $sections) {
            foreach ($sections as $section_name => $section_data) {

                $stack->start_controls_section($section_name, [
                    'label' => $section_data['label'],
                    'tab'   => $tab_name,
                ]);

                foreach ($section_data['controls'] as $control_name => $control_data) {
                    $stack->add_control($control_name, $control_data);
                }

                $stack->end_controls_section();
            }
        }

        // Remove the native "Panel Width" control (handled by FEP)
        $stack->remove_control('panel_width');
    }
}
