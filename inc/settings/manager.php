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

	// add the FEP settings to editor panel
	private function add_panel_tabs() {
		Elementor_Controls_Manager::add_tab( 'fep_settings', __( 'Settings', 'fep' ) );
	}

	// get saved settings for apply it to load
	protected function get_saved_settings( $id ) {

		$settings = []; // create the table

		$options = get_option( self::OPTIONS_KEY, null );
		if( $options !== null ) {

			foreach ( $options as $option => $value) {

				$settings[ $option ] = $value;

			}

		}

		return $settings;
	}

	// save settings when some option fep is changed
	protected function save_settings_to_db(array $settings, $id) {

		$model_controls = FEP_Model::get_controls_list();

		$one_list_settings = [];

		foreach ( $model_controls as $tab_name => $sections ) {

			foreach ( $sections as $section_name => $section_data ) {

				foreach ( $section_data['controls'] as $control_name => $control_data ) {

					if ( isset( $settings[ $control_name ] ) ) {
					//si le controle est sans valuer (yes ou par default dans elementor), il doit retourner son default

						$one_list_control_name = str_replace( 'elementor_', '', $control_name ); // remove the slug before option 'elementor_'
						$one_list_settings[ $one_list_control_name ] = $settings[ $control_name ]; // add to table

					} else {

						if ( isset($control_data['default']) ) {
							$one_list_control_name = str_replace( 'elementor_', '', $control_name ); // remove the slug before option 'elementor_'
							$one_list_settings[ $one_list_control_name ] = $control_data['default']; // add to table (default value if not set)
						}

					}

				}
			}
		}

		// Save all settings in one list
		if ( ! empty( $one_list_settings ) ) {
			update_option( self::OPTIONS_KEY, $one_list_settings ); // update the single option fep and include the table
		}

	}

	// get settings from database to share in javascript
	public static function get_settings() {

		$settings = []; // create the table

		$options = get_option( self::OPTIONS_KEY, null );

		if( $options !== null ) {

			foreach ( $options as $option => $value) {

				$settings[ $option ] = $value;

			}

		} else {

			// there to get all control FEP with default value if any database exist
			$model_controls = FEP_Model::get_controls_list();

			foreach ( $model_controls as $tab_name => $sections ) {

				foreach ( $sections as $section_name => $section_data ) {

					foreach ( $section_data['controls'] as $control_name => $control_data ) {

						if ( isset($control_data['default']) ) {
							$one_list_control_name = str_replace( 'elementor_', '', $control_name ); // remove the slug before option 'elementor_'
							$settings[ $one_list_control_name ] = $control_data['default']; // add to table
						}

					}
				}
			}


		}

		return $settings;

	}

}
