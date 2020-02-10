<?php

namespace FEP\Core\Settings\General; // use it for redeclare the class of this file

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Elementor\Controls_Manager as Elementor_Controls_Manager;
use Elementor\Core\Settings\General\Manager as Elementor_Manager;
use FEP\Core\Settings\General\Model as FEP_Model;

class Manager extends Elementor_Manager {

	const OPTIONS_KEY = '_elementor_fep_settings';

	public function __construct() {
		parent::__construct();

		$this->add_panel_tabs();
	}

	public function get_model_for_config() {
		return $this->get_model();
	}

	public function get_name() {
		return 'fep';
	}
	
	protected function get_saved_settings( $id ) {
		$model_controls = FEP_Model::get_controls_list();

		$settings = [];

		foreach ( $model_controls as $tab_name => $sections ) {

			foreach ( $sections as $section_name => $section_data ) {

				foreach ( $section_data['controls'] as $control_name => $control_data ) {
					$saved_setting = get_option( $control_name, null );

					if ( null !== $saved_setting ) {
						$settings[ $control_name ] = get_option( $control_name );
					}
				}
			}
		}

		return $settings;
	}


	protected function save_settings_to_db(array $settings, $id) {

		$model_controls = FEP_Model::get_controls_list();

		$one_list_settings = [];

		foreach ( $model_controls as $tab_name => $sections ) {

			foreach ( $sections as $section_name => $section_data ) {

				foreach ( $section_data['controls'] as $control_name => $control_data ) {
					if ( isset( $settings[ $control_name ] ) ) {
						$one_list_control_name = str_replace( 'elementor_', '', $control_name );

						$one_list_settings[ $one_list_control_name ] = $settings[ $control_name ];

						update_option( $control_name, $settings[ $control_name ] );
					} else {
						delete_option( $control_name );
					}
				}
			}
		}

		// Save all settings in one list for future usage
		if ( ! empty( $one_list_settings ) ) {
			update_option( self::OPTIONS_KEY, $one_list_settings );
		} else {
			delete_option( self::OPTIONS_KEY );
		}

	}


	private function add_panel_tabs() {

		Elementor_Controls_Manager::add_tab( 'fep_settings', __( 'Settings', 'fep' ) );

	}

	public static function get_settings() {

		$model_controls = FEP_Model::get_controls_list();

		$settings = [];

		foreach ( $model_controls as $tab_name => $sections ) {

			foreach ( $sections as $section_name => $section_data ) {

				foreach ( $section_data['controls'] as $control_name => $control_data ) {
					$saved_setting = get_option( $control_name, null );

					if ( $saved_setting != null ) {
						$settings[ $control_name ] = get_option( $control_name );
					} else {
						if ( isset($control_data['default']) ) {
							$settings[ $control_name ] = $control_data['default'];
						}
					}
				}
			}
		}

		return $settings;

	}

}
