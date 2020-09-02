<?php

namespace FEP\Inc\Settings; // use it for redeclare the class of this file

use Elementor\Controls_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class FEP_Controls {


    const META_KEY = 'elementor_preferences';

    /**
     * Construct
     * @since 2.2.1
     * @access public
     *
     */
    public function __construct() {
        add_action(	'elementor/element/editor-preferences/preferences/after_section_end', array($this, 'add_controls'), 15);
    }

    // get settings from database to share in javascript
    public static function get_settings() {

        $settings = [];

        $settings = get_user_meta( get_current_user_id(), self::META_KEY, true );

		if ( $settings ) {
            foreach ( $settings as $option => $value) {

                $settings[ $option ] = $value;

            }
		}

		return $settings;

    }

    public static function get_controls_list() {

        $debugger_html = '<button type="button" class="reset-fep elementor-button elementor-button-default">' . __( 'Reset Panel Position/Size', 'fep' ) . '</button>';

        $text_html_pro_version = __( 'The pro version is currently development,<br> get more information now on:', 'fep' );
        $html_pro_version_html = '<div class="desc-pro-version"><img src="' . FEP_URL .'/assets/images/banner-fep-pro.jpg"><br><br>' . $text_html_pro_version .'<br><br><a href="https://webmat.pro/flexible-elementor-panel-pro/" target="_blank">webmat.pro/flexible-elementor-panel-pro/</a></div>';

        return [

            Controls_Manager::TAB_SETTINGS => [
                'fep_settings_panel'  => [
                    'label'     => __('Panel settings', 'fep'),
                    'controls'  => [
                        'draggable_panel' => [
                            'label' 			=> __('Draggable panel', 'fep'),
                            'description' 		=> __( 'hold down the left click on title of panel for move it (put it in the corner left and click on the title for back to origin style)', 'fep' ),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'use_grid_ruler' => [
                            'label' 			=> __('Use FLEX GRID for widgets', 'fep'),
                            'description' 		=> __( 'This reduce the size of widgets in the editor and styling them', 'fep' ),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'minimize_category_space'  => [
                            'label' 			=> __('Minimize all categories with right click', 'fep'),
                            'description' 		=> __( 'click the right mouse button on the panel to collapse all categories of widgets', 'fep' ),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',

                        ],
                        'editor_skin' => [
                            'label' 			=> __('Editor skins', 'fep'),
                            'type'  			=> Controls_Manager::SELECT,
                            'options'   		=> [
                                'dark_pink'   		=>     __('Dark Pink', 'fep'),
                                'dark_orange'    	=>     __('Dark Orange', 'fep'),
                                'default'   		=>     __('Default', 'fep')
                            ],
                            'default' 			=> 'default',
                        ],
                        'display_vertical_collaspe_icon' => [
                            'label' 			=> __('Display the vertical collaspe icon in header panel', 'fep'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'display_reset_icon' => [
                            'label' 			=> __('Display the reset panel icon in header panel', 'fep'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                    ]
                ],
                'fep_settings_exit'  => [
                    'label'     => __('Exit button options', 'fep'),
                    'controls'  => [
                        'display_exit_icon' => [
                            'label' 			=> __('Display the exit icon in footer panel', 'fep'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'exit_link_point' => [
                            'label' 			=> __('Exit point', 'fep'),
                            'type'  			=> Controls_Manager::SELECT,
                            'options'   		=> [
                                'front'       	=>      __('View', 'fep'),
                                'edit'          =>      __('Edition', 'fep'),
                                'list'          =>      __('List Page/Post', 'fep'),
                                'admin_dashboard'    =>      __('Admin dashboard', 'fep'),
                                'elementor_library'  =>      __('Elementor library', 'fep'),
                            ],
                            'default' 			=> 'front',
                        ],
                        'exit_link_new_tab' =>	[
                            'label' 			=> __('Open in new tab', 'fep'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                    ]
                ],
                'fep_settings_responsive'  => [
                    'label'     => __('Responsive options', 'fep'),
                    'controls'  => [
                        'settings_responsive_note' => [
                            'type' 				=> Controls_Manager::RAW_HTML,
                            'raw' 				=> __( 'These options give you control over how responsive hidden elements appear and behave inside the Elementor editor on each responsive view (Desktop, Tablet or Mobile). Use them carefully to avoid misplacing elements while editing.', 'fep' ),
                            'content_classes' 	=> 'elementor-panel-alert elementor-panel-alert-warning',
                        ],
                        'hide_elements_responsive' => [
                            'label' 			=> __('Hide Responsive Elements', 'fep'),
                            'description' 		=> __('Completely hides elements that are set to hide in responsive modes.', 'fep'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                        'maintain_obscured_elements_responsive' => [
                            'label' 			=> __('Allow Editing Inside Hidden Sections', 'fep'),
                            'description' 		=> __('Allow editing of elements inside responsive hidden Sections or Inner Sections without having to use the Navigator.', 'fep'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                        'disable_obscured_elements_responsive' => [
                            'label' 			=> __('Disable Responsive Overlays', 'fep'),
                            'description' 		=> __('Remove the grayed out overlay pattern from any responsive hidden element and restore their original colors.', 'fep'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                        'alternative_responsive_indicator' => [
                            'label' 			=> __('Alternative Responsive Indicator', 'fep'),
                            'description' 		=> __('Adds an alternative indicator for responsive hidden elements by changing their handle colors.', 'fep'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                    ]
                ],
                'fep_settings_accordion'  => [
                    'label'     => __('Accordion widget options', 'fep'),
                    'controls'  => [
                        'accordion_options' => [
                            'label' 			=> __('First tab closed (only in editor)', 'fep'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'fep'),
                            'label_off' 		=> __('Off', 'fep'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                    ]
                ],
                'fep_settings_other'  => [
                    'label'     => __('Tools & Informations', 'fep'),
                    'controls'  => [
                        'reset_panel' => [
                            'type'  			=> Controls_Manager::RAW_HTML,
                            'raw' 				=> $debugger_html,
                        ],
                        'note_pro_version' => [
                            'type' 				=> Controls_Manager::RAW_HTML,
                            'raw' 				=> $html_pro_version_html,
                            'content_classes' 	=> 'ee-raw-html ee-raw-html__warning',
                        ]
                    ]
                ]
            ]
        ];

    }


    /**
     * @since 2.8.0
     * @access protected
     */
    public function add_controls($stack) {

        $controls_list = self::get_controls_list();

        foreach ( $controls_list as $tab_name => $sections ) {

            foreach ( $sections as $section_name => $section_data ) {

                $stack->start_controls_section(
                    $section_name, [
                        'label' => $section_data['label'],
                        'tab' => $tab_name,
                    ]
                );

                foreach ( $section_data['controls'] as $control_name => $control_data ) {
                    $stack->add_control( $control_name, $control_data );
                }

                $stack->end_controls_section();
            }
        }

        $stack->remove_control('panel_width'); // remove the control panel width from elementor 3.0
    }

}
