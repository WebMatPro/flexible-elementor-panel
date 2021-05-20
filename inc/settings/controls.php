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

        $debugger_html = '<button type="button" class="reset-fep elementor-button elementor-button-default">' . __( 'Reset Panel Position/Size', 'flexible-elementor-panel' ) . '</button>';

        $text_html_pro_version = __( 'The pro version is currently development,<br> get more information now on:', 'flexible-elementor-panel' );
        $html_pro_version_html = '<div class="desc-pro-version"><img src="' . FEP_URL .'/assets/images/banner-fep-pro.jpg"><br><br>' . $text_html_pro_version .'<br><br><a href="https://webmat.pro/flexible-elementor-panel-pro/" target="_blank">webmat.pro/flexible-elementor-panel-pro/</a></div>';

		$html_accordion_frontend = __( 'You can set the option to closed the first tabs accordion in frontend there:') . '<br><br><a href="' . get_admin_url() . 'admin.php?page=fep-options" target="_blank">' . get_admin_url() . 'admin.php?page=fep-options</a>';

		if ( is_rtl() ) {
			$rtl_force_mode = '<br>' . __('Note: if you disable this option when you are in RTL mode, this will set the LTR mode when the editor is on the right side', 'flexible-elementor-panel');
		} else {
			$rtl_force_mode = '';
		}

        return [

            Controls_Manager::TAB_SETTINGS => [
                'fep_settings_panel'  => [
                    'label'     => __('Panel settings', 'flexible-elementor-panel'),
                    'controls'  => [
                        'draggable_panel' => [
                            'label' 			=> __('Draggable panel', 'flexible-elementor-panel'),
                            'description' 		=> __( 'hold down the left click on title of panel for move it (put it in the corner left and click on the title for back to origin style)', 'flexible-elementor-panel' ),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'use_grid_ruler' => [
                            'label' 			=> __('Use FLEX GRID for widgets', 'flexible-elementor-panel'),
                            'description' 		=> __( 'This reduce the size of widgets in the editor and styling them', 'flexible-elementor-panel' ),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'minimize_category_space'  => [
                            'label' 			=> __('Minimize all categories with right click', 'flexible-elementor-panel'),
                            'description' 		=> __( 'click the right mouse button on the panel to collapse all categories of widgets', 'flexible-elementor-panel' ),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',

                        ],
                        'editor_skin' => [
                            'label' 			=> __('Editor skins', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SELECT,
                            'options'   		=> [
                                'dark_pink'   		=>     __('Dark Pink', 'flexible-elementor-panel'),
                                'dark_orange'    	=>     __('Dark Orange', 'flexible-elementor-panel'),
                                'default'   		=>     __('Default', 'flexible-elementor-panel')
                            ],
                            'default' 			=> 'default',
                        ],
                        'display_vertical_collaspe_icon' => [
                            'label' 			=> __('Display the vertical collaspe icon in header panel', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'display_reset_icon' => [
                            'label' 			=> __('Display the reset panel icon in header panel', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
						'rtl_force_mode' => [
							'label' 			=> __('Force RTL Mode', 'flexible-elementor-panel'),
							'description' 		=> __( 'Will force the RTL mode when the editor is on right side', 'flexible-elementor-panel' ) . $rtl_force_mode,
							'type'  			=> Controls_Manager::SWITCHER,
							'label_on' 			=> __('On', 'flexible-elementor-panel'),
							'label_off' 		=> __('Off', 'flexible-elementor-panel'),
							'return_value' 		=> 'yes',
							'default' 			=> 'yes',
						],
						/*'opacity_editor_panel' => [
                            'label' 			=> __('Opacity of Editor Panel', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SLIDER,
							'range' => [
									'%' => [
										'min' => 50,
										'max' => 100,
									],
								],
                            'size_units' => [ '%' ],
							'default' => [
								'unit' => '%',
								'size' => 100,
							],
                        ],*/
                    ]
                ],
                'fep_settings_exit'  => [
                    'label'     => __('Exit button options', 'flexible-elementor-panel'),
                    'controls'  => [
                        'display_exit_icon' => [
                            'label' 			=> __('Display the exit icon in footer panel', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                        'exit_link_point' => [
                            'label' 			=> __('Exit point', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SELECT,
                            'options'   		=> [
                                'front'       	=>      __('View', 'flexible-elementor-panel'),
                                'edit'          =>      __('Edition', 'flexible-elementor-panel'),
                                'list'          =>      __('List Page/Post', 'flexible-elementor-panel'),
                                'admin_dashboard'    =>      __('Admin dashboard', 'flexible-elementor-panel'),
                                'elementor_library'  =>      __('Elementor library', 'flexible-elementor-panel'),
                            ],
                            'default' 			=> 'front',
                        ],
                        'exit_link_new_tab' =>	[
                            'label' 			=> __('Open in new tab', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
                    ]
                ],
                'fep_settings_responsive'  => [
                    'label'     => __('Responsive options', 'flexible-elementor-panel'),
                    'controls'  => [
                        'settings_responsive_note' => [
                            'type' 				=> Controls_Manager::RAW_HTML,
                            'raw' 				=> __( 'These options give you control over how responsive hidden elements appear and behave inside the Elementor editor on each responsive view (Desktop, Tablet or Mobile). Use them carefully to avoid misplacing elements while editing.', 'flexible-elementor-panel' ),
                            'content_classes' 	=> 'elementor-panel-alert elementor-panel-alert-warning',
                        ],
                        'hide_elements_responsive' => [
                            'label' 			=> __('Hide Responsive Elements', 'flexible-elementor-panel'),
                            'description' 		=> __('Completely hides elements that are set to hide in responsive modes.', 'flexible-elementor-panel'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                        'maintain_obscured_elements_responsive' => [
                            'label' 			=> __('Allow Editing Inside Hidden Sections', 'flexible-elementor-panel'),
                            'description' 		=> __('Allow editing of elements inside responsive hidden Sections or Inner Sections without having to use the Navigator.', 'flexible-elementor-panel'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                        'disable_obscured_elements_responsive' => [
                            'label' 			=> __('Disable Responsive Overlays', 'flexible-elementor-panel'),
                            'description' 		=> __('Remove the grayed out overlay pattern from any responsive hidden element and restore their original colors.', 'flexible-elementor-panel'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                        'alternative_responsive_indicator' => [
                            'label' 			=> __('Alternative Responsive Indicator', 'flexible-elementor-panel'),
                            'description' 		=> __('Adds an alternative indicator for responsive hidden elements by changing their handle colors.', 'flexible-elementor-panel'),
                            'type' 				=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'no',
                        ],
                    ]
                ],
                'fep_settings_accordion'  => [
                    'label'     => __('Accordion widget options', 'flexible-elementor-panel'),
                    'controls'  => [
                        'accordion_options' => [
                            'label' 			=> __('First tab closed (only in editor)', 'flexible-elementor-panel'),
                            'type'  			=> Controls_Manager::SWITCHER,
                            'label_on' 			=> __('On', 'flexible-elementor-panel'),
                            'label_off' 		=> __('Off', 'flexible-elementor-panel'),
                            'return_value' 		=> 'yes',
                            'default' 			=> 'yes',
                        ],
						'accordion_options_frontend' => [
                            'type'  			=> Controls_Manager::RAW_HTML,
                            'raw' 				=> $html_accordion_frontend,
                        ],
                    ],
                ],
                'fep_settings_other'  => [
                    'label'     => __('Tools & Informations', 'flexible-elementor-panel'),
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
